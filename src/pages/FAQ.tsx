import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Cloud, Server, CreditCard, Users, Settings, Shield } from 'lucide-react';

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = [
    { id: 'all', label: 'All Questions', icon: <HelpCircle size={20} /> },
    { id: 'general', label: 'General', icon: <HelpCircle size={20} /> },
    { id: 'saas', label: 'SaaS Version', icon: <Cloud size={20} /> },
    { id: 'standalone', label: 'Standalone', icon: <Server size={20} /> },
    { id: 'billing', label: 'Billing & Pricing', icon: <CreditCard size={20} /> },
    { id: 'technical', label: 'Technical', icon: <Settings size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
  ];

  const faqs = [
    {
      category: 'general',
      question: 'What is Acadeemia?',
      answer: 'Acadeemia is a comprehensive school management system that helps educational institutions streamline their administrative processes, manage student information, handle finances, and improve communication between staff, students, and parents.'
    },
    {
      category: 'general',
      question: 'What are the main differences between SaaS and Standalone versions?',
      answer: 'The SaaS version is cloud-based with subscription pricing, automatic updates, and multi-school management capabilities. The Standalone version is self-hosted with one-time licensing, complete data ownership, and extensive customization options.'
    },
    {
      category: 'general',
      question: 'Do you offer a free trial?',
      answer: 'Yes, we offer a 1-month free trial for our SaaS version. You can start immediately without providing credit card information. For the Standalone version, we provide comprehensive demos.'
    },
    {
      category: 'saas',
      question: 'How do I start my SaaS free trial?',
      answer: 'Visit our website at acadeemia.com, click on "Start Free Trial," and follow the registration process. You\'ll have immediate access to all features for one month.'
    },
    {
      category: 'saas',
      question: 'Can I manage multiple schools with the SaaS version?',
      answer: 'Yes, our SaaS version includes multi-school management capabilities, allowing you to manage multiple institutions from a single platform with centralized administration.'
    },
    {
      category: 'saas',
      question: 'What happens to my data if I cancel my SaaS subscription?',
      answer: 'You can export all your data before cancellation. We provide a grace period during which you can download your information. After this period, data is securely deleted from our servers.'
    },
    {
      category: 'saas',
      question: 'How do I upgrade or downgrade my SaaS plan?',
      answer: 'You can change your plan anytime through your account dashboard. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.'
    },
    {
      category: 'standalone',
      question: 'What are the system requirements for the Standalone version?',
      answer: 'Minimum requirements include: 4GB RAM, 50GB storage, modern web server (Apache/Nginx), PHP 7.4+, MySQL 5.7+, and SSL certificate. We recommend higher specifications for larger institutions.'
    },
    {
      category: 'standalone',
      question: 'Do you provide hosting services for the Standalone version?',
      answer: 'Yes, we offer managed hosting services starting at KES 3,999 per term for standard hosting and KES 8,499 per term for premium hosting with enhanced resources.'
    },
    {
      category: 'standalone',
      question: 'How do updates work for the Standalone version?',
      answer: 'Updates are provided as downloadable packages. You can apply them manually or opt for our managed update service. All plans include lifetime updates.'
    },
    {
      category: 'standalone',
      question: 'Can I customize the Standalone version?',
      answer: 'Yes, the Standalone version offers extensive customization options. We provide basic customization with Advanced plans and extensive customization with Premium plans.'
    },
    {
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards, bank transfers, and mobile money payments (M-Pesa, Airtel Money). For institutional clients, we also accept purchase orders.'
    },
    {
      category: 'billing',
      question: 'Do you offer educational discounts?',
      answer: 'Yes, we provide special pricing for public schools, non-profit educational institutions, and schools in developing regions. Contact our sales team for details.'
    },
    {
      category: 'billing',
      question: 'Are there any setup fees?',
      answer: 'SaaS version has no setup fees. Standalone version includes deployment in the license fee. Additional services like data migration or custom domain setup have separate fees.'
    },
    {
      category: 'billing',
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'SaaS subscriptions are generally non-refundable, but we evaluate requests on a case-by-case basis. We encourage using our free trial to evaluate the service first.'
    },
    {
      category: 'technical',
      question: 'What browsers are supported?',
      answer: 'Acadeemia works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest browser versions for optimal performance.'
    },
    {
      category: 'technical',
      question: 'Is there a mobile app available?',
      answer: 'Our web application is mobile-responsive and works well on mobile devices. We also offer a dedicated Android app as an add-on for the Standalone version.'
    },
    {
      category: 'technical',
      question: 'How do I import existing student data?',
      answer: 'We provide data migration services. Basic migration from standard formats costs KES 4,999, while complex migrations from legacy systems cost KES 14,999.'
    },
    {
      category: 'technical',
      question: 'What kind of support do you provide?',
      answer: 'We offer email support, phone support during business hours, comprehensive documentation, video tutorials, and optional premium support packages with dedicated account managers.'
    },
    {
      category: 'technical',
      question: 'Can I integrate Acadeemia with other systems?',
      answer: 'Yes, we provide APIs for integration with other systems. The Standalone version offers more extensive integration possibilities including direct database access.'
    },
    {
      category: 'security',
      question: 'How secure is my data?',
      answer: 'We implement enterprise-grade security including data encryption, regular security audits, access controls, and compliance with international security standards.'
    },
    {
      category: 'security',
      question: 'Where is my data stored?',
      answer: 'SaaS data is stored in secure data centers with redundancy and backup systems. Standalone data is stored on your chosen infrastructure with optional managed hosting.'
    },
    {
      category: 'security',
      question: 'Do you comply with data protection regulations?',
      answer: 'Yes, we comply with applicable data protection laws including GDPR, FERPA, and COPPA. We have comprehensive privacy policies and data handling procedures.'
    },
    {
      category: 'security',
      question: 'What backup and disaster recovery options are available?',
      answer: 'SaaS version includes automatic daily backups with point-in-time recovery. Standalone version backup depends on your infrastructure, but we can provide managed backup services.'
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Find answers to common questions about Acadeemia's school management system.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      {openItems.includes(index) ? (
                        <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {openItems.includes(index) && (
                      <div className="px-6 pb-4">
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/demo"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Request Demo
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;