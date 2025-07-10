import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, DollarSign, TrendingUp, Users, 
  Plus, Eye, Edit, Activity, Star
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const StoreDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: <Package size={24} />, title: 'Total Add-ons', value: '24', change: '+3', color: 'bg-blue-50 text-blue-600' },
    { icon: <ShoppingCart size={24} />, title: 'Total Orders', value: '156', change: '+12', color: 'bg-green-50 text-green-600' },
    { icon: <DollarSign size={24} />, title: 'Revenue', value: 'KES 2.4M', change: '+15%', color: 'bg-purple-50 text-purple-600' },
    { icon: <Users size={24} />, title: 'Active Customers', value: '89', change: '+8', color: 'bg-orange-50 text-orange-600' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Westlake Academy', addon: 'QR Code Attendance', amount: 'KES 3,999', status: 'completed', time: '2 hours ago' },
    { id: 'ORD-002', customer: 'Riverside College', addon: 'Android App', amount: 'KES 3,999', status: 'pending', time: '4 hours ago' },
    { id: 'ORD-003', customer: 'Global Institute', addon: 'Multi Branch', amount: 'KES 2,999', status: 'completed', time: '6 hours ago' },
    { id: 'ORD-004', customer: 'Tech Academy', addon: 'Zoom Live Classes', amount: 'KES 1,999', status: 'processing', time: '1 day ago' },
  ];

  const topAddons = [
    { name: 'QR Code Attendance', sales: 45, revenue: 'KES 179,550', category: 'Both' },
    { name: 'Android App', sales: 32, revenue: 'KES 127,680', category: 'Standalone' },
    { name: 'Two-Factor Authentication', sales: 28, revenue: 'KES 69,720', category: 'SaaS' },
    { name: 'Multi Branch', sales: 24, revenue: 'KES 71,976', category: 'Standalone' },
  ];

  const quickActions = [
    { icon: <Plus size={20} />, title: 'Add New Add-on', description: 'Create a new add-on for the store', action: () => navigate('/dashboard/store/addons/new') },
    { icon: <Eye size={20} />, title: 'View All Orders', description: 'See all customer orders', action: () => navigate('/dashboard/store/orders') },
    { icon: <TrendingUp size={20} />, title: 'View Analytics', description: 'Check store performance', action: () => navigate('/dashboard/store/analytics') },
    { icon: <Edit size={20} />, title: 'Manage Add-ons', description: 'Edit existing add-ons', action: () => navigate('/dashboard/store/addons') },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Store Manager</h1>
        <p className="text-primary-100">
          Manage your add-ons, track orders, and monitor store performance from this central dashboard.
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

      {/* Quick Actions and Recent Orders */}
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

        {/* Recent Orders */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.addon} - {order.amount}</p>
                  <p className="text-xs text-gray-400">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/dashboard/store/orders')}>
            View All Orders
          </Button>
        </Card>
      </div>

      {/* Top Performing Add-ons */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Top Performing Add-ons</h3>
          <Button variant="outline" icon={<Activity size={18} />} onClick={() => navigate('/dashboard/store/analytics')}>
            View Analytics
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Add-on Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Sales</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topAddons.map((addon, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 mr-2" />
                      <span className="font-medium">{addon.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {addon.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{addon.sales} sales</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{addon.revenue}</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StoreDashboard;