import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Package, 
  Cloud, Server, Eye, MoreVertical, Star
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'saas' | 'standalone';
  features: string[];
  is_active: boolean;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

const AddOnsManager: React.FC = () => {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'saas' | 'standalone'>('all');
  const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchAddOns();
  }, []);

  const fetchAddOns = async () => {
    try {
      // For now, we'll use mock data since we don't have the add-ons table yet
      const mockAddOns: AddOn[] = [
        {
          id: '1',
          name: 'QR Code Attendance',
          description: 'Advanced attendance tracking using QR codes for quick and accurate recording.',
          price: 3999,
          category: 'saas',
          features: ['QR code generation', 'Mobile scanning', 'Real-time updates', 'Analytics'],
          is_active: true,
          is_popular: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Android App',
          description: 'Mobile access through dedicated Android application.',
          price: 3999,
          category: 'standalone',
          features: ['Native Android app', 'Offline sync', 'Push notifications', 'Mobile UI'],
          is_active: true,
          is_popular: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Two-Factor Authentication',
          description: 'Enhanced security with two-factor authentication for user accounts.',
          price: 2999,
          category: 'saas',
          features: ['SMS verification', 'App authentication', 'Backup codes', 'Security logs'],
          is_active: true,
          is_popular: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setAddOns(mockAddOns);
    } catch (error) {
      console.error('Error fetching add-ons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddOn = async (id: string) => {
    if (!confirm('Are you sure you want to delete this add-on?')) return;

    try {
      setAddOns(addOns.filter(addon => addon.id !== id));
    } catch (error) {
      console.error('Error deleting add-on:', error);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setAddOns(addOns.map(addon => 
        addon.id === id ? { ...addon, is_active: !currentStatus } : addon
      ));
    } catch (error) {
      console.error('Error updating add-on status:', error);
    }
  };

  const handleTogglePopular = async (id: string, currentStatus: boolean) => {
    try {
      setAddOns(addOns.map(addon => 
        addon.id === id ? { ...addon, is_popular: !currentStatus } : addon
      ));
    } catch (error) {
      console.error('Error updating add-on popularity:', error);
    }
  };

  const filteredAddOns = addOns.filter(addon => {
    const matchesSearch = addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         addon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || addon.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Add-ons Management</h1>
          <p className="text-gray-600">Manage store add-ons and their pricing</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setShowAddForm(true)}>
          Add New Add-on
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search add-ons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as 'all' | 'saas' | 'standalone')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Categories</option>
            <option value="saas">SaaS Add-ons</option>
            <option value="standalone">Standalone Add-ons</option>
          </select>
        </div>
      </Card>

      {/* Add-ons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAddOns.map((addon) => (
          <Card key={addon.id} className="p-6 relative" hoverEffect>
            {addon.is_popular && (
              <div className="absolute -top-3 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Star size={14} className="mr-1" />
                Popular
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center ${
                addon.category === 'saas' ? 'bg-primary-50 text-primary-600' : 'bg-secondary-50 text-secondary-600'
              }`}>
                {addon.category === 'saas' ? <Cloud size={20} /> : <Server size={20} />}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTogglePopular(addon.id, addon.is_popular)}
                  className={`p-1 rounded ${addon.is_popular ? 'text-yellow-500' : 'text-gray-400'}`}
                >
                  <Star size={16} />
                </button>
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">{addon.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
            
            <div className="mb-4">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                addon.category === 'saas' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'bg-secondary-50 text-secondary-700'
              }`}>
                {addon.category === 'saas' ? 'SaaS' : 'Standalone'}
              </span>
              <span className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                addon.is_active 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {addon.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Features:</h4>
              <ul className="space-y-1">
                {addon.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">KES {addon.price.toLocaleString()}</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" icon={<Eye size={14} />}>
                  View
                </Button>
                <Button variant="outline" size="sm" icon={<Edit size={14} />} onClick={() => setEditingAddOn(addon)}>
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<Trash2 size={14} />}
                  onClick={() => handleDeleteAddOn(addon.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleToggleActive(addon.id, addon.is_active)}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  addon.is_active
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {addon.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredAddOns.length === 0 && (
        <Card className="p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No add-ons found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first add-on.'
            }
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <Button variant="primary" icon={<Plus size={18} />} onClick={() => setShowAddForm(true)}>
              Create Your First Add-on
            </Button>
          )}
        </Card>
      )}

      {/* Add/Edit Form Modal would go here */}
      {(showAddForm || editingAddOn) && (
        <AddOnFormModal
          addon={editingAddOn}
          onClose={() => {
            setShowAddForm(false);
            setEditingAddOn(null);
          }}
          onSave={(addon) => {
            if (editingAddOn) {
              setAddOns(addOns.map(a => a.id === addon.id ? addon : a));
            } else {
              setAddOns([...addOns, { ...addon, id: Date.now().toString() }]);
            }
            setShowAddForm(false);
            setEditingAddOn(null);
          }}
        />
      )}
    </div>
  );
};

// Add-on Form Modal Component
interface AddOnFormModalProps {
  addon: AddOn | null;
  onClose: () => void;
  onSave: (addon: AddOn) => void;
}

const AddOnFormModal: React.FC<AddOnFormModalProps> = ({ addon, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<AddOn>>(
    addon || {
      name: '',
      description: '',
      price: 0,
      category: 'saas',
      features: [''],
      is_active: true,
      is_popular: false
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: addon?.id || Date.now().toString(),
      created_at: addon?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as AddOn);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), '']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {addon ? 'Edit Add-on' : 'Create New Add-on'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add-on Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'saas' | 'standalone' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="saas">SaaS</option>
                  <option value="standalone">Standalone</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (KES)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Features
                </label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  Add Feature
                </Button>
              </div>
              
              <div className="space-y-2">
                {(formData.features || []).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Feature description"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Popular</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                {addon ? 'Update Add-on' : 'Create Add-on'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOnsManager;