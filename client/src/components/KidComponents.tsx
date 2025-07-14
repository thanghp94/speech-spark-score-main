import React from 'react';
import { Star, Trophy, Award, Target, Heart, Zap } from 'lucide-react';

interface StarRatingProps {
  score: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  score, 
  maxStars = 5, 
  size = 'md',
  animated = true 
}) => {
  const filledStars = Math.floor((score / 100) * maxStars);
  const hasHalfStar = (score / 100) * maxStars - filledStars >= 0.5;
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex gap-1 items-center justify-center">
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < filledStars;
        const isHalf = index === filledStars && hasHalfStar;
        
        return (
          <div key={index} className="relative">
            <Star 
              className={`${sizeClasses[size]} ${
                isFilled ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 fill-gray-300'
              } ${animated ? 'transition-all duration-300 hover:scale-110' : ''} drop-shadow-sm`}
              style={{
                animationDelay: animated ? `${index * 0.1}s` : undefined
              }}
            />
            {isHalf && (
              <Star 
                className={`${sizeClasses[size]} text-yellow-500 fill-yellow-500 absolute top-0 left-0 drop-shadow-sm`}
                style={{ clipPath: 'inset(0 50% 0 0)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

interface AchievementBadgeProps {
  type: 'star' | 'trophy' | 'award' | 'target' | 'heart' | 'zap';
  label: string;
  earned?: boolean;
  animated?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  type,
  label,
  earned = false,
  animated = true
}) => {
  const icons = {
    star: Star,
    trophy: Trophy,
    award: Award,
    target: Target,
    heart: Heart,
    zap: Zap
  };
  
  const Icon = icons[type];
  
  const colors = {
    star: earned ? 'text-yellow bg-yellow/10 border-yellow/30' : 'text-muted-foreground bg-muted/10 border-muted/30',
    trophy: earned ? 'text-orange bg-orange/10 border-orange/30' : 'text-muted-foreground bg-muted/10 border-muted/30',
    award: earned ? 'text-purple bg-purple/10 border-purple/30' : 'text-muted-foreground bg-muted/10 border-muted/30',
    target: earned ? 'text-success bg-success/10 border-success/30' : 'text-muted-foreground bg-muted/10 border-muted/30',
    heart: earned ? 'text-pink bg-pink/10 border-pink/30' : 'text-muted-foreground bg-muted/10 border-muted/30',
    zap: earned ? 'text-blue bg-blue/10 border-blue/30' : 'text-muted-foreground bg-muted/10 border-muted/30'
  };

  return (
    <div className={`
      flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300
      ${colors[type]}
      ${earned && animated ? 'animate-celebration hover:scale-105' : ''}
      ${!earned ? 'opacity-50' : ''}
    `}>
      <Icon className={`h-8 w-8 ${earned && animated ? 'animate-star-sparkle' : ''}`} />
      <span className="text-xs font-medium text-center">{label}</span>
    </div>
  );
};

interface ConfettiProps {
  show: boolean;
  duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ show, duration = 3000 }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 animate-celebration"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            backgroundColor: [
              'hsl(var(--yellow))',
              'hsl(var(--pink))',
              'hsl(var(--blue))',
              'hsl(var(--purple))',
              'hsl(var(--orange))'
            ][Math.floor(Math.random() * 5)],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );
};