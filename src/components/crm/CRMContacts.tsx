import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit, Trash2, Search, Download, Upload, Users, CheckSquare, Square, ChevronDown, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  job_title?: string;
  tags?: string[];
  address?: string;
  notes?: string;
  status: 'Active' | 'Lead' | 'Inactive';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  'Active': 'bg-green-100 text-green-800',
  'Lead': 'bg-blue-100 text-blue-800',
  'Inactive': 'bg-gray-100 text-gray-800',
};

const CRMContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showDetail, setShowDetail] = useState<Contact | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('crm_contacts').select('*').order('created_at', { ascending: false });
    if (!error) setContacts(data || []);
    setLoading(false);
  };

  const handleBulkSelect = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === filteredContacts.length) setSelected([]);
    else setSelected(filteredContacts.map(c => c.id));
  };

  const handleDelete = async (ids: string[]) => {
    if (!window.confirm('Delete selected contacts?')) return;
    await supabase.from('crm_contacts').delete().in('id', ids);
    setSelected([]);
    fetchContacts();
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Company', 'Phone', 'Email', 'Status'],
      ...filteredContacts.map(c => [c.name, c.company, c.phone, c.email, c.status])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredContacts = contacts.filter(c =>
    (filterStatus === 'all' || c.status === filterStatus) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      (c.tags || []).join(',').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<Upload size={16} />}>Import</Button>
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>Export</Button>
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => { setEditingContact(null); setShowForm(true); }}>New Contact</Button>
        </div>
      </div>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={selected.length === filteredContacts.length && selected.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />} onClick={handleSelectAll} />
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
              placeholder="Search contacts..."
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
              <option value="Active">Active</option>
              <option value="Lead">Lead</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th></th>
                <th>Name</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map(contact => (
                <tr key={contact.id} className="border-b hover:bg-gray-50">
                  <td>
                    <input type="checkbox" checked={selected.includes(contact.id)} onChange={() => handleBulkSelect(contact.id)} />
                  </td>
                  <td>{contact.name}</td>
                  <td>{contact.company}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.email}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[contact.status]}`}>{contact.status}</span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" icon={<Eye size={14} />} onClick={() => setShowDetail(contact)} />
                      <Button variant="outline" size="sm" icon={<Edit size={14} />} onClick={() => { setEditingContact(contact); setShowForm(true); }} />
                      <Button variant="outline" size="sm" icon={<Trash2 size={14} />} onClick={() => handleDelete([contact.id])} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No contacts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Contact Modal */}
      {showForm && (
        <ContactFormModal
          contact={editingContact}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchContacts(); }}
        />
      )}

      {/* Contact Detail Modal */}
      {showDetail && (
        <ContactDetailModal
          contact={showDetail}
          onClose={() => setShowDetail(null)}
        />
      )}
    </div>
  );
};

// Contact Form Modal
const ContactFormModal: React.FC<{ contact: Contact | null; onClose: () => void; onSaved: () => void }> = ({ contact, onClose, onSaved }) => {
  const [form, setForm] = useState<Contact>(contact || {
    id: '', name: '', email: '', phone: '', company: '', job_title: '', tags: [], address: '', notes: '', status: 'Lead', assigned_to: '', created_at: '', updated_at: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (form.id) {
      const { error } = await supabase.from('crm_contacts').update({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        job_title: form.job_title,
        tags: form.tags,
        address: form.address,
        notes: form.notes,
        status: form.status,
        assigned_to: form.assigned_to
      }).eq('id', form.id);
      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from('crm_contacts').insert([{
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        job_title: form.job_title,
        tags: form.tags,
        address: form.address,
        notes: form.notes,
        status: form.status,
        assigned_to: form.assigned_to
      }]);
      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{form.id ? 'Edit Contact' : 'New Contact'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company/Organization</label>
                <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <input type="text" value={form.job_title} onChange={e => setForm({ ...form, job_title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags/Groups</label>
                <input type="text" value={(form.tags || []).join(', ')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()) })} className="w-full px-3 py-2 border rounded-lg" placeholder="Lead, Customer, Prospect" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Contact['status'] })} className="px-2 py-2 border rounded-lg">
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium">Assigned To</label>
              <input type="text" value={form.assigned_to || ''} onChange={e => setForm({ ...form, assigned_to: e.target.value })} className="px-2 py-2 border rounded-lg" placeholder="User/Agent" />
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

// Contact Detail Modal
const ContactDetailModal: React.FC<{ contact: Contact; onClose: () => void }> = ({ contact, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Contact Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Name:</strong> {contact.name}</div>
              <div><strong>Email:</strong> {contact.email}</div>
              <div><strong>Phone:</strong> {contact.phone}</div>
              <div><strong>Company:</strong> {contact.company}</div>
              <div><strong>Job Title:</strong> {contact.job_title}</div>
              <div><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[contact.status]}`}>{contact.status}</span></div>
              <div><strong>Tags:</strong> {(contact.tags || []).join(', ')}</div>
              <div><strong>Address:</strong> {contact.address}</div>
              <div><strong>Assigned To:</strong> {contact.assigned_to}</div>
            </div>
            <div>
              <strong>Notes:</strong>
              <div className="bg-gray-50 p-3 rounded-lg mt-1 text-gray-700 whitespace-pre-wrap">{contact.notes}</div>
            </div>
            {/* Timeline, linked tasks/deals, activity log can be added here */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Timeline & Activity (Coming Soon)</h3>
              <div className="bg-gray-50 p-3 rounded-lg text-gray-500">Recent interactions, tasks, deals, and activity log will appear here.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMContacts;
