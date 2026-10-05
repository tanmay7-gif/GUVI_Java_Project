import React from 'react';
import { ChallengesView } from '../components/challenge/ChallengesView';

interface ChallengesPageProps {
  onChallengeJoined?: () => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({ onChallengeJoined }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <ChallengesView onChallengeJoined={onChallengeJoined} />
    </div>
  );
};
