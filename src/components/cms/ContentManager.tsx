import React, { useState, useEffect } from 'react';
import { 
  Type, Plus, Edit, Trash2, Search, Filter, 
  Save, X, FileText, Image, List, Hash
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ContentItem {
  id: string;
  section_id: string;
  content_key: string;
  content_type: string;
  content_value: any;
  content_description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  section?: {
    name: string;
    page?: {
      title: string;
    };
  };
}

const ContentManager: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    fetchContentItems();
    fetchSections();
  }, []);

  const fetchContentItems = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select(`
          *,
          section:cms_sections(
            name,
            page:cms_pages(title)
          )
        `)
        .order('display_order', { ascending: true });

      if (error) throw error;
      console.log('Fetched content items:', data);
      setContentItems(data || []);
    } catch (error) {
      console.error('Error fetching content items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_sections')
        .select(`
          id, name, slug,
          page:cms_pages(title)
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content item?')) return;

    try {
      const { error } = await supabase
        .from('cms_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContentItems(contentItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting content item:', error);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('cms_content')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      setContentItems(contentItems.map(item => 
        item.id === id ? { ...item, is_active: !currentStatus } : item
      ));
    } catch (error) {
      console.error('Error updating content status:', error);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'heading': return <Type size={20} />;
      case 'paragraph': return <FileText size={20} />;
      case 'text': return <Hash size={20} />;
      case 'image': return <Image size={20} />;
      case 'list': return <List size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'heading': return 'bg-blue-100 text-blue-800';
      case 'paragraph': return 'bg-green-100 text-green-800';
      case 'text': return 'bg-purple-100 text-purple-800';
      case 'image': return 'bg-orange-100 text-orange-800';
      case 'list': return 'bg-pink-100 text-pink-800';
      case 'json': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.content_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         JSON.stringify(item.content_value).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = filterSection === 'all' || item.section_id === filterSection;
    const matchesType = filterType === 'all' || item.content_type === filterType;
    return matchesSearch && matchesSection && matchesType;
  });

  const getContentTypes = () => {
    return [...new Set(contentItems.map(item => item.content_type))];
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
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage individual content items across your website</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setEditingContent({
          id: '',
          section_id: '',
          content_key: '',
          content_type: 'text',
          content_value: '',
          content_description: '',
          display_order: 0,
          is_active: true,
          created_at: '',
          updated_at: ''
        })}>
          Add Content
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Sections</option>
            {sections.map(section => (
              <option key={section.id} value={section.id}>
                {section.page?.title} - {section.name}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Types</option>
            {getContentTypes().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Content Items */}
      <div className="grid grid-cols-1 gap-6">
        {filteredContent.map((item) => (
          <Card key={item.id} className="p-6" hoverEffect>
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-3 bg-primary-50 rounded-lg">
                  {getContentTypeIcon(item.content_type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.content_key}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContentTypeColor(item.content_type)}`}>
                      {item.content_type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">
                    Section: {item.section?.name} • Page: {item.section?.page?.title}
                  </p>
                  
                  {item.content_description && (
                    <p className="text-sm text-gray-500 mb-3">{item.content_description}</p>
                  )}
                  
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>Content:</strong> {
                        typeof item.content_value === 'string' 
                          ? item.content_value.substring(0, 100) + (item.content_value.length > 100 ? '...' : '')
                          : JSON.stringify(item.content_value).substring(0, 100) + '...'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit size={16} />}
                  onClick={() => setEditingContent(item)}
                >
                  Edit
                </Button>
                
                <Button
                  variant={item.is_active ? "outline" : "primary"}
                  size="sm"
                  onClick={() => handleToggleActive(item.id, item.is_active)}
                >
                  {item.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={() => handleDeleteContent(item.id)}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card className="p-12 text-center">
          <Type size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No content items found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterSection !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first content item.'
            }
          </p>
          {!searchTerm && filterSection === 'all' && filterType === 'all' && (
            <Button variant="primary" icon={<Plus size={18} />} onClick={() => setEditingContent({
              id: '',
              section_id: '',
              content_key: '',
              content_type: 'text',
              content_value: '',
              content_description: '',
              display_order: 0,
              is_active: true,
              created_at: '',
              updated_at: ''
            })}>
              Create Your First Content Item
            </Button>
          )}
        </Card>
      )}

      {/* Edit Content Modal */}
      {editingContent && (
        <ContentEditModal
          content={editingContent}
          sections={sections}
          onSave={async (content) => {
            try {
              if (content.id) {
                const { error } = await supabase
                  .from('cms_content')
                  .update({
                    content_key: content.content_key,
                    content_type: content.content_type,
                    content_value: content.content_value,
                    content_description: content.content_description,
                    display_order: content.display_order,
                    is_active: content.is_active,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', content.id);

                if (error) throw error;
                setContentItems(contentItems.map(item => item.id === content.id ? content : item));
              } else {
                const { data, error } = await supabase
                  .from('cms_content')
                  .insert({
                    section_id: content.section_id,
                    content_key: content.content_key,
                    content_type: content.content_type,
                    content_value: content.content_value,
                    content_description: content.content_description,
                    display_order: content.display_order,
                    is_active: content.is_active
                  })
                  .select()
                  .single();

                if (error) throw error;
                setContentItems([...contentItems, data]);
              }
              setEditingContent(null);
              fetchContentItems(); // Refresh to get updated data
            } catch (error) {
              console.error('Error saving content:', error);
            }
          }}
          onCancel={() => setEditingContent(null)}
        />
      )}
    </div>
  );
};

// Content Edit Modal Component
interface ContentEditModalProps {
  content: ContentItem;
  sections: any[];
  onSave: (content: ContentItem) => void;
  onCancel: () => void;
}

const ContentEditModal: React.FC<ContentEditModalProps> = ({ content, sections, onSave, onCancel }) => {
  const [formData, setFormData] = useState(content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleContentValueChange = (value: string) => {
    let parsedValue = value;
    
    // Try to parse as JSON for certain types
    if (formData.content_type === 'json' || formData.content_type === 'list') {
      try {
        parsedValue = JSON.parse(value);
      } catch (error) {
        // Keep as string if JSON parsing fails
      }
    }
    
    setFormData({ ...formData, content_value: parsedValue });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {content.id ? 'Edit Content Item' : 'Create New Content Item'}
            </h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Key
                </label>
                <input
                  type="text"
                  value={formData.content_key}
                  onChange={(e) => setFormData({ ...formData, content_key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., main_title, hero_subtitle"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <select
                  value={formData.section_id}
                  onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a section</option>
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.page?.title} - {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Type
                </label>
                <select
                  value={formData.content_type}
                  onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="text">Text</option>
                  <option value="heading">Heading</option>
                  <option value="paragraph">Paragraph</option>
                  <option value="image">Image</option>
                  <option value="list">List</option>
                  <option value="json">JSON</option>
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
                Description
              </label>
              <input
                type="text"
                value={formData.content_description || ''}
                onChange={(e) => setFormData({ ...formData, content_description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brief description of this content item"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Value
              </label>
              {formData.content_type === 'paragraph' || formData.content_type === 'json' || formData.content_type === 'list' ? (
                <textarea
                  value={typeof formData.content_value === 'string' ? formData.content_value : JSON.stringify(formData.content_value, null, 2)}
                  onChange={(e) => handleContentValueChange(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={formData.content_type === 'json' ? '{"key": "value"}' : 'Content value'}
                />
              ) : (
                <input
                  type="text"
                  value={typeof formData.content_value === 'string' ? formData.content_value : JSON.stringify(formData.content_value)}
                  onChange={(e) => handleContentValueChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Content value"
                />
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
                Active Content
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                {content.id ? 'Update Content' : 'Create Content'}
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

export default ContentManager;