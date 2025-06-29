import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Edit, Trash2, Save, Eye, Upload, Image, 
  Type, List, Hash, Calendar, Search, Filter, ChevronDown,
  ChevronRight, Globe, Settings, History, Copy
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface CMSPage {
  id: string;
  slug: string;
  title: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface CMSSection {
  id: string;
  page_id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  section_type: string;
}

interface CMSContent {
  id: string;
  section_id: string;
  content_key: string;
  content_type: 'text' | 'heading' | 'paragraph' | 'image' | 'list' | 'json';
  content_value: any;
  display_order: number;
  is_active: boolean;
}

interface CMSMedia {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  caption?: string;
  is_active: boolean;
  created_at: string;
}

const CMSManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pages' | 'media' | 'settings'>('pages');
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [content, setContent] = useState<CMSContent[]>([]);
  const [media, setMedia] = useState<CMSMedia[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPageModal, setShowPageModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchPages();
    fetchMedia();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchSections(selectedPage);
    }
  }, [selectedPage]);

  useEffect(() => {
    if (selectedSection) {
      fetchContent(selectedSection);
    }
  }, [selectedSection]);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .order('title');

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const fetchSections = async (pageId: string) => {
    try {
      const { data, error } = await supabase
        .from('cms_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('display_order');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchContent = async (sectionId: string) => {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .eq('section_id', sectionId)
        .order('display_order');

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_media')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSavePage = async (pageData: Partial<CMSPage>) => {
    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('cms_pages')
          .update(pageData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cms_pages')
          .insert(pageData);
        if (error) throw error;
      }
      
      fetchPages();
      setShowPageModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleSaveSection = async (sectionData: Partial<CMSSection>) => {
    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('cms_sections')
          .update(sectionData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cms_sections')
          .insert({ ...sectionData, page_id: selectedPage });
        if (error) throw error;
      }
      
      if (selectedPage) fetchSections(selectedPage);
      setShowSectionModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleSaveContent = async (contentData: Partial<CMSContent>) => {
    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('cms_content')
          .update(contentData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cms_content')
          .insert({ ...contentData, section_id: selectedSection });
        if (error) throw error;
      }
      
      if (selectedSection) fetchContent(selectedSection);
      setShowContentModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleDeleteItem = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh appropriate data
      if (table === 'cms_pages') fetchPages();
      else if (table === 'cms_sections' && selectedPage) fetchSections(selectedPage);
      else if (table === 'cms_content' && selectedSection) fetchContent(selectedSection);
      else if (table === 'cms_media') fetchMedia();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `cms/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cms-media')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('cms_media')
        .insert({
          filename: fileName,
          original_filename: file.name,
          file_path: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
        });

      if (dbError) throw dbError;

      fetchMedia();
    } catch (error) {
      console.error('Error uploading file:', error);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">CMS Manager</h1>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'pages' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('pages')}
            icon={<FileText size={18} />}
          >
            Pages
          </Button>
          <Button
            variant={activeTab === 'media' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('media')}
            icon={<Image size={18} />}
          >
            Media
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('settings')}
            icon={<Settings size={18} />}
          >
            Settings
          </Button>
        </div>
      </div>

      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pages List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Pages</h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setEditingItem(null);
                  setShowPageModal(true);
                }}
                icon={<Plus size={16} />}
              >
                Add Page
              </Button>
            </div>
            
            <div className="space-y-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPage === page.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPage(page.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{page.title}</h4>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {page.is_published && (
                        <Globe size={16} className="text-green-500" />
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(page);
                          setShowPageModal(true);
                        }}
                        icon={<Edit size={14} />}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Sections List */}
          {selectedPage && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Sections</h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEditingItem(null);
                    setShowSectionModal(true);
                  }}
                  icon={<Plus size={16} />}
                >
                  Add Section
                </Button>
              </div>
              
              <div className="space-y-2">
                {sections.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg">
                    <div
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedSection === section.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedSection(section.id);
                        toggleSection(section.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {expandedSections.has(section.id) ? (
                            <ChevronDown size={16} className="mr-2" />
                          ) : (
                            <ChevronRight size={16} className="mr-2" />
                          )}
                          <div>
                            <h4 className="font-medium">{section.name}</h4>
                            <p className="text-sm text-gray-500">{section.section_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingItem(section);
                              setShowSectionModal(true);
                            }}
                            icon={<Edit size={14} />}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem('cms_sections', section.id);
                            }}
                            icon={<Trash2 size={14} />}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Content List */}
          {selectedSection && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Content</h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEditingItem(null);
                    setShowContentModal(true);
                  }}
                  icon={<Plus size={16} />}
                >
                  Add Content
                </Button>
              </div>
              
              <div className="space-y-2">
                {content.map((item) => (
                  <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.content_key}</h4>
                        <p className="text-sm text-gray-500">{item.content_type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(item);
                            setShowContentModal(true);
                          }}
                          icon={<Edit size={14} />}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem('cms_content', item.id)}
                          icon={<Trash2 size={14} />}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'media' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Media Library</h3>
            <Button
              variant="primary"
              onClick={() => setShowMediaModal(true)}
              icon={<Upload size={18} />}
            >
              Upload Media
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-2">
                {item.mime_type?.startsWith('image/') ? (
                  <img
                    src={item.file_path}
                    alt={item.alt_text || item.original_filename}
                    className="w-full h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                )}
                <p className="text-xs mt-2 truncate">{item.original_filename}</p>
                <div className="flex justify-between mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(item.file_path)}
                    icon={<Copy size={12} />}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem('cms_media', item.id)}
                    icon={<Trash2 size={12} />}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modals */}
      {showPageModal && (
        <PageModal
          page={editingItem}
          onSave={handleSavePage}
          onClose={() => {
            setShowPageModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {showSectionModal && (
        <SectionModal
          section={editingItem}
          onSave={handleSaveSection}
          onClose={() => {
            setShowSectionModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {showContentModal && (
        <ContentModal
          content={editingItem}
          onSave={handleSaveContent}
          onClose={() => {
            setShowContentModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {showMediaModal && (
        <MediaModal
          onUpload={handleFileUpload}
          onClose={() => setShowMediaModal(false)}
        />
      )}
    </div>
  );
};

// Page Modal Component
const PageModal: React.FC<{
  page?: CMSPage;
  onSave: (data: Partial<CMSPage>) => void;
  onClose: () => void;
}> = ({ page, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    slug: page?.slug || '',
    title: page?.title || '',
    meta_title: page?.meta_title || '',
    meta_description: page?.meta_description || '',
    is_published: page?.is_published || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {page ? 'Edit Page' : 'Add Page'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium">Published</label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Section Modal Component
const SectionModal: React.FC<{
  section?: CMSSection;
  onSave: (data: Partial<CMSSection>) => void;
  onClose: () => void;
}> = ({ section, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: section?.name || '',
    slug: section?.slug || '',
    display_order: section?.display_order || 0,
    section_type: section?.section_type || 'content',
    is_active: section?.is_active !== false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {section ? 'Edit Section' : 'Add Section'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Section Type</label>
            <select
              value={formData.section_type}
              onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="content">Content</option>
              <option value="hero">Hero</option>
              <option value="features">Features</option>
              <option value="testimonials">Testimonials</option>
              <option value="pricing">Pricing</option>
              <option value="cta">Call to Action</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Display Order</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium">Active</label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Content Modal Component
const ContentModal: React.FC<{
  content?: CMSContent;
  onSave: (data: Partial<CMSContent>) => void;
  onClose: () => void;
}> = ({ content, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    content_key: content?.content_key || '',
    content_type: content?.content_type || 'text',
    content_value: content?.content_value || '',
    display_order: content?.display_order || 0,
    is_active: content?.is_active !== false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderContentInput = () => {
    switch (formData.content_type) {
      case 'text':
      case 'heading':
        return (
          <input
            type="text"
            value={formData.content_value}
            onChange={(e) => setFormData({ ...formData, content_value: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        );
      case 'paragraph':
        return (
          <textarea
            value={formData.content_value}
            onChange={(e) => setFormData({ ...formData, content_value: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={4}
          />
        );
      case 'image':
        return (
          <input
            type="url"
            value={formData.content_value}
            onChange={(e) => setFormData({ ...formData, content_value: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Image URL"
          />
        );
      case 'list':
        return (
          <textarea
            value={Array.isArray(formData.content_value) ? formData.content_value.join('\n') : formData.content_value}
            onChange={(e) => setFormData({ 
              ...formData, 
              content_value: e.target.value.split('\n').filter(item => item.trim()) 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={4}
            placeholder="One item per line"
          />
        );
      case 'json':
        return (
          <textarea
            value={typeof formData.content_value === 'object' ? JSON.stringify(formData.content_value, null, 2) : formData.content_value}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setFormData({ ...formData, content_value: parsed });
              } catch {
                setFormData({ ...formData, content_value: e.target.value });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            rows={6}
            placeholder="Valid JSON"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {content ? 'Edit Content' : 'Add Content'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Content Key</label>
            <input
              type="text"
              value={formData.content_key}
              onChange={(e) => setFormData({ ...formData, content_key: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content Type</label>
            <select
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
            <label className="block text-sm font-medium mb-1">Content Value</label>
            {renderContentInput()}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Display Order</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium">Active</label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Media Modal Component
const MediaModal: React.FC<{
  onUpload: (file: File) => void;
  onClose: () => void;
}> = ({ onUpload, onClose }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
      onClose();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Upload Media</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            Drag and drop your file here, or click to select
          </p>
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700"
          >
            Select File
          </label>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default CMSManager;