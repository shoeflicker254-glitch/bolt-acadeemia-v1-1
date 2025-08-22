import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit, Trash2, Search, Download, Upload, Users, CheckSquare, Square, X, Move, BarChart2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Deal {
  id: string;
  title: string;
  company?: string;
  contact?: string;
  value: number;
  stage: string;
  status: string;
  expected_close: string;
  assigned_to?: string;
  priority?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const stages = ['New', 'Qualified', 'Negotiation', 'Closed Won', 'Closed Lost'];
const statusOptions = ['Open', 'Won', 'Lost'];
const priorityOptions = ['High', 'Medium', 'Low'];

const CRMDeals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [showDetail, setShowDetail] = useState<Deal | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [kanban, setKanban] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDeals(); }, []);

  const fetchDeals = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('crm_deals').select('*').order('created_at', { ascending: false });
    if (!error) setDeals(data || []);
    setLoading(false);
  };

  const handleBulkSelect = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === filteredDeals.length) setSelected([]);
    else setSelected(filteredDeals.map(d => d.id));
  };

  const handleDelete = async (ids: string[]) => {
    if (!window.confirm('Delete selected deals?')) return;
    await supabase.from('crm_deals').delete().in('id', ids);
    setSelected([]);
    fetchDeals();
  };

  const handleExport = () => {
    const csv = [
      ['Title', 'Company', 'Contact', 'Value', 'Stage', 'Status', 'Expected Close'],
      ...filteredDeals.map(d => [d.title, d.company, d.contact, d.value, d.stage, d.status, d.expected_close])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deals.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredDeals = deals
    .filter(d => (filterStatus === 'all' || d.status === filterStatus))
    .filter(d => (filterStage === 'all' || d.stage === filterStage))
    .filter(d => (filterPriority === 'all' || d.priority === filterPriority))
    .filter(d => (
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.contact || '').toLowerCase().includes(search.toLowerCase())
    ))
    .sort((a, b) => {
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'stage') return stages.indexOf(a.stage) - stages.indexOf(b.stage);
      if (sortBy === 'expected_close') return new Date(a.expected_close).getTime() - new Date(b.expected_close).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Kanban grouping
  const dealsByStage: Record<string, Deal[]> = {};
  stages.forEach(stage => { dealsByStage[stage] = []; });
  filteredDeals.forEach(deal => { if (dealsByStage[deal.stage]) dealsByStage[deal.stage].push(deal); });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deals</h1>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<Upload size={16} />}>Import</Button>
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>Export</Button>
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => { setEditingDeal(null); setShowForm(true); }}>New Deal</Button>
        </div>
      </div>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={selected.length === filteredDeals.length && selected.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />} onClick={handleSelectAll} />
            <span className="text-sm">Select All</span>
            {selected.length > 0 && (
              <>
                <Button variant="outline" size="sm" icon={<Trash2 size={16} />} onClick={() => handleDelete(selected)}>Delete</Button>
                <Button variant="outline" size="sm">Update Stage</Button>
                <Button variant="outline" size="sm">Assign User</Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
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
              value={filterStage}
              onChange={e => setFilterStage(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Stages</option>
              {stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Priorities</option>
              {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="created_at">Recent</option>
              <option value="value">Value</option>
              <option value="stage">Stage</option>
              <option value="expected_close">Expected Close</option>
            </select>
            <Button variant="outline" size="sm" onClick={() => setKanban(!kanban)} icon={<Move size={16} />}>{kanban ? 'List' : 'Kanban'}</Button>
          </div>
        </div>
        {kanban ? (
          <div className="flex gap-4 overflow-x-auto">
            {stages.map(stage => (
              <div key={stage} className="min-w-[260px] flex-1">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: stage === 'Closed Won' ? '#22c55e' : stage === 'Closed Lost' ? '#ef4444' : '#3b82f6' }}></span>
                  {stage}
                  <span className="ml-auto text-xs text-gray-400">{dealsByStage[stage].length}</span>
                </div>
                <div className="space-y-2">
                  {dealsByStage[stage].map(deal => (
                    <Card key={deal.id} className="p-3 cursor-pointer" hoverEffect onClick={() => setShowDetail(deal)}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">{deal.title}</span>
                        <span className="text-xs font-medium text-gray-500">{deal.value ? `KES ${deal.value}` : ''}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">{deal.company || deal.contact}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{deal.status}</span>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{deal.priority}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Close: {deal.expected_close}</div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th></th>
                  <th>Deal Name</th>
                  <th>Company/Contact</th>
                  <th>Value</th>
                  <th>Stage</th>
                  <th>Status</th>
                  <th>Expected Close</th>
                  <th>Priority</th>
                  <th>Assigned</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map(deal => (
                  <tr key={deal.id} className="border-b hover:bg-gray-50">
                    <td>
                      <input type="checkbox" checked={selected.includes(deal.id)} onChange={() => handleBulkSelect(deal.id)} />
                    </td>
                    <td>{deal.title}</td>
                    <td>{deal.company || deal.contact}</td>
                    <td>{deal.value ? `KES ${deal.value}` : ''}</td>
                    <td>{deal.stage}</td>
                    <td>{deal.status}</td>
                    <td>{deal.expected_close}</td>
                    <td>{deal.priority}</td>
                    <td>{deal.assigned_to}</td>
                    <td>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" icon={<Eye size={14} />} onClick={() => setShowDetail(deal)} />
                        <Button variant="outline" size="sm" icon={<Edit size={14} />} onClick={() => { setEditingDeal(deal); setShowForm(true); }} />
                        <Button variant="outline" size="sm" icon={<Trash2 size={14} />} onClick={() => handleDelete([deal.id])} />
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDeals.length === 0 && (
                  <tr><td colSpan={10} className="text-center py-8 text-gray-400">No deals found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {/* Pipeline Summary Chart Placeholder */}
      <Card className="p-6 flex flex-col items-center justify-center h-64 mt-6">
        <BarChart2 size={48} className="text-primary-500 mb-4" />
        <p className="text-gray-700 font-medium">Pipeline Summary Chart (Coming Soon)</p>
      </Card>
      {/* Create/Edit Deal Modal */}
      {showForm && (
        <DealFormModal
          deal={editingDeal}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchDeals(); }}
        />
      )}
      {/* Deal Detail Modal */}
      {showDetail && (
        <DealDetailModal
          deal={showDetail}
          onClose={() => setShowDetail(null)}
        />
      )}
    </div>
  );
};

// Deal Form Modal
const DealFormModal: React.FC<{ deal: Deal | null; onClose: () => void; onSaved: () => void }> = ({ deal, onClose, onSaved }) => {
  const [form, setForm] = useState<Deal>(deal || {
    id: '', title: '', company: '', contact: '', value: 0, stage: 'New', status: 'Open', expected_close: '', assigned_to: '', priority: 'Medium', notes: '', created_at: '', updated_at: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (form.id) {
      await supabase.from('crm_deals').update({ ...form }).eq('id', form.id);
    } else {
      await supabase.from('crm_deals').insert([{ ...form }]);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{form.id ? 'Edit Deal' : 'New Deal'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Deal Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company/Contact</label>
                <input type="text" value={form.company || form.contact || ''} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deal Value (KES)</label>
                <input type="number" value={form.value} onChange={e => setForm({ ...form, value: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pipeline/Stage</label>
                <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Close Date</label>
                <input type="date" value={form.expected_close} onChange={e => setForm({ ...form, expected_close: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned User</label>
                <input type="text" value={form.assigned_to || ''} onChange={e => setForm({ ...form, assigned_to: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes/Description</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} />
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

// Deal Detail Modal
const DealDetailModal: React.FC<{ deal: Deal; onClose: () => void }> = ({ deal, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Deal Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Title:</strong> {deal.title}</div>
              <div><strong>Company/Contact:</strong> {deal.company || deal.contact}</div>
              <div><strong>Value:</strong> {deal.value ? `KES ${deal.value}` : ''}</div>
              <div><strong>Stage:</strong> {deal.stage}</div>
              <div><strong>Status:</strong> {deal.status}</div>
              <div><strong>Expected Close:</strong> {deal.expected_close}</div>
              <div><strong>Priority:</strong> {deal.priority}</div>
              <div><strong>Assigned To:</strong> {deal.assigned_to}</div>
            </div>
            <div>
              <strong>Notes/Description:</strong>
              <div className="bg-gray-50 p-3 rounded-lg mt-1 text-gray-700 whitespace-pre-wrap">{deal.notes}</div>
            </div>
            {/* Timeline, associated tasks/files, activity log can be added here */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Timeline & Activity (Coming Soon)</h3>
              <div className="bg-gray-50 p-3 rounded-lg text-gray-500">Recent interactions, tasks, files, and activity log will appear here.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDeals;
