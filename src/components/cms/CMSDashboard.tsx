import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Image, Layout, DollarSign, Users, Settings,
  TrendingUp, Eye, Edit, Plus, Activity
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CMSDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: <FileText size={24} />, title: 'Total Pages', value: '12', change: '+2', color: 'bg-blue-50 text-blue-600' },
    { icon: <Layout size={24} />, title: 'Sections', value: '48', change: '+5', color: 'bg-green-50 text-green-600' },
    { icon: <Image size={24} />, title: 'Media Files', value: '156', change: '+12', color: 'bg-purple-50 text-purple-600' },
    { icon: <Eye size={24} />, title: 'Page Views', value: '2.4K', change: '+15%', color: 'bg-orange-50 text-orange-600' },
  ];

  const recentActivity = [
    { action: 'Updated', item: 'Home Page - Hero Section', time: '2 hours ago', user: 'Admin' },
    { action: 'Created', item: 'New Blog Post', time: '4 hours ago', user: 'Admin' },
    { action: 'Modified', item: 'Pricing Page', time: '6 hours ago', user: 'Admin' },
    { action: 'Uploaded', item: 'Product Image', time: '1 day ago', user: 'Admin' },
  ];

  const quickActions = [
    { icon: <Plus size={20} />, title: 'Create New Page', description: 'Add a new page to your website', action: () => navigate('/dashboard/cms/pages/new') },
    { icon: <Edit size={20} />, title: 'Edit Home Page', description: 'Modify the main landing page', action: () => navigate('/dashboard/cms/pages/home') },
    { icon: <Image size={20} />, title: 'Upload Media', description: 'Add images and files', action: () => navigate('/dashboard/cms/media') },
    { icon: <DollarSign size={20} />, title: 'Update Pricing', description: 'Modify pricing plans', action: () => navigate('/dashboard/cms/pricing') },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Content Management</h1>
        <p className="text-primary-100">
          Manage your website content, pages, media, and settings from this central dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6" hoverEffect>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-primary-50 rounded-lg mr-3">
                    <span className="text-primary-600">{action.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">{activity.action}</span>
                    <span className="text-gray-600"> {activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time} by {activity.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Activity
          </Button>
        </Card>
      </div>

      {/* Content Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Content Overview</h3>
          <Button variant="outline" icon={<Activity size={18} />}>
            View Analytics
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <FileText size={32} className="mx-auto text-blue-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Pages</h4>
            <p className="text-sm text-gray-600 mt-1">Manage website pages and their content</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/dashboard/cms/pages')}>
              Manage Pages
            </Button>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Image size={32} className="mx-auto text-green-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Media</h4>
            <p className="text-sm text-gray-600 mt-1">Upload and organize images and files</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/dashboard/cms/media')}>
              Manage Media
            </Button>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <DollarSign size={32} className="mx-auto text-purple-600 mb-2" />
            <h4 className="font-semibold text-gray-900">Pricing</h4>
            <p className="text-sm text-gray-600 mt-1">Update pricing plans and features</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/dashboard/cms/pricing')}>
              Manage Pricing
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CMSDashboard;