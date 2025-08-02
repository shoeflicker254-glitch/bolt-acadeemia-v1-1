import React, { useState, useEffect } from 'react';
import { ExternalLink, Monitor, Server, ArrowRight, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useLocation } from 'react-router-dom';

// Declare Calendly types
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: {
        url: string;
        parentElement?: HTMLElement;
        prefill?: Record<string, any>;
        utm?: Record<string, any>;
      }) => void;
      closePopupWidget: () => void;
    };
  }
}

const Demo: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    role: '',
    version: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showCalendlyButton, setShowCalendlyButton] = useState(false);
  
  // Load Calendly widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Handle scrolling to demo form if hash is present
  useEffect(() => {
    if (location.hash === '#demo-request-form') {
      setTimeout(() => {
        const element = document.getElementById('demo-request-form');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCalendlyPopup = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/info-0rq/30min-demo-meeting',
        prefill: {
          name: formData.name,
          email: formData.email,
          customAnswers: {
            a1: formData.institution, // Institution
            a2: formData.role, // Role
            a3: formData.version, // Version interested in
            a4: formData.message // Additional notes
          }
        },
        utm: {
          utmCampaign: 'Demo Request',
          utmSource: 'Website',
          utmMedium: 'Form'
        }
      });
    } else {
      // Fallback to opening in new tab if Calendly widget fails to load
      window.open('https://calendly.com/info-0rq/30min-demo-meeting', '_blank');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Save to database using Supabase client
      const { error } = await supabase
        .from('demo_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          institution: formData.institution,
          role: formData.role,
          version: formData.version,
          message: formData.message || null,
          calendly_url: 'https://calendly.com/info-0rq/30min-demo-meeting'
        });

      if (error) {
        throw new Error(error.message || 'Failed to submit demo request');
      }

      setSubmitSuccess(true);
      setShowCalendlyButton(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        institution: '',
        role: '',
        version: '',
        message: '',
      });
      
      // Reset success message after 30 seconds to give time for scheduling
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowCalendlyButton(false);
      }, 30000);
    } catch (error) {
      console.error('Error sending demo request:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to send demo request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience Acadeemia in Action
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Try our interactive demos or request a personalized walkthrough tailored to your institution's needs.
          </p>
        </div>
      </section>

      {/* Demo Options */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Choose Your Demo Experience</h2>
          <p className="section-subtitle">
            We offer multiple ways to explore Acadeemia's capabilities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Interactive Demo */}
            <Card className="p-8" bordered hoverEffect>
              <h3 className="text-2xl font-bold mb-4">Interactive Online Demo</h3>
              <p className="text-gray-700 mb-6">
                Explore our system immediately with pre-populated sample data. Get hands-on experience with both deployment versions.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-start">
                    <Monitor size={24} className="text-primary-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold mb-2">SaaS Demo</h4>
                      <p className="text-gray-600 mb-4">Experience our cloud-based solution with sample data.</p>
                      <a 
                        href="https://saas.acadeemia.com/saasdemo" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                      >
                        Launch SaaS School Website Demo
                        <ExternalLink size={16} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-start">
                    <Server size={24} className="text-secondary-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Standalone Demo</h4>
                      <p className="text-gray-600 mb-4">Experience our self-hosted solution with sample data.</p>
                      <a 
                        href="https://selfhost.acadeemia.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-secondary-600 font-medium hover:text-secondary-700"
                      >
                        Launch Standalone School Website Demo
                        <ExternalLink size={16} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm">
                <p>
                  <strong>Demo Credentials:</strong><br />
                  ADMIN<br />
                  Username: demoadmin@acadeemia.com<br />
                  Password: AcadeemiaDemo<br />
                  TEACHER<br />
                  Username: demoteacher@acadeemia.com<br />
                  Password: AcadeemiaDemo<br />
                  STUDENT<br />
                  Username: demostudent@acadeemia.com<br />
                  Password: AcadeemiaDemo<br />
                  PARENT<br />
                  Username: demoparent@acadeemia.com<br />
                  Password: AcadeemiaDemo<br />
                  ACCOUNTANT<br />
                  Username: demoaccountant@acadeemia.com<br />
                  Password: AcadeemiaDemo<br />
                  RECEPTIONIST<br />
                  Username: demoreceptionist@acadeemia.com<br />
                  Password: AcadeemiaDemo
                </p>
              </div>
            </Card>
            
            {/* Guided Demo */}
            <Card className="p-8" bordered hoverEffect>
              <h3 className="text-2xl font-bold mb-4">Personalized Guided Demo</h3>
              <p className="text-gray-700 mb-6">
                Schedule a live demonstration with our product specialists tailored to your institution's specific requirements.
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  'One-on-one session with product specialist',
                  'Focused on your institution\'s specific needs',
                  'Opportunity to ask questions in real-time',
                  'Detailed exploration of relevant features',
                  'Discussion of customization options',
                  'Implementation and migration insights',
                  'Walkthrough of both SaaS and standalone versions',
                  'Overview of user roles and permissions setup',
                  'Guidance on integrating your existing systems and data',
                  'Breakdown of licensing and pricing options',
                  'Advice on best practices for onboarding your staff and users',
                  'Data privacy and backup strategy overview',
                  'Support and training resources overview',
                  'Time for feedback and next steps planning',
                  'Demonstration of real-time communication tools (e.g. SMS, WhatsApp)',
                  'Insight into performance tracking and reporting features',
                  'Explore financial and fee management tools',
                  'Custom branding, subdomain setup, and white-label options',
                  'Optional language support and localization settings',
                  'Insight into cloud hosting vs on-premise deployment'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight size={18} className="text-primary-600 mr-2 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => document.getElementById('demo-request-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Request Guided Demo
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Features Preview */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title">What You'll Experience in the Demo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: 'Student Management',
                list: [
                  'Student profiles and records',
                  'Enrollment and registration',
                  'Attendance tracking',
                  'Academic progress monitoring',
                  'Behavior and discipline tracking',
                  'Health and medical information management',
                  'Parent/guardian contact management',
                  'ID card generation and student grouping',
                  'Student promotion and graduation workflows'
                ]
              },
              {
                title: 'Academic Functions',
                list: [
                  'Course management',
                  'Curriculum planning',
                  'Grading and assessments',
                  'Exam scheduling and result publishing',
                  'Timetable scheduling',
                  'Homework and assignment tracking',
                  'Syllabus uploading and sharing',
                  'Report cards and transcripts generation',
                  'Online classes and lesson planning'
                ]
              },
              {
                title: 'Administrative Tools',
                list: [
                  'Financial management',
                  'Staff management',
                  'Reporting and analytics',
                  'Communication tools',
                  'Document and certificate generation (TCs, letters)',
                  'Asset and inventory management',
                  'Hostel and transport management',
                  'Admission management and online application portal',
                  'Licensing and permission control system'
                ]
              }
            ].map((section, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <ArrowRight size={16} className="text-primary-600 mr-2 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Note: Demo environments contain sample data to help you visualize how the system works with real information.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Request Form */}
      <section id="demo-request-form" className="section">
        <div className="container">
          <h2 className="section-title">Request a Personalized Demo</h2>
          <p className="section-subtitle">
            Fill out the form below and our team will contact you to schedule a customized demonstration.
          </p>
          
          <div className="max-w-3xl mx-auto mt-12">
            {submitSuccess && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-green-800 mb-8 animate-fade-in">
                <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                <p className="mb-4">
                  Your demo request has been received. One of our product specialists will contact you within 24 hours to schedule your personalized demonstration.
                </p>
                {showCalendlyButton && (
                  <div className="bg-white p-4 rounded-lg border border-green-300">
                    <p className="font-semibold mb-3">Schedule your demo meeting now:</p>
                    <Button 
                      variant="primary"
                      icon={<Calendar size={18} />}
                      onClick={openCalendlyPopup}
                      className="w-full sm:w-auto"
                    >
                      Book 30-minute Demo Meeting
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      Click the button above to open our scheduling widget and pick a time that works for you.
                    </p>
                  </div>
                )}
              </div>
            )}

            {submitError && (
              <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-800 mb-8 animate-fade-in">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                    Institution Name*
                  </label>
                  <input
                    id="institution"
                    name="institution"
                    type="text"
                    required
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Role*
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select your role</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Principal/Director">Principal/Director</option>
                    <option value="IT Manager">IT Manager</option>
                    <option value="Teacher/Faculty">Teacher/Faculty</option>
                    <option value="Administrative Staff">Administrative Staff</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                    Interested In*
                  </label>
                  <select
                    id="version"
                    name="version"
                    required
                    value={formData.version}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select an option</option>
                    <option value="SaaS">SaaS (Cloud-Based)</option>
                    <option value="Standalone">Standalone (Self-Hosted)</option>
                    <option value="Both">Both (Undecided)</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us about your institution's specific needs or any questions you have..."
                ></textarea>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                className="w-full py-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Schedule My Demo'}
              </Button>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[
              {
                q: "How long does the guided demo typically last?",
                a: "Our personalized demos usually last 45-60 minutes, depending on your questions and areas of interest."
              },
              {
                q: "Who should attend the demo from our institution?",
                a: "We recommend including key decision-makers, IT staff, and representatives from departments that will use the system."
              },
              {
                q: "Can we get access to the demo environment after the guided session?",
                a: "Yes, we can provide extended access to the demo environment for your team to explore further."
              },
              {
                q: "Is the demo customized to our specific type of institution?",
                a: "Absolutely! We tailor the demonstration to showcase features most relevant to your institution type (K-12, higher education, vocational, etc.)."
              },
              {
                q: "What technical requirements are needed for the interactive demo?",
                a: "Just a modern web browser (Chrome, Firefox, Safari, or Edge) and an internet connection."
              },
              {
                q: "Can we request a demo of specific add-on modules?",
                a: "Yes, please mention the specific add-ons you're interested in when completing the request form."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;