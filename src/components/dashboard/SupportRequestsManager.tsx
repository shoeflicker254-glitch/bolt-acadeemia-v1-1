import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, User, Mail, Tag, Clock, Eye, 
  Reply, Trash2, CheckCircle, AlertCircle, X,
  Grid, List, Filter, Search, Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface SupportRequest {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  support_type: string;
  message: string;
  ticket_number: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
}

const SupportRequestsManager: React.FC = () => {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const fetchSupportRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('email_support_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSupportRequests(data || []);
    } catch (error) {
      console.error('Error fetching support requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: SupportRequest['status']) => {
    try {
      const { error } = await supabase
        .from('email_support_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setSupportRequests(supportRequests.map(request => 
        request.id === id ? { ...request, status: newStatus } : request
      ));
    } catch (error) {
      console.error('Error updating support request status:', error);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this support request?')) return;

    try {
      const { error } = await supabase
        .from('email_support_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSupportRequests(supportRequests.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error deleting support request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-teal-100 text-teal-800',
    ];
    const index = Math.abs(type.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
    return colors[index];
  };

  const getSupportTypes = () => {
    return [...new Set(supportRequests.map(request => request.support_type))];
  };

  const filteredRequests = supportRequests.filter(request => {
    const matchesSearch = request.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.ticket_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesType = filterType === 'all' || request.support_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const groupedByStatus = {
    pending: filteredRequests.filter(r => r.status === 'pending'),
    in_progress: filteredRequests.filter(r => r.status === 'in_progress'),
    resolved: filteredRequests.filter(r => r.status === 'resolved'),
    closed: filteredRequests.filter(r => r.status === 'closed'),
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
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600 mr-4">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{groupedByStatus.pending.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{groupedByStatus.in_progress.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{groupedByStatus.resolved.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50 text-gray-600 mr-4">
              <HelpCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{supportRequests.length}</p>
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
                placeholder="Search support requests..."
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
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              {getSupportTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
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

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(groupedByStatus).map(([status, requests]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {status.replace('_', ' ')}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                  {requests.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {requests.map((request) => (
                  <Card key={request.id} className="p-4 cursor-pointer" hoverEffect onClick={() => setSelectedRequest(request)}>
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(request.support_type)}`}>
                        {request.support_type}
                      </span>
                      <div className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{request.subject}</h4>
                    <p className="text-sm text-gray-600 mb-3">{request.sender_name}</p>
                    <p className="text-xs text-gray-500 font-mono">{request.ticket_number}</p>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                          }}
                          className="flex-1"
                        >
                          View
                        </Button>
                        {status !== 'resolved' && status !== 'closed' && (
                          <select
                            value={request.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(request.id, e.target.value as SupportRequest['status']);
                            }}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                        <div className="text-sm font-medium text-gray-900">{request.ticket_number}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{request.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.sender_name}</div>
                        <div className="text-sm text-gray-500">{request.sender_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.support_type)}`}>
                        {request.support_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
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
                        <select
                          value={request.status}
                          onChange={(e) => handleStatusUpdate(request.id, e.target.value as SupportRequest['status'])}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filteredRequests.length === 0 && (
        <Card className="p-12 text-center">
          <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No support requests found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Support requests will appear here when customers submit tickets.'
            }
          </p>
        </Card>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <SupportRequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteRequest}
        />
      )}
    </div>
  );
};

// Support Request Details Modal Component
interface SupportRequestDetailsModalProps {
  request: SupportRequest;
  onClose: () => void;
  onStatusUpdate: (id: string, status: SupportRequest['status']) => void;
  onDelete: (id: string) => void;
}

const SupportRequestDetailsModal: React.FC<SupportRequestDetailsModalProps> = ({ 
  request, 
  onClose, 
  onStatusUpdate, 
  onDelete 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-teal-100 text-teal-800',
    ];
    const index = Math.abs(type.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
    return colors[index];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Support Request Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Ticket Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ticket Number</label>
                  <p className="text-gray-900 font-mono">{request.ticket_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Support Type</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.support_type)}`}>
                    {request.support_type}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted</label>
                  <p className="text-gray-900">{new Date(request.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{request.sender_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{request.sender_email}</p>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject</h3>
              <p className="text-gray-900">{request.subject}</p>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{request.message}</p>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <select
                value={request.status}
                onChange={(e) => onStatusUpdate(request.id, e.target.value as SupportRequest['status'])}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                icon={<Reply size={18} />}
                onClick={() => window.location.href = `mailto:${request.sender_email}?subject=Re: ${request.subject} [${request.ticket_number}]&body=Hi ${request.sender_name},%0D%0A%0D%0AThank you for contacting Acadeemia support...`}
                className="flex-1"
              >
                Reply via Email
              </Button>
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

export default SupportRequestsManager;