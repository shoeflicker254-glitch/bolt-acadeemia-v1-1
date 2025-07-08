import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Eye, Trash2, Search, Filter, Globe, 
  FileText, Calendar, User, MoreVertical
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Page {
  id: string;
  slug: string;
  title: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

const PagesManager: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPages(pages.filter(page => page.id !== id));
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('cms_pages')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setPages(pages.map(page => 
        page.id === id ? { ...page, is_published: !currentStatus } : page
      ));
    } catch (error) {
      console.error('Error updating page status:', error);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && page.is_published) ||
                         (filterStatus === 'draft' && !page.is_published);
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
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600">Manage your website pages and content</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => navigate('/dashboard/cms/pages/new')}>
          Create Page
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Pages</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </Card>

      {/* Pages List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPages.map((page) => (
          <Card key={page.id} className="p-6" hoverEffect>
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <FileText size={24} className="text-primary-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      page.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">/{page.slug}</p>
                  
                  {page.meta_description && (
                    <p className="text-sm text-gray-500 mb-3">{page.meta_description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Updated {new Date(page.updated_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      Admin
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Eye size={16} />}
                  onClick={() => window.open(`/${page.slug}`, '_blank')}
                >
                  Preview
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit size={16} />}
                  onClick={() => navigate(`/dashboard/cms/pages/${page.id}/edit`)}
                >
                  Edit
                </Button>
                
                <Button
                  variant={page.is_published ? "outline" : "primary"}
                  size="sm"
                  icon={<Globe size={16} />}
                  onClick={() => handleTogglePublish(page.id, page.is_published)}
                >
                  {page.is_published ? 'Unpublish' : 'Publish'}
                </Button>
                
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<MoreVertical size={16} />}
                    onClick={() => {
                      // Toggle dropdown menu
                    }}
                  />
                  {/* Dropdown menu would go here */}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={() => handleDeletePage(page.id)}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPages.length === 0 && (
        <Card className="p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No pages found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first page.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button variant="primary" icon={<Plus size={18} />} onClick={() => navigate('/dashboard/cms/pages/new')}>
              Create Your First Page
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default PagesManager;