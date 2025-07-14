import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Check, HelpCircle, Cloud, Server, Plus, AlertTriangle, ShoppingCart
} from 'lucide-react';
import Button from '../components/ui/Button';
import PricingCard from '../components/ui/PricingCard';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [billingPeriod, setBillingPeriod] = useState<'termly' | 'annual'>('annual');
  const [showAddOns, setShowAddOns] = useState(true);
  
  const handleBillingPeriodChange = (period: 'termly' | 'annual') => {
    setBillingPeriod(period);
  };
  
  const toggleAddOns = () => {
    setShowAddOns(!showAddOns);
  };

  const handleContactSales = () => {
    navigate('/contact');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleBuyAddon = (addonName: string, price: number) => {
    // Navigate to store with the specific addon
    navigate('/store', { 
      state: { 
        selectedAddon: addonName,
        price: price,
        fromPricing: true 
      } 
    });
  };

  // Handle URL hash for category filtering
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);
  
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
  
  const saasaddOns = [
    {
      name: 'QR Code Attendance ',
      description: 'Advanced attendance tracking using QR codes for quick and accurate recording.',
      price: 3999,
    },
    {
      name: 'Two-Factor Authentication',
      description: 'Enhanced security with two-factor authentication for user accounts.',
      price: 2499,
    }
  ];

  const standaloneaddOns = [
    {
      name: 'Android App',
      description: 'Mobile access through dedicated Android application.',
      price: 1999,
    },
    {
      name: 'Behaviour Records',
      description: 'Track and manage student behavior and disciplinary records.',
      price: 1999,
    },
    {
      name: 'Biometrics Entry',
      description: 'Biometric authentication for secure access control.',
      price: 1999,
    },
    {
      name: 'CBSE Examination',
      description: 'Specialized module for CBSE examination management.',
      price: 1999,
    },
    {
      name: 'Gmeet Live Classes',
      description: 'Google Meet integration for virtual learning',
      price: 1499,
    },
    {
      name: 'Multi Branch',
      description: 'Manage multiple branches or campuses from a single system.',
      price: 2999,
    },
    {
      name: 'Online Course',
      description: 'Complete online course management system.',
      price: 2499,
    },
    {
      name: 'QR Code Attendance',
      description: 'Quick and accurate attendance tracking using QR codes.',
      price: 1999,
    },
    {
      name: 'Quick Fees',
      description: 'Streamlined fee collection and management system.',
      price: 1999,
    },
    {
      name: 'Thermal Print',
      description: 'Support for thermal printing of receipts.',
      price: 1999,
    },
    {
      name: 'Two-Factor Authenticator',
      description: 'Enhanced security with two-factor authentication.',
      price: 1999,
    },
    {
      name: 'Zoom Live Classes',
      description: 'Integrate Zoom for seamless virtual classroom experiences.',
      price: 1999,
    }
  ];
  
  const additionalServices = [
    {
      name: 'Managed Hosting (Standard)',
      description: 'For Standalone version',
      price: 3999,
      unit: 'term'
    },
    {
      name: 'Managed Hosting (Premium)',
      description: 'For Standalone version with enhanced resources',
      price: 8499,
      unit: 'term'
    },
    {
      name: 'Custom Domain Setup',
      description: 'For SaaS version',
      price: 3499,
      unit: 'year'
    },
    {
      name: 'Data Migration - Basic',
      description: 'From standard formats',
      price: 4999,
      unit: 'year'
    },
    {
      name: 'Data Migration - Complex',
      description: 'From custom or legacy systems',
      price: 14999,
      unit: 'year'
    },
    {
      name: 'Premium Support Package',
      description: 'Dedicated account manager and priority response',
      price: 4999,
      unit: 'term'
    },
    {
      name: 'Onboarding (SaaS)',
      description: 'The setup of schools data e.g teachers, students, parents etc.',
      price: 4999,
      unit: 'one-time'
    },
   {
      name: 'Onboarding (Standalone)',
      description: 'The setup of schools data e.g teachers, students, parents etc.',
      price: 9999,
      unit: 'one-time'
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
      <section id="saas-pricing" className="section">
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
                onButtonClick={handleContactSales}
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
                <span>Annual billing provides a 10% discount compared to monthly billing.</span>
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
      <section id="standalone-pricing" className="section bg-gray-50">
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
                onButtonClick={handleContactSales}
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
                <span>Standalone version requires a yearly license fee plus optional ongoing services</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Hosting services are not included in the base license but are available as an add-on service.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>We offer lifetime update period on all plans, and an annual maintenance fee (15% of license cost) provides access to platform maintenance throughout.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Custom development services are available at an additional cost based on requirements.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>All training is offered free.</span>
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
              <h3 className="text-2xl font-semibold mb-6 text-center">SaaS Add-Ons</h3>
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
                      <th className="px-6 py-4 text-center text-gray-700 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {saasaddOns.map((saasaddon, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{saasaddon.name}</td>
                        <td className="px-6 py-4 text-gray-600">{saasaddon.description}</td>
                        <td className="px-6 py-4 text-right font-medium">KES {saasaddon.price.toLocaleString()}/term</td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<ShoppingCart size={16} />}
                            onClick={() => handleBuyAddon(saasaddon.name, saasaddon.price)}
                          >
                            Buy Now
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-center">Standalone Add-Ons</h3>
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
                      <th className="px-6 py-4 text-center text-gray-700 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {standaloneaddOns.map((standaloneaddon, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{standaloneaddon.name}</td>
                        <td className="px-6 py-4 text-gray-600">{standaloneaddon.description}</td>
                        <td className="px-6 py-4 text-right font-medium">KES {standaloneaddon.price.toLocaleString()}/term</td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<ShoppingCart size={16} />}
                            onClick={() => handleBuyAddon(standaloneaddon.name, standaloneaddon.price)}
                            className="min-w-[100px]"
                          >
                            Buy Now
                          </Button>
                        </td>
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
                      <th className="px-6 py-4 text-center text-gray-700 font-semibold">Action</th>
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
                        <td className="px-6 py-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleContactSales}
                          >
                            Contact Sales
                          </Button>
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
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-primary hover:bg-white/10 hover:text-white"
                onClick={handleContactSales}
              >
                Contact Sales
              </Button>
              <Link to="/demo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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