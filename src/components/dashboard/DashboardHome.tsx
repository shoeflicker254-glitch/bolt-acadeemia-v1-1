import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, School, BookOpen, TrendingUp, Calendar, 
  Bell, FileText, CreditCard, Shield, Database 
} from 'lucide-react';
import Card from '../ui/Card';

const DashboardHome: React.FC = () => {
  const { user, userRole, schoolId } = useAuth();

  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'super_admin':
        return 'Welcome to the Super Admin Dashboard';
      case 'admin':
        return 'Welcome to your School Administration Dashboard';
      case 'teacher':
        return 'Welcome to your Teaching Dashboard';
      case 'staff':
        return 'Welcome to your Staff Dashboard';
      default:
        return 'Welcome to your Dashboard';
    }
  };

  const getStatsCards = () => {
    if (userRole === 'super_admin') {
      return [
        { icon: <School size={24} />, title: 'Total Schools', value: '150+', color: 'bg-blue-50 text-blue-600' },
        { icon: <Users size={24} />, title: 'Total Users', value: '25,000+', color: 'bg-green-50 text-green-600' },
        { icon: <CreditCard size={24} />, title: 'Active Subscriptions', value: '142', color: 'bg-purple-50 text-purple-600' },
        { icon: <TrendingUp size={24} />, title: 'Monthly Revenue', value: '$45,000', color: 'bg-orange-50 text-orange-600' },
      ];
    }

    if (userRole === 'admin') {
      return [
        { icon: <Users size={24} />, title: 'Total Students', value: '1,250', color: 'bg-blue-50 text-blue-600' },
        { icon: <Users size={24} />, title: 'Staff Members', value: '85', color: 'bg-green-50 text-green-600' },
        { icon: <BookOpen size={24} />, title: 'Classes', value: '45', color: 'bg-purple-50 text-purple-600' },
        { icon: <Calendar size={24} />, title: 'Events This Month', value: '12', color: 'bg-orange-50 text-orange-600' },
      ];
    }

    if (userRole === 'teacher') {
      return [
        { icon: <BookOpen size={24} />, title: 'My Classes', value: '6', color: 'bg-blue-50 text-blue-600' },
        { icon: <Users size={24} />, title: 'My Students', value: '180', color: 'bg-green-50 text-green-600' },
        { icon: <FileText size={24} />, title: 'Assignments', value: '24', color: 'bg-purple-50 text-purple-600' },
        { icon: <Calendar size={24} />, title: 'Classes Today', value: '4', color: 'bg-orange-50 text-orange-600' },
      ];
    }

    return [
      { icon: <Bell size={24} />, title: 'Notifications', value: '5', color: 'bg-blue-50 text-blue-600' },
      { icon: <FileText size={24} />, title: 'Documents', value: '12', color: 'bg-green-50 text-green-600' },
      { icon: <Calendar size={24} />, title: 'Events', value: '3', color: 'bg-purple-50 text-purple-600' },
      { icon: <Users size={24} />, title: 'Contacts', value: '45', color: 'bg-orange-50 text-orange-600' },
    ];
  };

  const getRecentActivities = () => {
    if (userRole === 'super_admin') {
      return [
        { action: 'New school registered', details: 'Greenwood Academy joined the platform', time: '2 hours ago' },
        { action: 'Subscription renewed', details: 'Riverside College renewed their Gold plan', time: '4 hours ago' },
        { action: 'Support ticket resolved', details: 'Technical issue resolved for Westlake High', time: '6 hours ago' },
        { action: 'Payment received', details: 'Monthly payment from 15 schools processed', time: '1 day ago' },
      ];
    }

    if (userRole === 'admin') {
      return [
        { action: 'New student enrolled', details: 'John Smith enrolled in Grade 10A', time: '1 hour ago' },
        { action: 'Staff meeting scheduled', details: 'Monthly staff meeting set for Friday', time: '3 hours ago' },
        { action: 'Report generated', details: 'Monthly attendance report completed', time: '5 hours ago' },
        { action: 'Fee payment received', details: 'Payment from 25 students processed', time: '1 day ago' },
      ];
    }

    if (userRole === 'teacher') {
      return [
        { action: 'Assignment submitted', details: '15 students submitted Math homework', time: '30 minutes ago' },
        { action: 'Grade updated', details: 'Physics test grades published', time: '2 hours ago' },
        { action: 'Class scheduled', details: 'Extra Chemistry class added for tomorrow', time: '4 hours ago' },
        { action: 'Parent meeting', details: 'Meeting with Sarah\'s parents completed', time: '1 day ago' },
      ];
    }

    return [
      { action: 'Profile updated', details: 'Contact information updated successfully', time: '1 hour ago' },
      { action: 'Document uploaded', details: 'New certificate added to profile', time: '3 hours ago' },
      { action: 'Notification received', details: 'School event reminder', time: '5 hours ago' },
      { action: 'Message sent', details: 'Message sent to class teacher', time: '1 day ago' },
    ];
  };

  const statsCards = getStatsCards();
  const recentActivities = getRecentActivities();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h1>
        <p className="text-primary-100">
          {userRole === 'super_admin' 
            ? 'Manage all schools and monitor system performance from here.'
            : 'Here\'s what\'s happening in your account today.'
          }
        </p>
        <div className="mt-4 text-sm">
          <p>Logged in as: <span className="font-medium">{user?.email}</span></p>
          {schoolId && <p>School ID: <span className="font-medium">{schoolId}</span></p>}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="p-6" hoverEffect>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {userRole === 'super_admin' && (
              <>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <School size={20} className="text-primary-600 mr-3" />
                    <span className="font-medium">Add New School</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Database size={20} className="text-primary-600 mr-3" />
                    <span className="font-medium">System Analytics</span>
                  </div>
                </button>
              </>
            )}
            
            {userRole === 'admin' && (
              <>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Users size={20} className="text-primary-600 mr-3" />
                    <span className="font-medium">Add New Student</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-primary-600 mr-3" />
                    <span className="font-medium">Generate Report</span>
                  </div>
                </button>
              </>
            )}

            {userRole === 'teacher' && (
              <>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-primary-600 mr-3" />
                    <span className="font-medium">Create Assignment</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <BookOpen size={20} className="text-primary-600 mr-3" />
                    <span className="font-medium">Take Attendance</span>
                  </div>
                </button>
              </>
            )}

            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Bell size={20} className="text-primary-600 mr-3" />
                <span className="font-medium">View Notifications</span>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;