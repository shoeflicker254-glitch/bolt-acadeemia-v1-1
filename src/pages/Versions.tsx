import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, Server, Check, AlertTriangle, X, Shield, Clock, Database, Users, Package, CreditCard, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';

const Versions: React.FC = () => {
  const navigate = useNavigate();

  const handleSaasPricing = () => {
    navigate('/pricing#saas-pricing');
  };

  const handleStandalonePricing = () => {
    navigate('/pricing#standalone-pricing');
  };

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestDemo = () => {
    navigate('/demo#demo-request-form');
  };

  const handleContactUs = () => {
    navigate('/contact');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Ideal Deployment
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Flexible deployment options tailored to your institution's needs and preferences.
          </p>
        </div>
      </section>

      {/* Deployment Options Overview */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* SaaS Version */}
            <div className="card p-8 border-2 border-primary-200 bg-white rounded-xl">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-primary-50 rounded-full mr-4">
                  <Cloud size={32} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">SaaS Version</h2>
                  <p className="text-primary-600 mt-1">Free Trial Available</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 mb-6">
                Our cloud-based solution provides instant access with minimal setup, perfect for institutions seeking convenience and flexibility. Manage multiple schools under one platform with our comprehensive multi-school management system.
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {[
                    'Multi-school management capabilities',
                    'Instant access with 1 Month free trial period',
                    'Online subscription purchase and renewal',
                    'Automatic updates with the latest features',
                    'Accessible anywhere with an internet connection',
                    'Scalable resources based on your needs',
                    'Reduced IT overhead and maintenance',
                    'PWA enabled',
                    'Enterprise-grade security and backups'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={18} className="text-primary-600 mr-2 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Default Modules Included</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Alumni',
                      'Attachments Book',
                      'Attendance',
                      'Bulk SMS and Email',
                      'Card Management',
                      'Certificate',
                      'Custom Domain',
                      'Events',
                      'Homework',
                      'Hostel',
                      'Human Resource',
                      'Inventory',
                      'Library',
                      'Live Class',
                      'Multi Class',
                      'Office Accounting',
                      'Online Exam',
                      'Reception',
                      'Student Accounting',
                      'Transport',
                      'Website'
                    ].map((module, index) => (
                      <div key={index} className="flex items-center">
                        <Check size={16} className="text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-sm">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Optional Add-ons</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ul className="space-y-3">
                    {[
                      'QR Code Attendance',
                      'Two-Factor Authentication'
                    ].map((addon, index) => (
                      <li key={index} className="flex items-start">
                        <Package size={18} className="text-primary-600 mr-2 mt-1 flex-shrink-0" />
                        <span>{addon}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Subscription Features</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ul className="space-y-3">
                    {[
                      { icon: <CreditCard size={18} />, text: 'Online payment for subscriptions' },
                      { icon: <RefreshCw size={18} />, text: 'Easy subscription renewal' },
                      { icon: <Users size={18} />, text: 'Multi-school management' }
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-600 mr-2 mt-1 flex-shrink-0">{item.icon}</span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="https://saas.acadeemia.com/#pricing" target="_blank" className="flex-1">
                  <Button variant="primary" fullWidth>
                    Start Free Trial
                  </Button>
                </Link>
                <div className="flex-1">
                  <Button variant="outline" fullWidth onClick={handleSaasPricing}>
                    View Pricing
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Standalone Version */}
            <div className="card p-8 border-2 border-secondary-200 bg-white rounded-xl">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-secondary-50 rounded-full mr-4">
                  <Server size={32} className="text-secondary-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Standalone Version</h2>
                  <p className="text-primary-600 mt-1">Demos Available</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 mb-6">
                Our self-hosted solution gives you complete control over your data and infrastructure. We offer custom hosting and domain setup services at an additional cost to ensure a seamless deployment.
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {[
                    'Complete data ownership and privacy control',
                    'Customized infrastructure based on your requirements',
                    'Enhanced security with your own firewall and VPN options',
                    'Operate fully within your institution\'s network',
                    'Integration with existing systems and databases',
                    'Tailored update schedule on your terms',
                    'No dependency on third-party cloud services',
                    'Scalable architecture to match your institutions growth',
                    'Offline accessibility with local backup options',
                    'Full administrative control and role-based permissions',
                    'Dedicated support and direct communication channels'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={18} className="text-secondary-600 mr-2 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Default Modules Included</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Alumni',
                      'Annual Calendar',
                      'Calendar To-Do List',
                      'Certificate',
                      'Chat',
                      'Communicate',
                      'Download Center',
                      'Examination',
                      'Expense',
                      'Fees Collection',
                      'Front CMS',
                      'Front Office',
                      'Homework',
                      'Hostel',
                      'Income',
                      'Inventory',
                      'Lesson Plan',
                      'Library',
                      'Multi Class',
                      'Online Admission',
                      'Online Examination',
                      'Student Attendance',
                      'Student CV',
                      'Transport'
                    ].map((module, index) => (
                      <div key={index} className="flex items-center">
                        <Check size={16} className="text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-sm">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Optional Add-ons</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Zoom Live Classes',
                      'Gmeet Live Classes',
                      'Online Course',
                      'Behaviour Records',
                      'CBSE Examination',
                      'Multi Branch',
                      'Two-Factor Authenticator',
                      'QR Code Attendance',
                      'Quick Fees',
                      'Thermal Print',
                      'Android App',
                      'Biometrics Entry'
                    ].map((addon, index) => (
                      <div key={index} className="flex items-center">
                        <Package size={16} className="text-secondary-600 mr-2 flex-shrink-0" />
                        <span className="text-sm">{addon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" fullWidth onClick={handleRequestDemo}>
                  Try Standalone Demo
                </Button>
                <div className="flex-1">
                  <Button variant="outline" fullWidth onClick={handleStandalonePricing}>
                    View Pricing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title">Detailed Comparison</h2>
          <p className="section-subtitle">
            Compare both versions side by side to determine which solution best fits your institution's needs.
          </p>
          
          <div className="overflow-x-auto mt-12">
            <table className="w-full bg-white rounded-xl shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left text-gray-700 font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center text-primary-700 font-semibold">
                    <div className="flex items-center justify-center">
                      <Cloud size={20} className="mr-2" />
                      <span>SaaS Version</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-secondary-700 font-semibold">
                    <div className="flex items-center justify-center">
                      <Server size={20} className="mr-2" />
                      <span>Standalone Version</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  {
                    feature: 'Deployment Time',
                    saas: { icon: <Clock size={18} />, text: 'Immediate' },
                    standalone: { icon: <Clock size={18} />, text: '1-2 Weeks' }
                  },
                  {
                    feature: 'Data Ownership',
                    saas: { icon: <Database size={18} />, text: 'Hosted on our secure servers' },
                    standalone: { icon: <Database size={18} />, text: 'Complete ownership on your servers' }
                  },
                  {
                    feature: 'Updates & Maintenance',
                    saas: { icon: <Check size={18} />, text: 'Automatic' },
                    standalone: { icon: <Check size={18} />, text: 'Manual or managed service' }
                  },
                  {
                    feature: 'Infrastructure Management',
                    saas: { icon: <Check size={18} />, text: 'Fully managed by us' },
                    standalone: { icon: <Check size={18} />, text: 'Your responsibility or optional service' }
                  },
                  {
                    feature: 'Multi-School Management',
                    saas: { icon: <Check size={18} />, text: 'Included' },
                    standalone: { icon: <X size={18} />, text: 'Available as add-on (Multi Branch)' }
                  },
                  {
                    feature: 'Free Trial',
                    saas: { icon: <Check size={18} />, text: 'Available' },
                    standalone: { icon: <X size={18} />, text: 'Demo available' }
                  },
                  {
                    feature: 'Online Payment',
                    saas: { icon: <Check size={18} />, text: 'Built-in subscription management' },
                    standalone: { icon: <X size={18} />, text: 'Yearly license' }
                  },
                  {
                    feature: 'Customization Flexibility',
                    saas: { icon: <AlertTriangle size={18} />, text: 'Limited to available options' },
                    standalone: { icon: <Check size={18} />, text: 'Extensive possibilities' }
                  },
                  {
                    feature: 'Integration with Internal Systems',
                    saas: { icon: <AlertTriangle size={18} />, text: 'API-based only' },
                    standalone: { icon: <Check size={18} />, text: 'Direct database access possible' }
                  },
                  {
                    feature: 'Scalability',
                    saas: { icon: <Check size={18} />, text: 'Automatic scaling' },
                    standalone: { icon: <Check size={18} />, text: 'Manual resource allocation' }
                  },
                  {
                    feature: 'Security Compliance',
                    saas: { icon: <Shield size={18} />, text: 'Our standard compliance' },
                    standalone: { icon: <Shield size={18} />, text: 'Customizable to your policies' }
                  },
                  {
                    feature: 'Internet Dependency',
                    saas: { icon: <AlertTriangle size={18} />, text: 'Required for access' },
                    standalone: { icon: <Check size={18} />, text: 'Can operate on local network' }
                  },
                  {
                    feature: 'Initial Setup Cost',
                    saas: { icon: <Check size={18} />, text: 'Minimal' },
                    standalone: { icon: <AlertTriangle size={18} />, text: 'Higher upfront investment' }
                  }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className={`mr-2 ${row.saas.icon.type === Check ? 'text-green-500' : row.saas.icon.type === X ? 'text-red-500' : 'text-primary-500'}`}>
                          {row.saas.icon}
                        </span>
                        <span>{row.saas.text}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className={`mr-2 ${row.standalone.icon.type === Check ? 'text-green-500' : row.standalone.icon.type === X ? 'text-red-500' : 'text-secondary-500'}`}>
                          {row.standalone.icon}
                        </span>
                        <span>{row.standalone.text}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Common questions about our deployment options.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[
              {
                q: "How does the free trial work for the SaaS version?",
                a: "You can start a free trial immediately with full access to all features. No credit card is required to begin your trial period."
              },
              {
                q: "Can I manage multiple schools with the SaaS version?",
                a: "Yes, our SaaS version includes multi-school management capabilities, allowing you to manage multiple institutions from a single platform."
              },
              {
                q: "How do I purchase or renew my subscription?",
                a: "You can purchase and renew subscriptions directly through our website using our secure online payment system."
              },
              {
                q: "What happens when my free trial ends?",
                a: "You'll be notified before your trial ends and can easily upgrade to a paid subscription to continue using the system without interruption."
              },
              {
                q: "Can I switch between deployment options later?",
                a: "Yes, we offer migration services to help you transition between SaaS and Standalone versions as your needs evolve."
              },
              {
                q: "What happens to my data if I cancel my SaaS subscription?",
                a: "We provide a grace period during which you can export all your data. After this period, data is securely deleted from our servers."
              }
            ].map((faq, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold mb-3">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Not Sure Which Option Is Right for You?</h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Our experts can help assess your needs and recommend the best solution for your institution.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-primary hover:bg-white/10 hover:text-white"
                onClick={handleContactUs}
              >
                Contact Sales
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-primary hover:bg-white/10 hover:text-white"
                onClick={handleRequestDemo}
              >
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Versions;