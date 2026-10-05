import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { InteractiveProfileAvatar } from '../components/three/InteractiveProfileAvatar';
import {
  User as UserIcon,
  Lock,
  Mail,
  KeyRound,
  Target,
  Bell,
  CheckCircle2,
  Sparkles,
  Shield,
  Save,
} from 'lucide-react';

type ProfileTab = 'details' | 'goals' | 'security' | 'notifications';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ProfileTab>('details');

  // Profile details state
  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [profileImage, setProfileImage] = useState<string>(user?.profile_image || '');
  const [bio, setBio] = useState<string>('Clinical strength & endurance athlete tracking hypertrophy markers and metabolic pacing.');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // Fitness goals state
  const [weeklyHoursGoal, setWeeklyHoursGoal] = useState<number>(5.5);
  const [dailyCaloriesTarget, setDailyCaloriesTarget] = useState<number>(650);
  const [targetWeight, setTargetWeight] = useState<string>('74.5 kg');
  const [primaryDiscipline, setPrimaryDiscipline] = useState<string>('Hypertrophy & Conditioning');
  const [isSavingGoals, setIsSavingGoals] = useState<boolean>(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // Notification toggles
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    challengeMilestones: true,
    weeklyDigest: true,
    telemetryAlerts: false,
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await api.updateProfile({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        profile_image: profileImage.trim() || undefined,
      });
      if (res.success && res.data) {
        updateUser(res.data);
        showToast('Personal details updated successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update personal details.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGoals(true);
    setTimeout(() => {
      setIsSavingGoals(false);
      showToast('Fitness benchmarks and biometric goals calibrated!', 'success');
    }, 400);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'warning');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      showToast(res.message || 'Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update password.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-emerald-100 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Interactive 3D Physical Rig & Profile Architecture
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Athlete Profile & Biometric Persona
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Rotate your personal 3D avatar rig, audit muscle recovery hotspots, and manage account credentials.
        </p>
      </div>

      {/* Main Grid: Left 3D Avatar (5 cols), Right Tabbed Settings (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive 3D Avatar Rig (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <InteractiveProfileAvatar
            goalProgress={84}
            userName={name || 'Athlete'}
          />

          {/* Quick Athlete Badge Card */}
          <div className="clinical-card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  profileImage ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    name || 'Athlete'
                  )}`
                }
                alt={name}
                className="w-12 h-12 rounded-full border-2 border-emerald-200 object-cover shadow-sm"
              />
              <div>
                <h4 className="text-sm font-bold text-gray-900">{name || 'Athlete'}</h4>
                <p className="text-[11px] text-gray-500">{email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {user?.role} Tier
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">• Joined 2026</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                Active Protocol
              </span>
              <span className="text-xs font-bold text-emerald-700">Hypertrophy V4</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Settings Panels (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Clinical Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-emerald-100/90 rounded-2xl shadow-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'details'
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Personal Details
            </button>

            <button
              onClick={() => setActiveTab('goals')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'goals'
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Fitness Goals
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'security'
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Security & Credentials
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'notifications'
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Preferences
            </button>
          </div>

          {/* TAB 1: Personal Details Panel */}
          {activeTab === 'details' && (
            <div className="clinical-card p-6 space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
                  <p className="text-xs text-gray-500">Update your clinical identity and public profile</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified ID
                </span>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter athlete display name..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="athlete@domain.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or DiceBear seed URL"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Bordered cleanly in mint-200 across all leaderboard and session views.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Clinical Bio / Athletic Focus
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Detail your conditioning targets, injuries, or athletic focus..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 resize-none shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Fitness Goals Panel */}
          {activeTab === 'goals' && (
            <div className="clinical-card p-6 space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Weekly Benchmarks & Metabolic Targets</h3>
                  <p className="text-xs text-gray-500">Configure thresholds reflected on your 3D activity orb</p>
                </div>
                <Target className="w-5 h-5 text-emerald-600" />
              </div>

              <form onSubmit={handleSaveGoals} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Weekly Active Target (Hours)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="25"
                      value={weeklyHoursGoal}
                      onChange={(e) => setWeeklyHoursGoal(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Daily Caloric Target (kcal)
                    </label>
                    <input
                      type="number"
                      step="50"
                      min="100"
                      max="4000"
                      value={dailyCaloriesTarget}
                      onChange={(e) => setDailyCaloriesTarget(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Target Bodyweight Benchmark
                    </label>
                    <input
                      type="text"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      placeholder="e.g. 74.5 kg"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Primary Training Discipline
                    </label>
                    <input
                      type="text"
                      value={primaryDiscipline}
                      onChange={(e) => setPrimaryDiscipline(e.target.value)}
                      placeholder="e.g. Strength & Conditioning"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingGoals}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSavingGoals ? 'Updating Benchmarks...' : 'Save Benchmark Goals'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Security & Credentials Panel */}
          {activeTab === 'security' && (
            <div className="clinical-card p-6 space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Security Credentials</h3>
                    <p className="text-xs text-gray-500">Update account password with bcrypt validation</p>
                  </div>
                </div>
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  {isChangingPassword ? 'Verifying...' : 'Update Password Safeguard'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Notification Preferences Panel */}
          {activeTab === 'notifications' && (
            <div className="clinical-card p-6 space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Telemetry Notification Preferences</h3>
                  <p className="text-xs text-gray-500">Control automated alerts and challenge milestone triggers</p>
                </div>
                <Bell className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: 'workoutReminders',
                    title: 'Daily Conditioning Reminders',
                    description: 'Receive morning notifications to hit your scheduled workout session.',
                  },
                  {
                    key: 'challengeMilestones',
                    title: 'Challenge Progress & Badges',
                    description: 'Alert when a 3D holographic challenge badge is within 10% of unlock.',
                  },
                  {
                    key: 'weeklyDigest',
                    title: 'Weekly Clinical Biometric Digest',
                    description: 'Comprehensive report on metabolic efficiency, total hours, and intensity curve.',
                  },
                  {
                    key: 'telemetryAlerts',
                    title: 'System Telemetry & Audit Logs',
                    description: 'Real-time security alerts when login occurs from an unverified browser.',
                  },
                ].map((item) => {
                  const isChecked = notifications[item.key as keyof typeof notifications];
                  return (
                    <div
                      key={item.key}
                      onClick={() => {
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key as keyof typeof notifications],
                        }));
                        showToast(`Preference for "${item.title}" updated`, 'info');
                      }}
                      className="p-4 rounded-xl border border-emerald-100/80 bg-[#FAFCFA] hover:bg-emerald-50/30 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>

                      <div
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                          isChecked ? 'bg-emerald-500' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                            isChecked ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
