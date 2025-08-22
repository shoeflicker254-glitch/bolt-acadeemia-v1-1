import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const crmMenus = [
  { label: 'Dashboard', path: '/dashboard/crm/dashboard' },
  { label: 'Contacts', path: '/dashboard/crm/contacts' },
  { label: 'Companies', path: '/dashboard/crm/companies' },
  { label: 'Deals', path: '/dashboard/crm/deals' },
  { label: 'Activities', path: '/dashboard/crm/activities' },
  { label: 'Tasks', path: '/dashboard/crm/tasks' },
  { label: 'Notes', path: '/dashboard/crm/notes' },
  { label: 'Pipelines', path: '/dashboard/crm/pipelines' },
  { label: 'Reports', path: '/dashboard/crm/reports' }
];

const CRMLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-full bg-gray-100">
      {/* CRM Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">CRM Manager</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <nav className="p-4 space-y-2">
          {crmMenus.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-start px-4 py-3 text-left rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{item.label}</div>
            </button>
          ))}
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {crmMenus.find(item => isActive(item.path))?.label || 'CRM Manager'}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CRMLayout;
