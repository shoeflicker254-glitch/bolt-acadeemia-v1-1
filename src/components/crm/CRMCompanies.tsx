import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit, Trash2, Search, Download, Upload, Users, CheckSquare, Square, ChevronDown, X, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  phone: string;
  email: string;
  status: string;
  tags?: string[];
  notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  'Active': 'bg-green-100 text-green-800',
  'Prospect': 'bg-blue-100 text-blue-800',
  'Lead': 'bg-yellow-100 text-yellow-800',
  'Client': 'bg-purple-100 text-purple-800',
  'Inactive': 'bg-gray-100 text-gray-800',
};

const sizeOptions = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
const industryOptions = ['Education', 'Technology', 'Finance', 'Healthcare', 'Retail', 'Other'];
const statusOptions = ['Active', 'Prospect', 'Lead', 'Client', 'Inactive'];

const CRMCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showDetail, setShowDetail] = useState<Company | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('crm_companies').select('*').order('created_at', { ascending: false });
    if (!error) setCompanies(data || []);
    setLoading(false);
  };

  const handleBulkSelect = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === filteredCompanies.length) setSelected([]);
    else setSelected(filteredCompanies.map(c => c.id));
  };

  const handleDelete = async (ids: string[]) => {
    if (!window.confirm('Delete selected companies?')) return;
    await supabase.from('crm_companies').delete().in('id', ids);
    setSelected([]);
    fetchCompanies();
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Industry', 'Size', 'Location', 'Status'],
      ...filteredCompanies.map(c => [c.name, c.industry, c.size, c.location, c.status])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'companies.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredCompanies = companies
    .filter(c => (filterStatus === 'all' || c.status === filterStatus))
    .filter(c => (filterIndustry === 'all' || c.industry === filterIndustry))
    .filter(c => (filterSize === 'all' || c.size === filterSize))
    .filter(c => (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      (c.tags || []).join(',').toLowerCase().includes(search.toLowerCase())
    ))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return sizeOptions.indexOf(a.size) - sizeOptions.indexOf(b.size);
      if (sortBy === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Companies</h1>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<Upload size={16} />}>Import</Button>
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>Export</Button>
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => { setEditingCompany(null); setShowForm(true); }}>New Company</Button>
        </div>
      </div>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={selected.length === filteredCompanies.length && selected.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />} onClick={handleSelectAll} />
            <span className="text-sm">Select All</span>
            {selected.length > 0 && (
              <>
                <Button variant="outline" size="sm" icon={<Trash2 size={16} />} onClick={() => handleDelete(selected)}>Delete</Button>
                <Button variant="outline" size="sm">Tag</Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filterIndustry}
              onChange={e => setFilterIndustry(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Industries</option>
              {industryOptions.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select
              value={filterSize}
              onChange={e => setFilterSize(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Sizes</option>
              {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="name">A–Z</option>
              <option value="recent">Recent</option>
              <option value="size">Largest Size</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th></th>
                <th>Company Name</th>
                <th>Industry</th>
                <th>Size</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(company => (
                <tr key={company.id} className="border-b hover:bg-gray-50">
                  <td>
                    <input type="checkbox" checked={selected.includes(company.id)} onChange={() => handleBulkSelect(company.id)} />
                  </td>
                  <td>{company.name}</td>
                  <td>{company.industry}</td>
                  <td>{company.size}</td>
                  <td>{company.location}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[company.status] || 'bg-gray-100 text-gray-800'}`}>{company.status}</span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" icon={<Eye size={14} />} onClick={() => setShowDetail(company)} />
                      <Button variant="outline" size="sm" icon={<Edit size={14} />} onClick={() => { setEditingCompany(company); setShowForm(true); }} />
                      <Button variant="outline" size="sm" icon={<Trash2 size={14} />} onClick={() => handleDelete([company.id])} />
                      <Button variant="outline" size="sm" icon={<UserPlus size={14} />} title="Assign Contact" />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No companies found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Company Modal */}
      {showForm && (
        <CompanyFormModal
          company={editingCompany}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchCompanies(); }}
        />
      )}

      {/* Company Detail Modal */}
      {showDetail && (
        <CompanyDetailModal
          company={showDetail}
          onClose={() => setShowDetail(null)}
        />
      )}
    </div>
  );
};

// Company Form Modal
const CompanyFormModal: React.FC<{ company: Company | null; onClose: () => void; onSaved: () => void }> = ({ company, onClose, onSaved }) => {
  const [form, setForm] = useState<Company>(company || {
    id: '', name: '', industry: '', size: '', location: '', website: '', phone: '', email: '', status: 'Prospect', tags: [], notes: '', assigned_to: '', created_at: '', updated_at: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (form.id) {
      await supabase.from('crm_companies').update({ ...form }).eq('id', form.id);
    } else {
      await supabase.from('crm_companies').insert([{ ...form }]);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{form.id ? 'Edit Company' : 'New Company'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Select Industry</option>
                  {industryOptions.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company Size</label>
                <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Select Size</option>
                  {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location/Address</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input type="text" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <input type="text" value={(form.tags || []).join(', ')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()) })} className="w-full px-3 py-2 border rounded-lg" placeholder="Prospect, Client, Partner" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes/Description</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Assigned CRM User</label>
                <input type="text" value={form.assigned_to || ''} onChange={e => setForm({ ...form, assigned_to: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="User/Agent" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Company Detail Modal
const CompanyDetailModal: React.FC<{ company: Company; onClose: () => void }> = ({ company, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Company Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Name:</strong> {company.name}</div>
              <div><strong>Industry:</strong> {company.industry}</div>
              <div><strong>Size:</strong> {company.size}</div>
              <div><strong>Location:</strong> {company.location}</div>
              <div><strong>Website:</strong> {company.website}</div>
              <div><strong>Phone:</strong> {company.phone}</div>
              <div><strong>Email:</strong> {company.email}</div>
              <div><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[company.status] || 'bg-gray-100 text-gray-800'}`}>{company.status}</span></div>
              <div><strong>Tags:</strong> {(company.tags || []).join(', ')}</div>
              <div><strong>Assigned To:</strong> {company.assigned_to}</div>
            </div>
            <div>
              <strong>Notes/Description:</strong>
              <div className="bg-gray-50 p-3 rounded-lg mt-1 text-gray-700 whitespace-pre-wrap">{company.notes}</div>
            </div>
            {/* Linked contacts, deals, activity timeline can be added here */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Linked Contacts, Deals & Activity (Coming Soon)</h3>
              <div className="bg-gray-50 p-3 rounded-lg text-gray-500">Linked contacts, deals, and activity timeline will appear here.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMCompanies;
