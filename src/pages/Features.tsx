import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, BarChart, Calendar, Bell, FileText, 
  MessageSquare, Settings, Clock, Award, CheckSquare, Search,
  Globe, Database, Shield, Zap, Briefcase, BookmarkPlus,
  Cloud, Server, Package
} from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/ui/FeatureCard';
import AddOnCard from '../components/ui/AddOnCard';

const Features: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVersion, setActiveVersion] = useState<'saas' | 'standalone'>('saas');
  
  const categories = [
    { id: 'all', label: 'All Features' },
    { id: 'core', label: 'Core Features' },
    { id: 'academic', label: 'Academic' },
    { id: 'admin', label: 'Administrative' },
    { id: 'communication', label: 'Communication' },
    { id: 'addons', label: 'Add-Ons' }
  ];

  const saasModules = [
    { name: 'Alumni', category: 'core' },
    { name: 'Attachments Book', category: 'admin' },
    { name: 'Attendance', category: 'academic' },
    { name: 'Bulk SMS and Email', category: 'communication' },
    { name: 'Card Management', category: 'admin' },
    { name: 'Certificate', category: 'academic' },
    { name: 'Custom Domain', category: 'admin' },
    { name: 'Events', category: 'core' },
    { name: 'Homework', category: 'academic' },
    { name: 'Hostel', category: 'admin' },
    { name: 'Human Resource', category: 'admin' },
    { name: 'Inventory', category: 'admin' },
    { name: 'Library', category: 'academic' },
    { name: 'Live Class', category: 'academic' },
    { name: 'Multi Class', category: 'academic' },
    { name: 'Office Accounting', category: 'admin' },
    { name: 'Online Exam', category: 'academic' },
    { name: 'Reception', category: 'admin' },
    { name: 'Student Accounting', category: 'admin' },
    { name: 'Transport', category: 'admin' },
    { name: 'Website', category: 'core' }
  ];

  const standaloneModules = [
    { name: 'Fees Collection', category: 'admin' },
    { name: 'Income', category: 'admin' },
    { name: 'Expense', category: 'admin' },
    { name: 'Student Attendance', category: 'academic' },
    { name: 'Examination', category: 'academic' },
    { name: 'Download Center', category: 'core' },
    { name: 'Library', category: 'academic' },
    { name: 'Inventory', category: 'admin' },
    { name: 'Transport', category: 'admin' },
    { name: 'Hostel', category: 'admin' },
    { name: 'Communicate', category: 'communication' },
    { name: 'Front CMS', category: 'core' },
    { name: 'Front Office', category: 'admin' },
    { name: 'Homework', category: 'academic' },
    { name: 'Certificate', category: 'academic' },
    { name: 'Calendar To-Do List', category: 'core' },
    { name: 'Online Examination', category: 'academic' },
    { name: 'Chat', category: 'communication' },
    { name: 'Multi Class', category: 'academic' },
    { name: 'Online Admission', category: 'admin' },
    { name: 'Alumni', category: 'core' },
    { name: 'Lesson Plan', category: 'academic' },
    { name: 'Annual Calendar', category: 'core' },
    { name: 'Student CV', category: 'academic' }
  ];

  const saasAddons = [
    {
      title: 'QR Code Attendance',
      description: 'Advanced attendance tracking using QR codes for quick and accurate recording.',
      price: 'KES 3,999/term',
      category: 'addons'
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Enhanced security with two-factor authentication for user accounts.',
      price: 'KES 2,999/term',
      category: 'addons'
    }
  ];

  const standaloneAddons = [
    {
      title: 'Zoom Live Classes',
      description: 'Integrate Zoom for seamless virtual classroom experiences.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'Gmeet Live Classes',
      description: 'Google Meet integration for virtual learning.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'Online Course',
      description: 'Complete online course management system.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'Behaviour Records',
      description: 'Track and manage student behavior and disciplinary records.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'CBSE Examination',
      description: 'Specialized module for CBSE examination management.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'Multi Branch',
      description: 'Manage multiple branches or campuses from a single system.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'Two-Factor Authenticator',
      description: 'Enhanced security with two-factor authentication.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'QR Code Attendance',
      description: 'Quick and accurate attendance tracking using QR codes.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'Quick Fees',
      description: 'Streamlined fee collection and management system.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'Thermal Print',
      description: 'Support for thermal printing of receipts and documents.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'Android App',
      description: 'Mobile access through dedicated Android application.',
      price: 'Contact Sales',
      category: 'addons'
    },
    {
      title: 'Biometrics Entry',
      description: 'Biometric authentication for secure access control.',
      price: 'Contact Sales',
      category: 'addons'
    }
  ];

  const getModules = () => {
    const modules = activeVersion === 'saas' ? saasModules : standaloneModules;
    return activeCategory === 'all' 
      ? modules 
      : modules.filter(module => module.category === activeCategory);
  };

  const getAddons = () => {
    return activeVersion === 'saas' ? saasAddons : standaloneAddons;
  };

  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features & Add-Ons
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover the comprehensive toolset that powers Acadeemia and explore optional add-ons to extend functionality.
          </p>
        </div>
      </section>

      {/* Version Toggle */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="container">
          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveVersion('saas')}
                className={`flex items-center px-5 py-2 rounded-lg font-medium ${
                  activeVersion === 'saas'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Cloud size={20} className="mr-2" />
                SaaS Version
              </button>
              <button
                onClick={() => setActiveVersion('standalone')}
                className={`flex items-center px-5 py-2 rounded-lg font-medium ${
                  activeVersion === 'standalone'
                    ? 'bg-secondary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Server size={20} className="mr-2" />
                Standalone Version
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? activeVersion === 'saas' 
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCategory === 'addons' ? (
              getAddons().map((addon, index) => (
                <AddOnCard
                  key={index}
                  title={addon.title}
                  description={addon.description}
                  price={addon.price}
                  icon={<Package size={24} />}
                  category="Add-On"
                  buttonText="Learn More"
                />
              ))
            ) : (
              getModules().map((module, index) => (
                <FeatureCard
                  key={index}
                  title={module.name}
                  description={`Comprehensive ${module.name.toLowerCase()} management and tracking system.`}
                  icon={<CheckSquare size={24} />}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Acadeemia?</h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              See all these features in action with a personalized demo tailored to your institution's needs.
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
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;