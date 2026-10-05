import React, { useState, useEffect, useCallback } from 'react';
import { Challenge, UserChallenge } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { HolographicBadge3D } from '../three/HolographicBadge3D';
import {
  Award,
  Flame,
  Clock,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
  Target,
  Trophy,
} from 'lucide-react';

interface ChallengesViewProps {
  onChallengeJoined?: () => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ onChallengeJoined }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [myChallenges, setMyChallenges] = useState<{
    active: UserChallenge[];
    completed: UserChallenge[];
    total_badges_earned: number;
  }>({
    active: [],
    completed: [],
    total_badges_earned: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [challengesRes, myRes] = await Promise.all([
        api.getChallenges(),
        api.getMyChallenges(),
      ]);

      if (challengesRes.success && challengesRes.data) {
        setAllChallenges(challengesRes.data);
      }
      if (myRes.success && myRes.data) {
        setMyChallenges(myRes.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load challenge records.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleJoin = async (challengeId: string) => {
    setJoiningId(challengeId);
    try {
      await api.joinChallenge(challengeId);
      showToast('Challenge enrolled! Keep logging workouts to achieve milestones.', 'success');
      loadData();
      if (onChallengeJoined) onChallengeJoined();
    } catch (err: any) {
      showToast(err.message || 'Could not join challenge.', 'error');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-600" />
            Endurance Challenges & 3D Badges
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Achieve physiological milestones and unlock holographic 3D medals for your permanent trophy cabinet.
          </p>
        </div>

        <div className="flex items-center p-1 bg-white border border-emerald-100 rounded-2xl text-xs font-bold shadow-soft-sm">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Active ({myChallenges.active.length})
          </button>
          <button
            onClick={() => setActiveTab('EXPLORE')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'EXPLORE'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Explore ({allChallenges.length})
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'HISTORY'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Trophy Case ({myChallenges.total_badges_earned})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">Syncing challenge milestones...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: ACTIVE CHALLENGES */}
          {activeTab === 'ACTIVE' && (
            <div className="space-y-4">
              {myChallenges.active.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-emerald-100 shadow-soft-sm">
                  <Target className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-gray-800">No active challenges in progress</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                    Enroll in an endurance or metabolic challenge to start tracking your next 3D badge.
                  </p>
                  <button
                    onClick={() => setActiveTab('EXPLORE')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
                  >
                    Browse Available Challenges
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myChallenges.active.map((uc) => {
                    const c = uc.challenge;
                    const percent = uc.progress_percentage || 0;
                    let metricIcon = <Flame className="w-4 h-4 text-emerald-600" />;
                    let metricUnit = 'kcal';
                    if (c.target_metric === 'DURATION') {
                      metricIcon = <Clock className="w-4 h-4 text-teal-600" />;
                      metricUnit = 'mins';
                    } else if (c.target_metric === 'WORKOUT_COUNT') {
                      metricIcon = <Dumbbell className="w-4 h-4 text-emerald-600" />;
                      metricUnit = 'sessions';
                    }

                    return (
                      <div
                        key={uc.id}
                        className="clinical-card p-6 flex flex-col justify-between relative group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {c.target_metric}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-[#FAFCFA] px-2 py-0.5 rounded-md border border-emerald-100">
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              {c.reward_badge}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {c.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                        </div>

                        {/* Progress Section */}
                        <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 flex items-center gap-1 font-semibold">
                              {metricIcon}
                              {uc.current_progress.toLocaleString()} / {c.target_value.toLocaleString()} {metricUnit}
                            </span>
                            <span className="font-extrabold text-emerald-700">{percent}%</span>
                          </div>

                          <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden p-0.5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Ends {new Date(c.end_date).toLocaleDateString()}
                            </span>
                            <span className="text-emerald-600 font-semibold">Auto-Synced</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPLORE ALL CHALLENGES */}
          {activeTab === 'EXPLORE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allChallenges.map((c) => {
                const isJoined = c.user_status === 'IN_PROGRESS';
                const isCompleted = c.user_status === 'COMPLETED';

                return (
                  <div
                    key={c.id}
                    className="clinical-card p-6 flex flex-col justify-between relative group hover:border-emerald-300"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {c.target_metric}
                        </span>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                          <Users className="w-3 h-3 text-emerald-600" />
                          {c.total_participants || 0} enrolled
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-gray-900 mb-1">{c.title}</h4>
                      <p className="text-xs text-gray-500 mb-4">{c.description}</p>

                      <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-emerald-100/80 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Target Volume:</span>
                          <span className="font-bold text-gray-900">
                            {c.target_value.toLocaleString()} {c.target_metric.toLowerCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Unlockable 3D Trophy:</span>
                          <span className="font-bold text-emerald-700 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            {c.reward_badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Ends {new Date(c.end_date).toLocaleDateString()}
                      </span>

                      {isCompleted ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Achieved
                        </span>
                      ) : isJoined ? (
                        <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold">
                          Enrolled ({c.progress_percent || 0}%)
                        </span>
                      ) : (
                        <button
                          onClick={() => handleJoin(c.id)}
                          disabled={joiningId === c.id}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
                        >
                          {joiningId === c.id ? 'Joining...' : 'Enroll Challenge'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: TROPHY CASE WITH 3D HOLOGRAPHIC BADGES */}
          {activeTab === 'HISTORY' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-500/10">
                    <Trophy className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">3D Holographic Medal Cabinet</h3>
                    <p className="text-xs text-gray-600">
                      Hover over any medal to inspect real-time physics lighting and holographic reflections.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-700">
                    {myChallenges.completed.length}
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Badges Unlocked
                  </span>
                </div>
              </div>

              {myChallenges.completed.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <Award className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-gray-800">No completed badges yet</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                    Complete all target metrics for an active challenge to immortalize your 3D medal here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myChallenges.completed.map((uc) => (
                    <div
                      key={uc.id}
                      className="clinical-card p-5 flex flex-col items-center text-center relative overflow-hidden"
                    >
                      {/* 3D Holographic Medal Display */}
                      <HolographicBadge3D badgeName={uc.challenge.reward_badge} isUnlocked={true} />

                      <div className="mt-2 w-full">
                        <h4 className="text-sm font-bold text-gray-900">{uc.challenge.reward_badge}</h4>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{uc.challenge.title}</p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Achieved {uc.completed_at ? new Date(uc.completed_at).toLocaleDateString() : 'Verified'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
