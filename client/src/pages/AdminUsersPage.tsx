import React from 'react';
import { AdminUserManagement } from '../components/admin/AdminUserManagement';

export const AdminUsersPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <AdminUserManagement />
    </div>
  );
};
