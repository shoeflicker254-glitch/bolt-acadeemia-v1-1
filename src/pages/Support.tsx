import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, MessageSquare, Phone, Mail, Clock, FileText, 
  Video, Book, Users, Zap, CheckCircle, AlertCircle, Search
} from 'lucide-react';
import Button from '../components/ui/Button';

const Support: React.FC = () => {
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'medium',
    description: ''
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle ticket submission
    console.log('Ticket submitted:', ticketForm);
  };

  const supportChannels = [
    {
      icon: <Mail size={24} />,
      title: 'Email Support',
      description: 'Get help via email with detailed responses',
      contact: 'support@acadeemia.com',
      responseTime: '24 hours',
      availability: '24/7'
    },
    {
      icon: <Phone size={24} />,
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      contact: '+254 111 313 818',
      responseTime: 'Immediate',
      availability: 'Mon-Fri 7AM-5PM EAT'
    },
    {
      icon: <MessageSquare size={24} />,
      title: 'Live Chat',
      description: 'Real-time chat support for quick questions',
      contact: 'Available on website',
      responseTime: '< 5 minutes',
      availability: 'Mon-Fri 8AM-6PM EAT'
    }
  ];

  const supportResources = [
    {
      icon: <Book size={24} />,
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials',
      link: '#',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: <Video size={24} />,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      link: '#',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: <HelpCircle size={24} />,
      title: 'FAQ',
      description: 'Frequently asked questions',
      link: '/faq',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: <Users size={24} />,
      title: 'Community Forum',
      description: 'Connect with other users',
      link: '#',
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  const ticketTypes = [
    { id: 'technical', label: 'Technical Issue', icon: <Zap size={20} /> },
    { id: 'billing', label: 'Billing Question', icon: <FileText size={20} /> },
    { id: 'feature', label: 'Feature Request', icon: <CheckCircle size={20} /> },
    { id: 'bug', label: 'Bug Report', icon: <AlertCircle size={20} /> },
    { id: 'general', label: 'General Inquiry', icon: <HelpCircle size={20} /> }
  ];

  return (
    <div className="pt-20 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Support Center
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Get the help you need to make the most of Acadeemia's school management system.
          </p>
        </div>
      </section>

      {/* Quick Search */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, guides, or common issues..."
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Get Support</h2>
          <p className="section-subtitle">
            Choose the support channel that works best for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-3 bg-primary-50 rounded-full w-14 h-14 flex items-center justify-center text-primary-600 mb-6">
                  {channel.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{channel.title}</h3>
                <p className="text-gray-600 mb-4">{channel.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Contact:</span>
                    <span className="text-sm font-medium">{channel.contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Response Time:</span>
                    <span className="text-sm font-medium">{channel.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Availability:</span>
                    <span className="text-sm font-medium">{channel.availability}</span>
                  </div>
                </div>

                <Button variant="outline" fullWidth>
                  {channel.title === 'Email Support' ? 'Send Email' : 
                   channel.title === 'Phone Support' ? 'Call Now' : 'Start Chat'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Self-Service Resources */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title">Self-Service Resources</h2>
          <p className="section-subtitle">
            Find answers and learn how to use Acadeemia effectively.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {supportResources.map((resource, index) => (
              <Link
                key={index}
                to={resource.link}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 ${resource.color}`}>
                  {resource.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm">{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Support Ticket */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Submit a Support Ticket</h2>
            <p className="text-xl text-gray-600 text-center mb-12">
              Can't find what you're looking for? Submit a detailed support request and our team will get back to you.
            </p>

            <form onSubmit={handleTicketSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={ticketForm.name}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Issue Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {ticketTypes.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedTicketType(type.id)}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                        selectedTicketType === type.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {type.icon}
                      <span className="text-xs mt-1 text-center">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={6}
                  required
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Please provide as much detail as possible about your issue..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <Button type="submit" variant="primary" fullWidth>
                Submit Support Ticket
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Support Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Clock size={32} className="mx-auto text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Business Hours</h3>
                <p className="text-gray-600 mb-4">Monday - Friday</p>
                <p className="text-2xl font-bold text-primary-600">7:00 AM - 5:00 PM</p>
                <p className="text-sm text-gray-500 mt-2">East Africa Time (EAT)</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Mail size={32} className="mx-auto text-secondary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Available 24/7</p>
                <p className="text-2xl font-bold text-secondary-600">Always Open</p>
                <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Mail size={32} className="mx-auto text-secondary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Call & Chat Support</h3>
                <p className="text-gray-600 mb-4">Available 24/7</p>
                <p className="text-2xl font-bold text-secondary-600">Always Open</p>
                <p className="text-sm text-gray-500 mt-2">Response within 5 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;