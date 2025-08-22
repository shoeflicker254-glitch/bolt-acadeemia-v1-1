import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Search, Filter, Cloud, Server, Eye, Star, RefreshCw, FolderSync as Sync } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useCurrency } from '../../contexts/CurrencyContext';

interface CMSAddOn {
  id: string;
  store_addon_id?: string;
  addon_name: string;
  addon_description: string;
  addon_category: 'saas' | 'standalone';
  price_amount: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface StoreAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'saas' | 'standalone';
  features: string[];
  is_active: boolean;
  is_popular: boolean;
}

const AddOnsManager: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [cmsAddOns, setCmsAddOns] = useState<CMSAddOn[]>([]);
  const [storeAddOns, setStoreAddOns] = useState<StoreAddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'saas' | 'standalone'>('all');
  const [editingAddOn, setEditingAddOn] = useState<CMSAddOn | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchCMSAddOns();
    fetchStoreAddOns();
  }, []);

  const fetchCMSAddOns = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_addons')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      console.log('Fetched CMS add-ons:', data);
      setCmsAddOns(data || []);
    } catch (error) {
      console.error('Error fetching CMS add-ons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreAddOns = async () => {
    try {
      const { data, error } = await supabase
        .from('store_addons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched store add-ons:', data);
      setStoreAddOns(data || []);
    } catch (error) {
      console.error('Error fetching store add-ons:', error);
    }
  };

  const handleSyncWithStore = async () => {
    setSyncing(true);
    try {
      // Get all store add-ons
      const { data: storeData, error: storeError } = await supabase
        .from('store_addons')
        .select('*')
        .eq('is_active', true);

      if (storeError) throw storeError;

      // Sync each store add-on to CMS
      for (const storeAddOn of storeData || []) {
        const { error } = await supabase
          .from('cms_addons')
          .upsert({
            store_addon_id: storeAddOn.id,
            addon_name: storeAddOn.name,
            addon_description: storeAddOn.description,
            addon_category: storeAddOn.category,
            price_amount: storeAddOn.price,
            features: storeAddOn.features || [],
            is_popular: storeAddOn.is_popular || false,
            is_active: true,
            display_order: 0
          }, {
            onConflict: 'store_addon_id'
          });

        if (error) {
          console.error('Error syncing add-on:', storeAddOn.name, error);
        }
      }

      await fetchCMSAddOns();
    } catch (error) {
      console.error('Error syncing with store:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteAddOn = async (id: string) => {
    if (!confirm('Are you sure you want to delete this add-on?')) return;

    try {
      const { error } = await supabase
        .from('cms_addons')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      setCmsAddOns(cmsAddOns.filter(addon => addon.id !== id));
    } catch (error) {
      console.error('Error deleting add-on:', error);
    }
  };

  const handleTogglePopular = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('cms_addons')
        .update({ 
          is_popular: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      setCmsAddOns(cmsAddOns.map(addon => 
        addon.id === id ? { ...addon, is_popular: !currentStatus } : addon
      ));
    } catch (error) {
      console.error('Error updating add-on popularity:', error);
    }
  };

  const filteredAddOns = cmsAddOns.filter(addon => {
    const matchesSearch = addon.addon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         addon.addon_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || addon.addon_category === filterCategory;
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
          <p className="text-gray-600">Manage website add-ons synced from store</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            icon={<Sync size={18} />} 
            onClick={handleSyncWithStore}
            disabled={syncing}
          >
            {syncing ? 'Syncing...' : 'Sync with Store'}
          </Button>
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setEditingAddOn({
            id: '',
            addon_name: '',
            addon_description: '',
            addon_category: 'saas',
            price_amount: 0,
            features: [],
            is_popular: false,
            is_active: true,
            display_order: 0,
            created_at: '',
            updated_at: ''
          })}>
            Add Custom Add-on
          </Button>
        </div>
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
                addon.addon_category === 'saas' ? 'bg-primary-50 text-primary-600' : 'bg-secondary-50 text-secondary-600'
              }`}>
                {addon.addon_category === 'saas' ? <Cloud size={20} /> : <Server size={20} />}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTogglePopular(addon.id, addon.is_popular)}
                  className={`p-1 rounded ${addon.is_popular ? 'text-yellow-500' : 'text-gray-400'}`}
                >
                  <Star size={16} />
                </button>
                {addon.store_addon_id && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Synced
                  </span>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">{addon.addon_name}</h3>
            <p className="text-gray-600 text-sm mb-4">{addon.addon_description}</p>
            
            <div className="mb-4">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                addon.addon_category === 'saas' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'bg-secondary-50 text-secondary-700'
              }`}>
                {addon.addon_category === 'saas' ? 'SaaS' : 'Standalone'}
              </span>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Features:</h4>
              <ul className="space-y-1">
                {(addon.features || []).slice(0, 3).map((feature, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
                {(addon.features || []).length > 3 && (
                  <li className="text-xs text-gray-500">
                    +{(addon.features || []).length - 3} more features
                  </li>
                )}
              </ul>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg">{formatPrice(addon.price_amount)}</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" icon={<Eye size={14} />}>
                  View
                </Button>
                <Button variant="outline" size="sm" icon={<Edit size={14} />} onClick={() => setEditingAddOn(addon)}>
                  Edit
                </Button>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => handleDeleteAddOn(addon.id)}
              className="text-red-600 hover:text-red-700"
            >
              Remove from CMS
            </Button>
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
              : 'Sync with store to import add-ons or create custom ones.'
            }
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="primary" icon={<Sync size={18} />} onClick={handleSyncWithStore}>
              Sync with Store
            </Button>
            <Button variant="outline" icon={<Plus size={18} />} onClick={() => setEditingAddOn({
              id: '',
              addon_name: '',
              addon_description: '',
              addon_category: 'saas',
              price_amount: 0,
              features: [],
              is_popular: false,
              is_active: true,
              display_order: 0,
              created_at: '',
              updated_at: ''
            })}>
              Create Custom Add-on
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Add-on Modal */}
      {editingAddOn && (
        <AddOnEditModal
          addon={editingAddOn}
          onSave={async (addon) => {
            try {
              if (addon.id) {
                const { error } = await supabase
                  .from('cms_addons')
                  .update({
                    addon_name: addon.addon_name,
                    addon_description: addon.addon_description,
                    addon_category: addon.addon_category,
                    price_amount: addon.price_amount,
                    features: addon.features,
                    is_popular: addon.is_popular,
                    display_order: addon.display_order,
                    is_active: addon.is_active,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', addon.id);

                if (error) throw error;
                setCmsAddOns(cmsAddOns.map(a => a.id === addon.id ? addon : a));
              } else {
                const { data, error } = await supabase
                  .from('cms_addons')
                  .insert({
                    addon_name: addon.addon_name,
                    addon_description: addon.addon_description,
                    addon_category: addon.addon_category,
                    price_amount: addon.price_amount,
                    features: addon.features,
                    is_popular: addon.is_popular,
                    display_order: addon.display_order,
                    is_active: addon.is_active
                  })
                  .select()
                  .single();

                if (error) throw error;
                setCmsAddOns([...cmsAddOns, data]);
              }
              setEditingAddOn(null);
              fetchCMSAddOns(); // Refresh data
            } catch (error) {
              console.error('Error saving add-on:', error);
            }
          }}
          onCancel={() => setEditingAddOn(null)}
        />
      )}
    </div>
  );
};

// Add-on Edit Modal Component
interface AddOnEditModalProps {
  addon: CMSAddOn;
  onSave: (addon: CMSAddOn) => void;
  onCancel: () => void;
}

const AddOnEditModal: React.FC<AddOnEditModalProps> = ({ addon, onSave, onCancel }) => {
  const [formData, setFormData] = useState(addon);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
              {addon.id ? 'Edit Add-on' : 'Create New Add-on'}
            </h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
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
                  value={formData.addon_name}
                  onChange={(e) => setFormData({ ...formData, addon_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.addon_category}
                  onChange={(e) => setFormData({ ...formData, addon_category: e.target.value as 'saas' | 'standalone' })}
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
                value={formData.addon_description}
                onChange={(e) => setFormData({ ...formData, addon_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (KES)
                </label>
                <input
                  type="number"
                  value={formData.price_amount}
                  onChange={(e) => setFormData({ ...formData, price_amount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
              </div>
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
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Popular</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                {addon.id ? 'Update Add-on' : 'Create Add-on'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
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