import React, { useState, useEffect } from 'react';
import { 
  Mail, Users, Download, Search, Filter, Eye, 
  Trash2, UserX, UserCheck, Calendar, TrendingUp,
  X, CheckCircle, AlertCircle, RefreshCw, Send
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface NewsletterSubscription {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'complained';
  subscribed_at: string;
  unsubscribed_at?: string;
  source: string;
  preferences: any;
  created_at: string;
  updated_at: string;
}

const NewsletterManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [selectedSubscription, setSelectedSubscription] = useState<NewsletterSubscription | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({ email: '', name: '' });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched newsletter subscriptions:', data);
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching newsletter subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: NewsletterSubscription['status']) => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'unsubscribed') {
        updateData.unsubscribed_at = new Date().toISOString();
      } else if (newStatus === 'active') {
        updateData.unsubscribed_at = null;
      }

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      setSubscriptions(subscriptions.map(sub => 
        sub.id === id ? { ...sub, ...updateData } : sub
      ));
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this subscription?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: newSubscriber.email,
          name: newSubscriber.name || null,
          status: 'active',
          source: 'admin'
        });

      if (error) throw error;
      
      setNewSubscriber({ email: '', name: '' });
      setShowAddForm(false);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error adding subscriber:', error);
      alert('Failed to add subscriber. Email might already exist.');
    }
  };

  const exportSubscriptions = () => {
    const csvContent = [
      ['Email', 'Name', 'Status', 'Subscribed Date', 'Source'],
      ...filteredSubscriptions.map(sub => [
        sub.email,
        sub.name || '',
        sub.status,
        new Date(sub.subscribed_at).toLocaleDateString(),
        sub.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'unsubscribed': return 'bg-gray-100 text-gray-800';
      case 'bounced': return 'bg-red-100 text-red-800';
      case 'complained': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'import': return 'bg-orange-100 text-orange-800';
      case 'api': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSources = () => {
    return [...new Set(subscriptions.map(sub => sub.source))];
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesSource = filterSource === 'all' || sub.source === filterSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    unsubscribed: subscriptions.filter(s => s.status === 'unsubscribed').length,
    thisWeek: subscriptions.filter(s => 
      new Date(s.subscribed_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Management</h1>
          <p className="text-gray-600">Manage newsletter subscriptions and subscribers</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={<RefreshCw size={18} />} onClick={fetchSubscriptions}>
            Refresh
          </Button>
          <Button variant="outline" icon={<Download size={18} />} onClick={exportSubscriptions}>
            Export CSV
          </Button>
          <Button variant="primary" icon={<Mail size={18} />} onClick={() => setShowAddForm(true)}>
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-600 mr-4">
              <UserX size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unsubscribed}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
            <option value="complained">Complained</option>
          </select>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Sources</option>
            {getSources().map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Subscribers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{subscription.email}</div>
                      {subscription.name && (
                        <div className="text-sm text-gray-500">{subscription.name}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceColor(subscription.source)}`}>
                      {subscription.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscription.subscribed_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye size={14} />}
                        onClick={() => setSelectedSubscription(subscription)}
                      >
                        View
                      </Button>
                      {subscription.status === 'active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<UserX size={14} />}
                          onClick={() => handleStatusUpdate(subscription.id, 'unsubscribed')}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          Unsubscribe
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<UserCheck size={14} />}
                          onClick={() => handleStatusUpdate(subscription.id, 'active')}
                          className="text-green-600 hover:text-green-700"
                        >
                          Reactivate
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() => handleDeleteSubscription(subscription.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredSubscriptions.length === 0 && (
        <Card className="p-12 text-center">
          <Mail size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscribers found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' || filterSource !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Newsletter subscribers will appear here when users sign up.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && filterSource === 'all' && (
            <Button variant="primary" icon={<Mail size={18} />} onClick={() => setShowAddForm(true)}>
              Add First Subscriber
            </Button>
          )}
        </Card>
      )}

      {/* Add Subscriber Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Add New Subscriber</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddSubscriber} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newSubscriber.email}
                    onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={newSubscriber.name}
                    onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    Add Subscriber
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Subscriber Details Modal */}
      {selectedSubscription && (
        <SubscriberDetailsModal
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteSubscription}
        />
      )}
    </div>
  );
};

// Subscriber Details Modal Component
interface SubscriberDetailsModalProps {
  subscription: NewsletterSubscription;
  onClose: () => void;
  onStatusUpdate: (id: string, status: NewsletterSubscription['status']) => void;
  onDelete: (id: string) => void;
}

const SubscriberDetailsModal: React.FC<SubscriberDetailsModalProps> = ({ 
  subscription, 
  onClose, 
  onStatusUpdate, 
  onDelete 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'unsubscribed': return 'bg-gray-100 text-gray-800';
      case 'bounced': return 'bg-red-100 text-red-800';
      case 'complained': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'import': return 'bg-orange-100 text-orange-800';
      case 'api': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Subscriber Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Subscriber Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{subscription.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{subscription.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
                    {subscription.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Source</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceColor(subscription.source)}`}>
                    {subscription.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Subscription Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Timeline</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-green-600 mr-2" />
                    <span className="text-sm">
                      <strong>Subscribed:</strong> {new Date(subscription.subscribed_at).toLocaleString()}
                    </span>
                  </div>
                  {subscription.unsubscribed_at && (
                    <div className="flex items-center">
                      <Calendar size={16} className="text-red-600 mr-2" />
                      <span className="text-sm">
                        <strong>Unsubscribed:</strong> {new Date(subscription.unsubscribed_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar size={16} className="text-blue-600 mr-2" />
                    <span className="text-sm">
                      <strong>Last Updated:</strong> {new Date(subscription.updated_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Management */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Status</h3>
              <div className="flex space-x-3">
                <select
                  value={subscription.status}
                  onChange={(e) => onStatusUpdate(subscription.id, e.target.value as NewsletterSubscription['status'])}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                  <option value="bounced">Bounced</option>
                  <option value="complained">Complained</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                icon={<Send size={18} />}
                onClick={() => window.location.href = `mailto:${subscription.email}?subject=Newsletter from Acadeemia&body=Hi ${subscription.name || 'there'},%0D%0A%0D%0AThank you for subscribing to our newsletter...`}
                className="flex-1"
              >
                Send Email
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onDelete(subscription.id);
                  onClose();
                }}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterManager;