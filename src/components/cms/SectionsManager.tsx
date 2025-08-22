import React, { useState, useEffect } from 'react';
import { 
  Layout, Plus, Edit, Trash2, Search, Filter, 
  Eye, Save, X, FileText, Image, Type, Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Section {
  id: string;
  page_id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  section_type: string;
  section_data: any;
  created_at: string;
  updated_at: string;
  page?: {
    title: string;
    slug: string;
  };
}

const SectionsManager: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPage, setFilterPage] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  useEffect(() => {
    fetchSections();
    fetchPages();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_sections')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      console.log('Fetched sections:', data);
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('id, title, slug')
        .eq('is_published', true)
        .order('title', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      const { error } = await supabase
        .from('cms_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSections(sections.filter(section => section.id !== id));
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('cms_sections')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      setSections(sections.map(section => 
        section.id === id ? { ...section, is_active: !currentStatus } : section
      ));
    } catch (error) {
      console.error('Error updating section status:', error);
    }
  };

  const getSectionTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'bg-blue-100 text-blue-800';
      case 'features': return 'bg-green-100 text-green-800';
      case 'pricing': return 'bg-purple-100 text-purple-800';
      case 'testimonials': return 'bg-orange-100 text-orange-800';
      case 'cta': return 'bg-red-100 text-red-800';
      case 'content': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPage = filterPage === 'all' || section.page_id === filterPage;
    const matchesType = filterType === 'all' || section.section_type === filterType;
    return matchesSearch && matchesPage && matchesType;
  });

  const getSectionTypes = () => {
    return [...new Set(sections.map(section => section.section_type))];
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
          <h1 className="text-2xl font-bold text-gray-900">Sections Management</h1>
          <p className="text-gray-600">Manage page sections and their content</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setEditingSection({
          id: '',
          page_id: '',
          name: '',
          slug: '',
          display_order: 0,
          is_active: true,
          section_type: 'content',
          section_data: {},
          created_at: '',
          updated_at: ''
        })}>
          Add Section
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={filterPage}
            onChange={(e) => setFilterPage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Pages</option>
            {pages.map(page => (
              <option key={page.id} value={page.id}>{page.title}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Types</option>
            {getSectionTypes().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Sections List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSections.map((section) => (
          <Card key={section.id} className="p-6" hoverEffect>
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Layout size={24} className="text-primary-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSectionTypeColor(section.section_type)}`}>
                      {section.section_type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      section.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {section.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">
                    Page: {section.page?.title} • Slug: {section.slug} • Order: {section.display_order}
                  </p>
                  
                  {section.section_data && Object.keys(section.section_data).length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">
                        <strong>Data:</strong> {JSON.stringify(section.section_data, null, 2).substring(0, 100)}...
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Updated {new Date(section.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit size={16} />}
                  onClick={() => setEditingSection(section)}
                >
                  Edit
                </Button>
                
                <Button
                  variant={section.is_active ? "outline" : "primary"}
                  size="sm"
                  onClick={() => handleToggleActive(section.id, section.is_active)}
                >
                  {section.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={() => handleDeleteSection(section.id)}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <Card className="p-12 text-center">
          <Layout size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sections found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterPage !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first section.'
            }
          </p>
          {!searchTerm && filterPage === 'all' && filterType === 'all' && (
            <Button variant="primary" icon={<Plus size={18} />} onClick={() => setEditingSection({
              id: '',
              page_id: '',
              name: '',
              slug: '',
              display_order: 0,
              is_active: true,
              section_type: 'content',
              section_data: {},
              created_at: '',
              updated_at: ''
            })}>
              Create Your First Section
            </Button>
          )}
        </Card>
      )}

      {/* Edit Section Modal */}
      {editingSection && (
        <SectionEditModal
          section={editingSection}
          pages={pages}
          onSave={async (section) => {
            try {
              if (section.id) {
                const { error } = await supabase
                  .from('cms_sections')
                  .update({
                    name: section.name,
                    slug: section.slug,
                    display_order: section.display_order,
                    section_type: section.section_type,
                    section_data: section.section_data,
                    is_active: section.is_active,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', section.id);

                if (error) throw error;
                setSections(sections.map(s => s.id === section.id ? section : s));
              } else {
                const { data, error } = await supabase
                  .from('cms_sections')
                  .insert({
                    page_id: section.page_id,
                    name: section.name,
                    slug: section.slug,
                    display_order: section.display_order,
                    section_type: section.section_type,
                    section_data: section.section_data,
                    is_active: section.is_active
                  })
                  .select()
                  .single();

                if (error) throw error;
                setSections([...sections, data]);
              }
              setEditingSection(null);
              fetchSections(); // Refresh to get updated data
            } catch (error) {
              console.error('Error saving section:', error);
            }
          }}
          onCancel={() => setEditingSection(null)}
        />
      )}
    </div>
  );
};

// Section Edit Modal Component
interface SectionEditModalProps {
  section: Section;
  pages: any[];
  onSave: (section: Section) => void;
  onCancel: () => void;
}

const SectionEditModal: React.FC<SectionEditModalProps> = ({ section, pages, onSave, onCancel }) => {
  const [formData, setFormData] = useState(section);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateSectionData = (key: string, value: any) => {
    setFormData({
      ...formData,
      section_data: {
        ...formData.section_data,
        [key]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {section.id ? 'Edit Section' : 'Create New Section'}
            </h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Name
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
                  Page
                </label>
                <select
                  value={formData.page_id}
                  onChange={(e) => setFormData({ ...formData, page_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a page</option>
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>{page.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Type
                </label>
                <select
                  value={formData.section_type}
                  onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="content">Content</option>
                  <option value="hero">Hero</option>
                  <option value="features">Features</option>
                  <option value="pricing">Pricing</option>
                  <option value="testimonials">Testimonials</option>
                  <option value="cta">Call to Action</option>
                </select>
              </div>
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

            {/* Section Data Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Section Data
              </label>
              
              {formData.section_type === 'hero' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.section_data?.title || ''}
                      onChange={(e) => updateSectionData('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Hero section title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Subtitle</label>
                    <textarea
                      value={formData.section_data?.subtitle || ''}
                      onChange={(e) => updateSectionData('subtitle', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Hero section subtitle"
                    />
                  </div>
                </div>
              )}

              {(formData.section_type === 'features' || formData.section_type === 'pricing') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={formData.section_data?.title || ''}
                      onChange={(e) => updateSectionData('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Section title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Section Subtitle</label>
                    <textarea
                      value={formData.section_data?.subtitle || ''}
                      onChange={(e) => updateSectionData('subtitle', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Section subtitle"
                    />
                  </div>
                </div>
              )}

              {formData.section_type === 'content' && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Raw JSON Data</label>
                  <textarea
                    value={JSON.stringify(formData.section_data, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setFormData({ ...formData, section_data: parsed });
                      } catch (error) {
                        // Invalid JSON, don't update
                      }
                    }}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                    placeholder='{"key": "value"}'
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active Section
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                {section.id ? 'Update Section' : 'Create Section'}
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

export default SectionsManager;