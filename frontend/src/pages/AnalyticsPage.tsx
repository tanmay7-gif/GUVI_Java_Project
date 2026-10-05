import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AnalyticsSummary } from '../types';
import { useToast } from '../context/ToastContext';
import { ThreeBarChart } from '../components/three/ThreeBarChart';
import { ThreePieChart, PieCategorySlice } from '../components/three/ThreePieChart';
import {
  Flame,
  Clock,
  TrendingUp,
  Zap,
  Activity,
  Layers,
  Calendar,
  Sparkles,
  Download,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type TimeWindow = 'Week' | 'Month' | 'Year' | 'All-Time';
type ActiveMetric = 'calories' | 'duration';

export const AnalyticsPage: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('Week');
  const [activeBarMetric, setActiveBarMetric] = useState<ActiveMetric>('calories');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const res = await api.getWorkoutAnalytics();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to fetch biometric analytics telemetry.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [showToast]);

  // Transform backend dailyTrend for 3D Bar Chart
  const formattedBarData = React.useMemo(() => {
    if (!data?.dailyTrend || data.dailyTrend.length === 0) {
      return [
        { day: 'Mon', date: 'Sep 29', calories: 480, duration: 45 },
        { day: 'Tue', date: 'Sep 30', calories: 620, duration: 60 },
        { day: 'Wed', date: 'Oct 01', calories: 350, duration: 30 },
        { day: 'Thu', date: 'Oct 02', calories: 750, duration: 75 },
        { day: 'Fri', date: 'Oct 03', calories: 520, duration: 50 },
        { day: 'Sat', date: 'Oct 04', calories: 840, duration: 90 },
        { day: 'Sun', date: 'Oct 05', calories: 410, duration: 40 },
      ];
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return data.dailyTrend.map((item) => {
      const d = new Date(item.date);
      const dayName = isNaN(d.getTime()) ? item.date.slice(0, 3) : dayNames[d.getDay()];
      return {
        day: dayName,
        date: item.date,
        calories: item.calories,
        duration: item.duration,
      };
    });
  }, [data]);

  // Transform backend workout type breakdown for 3D Pie Chart
  const formattedPieData: PieCategorySlice[] = React.useMemo(() => {
    if (!data?.typeBreakdown || data.typeBreakdown.length === 0) {
      return [
        { name: 'Cardio', value: 35, color: '#10B981', emissiveColor: '#34D399', sessionsCount: 7 },
        { name: 'Strength', value: 40, color: '#059669', emissiveColor: '#10B981', sessionsCount: 9 },
        { name: 'Flexibility', value: 15, color: '#14B8A6', emissiveColor: '#2DD4BF', sessionsCount: 3 },
        { name: 'HIIT', value: 10, color: '#38BDF8', emissiveColor: '#7DD3FC', sessionsCount: 2 },
      ];
    }

    const totalCount = data.typeBreakdown.reduce((sum, item) => sum + item.count, 0) || 1;
    const colors = ['#10B981', '#059669', '#14B8A6', '#38BDF8', '#8B5CF6'];
    const emissiveColors = ['#34D399', '#10B981', '#2DD4BF', '#7DD3FC', '#A78BFA'];

    return data.typeBreakdown.map((t, idx) => ({
      name: t.name,
      value: Math.round((t.count / totalCount) * 100),
      color: colors[idx % colors.length],
      emissiveColor: emissiveColors[idx % emissiveColors.length],
      sessionsCount: t.count,
    }));
  }, [data]);

  const summary = data?.summary || {
    weeklyWorkoutHours: 4.8,
    weeklyCaloriesBurned: 3970,
    activeChallengesCount: 3,
    totalLifetimeCalories: 14200,
    totalLifetimeWorkouts: 28,
    totalLifetimeHours: 24.5,
  };

  if (isLoading) {
    return (
      <div className="py-28 flex flex-col items-center justify-center gap-3 text-emerald-800">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Synthesizing 3D Telemetry Laboratory...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            3D Biometric Telemetry & Analytics Laboratory
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            Biometric Performance Matrix
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Interactive WebGL 3D volumetric metrics, energy burn acceleration, and multi-discipline distribution.
          </p>
        </div>

        {/* Time Window Selectors */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-white p-1 rounded-xl border border-emerald-100 shadow-sm">
            {(['Week', 'Month', 'Year', 'All-Time'] as TimeWindow[]).map((w) => (
              <button
                key={w}
                onClick={() => setTimeWindow(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeWindow === w
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <button
            onClick={() => showToast('Exporting clinical biometric telemetry report (CSV)...', 'info')}
            className="p-2 rounded-xl bg-white border border-emerald-100 hover:bg-gray-50 text-gray-600 hover:text-emerald-700 shadow-sm transition-all"
            title="Export Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weekly Active Volume */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Duration
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              {summary.weeklyWorkoutHours}
            </span>
            <span className="text-xs font-semibold text-gray-500">hours</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Target: 5.0 hrs weekly
          </p>
        </div>

        {/* Energy Output */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Metabolic Output
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              {summary.weeklyCaloriesBurned.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">kcal</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Active caloric burn rate</p>
        </div>

        {/* Efficiency Index */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Burn Velocity
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              {Math.round(summary.weeklyCaloriesBurned / Math.max(1, summary.weeklyWorkoutHours * 60))}
            </span>
            <span className="text-xs font-semibold text-gray-500">kcal / min</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2">Optimal metabolic rate</p>
        </div>

        {/* Lifetime Logged */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Audited Sessions
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              {summary.totalLifetimeWorkouts}
            </span>
            <span className="text-xs font-semibold text-gray-500">sessions</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            {summary.totalLifetimeHours} lifetime hours
          </p>
        </div>
      </div>

      {/* Primary 3D Visualizations Dual Laboratory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Volumetric Bar Chart (7 cols) */}
        <div className="lg:col-span-7 clinical-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                  <Activity className="w-3 h-3 text-emerald-600" />
                  3D Volumetric Telemetry
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  Daily Volume & Caloric Load
                </h3>
                <p className="text-xs text-gray-500">
                  Interactive 3D raycast bars. Hover to inspect day metrics or rotate view.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-semibold text-gray-400 block">Active Mode</span>
                <span className="text-xs font-bold text-emerald-700 capitalize">
                  {activeBarMetric}
                </span>
              </div>
            </div>

            {/* 3D Volumetric Bar Chart */}
            <ThreeBarChart
              data={formattedBarData}
              activeMetric={activeBarMetric}
              onMetricToggle={setActiveBarMetric}
              heightClass="h-80"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              Dynamic height transitions calibrated to daily totals
            </span>
            <span className="text-emerald-700 font-bold">WebGL Shaded</span>
          </div>
        </div>

        {/* 3D Extruded Donut / Pie Chart (5 cols) */}
        <div className="lg:col-span-5 clinical-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-bold uppercase tracking-wider border border-teal-100">
                  <Layers className="w-3 h-3 text-teal-600" />
                  3D Extruded Geometry
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  Discipline Distribution
                </h3>
                <p className="text-xs text-gray-500">
                  Hover slices to raise on Y-axis with emissive mint radiance.
                </p>
              </div>
            </div>

            {/* 3D Extruded Pie Component */}
            <ThreePieChart data={formattedPieData} heightClass="h-80" />
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Hover lift: +0.35 Y-offset</span>
            <span className="text-teal-700 font-bold">Chamfered Cylinders</span>
          </div>
        </div>
      </div>

      {/* Secondary 2D Curved Volumetric Area Trend Line */}
      <div className="clinical-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Volumetric Energy Expenditure Curve
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Curved gradient telemetry detailing continuous energy pacing across selected time-window.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {timeWindow} Window
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.dailyTrend || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="clinicalEmeraldCurve" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D1E7DD',
                  borderRadius: '1rem',
                  color: '#111827',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px -2px rgba(16, 185, 129, 0.15)',
                }}
                formatter={(val: any) => [`${val} kcal`, 'Expenditure']}
              />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#clinicalEmeraldCurve)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
