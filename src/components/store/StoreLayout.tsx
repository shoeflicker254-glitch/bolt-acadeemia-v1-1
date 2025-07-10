import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Store, Package, ShoppingCart, BarChart, Settings, 
  Home, Plus, Search, Filter, TrendingUp
} from 'lucide-react';
import Button from '../ui/Button';

const StoreLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard/store' },
    { icon: <Package size={20} />, label: 'Add-ons', path: '/dashboard/store/addons' },
    { icon: <ShoppingCart size={20} />, label: 'Orders', path: '/dashboard/store/orders' },
    { icon: <BarChart size={20} />, label: 'Analytics', path: '/dashboard/store/analytics' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/store/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Store Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Store Manager</h2>
          <p className="text-sm text-gray-600 mt-1">Manage add-ons and orders</p>
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
        {/* Store Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => isActive(item.path))?.label || 'Store Manager'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search store..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <Button variant="outline" icon={<Filter size={18} />}>
                Filter
              </Button>
              
              <Button variant="primary" icon={<Plus size={18} />}>
                New Add-on
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

export default StoreLayout;