import React, { useState, useEffect } from 'react';
import { 
  Upload, Image, File, Trash2, Search, Filter, 
  Download, Eye, Copy, Grid, List
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface MediaFile {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  alt_text?: string;
  caption?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  uploaded_by?: string;
}

const MediaManager: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_media')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched media files:', data);
      setMediaFiles(data || []);
    } catch (error) {
      console.error('Error fetching media files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('cms-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save file info to database
        const { error: dbError } = await supabase
          .from('cms_media')
          .insert({
            filename: fileName,
            original_filename: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
            category: 'general',
            is_active: true
          });

        if (dbError) throw dbError;
      }

      // Refresh the media list
      await fetchMediaFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const { error } = await supabase
        .from('cms_media')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      setMediaFiles(mediaFiles.filter(file => file.id !== id));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const getMediaCategories = () => {
    return [...new Set(mediaFiles.map(file => file.category || 'general'))];
  };

  const updateFileCategory = async (id: string, category: string) => {
    try {
      const { error } = await supabase
        .from('cms_media')
        .update({ category })
        .eq('id', id);

      if (error) throw error;
      setMediaFiles(mediaFiles.map(file => 
        file.id === id ? { ...file, category } : file
      ));
    } catch (error) {
      console.error('Error updating file category:', error);
    }
  };

  const copyFileUrl = (filePath: string) => {
    const url = `${supabase.supabaseUrl}/storage/v1/object/public/cms-media/${filePath}`;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isImage = (mimeType?: string) => {
    return mimeType?.startsWith('image/') || false;
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.alt_text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'images' && isImage(file.mime_type)) ||
                         (filterType === 'documents' && !isImage(file.mime_type));
    const matchesCategory = filterCategory === 'all' || file.category === filterCategory;
    return matchesSearch && matchesFilter && matchesCategory;
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
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Upload and manage your website media files</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button variant="primary" icon={<Upload size={18} />} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </label>
        </div>
      </div>

      {/* Filters and View Controls */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search media files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'images' | 'documents')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
              <option value="documents">Documents</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {getMediaCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              icon={<Grid size={16} />}
              onClick={() => setViewMode('grid')}
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              icon={<List size={16} />}
              onClick={() => setViewMode('list')}
            />
          </div>
        </div>
      </Card>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="p-4" hoverEffect>
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {isImage(file.mime_type) ? (
                  <img
                    src={`${supabase.supabaseUrl}/storage/v1/object/public/cms-media/${file.file_path}`}
                    alt={file.alt_text || file.original_filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <File size={48} className="text-gray-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-gray-900 truncate" title={file.original_filename}>
                  {file.original_filename}
                </h3>
                <p className="text-xs text-gray-500">{formatFileSize(file.file_size)}</p>
                <div className="mb-2">
                  <select
                    value={file.category || 'general'}
                    onChange={(e) => updateFileCategory(file.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                  >
                    <option value="general">General</option>
                    <option value="logos">Logos</option>
                    <option value="frontend">Frontend</option>
                    <option value="icons">Icons</option>
                    <option value="banners">Banners</option>
                    <option value="testimonials">Testimonials</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Eye size={14} />}
                    onClick={() => window.open(`${supabase.supabaseUrl}/storage/v1/object/public/cms-media/${file.file_path}`, '_blank')}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Copy size={14} />}
                    onClick={() => copyFileUrl(file.file_path)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Trash2 size={14} />}
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-600 hover:text-red-700"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          {isImage(file.mime_type) ? (
                            <img
                              src={`${supabase.supabaseUrl}/storage/v1/object/public/cms-media/${file.file_path}`}
                              alt={file.alt_text || file.original_filename}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <File size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.original_filename}</div>
                          {file.alt_text && (
                            <div className="text-sm text-gray-500">{file.alt_text}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.mime_type || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.file_size)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={file.category || 'general'}
                        onChange={(e) => updateFileCategory(file.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="general">General</option>
                        <option value="logos">Logos</option>
                        <option value="frontend">Frontend</option>
                        <option value="icons">Icons</option>
                        <option value="banners">Banners</option>
                        <option value="testimonials">Testimonials</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(file.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Eye size={14} />}
                          onClick={() => window.open(`${supabase.supabaseUrl}/storage/v1/object/public/cms-media/${file.file_path}`, '_blank')}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Copy size={14} />}
                          onClick={() => copyFileUrl(file.file_path)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-600 hover:text-red-700"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filteredFiles.length === 0 && (
        <Card className="p-12 text-center">
          <Image size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No media files found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Upload your first media file to get started.'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <label htmlFor="file-upload">
              <Button variant="primary" icon={<Upload size={18} />}>
                Upload Your First File
              </Button>
            </label>
          )}
        </Card>
      )}
    </div>
  );
};

export default MediaManager;