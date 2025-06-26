import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, HelpCircle, Cloud, Server, Plus, AlertTriangle
} from 'lucide-react';
import Button from '../components/ui/Button';
import PricingCard from '../components/ui/PricingCard';

const Pricing: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'termly' | 'annual'>('annual');
  const [showAddOns, setShowAddOns] = useState(true);
  
  const handleBillingPeriodChange = (period: 'termly' | 'annual') => {
    setBillingPeriod(period);
  };
  
  const toggleAddOns = () => {
    setShowAddOns(!showAddOns);
  };
  
  // Calculate discounted prices for annual billing (10% discount)
  const getPrice = (termlyPrice: number) => {
    if (billingPeriod === 'annual') {
      const annualPrice = termlyPrice * 0.9 * 3;
      return `KES ${Math.round(annualPrice / 3).toLocaleString()}`; // Display the termly equivalent
    }
    return `KES ${termlyPrice.toLocaleString()}`;
  };
  
  const saasPlans = [
    {
      title: 'Starter',
      description: 'Perfect for small schools just getting started.',
      termlyPrice: 20000,
      features: [
        { text: '1 - 200 students', included: true },
        { text: 'Unlimited users', included: true },
        { text: 'FrontDesk feature', included: true },
        { text: 'Student management', included: true },
        { text: 'Fees management', included: true },
        { text: 'Bulk SMS integration', included: true },
        { text: 'Bulk email integration', included: true },
        { text: 'Payment Gateways integration', included: true },
        { text: 'Academics/Exams', included: true },
        { text: 'Transport management', included: true },
        { text: 'Library management', included: true },
        { text: 'Inventory management', included: true },
        { text: 'Hostel management', included: true },
        { text: 'Expenses management', included: true },
        { text: 'Attendance management', included: true },
        { text: 'Staff management', included: true },
        { text: 'Parent portal', included: true },
        { text: '24/7 access', included: true },
        { text: 'Fulltime support', included: true },
      ],
      highlight: false,
      badge: '',
    },
    {
      title: 'Bronze',
      description: 'Ideal for growing schools with expanded needs.',
      termlyPrice: 30000,
      features: [
        { text: '201 - 400 students', included: true },
        { text: 'Unlimited users', included: true },
        { text: 'FrontDesk feature', included: true },
        { text: 'Student management', included: true },
        { text: 'Fees management', included: true },
        { text: 'Bulk SMS integration', included: true },
        { text: 'Bulk email integration', included: true },
        { text: 'Payment Gateways integration', included: true },
        { text: 'Academics/Exams', included: true },
        { text: 'Transport management', included: true },
        { text: 'Library management', included: true },
        { text: 'Inventory management', included: true },
        { text: 'Hostel management', included: true },
        { text: 'Expenses management', included: true },
        { text: 'Attendance management', included: true },
        { text: 'Staff management', included: true },
        { text: 'Parent portal', included: true },
        { text: '24/7 access', included: true },
        { text: 'Fulltime support', included: true },
      ],
      highlight: false,
      badge: '',
    },
    {
      title: 'Silver',
      description: 'Complete solution for medium-sized institutions.',
      termlyPrice: 40000,
      features: [
        { text: '401 - 700 students', included: true },
        { text: 'Unlimited users', included: true },
        { text: 'FrontDesk feature', included: true },
        { text: 'Student management', included: true },
        { text: 'Fees management', included: true },
        { text: 'Bulk SMS integration', included: true },
        { text: 'Bulk email integration', included: true },
        { text: 'Payment Gateways integration', included: true },
        { text: 'Academics/Exams', included: true },
        { text: 'Transport management', included: true },
        { text: 'Library management', included: true },
        { text: 'Inventory management', included: true },
        { text: 'Hostel management', included: true },
        { text: 'Expenses management', included: true },
        { text: 'Attendance management', included: true },
        { text: 'Staff management', included: true },
        { text: 'Parent portal', included: true },
        { text: '24/7 access', included: true },
        { text: 'Fulltime support', included: true },
        { text: 'Up to 2 campuses', included: true },
      ],
      highlight: true,
      badge: 'Most Popular',
    },
    {
      title: 'Gold',
      description: 'Premium solution for large educational institutions.',
      termlyPrice: 60000,
      features: [
        { text: '701 - 1500 students', included: true },
        { text: 'Unlimited users', included: true },
        { text: 'FrontDesk feature', included: true },
        { text: 'Student management', included: true },
        { text: 'Fees management', included: true },
        { text: 'Bulk SMS integration', included: true },
        { text: 'Bulk email integration', included: true },
        { text: 'Payment Gateways integration', included: true },
        { text: 'Academics/Exams', included: true },
        { text: 'Transport management', included: true },
        { text: 'Library management', included: true },
        { text: 'Inventory management', included: true },
        { text: 'Hostel management', included: true },
        { text: 'Expenses management', included: true },
        { text: 'Attendance management', included: true },
        { text: 'Staff management', included: true },
        { text: 'Parent portal', included: true },
        { text: '24/7 access', included: true },
        { text: 'Fulltime support', included: true },
      ],
      highlight: false,
      badge: '',
    }
  ];
  
  const standalonePlans = [
    {
      title: 'Basic',
      description: 'Entry-level self-hosted solution for smaller institutions.',
      termlyPrice: 49999,
      period: 'yearly',
      features: [
        { text: 'Yearly license fee', included: true },
        { text: 'Up to 500 students', included: true },
        { text: 'Core modules', included: true },
        { text: 'Initial deployment', included: true },
        { text: 'Basic configuration', included: true },
        { text: 'Life-time of updates', included: true },
        { text: 'Advanced customization', included: false },
        { text: 'Extended support', included: false },
        { text: 'Hosting services', included: false },
      ],
      highlight: false,
    },
    {
      title: 'Advanced',
      description: 'Comprehensive self-hosted solution with extended support.',
      termlyPrice: 79999,
      period: 'yearly',
      features: [
        { text: 'Yearly license fee', included: true },
        { text: 'Unlimited students', included: true },
        { text: 'All core modules', included: true },
        { text: 'Professional deployment', included: true },
        { text: 'Advanced configuration', included: true },
        { text: 'Life-time of updates', included: true },
        { text: 'Basic customization', included: true },
        { text: '12 months of support', included: true },
        { text: 'Hosting services', included: false },
      ],
      highlight: true,
      badge: 'Recommended',
    },
    {
      title: 'Premium',
      description: 'Complete enterprise solution with unlimited options.',
      termlyPrice: 129999,
      period: 'yearly',
      features: [
        { text: 'Yearly license fee', included: true },
        { text: 'Unlimited students', included: true },
        { text: 'All core & premium modules', included: true },
        { text: 'White-glove deployment', included: true },
        { text: 'Custom configuration', included: true },
        { text: 'Life-time of updates', included: true },
        { text: 'Extensive customization', included: true },
        { text: '24 months of premium support', included: true },
        { text: '12 months hosting included', included: true },
      ],
      highlight: false,
    }
  ];
  
  const addOns = [
    {
      name: 'Zoom Live Classes (Standalone)',
      description: 'Integrate Zoom for seamless virtual classroom experiences.',
      price: 1999,
    },
    {
      name: 'Gmeet Live Classes (Standalone)',
      description: 'Google Meet integration for virtual learning',
      price: 1499,
    },
    {
      name: 'Advanced Data Analytics',
      description: 'Predictive analytics and detailed institutional insights',
      price: 2499,
    },
    {
      name: 'Transportation Management',
      description: 'Fleet management and student transportation tracking',
      price: 17990,
    },
    {
      name: 'Enhanced Security Suite',
      description: 'Advanced security features and audit logs',
      price: 1999,
    },
    {
      name: 'Multi-Campus Management',
      description: 'Tools for managing multiple branches or campuses',
      price: 2999,
    }
  ];
  
  const additionalServices = [
    {
      name: 'Managed Hosting (Standard)',
      description: 'For Standalone version',
      price: 1999,
      unit: 'month'
    },
    {
      name: 'Managed Hosting (Premium)',
      description: 'For Standalone version with enhanced resources',
      price: 3499,
      unit: 'month'
    },
    {
      name: 'Custom Domain Setup',
      description: 'For SaaS version',
      price: 1999,
      unit: 'one-time'
    },
    {
      name: 'Data Migration - Basic',
      description: 'From standard formats',
      price: 4999,
      unit: 'one-time'
    },
    {
      name: 'Data Migration - Complex',
      description: 'From custom or legacy systems',
      price: 14999,
      unit: 'one-time'
    },
    {
      name: 'Premium Support Package',
      description: 'Dedicated account manager and priority response',
      price: 2999,
      unit: 'month'
    }
  ];
  
  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Choose the plan that's right for your educational institution.
          </p>
        </div>
      </section>

      {/* Version Toggle */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="container">
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => handleBillingPeriodChange('termly')}
                className={`px-5 py-2 rounded-lg font-medium ${
                  billingPeriod === 'termly'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Termly
              </button>
              <button
                onClick={() => handleBillingPeriodChange('annual')}
                className={`px-5 py-2 rounded-lg font-medium ${
                  billingPeriod === 'annual'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Annual
              </button>
            </div>
            
            {billingPeriod === 'annual' && (
              <div className="bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center">
                <Check size={16} className="mr-1" />
                Save 10% with annual billing
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SaaS Pricing */}
      <section className="section">
        <div className="container">
          <div className="flex items-center justify-center mb-12">
            <div className="p-3 bg-primary-50 rounded-full mr-3">
              <Cloud size={24} className="text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold">SaaS Version</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {saasPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                description={plan.description}
                price={getPrice(plan.termlyPrice)}
                period={billingPeriod === 'annual' ? 'term (billed annually)' : 'term'}
                features={plan.features}
                highlight={plan.highlight}
                badge={plan.badge}
                buttonText="Subscribe Now"
                onButtonClick={() => window.location.href = '/contact'}
              />
            ))}
          </div>
          
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <AlertTriangle size={20} className="text-amber-500 mr-2" />
              <h3 className="text-lg font-semibold">Important Notes</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>All SaaS plans include automatic updates, daily backups, and security patches.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Pricing is per term and includes all listed features for the specified student range.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Annual billing provides a 20% discount compared to monthly billing.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Multi-campus management is available in Silver plan and above.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>All plans include unlimited users and 24/7 access with full-time support.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>All platform training is free.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Standalone Pricing */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-center mb-12">
            <div className="p-3 bg-secondary-50 rounded-full mr-3">
              <Server size={24} className="text-secondary-600" />
            </div>
            <h2 className="text-3xl font-bold">Standalone Version</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {standalonePlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                description={plan.description}
                price={`KES ${plan.termlyPrice.toLocaleString()}`}
                period={plan.period}
                features={plan.features}
                highlight={plan.highlight}
                badge={plan.badge}
                buttonText="Contact Sales"
                onButtonClick={() => window.location.href = '/Contact'}
              />
            ))}
          </div>
          
          <div className="mt-12 bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <AlertTriangle size={20} className="text-amber-500 mr-2" />
              <h3 className="text-lg font-semibold">Important Notes</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Standalone version requires a one-time license fee plus optional ongoing services.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Hosting services are not included in the base license but are available as an add-on service.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>After the included update period, an annual maintenance fee (15% of license cost) provides access to new updates.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Custom development services are available at an additional cost based on requirements.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Add-Ons Section */}
      <section className="section">
        <div className="container">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-accent-50 rounded-full mr-3">
              <Plus size={24} className="text-accent-600" />
            </div>
            <h2 className="text-3xl font-bold">Add-Ons & Additional Services</h2>
          </div>
          
          <p className="section-subtitle">
            Extend your system's functionality with these optional modules and services.
          </p>
          
          <div className="flex justify-center mb-8">
            <Button
              variant="outline"
              onClick={toggleAddOns}
              className="inline-flex items-center"
            >
              {showAddOns ? 'Hide Add-Ons' : 'Show Add-Ons'}
            </Button>
          </div>
          
          {showAddOns && (
            <>
              <h3 className="text-2xl font-semibold mb-6 text-center">System Add-Ons</h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-sm mb-12">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-4 text-left text-gray-700 font-semibold">Add-On Module</th>
                      <th className="px-6 py-4 text-left text-gray-700 font-semibold">Description</th>
                      <th className="px-6 py-4 text-right text-gray-700 font-semibold">
                        Termly Cost
                        <span className="ml-2 text-sm font-normal text-gray-500">(per institution)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {addOns.map((addon, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{addon.name}</td>
                        <td className="px-6 py-4 text-gray-600">{addon.description}</td>
                        <td className="px-6 py-4 text-right font-medium">KES {addon.price.toLocaleString()}/term</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-2xl font-semibold mb-6 text-center">Additional Services</h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-4 text-left text-gray-700 font-semibold">Service</th>
                      <th className="px-6 py-4 text-left text-gray-700 font-semibold">Details</th>
                      <th className="px-6 py-4 text-right text-gray-700 font-semibold">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {additionalServices.map((service, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{service.name}</td>
                        <td className="px-6 py-4 text-gray-600">{service.description}</td>
                        <td className="px-6 py-4 text-right font-medium">
                          KES {service.price.toLocaleString()}/{service.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[
              {
                q: "Can we switch between SaaS and Standalone versions?",
                a: "Yes, we offer migration services to help you transition between deployment options as your needs evolve."
              },
              {
                q: "Are there any hidden fees not listed here?",
                a: "No, our pricing is completely transparent. The only additional costs would be for custom development work or services not listed on this page."
              },
              {
                q: "Do you offer educational discounts?",
                a: "Yes, we offer special pricing for public schools, non-profits, and educational institutions in developing regions. Contact our sales team for details."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept credit cards, bank transfers, and purchase orders from qualified institutions."
              },
              {
                q: "Can I purchase individual modules instead of a complete plan?",
                a: "The core system requires a base plan, but you can selectively add individual add-on modules to any plan based on your needs."
              },
              {
                q: "What happens if we exceed our student limit?",
                a: "We'll notify you when you approach your limit and offer options to upgrade to the next tier or pay for additional student capacity."
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

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Institution?</h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Contact our sales team for a personalized quote or to discuss custom requirements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-primary hover:bg-white/10 hover:text-white"
                >
                  Contact Sales
                </Button>
              </Link>
              <Link to="/demo">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-primary hover:bg-white/10 hover:text-white"
                >
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;