import React from 'react';
import { AdminDashboardView } from '../components/admin/AdminDashboardView';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (tab: string) => {
    if (tab === 'admin-users') navigate('/admin/users');
    else if (tab === 'admin-content') navigate('/admin/moderation');
    else if (tab === 'admin-settings' || tab === 'admin-audit') navigate('/admin/settings');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <AdminDashboardView onNavigateTab={handleNavigate} />
    </div>
  );
};
