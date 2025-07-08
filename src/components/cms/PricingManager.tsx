import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Plus, Edit, Trash2, Save, X, 
  Check, AlertCircle, Package, Users
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  features: PricingFeature[];
  highlight: boolean;
  badge?: string;
  category: 'saas' | 'standalone';
}

interface PricingFeature {
  text: string;
  included: boolean;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'saas' | 'standalone';
}

const PricingManager: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null);
  const [activeTab, setActiveTab] = useState<'plans' | 'addons'>('plans');

  useEffect(() => {
    // Load initial pricing data
    loadPricingData();
  }, []);

  const loadPricingData = () => {
    // This would typically load from your database
    // For now, using mock data
    const mockPlans: PricingPlan[] = [
      {
        id: '1',
        name: 'Starter',
        description: 'Perfect for small schools',
        price: 20000,
        period: 'term',
        category: 'saas',
        highlight: false,
        features: [
          { text: '1 - 200 students', included: true },
          { text: 'Unlimited users', included: true },
          { text: 'Basic support', included: true },
          { text: 'Advanced features', included: false }
        ]
      },
      {
        id: '2',
        name: 'Professional',
        description: 'For growing institutions',
        price: 40000,
        period: 'term',
        category: 'saas',
        highlight: true,
        badge: 'Most Popular',
        features: [
          { text: '201 - 500 students', included: true },
          { text: 'Unlimited users', included: true },
          { text: 'Priority support', included: true },
          { text: 'Advanced features', included: true }
        ]
      }
    ];

    const mockAddOns: AddOn[] = [
      {
        id: '1',
        name: 'QR Code Attendance',
        description: 'Advanced attendance tracking using QR codes',
        price: 3999,
        category: 'saas'
      },
      {
        id: '2',
        name: 'Android App',
        description: 'Mobile access through dedicated Android application',
        price: 3999,
        category: 'standalone'
      }
    ];

    setPlans(mockPlans);
    setAddOns(mockAddOns);
  };

  const handleSavePlan = (plan: PricingPlan) => {
    if (editingPlan?.id) {
      setPlans(plans.map(p => p.id === plan.id ? plan : p));
    } else {
      setPlans([...plans, { ...plan, id: Date.now().toString() }]);
    }
    setEditingPlan(null);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const handleSaveAddOn = (addOn: AddOn) => {
    if (editingAddOn?.id) {
      setAddOns(addOns.map(a => a.id === addOn.id ? addOn : a));
    } else {
      setAddOns([...addOns, { ...addOn, id: Date.now().toString() }]);
    }
    setEditingAddOn(null);
  };

  const handleDeleteAddOn = (id: string) => {
    if (confirm('Are you sure you want to delete this add-on?')) {
      setAddOns(addOns.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600">Manage pricing plans and add-ons for your website</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plans'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pricing Plans
          </button>
          <button
            onClick={() => setActiveTab('addons')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'addons'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Add-ons
          </button>
        </nav>
      </div>

      {/* Pricing Plans Tab */}
      {activeTab === 'plans' && (
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
                category: 'saas',
                highlight: false,
                features: []
              })}
            >
              Add New Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`p-6 ${plan.highlight ? 'border-2 border-primary-500' : ''}`}>
                {plan.badge && (
                  <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium text-center mb-4">
                    {plan.badge}
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">KES {plan.price.toLocaleString()}</span>
                    <span className="text-gray-500 ml-2">per {plan.period}</span>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    plan.category === 'saas' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {plan.category.toUpperCase()}
                  </span>
                </div>

                <div className="mb-6">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className={`mr-2 mt-1 ${
                          feature.included ? 'text-green-500' : 'text-gray-300'
                        }`} />
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
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
      )}

      {/* Add-ons Tab */}
      {activeTab === 'addons' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              variant="primary"
              icon={<Plus size={18} />}
              onClick={() => setEditingAddOn({
                id: '',
                name: '',
                description: '',
                price: 0,
                category: 'saas'
              })}
            >
              Add New Add-on
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addOn) => (
              <Card key={addOn.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Package size={24} className="text-primary-600" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    addOn.category === 'saas' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {addOn.category.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{addOn.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{addOn.description}</p>
                
                <div className="mb-4">
                  <span className="text-xl font-bold">KES {addOn.price.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">/term</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit size={16} />}
                    onClick={() => setEditingAddOn(addOn)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    onClick={() => handleDeleteAddOn(addOn.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <PlanEditModal
          plan={editingPlan}
          onSave={handleSavePlan}
          onCancel={() => setEditingPlan(null)}
        />
      )}

      {/* Edit Add-on Modal */}
      {editingAddOn && (
        <AddOnEditModal
          addOn={editingAddOn}
          onSave={handleSaveAddOn}
          onCancel={() => setEditingAddOn(null)}
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
      features: [...formData.features, { text: '', included: true }]
    });
  };

  const updateFeature = (index: number, feature: PricingFeature) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = feature;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="month">Month</option>
                </select>
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
                placeholder="e.g., Most Popular"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="highlight"
                checked={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="highlight" className="text-sm font-medium text-gray-700">
                Highlight this plan
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
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={feature.included}
                      onChange={(e) => updateFeature(index, { ...feature, included: e.target.checked })}
                    />
                    <input
                      type="text"
                      value={feature.text}
                      onChange={(e) => updateFeature(index, { ...feature, text: e.target.value })}
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

// Add-on Edit Modal Component
interface AddOnEditModalProps {
  addOn: AddOn;
  onSave: (addOn: AddOn) => void;
  onCancel: () => void;
}

const AddOnEditModal: React.FC<AddOnEditModalProps> = ({ addOn, onSave, onCancel }) => {
  const [formData, setFormData] = useState(addOn);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {addOn.id ? 'Edit Add-on' : 'Create New Add-on'}
            </h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex space-x-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                Save Add-on
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