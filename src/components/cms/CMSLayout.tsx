import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, Image, Settings, Layout, DollarSign, Users, 
  Home, Plus, Search, Filter, Save, Eye, Edit3
} from 'lucide-react';
import Button from '../ui/Button';

const CMSLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard/cms' },
    { icon: <FileText size={20} />, label: 'Pages', path: '/dashboard/cms/pages' },
    { icon: <Layout size={20} />, label: 'Sections', path: '/dashboard/cms/sections' },
    { icon: <Edit3 size={20} />, label: 'Content', path: '/dashboard/cms/content' },
    { icon: <Image size={20} />, label: 'Media', path: '/dashboard/cms/media' },
    { icon: <DollarSign size={20} />, label: 'Pricing', path: '/dashboard/cms/pricing' },
    { icon: <Users size={20} />, label: 'Users', path: '/dashboard/cms/users' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/cms/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* CMS Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Content Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your website content</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* CMS Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => isActive(item.path))?.label || 'CMS'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <Button variant="outline" icon={<Filter size={18} />}>
                Filter
              </Button>
              
              <Button variant="primary" icon={<Plus size={18} />}>
                New Content
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

export default CMSLayout;