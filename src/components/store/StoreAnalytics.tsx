import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Package, Users, Calendar,
  BarChart, PieChart, Download, Filter
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useCurrency } from '../../contexts/CurrencyContext';

const StoreAnalytics: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [dateRange, setDateRange] = useState('30d');
  const [category, setCategory] = useState('all');

  const stats = [
    { 
      icon: <DollarSign size={24} />, 
      title: 'Total Revenue', 
      value: formatPrice(2456780), 
      change: '+15.3%', 
      color: 'bg-green-50 text-green-600',
      trend: 'up'
    },
    { 
      icon: <Package size={24} />, 
      title: 'Add-ons Sold', 
      value: '156', 
      change: '+8.2%', 
      color: 'bg-blue-50 text-blue-600',
      trend: 'up'
    },
    { 
      icon: <Users size={24} />, 
      title: 'Active Customers', 
      value: '89', 
      change: '+12.1%', 
      color: 'bg-purple-50 text-purple-600',
      trend: 'up'
    },
    { 
      icon: <TrendingUp size={24} />, 
      title: 'Conversion Rate', 
      value: '3.2%', 
      change: '+0.5%', 
      color: 'bg-orange-50 text-orange-600',
      trend: 'up'
    },
  ];

  const topAddons = [
    { name: 'QR Code Attendance', sales: 45, revenue: 179550, percentage: 28.8 },
    { name: 'Android App', sales: 32, revenue: 127680, percentage: 20.5 },
    { name: 'Two-Factor Authentication', sales: 28, revenue: 83720, percentage: 17.9 },
    { name: 'Multi Branch', sales: 24, revenue: 71976, percentage: 15.4 },
    { name: 'Zoom Live Classes', sales: 18, revenue: 35982, percentage: 11.5 },
    { name: 'Others', sales: 9, revenue: 21092, percentage: 5.9 },
  ];

  const revenueData = [
    { month: 'Jan', saas: 45000, standalone: 32000 },
    { month: 'Feb', saas: 52000, standalone: 38000 },
    { month: 'Mar', saas: 48000, standalone: 42000 },
    { month: 'Apr', saas: 61000, standalone: 45000 },
    { month: 'May', saas: 55000, standalone: 48000 },
    { month: 'Jun', saas: 67000, standalone: 52000 },
  ];

  const customerSegments = [
    { segment: 'Primary Schools', count: 34, percentage: 38.2, color: 'bg-blue-500' },
    { segment: 'Secondary Schools', count: 28, percentage: 31.5, color: 'bg-green-500' },
    { segment: 'Colleges', count: 15, percentage: 16.9, color: 'bg-purple-500' },
    { segment: 'Universities', count: 12, percentage: 13.4, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Analytics</h1>
          <p className="text-gray-600">Track store performance and insights</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" icon={<Download size={18} />}>
            Export Report
          </Button>
        </div>
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
                  <span className={`ml-2 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Trends</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">SaaS</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Standalone</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex flex-col items-center space-y-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(data.saas / 70000) * 200}px` }}
                  ></div>
                  <div 
                    className="w-full bg-green-500"
                    style={{ height: `${(data.standalone / 70000) * 200}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Add-ons */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Top Performing Add-ons</h3>
          <div className="space-y-4">
            {topAddons.map((addon, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{addon.name}</span>
                    <span className="text-sm text-gray-600">{addon.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${addon.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{addon.sales} sales</span>
                    <span className="text-xs text-gray-500">{formatPrice(addon.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Customer Segments and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Customer Segments</h3>
          <div className="space-y-4">
            {customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${segment.color} rounded-full mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{segment.segment}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{segment.count}</div>
                  <div className="text-xs text-gray-500">{segment.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">89</div>
                {formatPrice(15748)}
            </div>
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Performance Metrics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Average Order Value</span>
                <span className="text-sm font-bold text-gray-900">KES 15,748</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Customer Retention</span>
                <span className="text-sm font-bold text-gray-900">85.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Cart Abandonment</span>
                <span className="text-sm font-bold text-gray-900">12.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '13%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                <span className="text-sm font-bold text-gray-900">4.7/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Detailed Add-on Performance</h3>
          <Button variant="outline" icon={<Filter size={18} />}>
            Filter
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
                <th className="text-left py-3 px-4 font-medium text-gray-700">Avg. Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Growth</th>
              </tr>
            </thead>
            <tbody>
              {topAddons.slice(0, 5).map((addon, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{addon.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {index % 2 === 0 ? 'SaaS' : 'Standalone'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{addon.sales}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{formatPrice(addon.revenue)}</td>
                  <td className="py-3 px-4 text-gray-600">{formatPrice(Math.round(addon.revenue / addon.sales))}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-medium">+{(Math.random() * 20 + 5).toFixed(1)}%</span>
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

export default StoreAnalytics;