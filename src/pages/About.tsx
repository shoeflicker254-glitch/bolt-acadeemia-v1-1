import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Target, Heart, Check, Globe, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

const About: React.FC = () => {
  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Acadeemia
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Empowering educational institutions with innovative management solutions since 2019.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Transforming Education Management</h2>
              <p className="text-lg text-gray-700 mb-6">
                Acadeemia was founded in 2017 by Michael Mwaringa. Due to the lack of a management system in his fathers school, he recognized the need for a comprehensive, user-friendly school management system that could adapt to diverse educational environments.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                What began as a solution for a single institution quickly evolved into a versatile platform serving hundreds of educational institutions worldwide. Our journey has been guided by a simple principle: technology should enhance education, not complicate it.
              </p>
              <p className="text-lg text-gray-700">
                Today, Acadeemia continues to innovate at the intersection of education and technology, developing solutions that address the evolving needs of modern educational institutions.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-5 -right-5 w-32 h-32 bg-primary-100 rounded-lg"></div>
              <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-accent-100 rounded-lg"></div>
              <img 
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Acadeemia team meeting" 
                className="rounded-xl shadow-lg relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">Our Foundation</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Mission, Vision & Values</h2>
            <p className="text-lg text-gray-700">
              The principles that guide our company and shape our approach to serving educational institutions worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-primary-500">
              <div className="p-3 bg-primary-50 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Target size={28} className="text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To empower educational institutions with intuitive technology solutions that streamline administrative processes, enhance learning experiences, and foster academic excellence.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-secondary-500">
              <div className="p-3 bg-secondary-50 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Users size={28} className="text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To be the global leader in educational management systems, recognized for innovation, reliability, and commitment to advancing education through technology.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-accent-500">
              <div className="p-3 bg-accent-50 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Heart size={28} className="text-accent-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Values</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Check size={18} className="text-accent-600 mr-2 mt-1 flex-shrink-0" />
                  <span><strong>Innovation</strong> - Constantly evolving our solutions</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-accent-600 mr-2 mt-1 flex-shrink-0" />
                  <span><strong>Integrity</strong> - Upholding the highest ethical standards</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-accent-600 mr-2 mt-1 flex-shrink-0" />
                  <span><strong>Excellence</strong> - Delivering exceptional quality</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-accent-600 mr-2 mt-1 flex-shrink-0" />
                  <span><strong>Empathy</strong> - Understanding our users' needs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact & Partnerships Section */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">Global Reach</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Global Impact</h2>
            <p className="text-lg text-gray-700">
              Transforming education management across continents through strategic partnerships and innovative solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-50 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Globe size={28} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Presence</h3>
              <p className="text-gray-600 mb-4">
                Operating in over 30 countries across 6 continents, serving diverse educational systems and cultures.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  500+ Educational Institutions
                </li>
                <li className="flex items-center text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  2M+ Students Impacted
                </li>
                <li className="flex items-center text-gray-700">
                  <Check size={16} className="text-blue-600 mr-2" />
                  30+ Countries Served
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-green-50 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Shield size={28} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Strategic Partnerships</h3>
              <p className="text-gray-600 mb-4">
                Collaborating with leading educational institutions and technology providers worldwide.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <Check size={16} className="text-green-600 mr-2" />
                  Microsoft Education Partner
                </li>
                <li className="flex items-center text-gray-700">
                  <Check size={16} className="text-green-600 mr-2" />
                  Google Workspace Integration
                </li>
                <li className="flex items-center text-gray-700">
                  <Check size={16} className="text-green-600 mr-2" />
                  UNESCO ICT Partner
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-purple-50 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Zap size={28} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation Hub</h3>
              <p className="text-gray-600 mb-4">
                Driving educational technology innovation through research and development.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <Check size={16} className="text-purple-600 mr-2" />
                  AI-Powered Analytics
                </li>
                <li className="flex items-center text-gray-700">
                  <Check size={16} className="text-purple-600 mr-2" />
                  Blockchain Certificates
                </li>
                <li className="flex items-center text-gray-700">
                  <Check size={16} className="text-purple-600 mr-2" />
                  Smart Learning Tools
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center">Featured Partners</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  name: "Global Education Alliance",
                  location: "United States",
                  type: "Research Partner"
                },
                {
                  name: "EduTech Solutions",
                  location: "United Kingdom",
                  type: "Technology Partner"
                },
                {
                  name: "African Education Council",
                  location: "Kenya",
                  type: "Regional Partner"
                },
                {
                  name: "Asian School Network",
                  location: "Singapore",
                  type: "Implementation Partner"
                }
              ].map((partner, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-900">{partner.name}</h4>
                    <p className="text-sm text-gray-600">{partner.location}</p>
                    <p className="text-xs text-primary-600 mt-1">{partner.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">Our Impact</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Making a Difference</h2>
            <p className="text-lg text-gray-700">
              We're proud of the positive impact our solutions have made for educational institutions worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Educational Institutions" },
              { number: "30+", label: "Countries" },
              { number: "2M+", label: "Students Impacted" },
              { number: "15M+", label: "Hours Saved Annually" }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <p className="text-gray-700">{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-center">Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  institution: "Westlake University",
                  quote: "Acadeemia revolutionized our administrative processes, reducing paperwork by 85% and allowing our staff to focus on what matters most: supporting our students.",
                  person: "Dr. Richard Martinez, President"
                },
                {
                  institution: "Global Academy Network",
                  quote: "Managing our 12 campuses was a logistical challenge until we implemented Acadeemia. Now we have complete visibility and standardized processes across all locations.",
                  person: "Jennifer Lewis, Operations Director"
                },
                {
                  institution: "Eastside High School",
                  quote: "The parents at our school love the transparency and communication features. Attendance rates improved by 12% in the first year after implementation.",
                  person: "Thomas Anderson, Principal"
                }
              ].map((story, index) => (
                <div key={index} className="flex flex-col h-full">
                  <div className="bg-gray-50 p-6 rounded-lg mb-4 flex-grow">
                    <p className="italic text-gray-700">"{story.quote}"</p>
                  </div>
                  <div>
                    <p className="font-semibold">{story.person}</p>
                    <p className="text-sm text-gray-600">{story.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Team collaboration" 
                className="rounded-xl shadow-lg"
              />
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">Our Commitment</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Acadeemia</h2>
              <p className="text-lg text-gray-700 mb-6">
                Our commitment extends beyond providing software—we're your partner in educational excellence.
              </p>
              
              <ul className="space-y-4">
                {[
                  {
                    title: "Education-First Approach",
                    description: "Our solutions are designed by educators for educators, with pedagogy at the core."
                  },
                  {
                    title: "Continuous Innovation",
                    description: "We're constantly evolving our platform based on user feedback and educational trends."
                  },
                  {
                    title: "Dedicated Support",
                    description: "Our support team understands education and is committed to your institution's success."
                  },
                  {
                    title: "Scalable Solutions",
                    description: "Whether you're a small school or a large university, our system grows with your needs."
                  },
                  {
                    title: "Data Security & Privacy",
                    description: "We adhere to the highest standards of data protection, especially important for student information."
                  }
                ].map((item, index) => (
                  <li key={index} className="flex">
                    <div className="mr-4 mt-1">
                      <Award size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Educational Community</h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover how Acadeemia can transform your institution's management and empower your educational mission.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/demo">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-primary hover:bg-white/10 hover:text-white"
                >
                  Request Demo
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-primary hover:bg-white/10 hover:text-white"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;