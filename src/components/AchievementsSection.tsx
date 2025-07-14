import React from 'react';
import { Star, Trophy, Zap, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AchievementsSectionProps {
  achievements: string[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  if (achievements.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-blue/5 to-purple/5 border border-blue/20">
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue" />
            <span className="text-lg font-fredoka font-bold text-blue">Achievements!</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              achievements.includes('perfect-pronunciation') 
                ? 'bg-green/20 text-green border border-green/30' 
                : 'bg-gray/10 text-gray-400 border border-gray/20'
            }`}>
              <Star className="h-3 w-3" />
              <span>Perfect!</span>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              achievements.includes('fluency-master') 
                ? 'bg-blue/20 text-blue border border-blue/30' 
                : 'bg-gray/10 text-gray-400 border border-gray/20'
            }`}>
              <Zap className="h-3 w-3" />
              <span>Fluent!</span>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              achievements.includes('practice-champion') 
                ? 'bg-orange/20 text-orange border border-orange/30' 
                : 'bg-gray/10 text-gray-400 border border-gray/20'
            }`}>
              <Trophy className="h-3 w-3" />
              <span>Champion!</span>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              achievements.includes('speech-star') 
                ? 'bg-pink/20 text-pink border border-pink/30' 
                : 'bg-gray/10 text-gray-400 border border-gray/20'
            }`}>
              <Heart className="h-3 w-3" />
              <span>Star!</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
