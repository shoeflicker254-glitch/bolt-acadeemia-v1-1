import React, { useEffect, useState } from 'react';
import { Users, Building2, Briefcase, Activity, BarChart2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';

const CRMDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    contacts: 0,
    companies: 0,
    deals: 0,
    activities: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: contacts }, { count: companies }, { count: deals }, { count: activities }] = await Promise.all([
        supabase.from('crm_contacts').select('*', { count: 'exact', head: true }),
        supabase.from('crm_companies').select('*', { count: 'exact', head: true }),
        supabase.from('crm_deals').select('*', { count: 'exact', head: true }),
        supabase.from('crm_activities').select('*', { count: 'exact', head: true })
      ]);
      setStats({
        contacts: contacts || 0,
        companies: companies || 0,
        deals: deals || 0,
        activities: activities || 0
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">CRM Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 flex items-center">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4"><Users size={28} /></div>
          <div>
            <p className="text-sm text-gray-600">Contacts</p>
            <p className="text-2xl font-bold text-gray-900">{stats.contacts}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center">
          <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4"><Building2 size={28} /></div>
          <div>
            <p className="text-sm text-gray-600">Companies</p>
            <p className="text-2xl font-bold text-gray-900">{stats.companies}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center">
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4"><Briefcase size={28} /></div>
          <div>
            <p className="text-sm text-gray-600">Deals</p>
            <p className="text-2xl font-bold text-gray-900">{stats.deals}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center">
          <div className="p-3 rounded-lg bg-orange-50 text-orange-600 mr-4"><Activity size={28} /></div>
          <div>
            <p className="text-sm text-gray-600">Activities</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activities}</p>
          </div>
        </Card>
      </div>
      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="p-6 flex flex-col items-center justify-center h-64">
          <BarChart2 size={48} className="text-primary-500 mb-4" />
          <p className="text-gray-700 font-medium">Deals Pipeline Chart (Coming Soon)</p>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center h-64">
          <BarChart2 size={48} className="text-primary-500 mb-4" />
          <p className="text-gray-700 font-medium">Activity Overview Chart (Coming Soon)</p>
        </Card>
      </div>
    </div>
  );
};

export default CRMDashboard;
