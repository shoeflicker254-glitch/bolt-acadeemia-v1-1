import React, { useState, useEffect } from 'react';
import { 
  Calendar, User, Mail, Phone, Building, Eye, 
  MessageSquare, CheckCircle, Clock, X, ExternalLink,
  Grid, List, Filter, Search, Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface DemoRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  institution: string;
  role: string;
  version: string;
  message?: string;
  calendly_url?: string;
  created_at: string;
}

const DemoRequestsManager: React.FC = () => {
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVersion, setFilterVersion] = useState<'all' | 'SaaS' | 'Standalone' | 'Both'>('all');
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);

  useEffect(() => {
    fetchDemoRequests();
  }, []);

  const fetchDemoRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDemoRequests(data || []);
    } catch (error) {
      console.error('Error fetching demo requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this demo request?')) return;

    try {
      const { error } = await supabase
        .from('demo_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDemoRequests(demoRequests.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error deleting demo request:', error);
    }
  };

  const filteredRequests = demoRequests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterVersion === 'all' || request.version === filterVersion;
    return matchesSearch && matchesFilter;
  });

  const getVersionColor = (version: string) => {
    switch (version) {
      case 'SaaS': return 'bg-blue-100 text-blue-800';
      case 'Standalone': return 'bg-green-100 text-green-800';
      case 'Both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{demoRequests.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
              <Building size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">SaaS Interest</p>
              <p className="text-2xl font-bold text-gray-900">
                {demoRequests.filter(r => r.version === 'SaaS' || r.version === 'Both').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4">
              <Building size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Standalone Interest</p>
              <p className="text-2xl font-bold text-gray-900">
                {demoRequests.filter(r => r.version === 'Standalone' || r.version === 'Both').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-600 mr-4">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {demoRequests.filter(r => 
                  new Date(r.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and View Controls */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search demo requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={filterVersion}
              onChange={(e) => setFilterVersion(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Versions</option>
              <option value="SaaS">SaaS Only</option>
              <option value="Standalone">Standalone Only</option>
              <option value="Both">Both Versions</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="sm"
              icon={<List size={16} />}
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'primary' : 'outline'}
              size="sm"
              icon={<Grid size={16} />}
              onClick={() => setViewMode('kanban')}
            >
              Kanban
            </Button>
          </div>
        </div>
      </Card>

      {/* Table View */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.name}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                        {request.phone && (
                          <div className="text-sm text-gray-500">{request.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.institution}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVersionColor(request.version)}`}>
                        {request.version}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Eye size={14} />}
                          onClick={() => setSelectedRequest(request)}
                        >
                          View
                        </Button>
                        {request.calendly_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<ExternalLink size={14} />}
                            onClick={() => window.open(request.calendly_url, '_blank')}
                          >
                            Schedule
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="p-6" hoverEffect>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-50 rounded-lg mr-3">
                    <Calendar size={20} className="text-primary-600" />
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVersionColor(request.version)}`}>
                    {request.version}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(request.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{request.institution}</p>
              <p className="text-sm text-gray-500 mb-4">{request.role}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-2" />
                  {request.email}
                </div>
                {request.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="mr-2" />
                    {request.phone}
                  </div>
                )}
              </div>
              
              {request.message && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 line-clamp-3">{request.message}</p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Eye size={14} />}
                  onClick={() => setSelectedRequest(request)}
                  className="flex-1"
                >
                  View Details
                </Button>
                {request.calendly_url && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ExternalLink size={14} />}
                    onClick={() => window.open(request.calendly_url, '_blank')}
                  >
                    Schedule
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredRequests.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No demo requests found</h3>
          <p className="text-gray-600">
            {searchTerm || filterVersion !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Demo requests will appear here when customers submit the form.'
            }
          </p>
        </Card>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onDelete={handleDeleteRequest}
        />
      )}
    </div>
  );
};

// Request Details Modal Component
interface RequestDetailsModalProps {
  request: DemoRequest;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ request, onClose, onDelete }) => {
  const getVersionColor = (version: string) => {
    switch (version) {
      case 'SaaS': return 'bg-blue-100 text-blue-800';
      case 'Standalone': return 'bg-green-100 text-green-800';
      case 'Both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Demo Request Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{request.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{request.email}</p>
                  </div>
                  {request.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{request.phone}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Institution</label>
                    <p className="text-gray-900">{request.institution}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="text-gray-900">{request.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Version Interest</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVersionColor(request.version)}`}>
                      {request.version}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {request.message && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{request.message}</p>
                </div>
              </div>
            )}

            {/* Submission Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Submitted:</span>
                    <p className="text-gray-900">{new Date(request.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Request ID:</span>
                    <p className="text-gray-900 font-mono">{request.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                icon={<Mail size={18} />}
                onClick={() => window.location.href = `mailto:${request.email}?subject=Demo Request Follow-up&body=Hi ${request.name},%0D%0A%0D%0AThank you for your interest in Acadeemia...`}
                className="flex-1"
              >
                Send Email
              </Button>
              {request.calendly_url && (
                <Button
                  variant="secondary"
                  icon={<ExternalLink size={18} />}
                  onClick={() => window.open(request.calendly_url, '_blank')}
                  className="flex-1"
                >
                  Schedule Meeting
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  onDelete(request.id);
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

export default DemoRequestsManager;