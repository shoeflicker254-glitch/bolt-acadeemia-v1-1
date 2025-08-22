import React from 'react';
import { useNavigate } from 'react-router-dom';

const crmMenus = [
  { label: 'Contacts', path: '/dashboard/crm/contacts' },
  { label: 'Companies', path: '/dashboard/crm/companies' },
  { label: 'Deals', path: '/dashboard/crm/deals' },
  { label: 'Activities', path: '/dashboard/crm/activities' },
  { label: 'Tasks', path: '/dashboard/crm/tasks' },
  { label: 'Notes', path: '/dashboard/crm/notes' },
  { label: 'Pipelines', path: '/dashboard/crm/pipelines' },
  { label: 'Reports', path: '/dashboard/crm/reports' }
];

const CRMManager: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">CRM Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {crmMenus.map((menu, idx) => (
          <button
            key={idx}
            onClick={() => navigate(menu.path)}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md border border-gray-200 text-left w-full transition"
          >
            <span className="text-lg font-semibold text-primary-700">{menu.label}</span>
            <div className="text-gray-500 text-sm mt-2">Go to {menu.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CRMManager;
