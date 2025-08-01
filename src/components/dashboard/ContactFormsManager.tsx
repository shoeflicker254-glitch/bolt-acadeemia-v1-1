import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, User, Mail, Calendar, Eye, 
  Reply, Trash2, CheckCircle, Clock, X,
  Grid, List, Filter, Search, Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ContactForm {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const ContactFormsManager: React.FC = () => {
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [selectedForm, setSelectedForm] = useState<ContactForm | null>(null);

  useEffect(() => {
    fetchContactForms();
  }, []);

  const fetchContactForms = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactForms(data || []);
    } catch (error) {
      console.error('Error fetching contact forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact form?')) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContactForms(contactForms.filter(form => form.id !== id));
    } catch (error) {
      console.error('Error deleting contact form:', error);
    }
  };

  const getSubjectCategories = () => {
    const subjects = contactForms.map(form => form.subject);
    return [...new Set(subjects)];
  };

  const filteredForms = contactForms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSubject === 'all' || form.subject === filterSubject;
    return matchesSearch && matchesFilter;
  });

  const getSubjectColor = (subject: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
    ];
    const index = Math.abs(subject.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
    return colors[index];
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
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{contactForms.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
              <User size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Contacts</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(contactForms.map(f => f.email)).size}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {contactForms.filter(f => 
                  new Date(f.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-600 mr-4">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{getSubjectCategories().length}</p>
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
                placeholder="Search contact forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Subjects</option>
              {getSubjectCategories().map(subject => (
                <option key={subject} value={subject}>{subject}</option>
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
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message Preview
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
                {filteredForms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{form.name}</div>
                        <div className="text-sm text-gray-500">{form.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSubjectColor(form.subject)}`}>
                        {form.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {form.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(form.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Eye size={14} />}
                          onClick={() => setSelectedForm(form)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Reply size={14} />}
                          onClick={() => window.location.href = `mailto:${form.email}?subject=Re: ${form.subject}&body=Hi ${form.name},%0D%0A%0D%0AThank you for contacting Acadeemia...`}
                        >
                          Reply
                        </Button>
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
          {filteredForms.map((form) => (
            <Card key={form.id} className="p-6" hoverEffect>
              <div className="flex items-start justify-between mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSubjectColor(form.subject)}`}>
                  {form.subject}
                </span>
                <div className="text-xs text-gray-500">
                  {new Date(form.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{form.email}</p>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-700 line-clamp-4">{form.message}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Eye size={14} />}
                  onClick={() => setSelectedForm(form)}
                  className="flex-1"
                >
                  View
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Reply size={14} />}
                  onClick={() => window.location.href = `mailto:${form.email}?subject=Re: ${form.subject}&body=Hi ${form.name},%0D%0A%0D%0AThank you for contacting Acadeemia...`}
                >
                  Reply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredForms.length === 0 && (
        <Card className="p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No contact forms found</h3>
          <p className="text-gray-600">
            {searchTerm || filterSubject !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Contact form submissions will appear here.'
            }
          </p>
        </Card>
      )}

      {/* Form Details Modal */}
      {selectedForm && (
        <ContactFormDetailsModal
          form={selectedForm}
          onClose={() => setSelectedForm(null)}
          onDelete={handleDeleteForm}
        />
      )}
    </div>
  );
};

// Contact Form Details Modal Component
interface ContactFormDetailsModalProps {
  form: ContactForm;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ContactFormDetailsModal: React.FC<ContactFormDetailsModalProps> = ({ form, onClose, onDelete }) => {
  const getSubjectColor = (subject: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
    ];
    const index = Math.abs(subject.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
    return colors[index];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Contact Form Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{form.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{form.email}</p>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject</h3>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getSubjectColor(form.subject)}`}>
                {form.subject}
              </span>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{form.message}</p>
              </div>
            </div>

            {/* Submission Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Submitted:</span>
                    <p className="text-gray-900">{new Date(form.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Form ID:</span>
                    <p className="text-gray-900 font-mono">{form.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                icon={<Reply size={18} />}
                onClick={() => window.location.href = `mailto:${form.email}?subject=Re: ${form.subject}&body=Hi ${form.name},%0D%0A%0D%0AThank you for contacting Acadeemia...`}
                className="flex-1"
              >
                Reply via Email
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onDelete(form.id);
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

export default ContactFormsManager;