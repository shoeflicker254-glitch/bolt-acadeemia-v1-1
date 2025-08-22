import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Plus, Edit, Trash2, Save, X, 
  Check, AlertCircle, Package, Users, RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useCurrency } from '../../contexts/CurrencyContext';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  highlight: boolean;
  badge?: string;
  plan_type: 'saas' | 'standalone';
  is_highlighted: boolean;
  display_order: number;
  is_active: boolean;
}

const PricingManager: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'saas' | 'standalone'>('saas');

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      console.log('Fetched pricing plans:', data);
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = (plan: PricingPlan) => {
    const savePlan = async () => {
      try {
        if (plan.id) {
          const { error } = await supabase
            .from('cms_pricing_plans')
            .update({
              plan_name: plan.name,
              plan_description: plan.description,
              plan_type: plan.category,
              price_amount: plan.price,
              price_period: plan.period,
              features: plan.features,
              is_highlighted: plan.highlight,
              badge_text: plan.badge,
              display_order: plan.display_order,
              is_active: plan.is_active,
              updated_at: new Date().toISOString()
            })
            .eq('id', plan.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cms_pricing_plans')
            .insert({
              plan_name: plan.name,
              plan_description: plan.description,
              plan_type: plan.category,
              price_amount: plan.price,
              price_period: plan.period,
              features: plan.features,
              is_highlighted: plan.highlight,
              badge_text: plan.badge,
              display_order: plan.display_order,
              is_active: plan.is_active
            });

          if (error) throw error;
        }
        
        fetchPricingPlans(); // Refresh data
      } catch (error) {
        console.error('Error saving plan:', error);
      }
    }
    
    savePlan();
    setEditingPlan(null);
  };

  const handleDeletePlan = (id: string) => {
    const deletePlan = async () => {
      try {
        const { error } = await supabase
          .from('cms_pricing_plans')
          .update({ is_active: false })
          .eq('id', id);

        if (error) throw error;
        fetchPricingPlans(); // Refresh data
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
    
    if (confirm('Are you sure you want to delete this plan?')) {
      deletePlan();
    }
  };

  const filteredPlans = plans.filter(plan => plan.plan_type === activeTab);

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
          <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600">Manage pricing plans and add-ons for your website</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={<RefreshCw size={18} />} onClick={fetchPricingPlans}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('saas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'saas'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            SaaS Plans
          </button>
          <button
            onClick={() => setActiveTab('standalone')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'standalone'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Standalone Plans
          </button>
        </nav>
      </div>

      {/* Pricing Plans */}
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => setEditingPlan({
              id: '',
              name: '',
              description: '',
              price: 0,
              period: 'term',
              plan_type: activeTab,
              highlight: false,
              features: [],
              badge: '',
              is_highlighted: false,
              display_order: 0,
              is_active: true
            })}
          >
            Add New Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className={`p-6 ${plan.is_highlighted ? 'border-2 border-primary-500' : ''}`}>
              {plan.badge && (
                <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium text-center mb-4">
                  {plan.badge}
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{formatPrice(plan.price_amount)}</span>
                  <span className="text-gray-500 ml-2">per {plan.period}</span>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  plan.plan_type === 'saas' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {plan.plan_type.toUpperCase()}
                </span>
              </div>

              <div className="mb-6">
                <ul className="space-y-2">
                  {(plan.features || []).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={16} className="mr-2 mt-1 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit size={16} />}
                  onClick={() => setEditingPlan(plan)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <PlanEditModal
          plan={editingPlan}
          onSave={handleSavePlan}
          onCancel={() => setEditingPlan(null)}
        />
      )}
    </div>
  );
};

// Plan Edit Modal Component
interface PlanEditModalProps {
  plan: PricingPlan;
  onSave: (plan: PricingPlan) => void;
  onCancel: () => void;
}

const PlanEditModal: React.FC<PlanEditModalProps> = ({ plan, onSave, onCancel }) => {
  const [formData, setFormData] = useState(plan);

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
              {plan.id ? 'Edit Plan' : 'Create New Plan'}
            </h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name
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
                  value={formData.plan_type}
                  onChange={(e) => setFormData({ ...formData, plan_type: e.target.value as 'saas' | 'standalone' })}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="term">Term</option>
                  <option value="year">Year</option>
                  <option value="yearly">Yearly</option>
                  <option value="month">Month</option>
                </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge (optional)
              </label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g., Most Popular, Recommended"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.highlight}
                  onChange={(e) => setFormData({ ...formData, highlight: e.target.checked, is_highlighted: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Highlight this plan</span>
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

            <div className="flex space-x-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                Save Plan
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

export default PricingManager;