import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, MessageSquare, HelpCircle, Calendar, 
  Users, Filter, Search, Download, RefreshCw
} from 'lucide-react';
import Button from '../ui/Button';

const FormsLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const menuItems = [
    { 
      icon: <Calendar size={20} />, 
      label: 'Demo Requests', 
      path: '/dashboard/forms/demo-requests',
      description: 'Manage demo requests and schedule meetings'
    },
    { 
      icon: <MessageSquare size={20} />, 
      label: 'Contact Forms', 
      path: '/dashboard/forms/contact-forms',
      description: 'View and respond to contact inquiries'
    },
    { 
      icon: <HelpCircle size={20} />, 
      label: 'Support Requests', 
      path: '/dashboard/forms/support-requests',
      description: 'Handle support tickets and issues'
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Forms Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Forms Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage form submissions</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-start px-4 py-3 text-left rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 mt-0.5">{item.icon}</span>
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Forms Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => isActive(item.path))?.label || 'Forms Management'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <Button variant="outline" icon={<Filter size={18} />}>
                Filter
              </Button>
              
              <Button variant="outline" icon={<RefreshCw size={18} />}>
                Refresh
              </Button>
              
              <Button variant="primary" icon={<Download size={18} />}>
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FormsLayout;