import React from 'react';
import { UserDashboardView } from '../components/dashboard/UserDashboardView';

interface DashboardPageProps {
  onOpenLogWorkout: () => void;
  onNavigateTab: (tab: string) => void;
  refreshTrigger: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenLogWorkout,
  onNavigateTab,
  refreshTrigger,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <UserDashboardView
        onOpenLogWorkout={onOpenLogWorkout}
        onNavigateTab={onNavigateTab}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};
