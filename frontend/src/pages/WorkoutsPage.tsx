import React from 'react';
import { WorkoutHistoryTable } from '../components/workout/WorkoutHistoryTable';
import { WorkoutLog } from '../types';
import { PlusCircle, Sparkles, Dumbbell } from 'lucide-react';

interface WorkoutsPageProps {
  onOpenLogWorkout: () => void;
  onEditWorkout: (workout: WorkoutLog) => void;
  refreshTrigger: number;
}

export const WorkoutsPage: React.FC<WorkoutsPageProps> = ({
  onOpenLogWorkout,
  onEditWorkout,
  refreshTrigger,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Athletic Audit Log & History
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Workout Center
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Paginated audit history of all conditioning, hypertrophy, and recovery sessions. Filter by date, category, and perceived exertion (RPE).
          </p>
        </div>

        <button
          onClick={onOpenLogWorkout}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all self-start sm:self-auto active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Workout (3D Torso)</span>
        </button>
      </div>

      {/* Paginated Table Component */}
      <WorkoutHistoryTable
        onEdit={onEditWorkout}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};
