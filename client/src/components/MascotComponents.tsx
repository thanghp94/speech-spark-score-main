import React, { useState, useEffect } from 'react';
import encouragingFox from '@/assets/encouraging-fox.jpg';
import happyParrot from '@/assets/happy-parrot.jpg';
import wiseOwl from '@/assets/wise-owl-mascot.jpg';

interface MascotProps {
  mood: 'encouraging' | 'celebrating' | 'thinking' | 'listening';
  message?: string;
  animated?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ 
  mood, 
  message, 
  animated = true 
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  
  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    }
  }, [message]);

  const mascotData = {
    encouraging: {
      image: encouragingFox,
      defaultMessage: "You can do it! 🌟",
      bgColor: "from-orange/20 to-yellow/20",
      borderColor: "border-orange/30"
    },
    celebrating: {
      image: happyParrot,
      defaultMessage: "Awesome job! 🎉",
      bgColor: "from-pink/20 to-purple/20", 
      borderColor: "border-pink/30"
    },
    thinking: {
      image: wiseOwl,
      defaultMessage: "Let me think... 🤔",
      bgColor: "from-blue/20 to-purple/20",
      borderColor: "border-blue/30"
    },
    listening: {
      image: wiseOwl,
      defaultMessage: "I'm listening carefully! 👂",
      bgColor: "from-success/20 to-blue/20",
      borderColor: "border-success/30"
    }
  };

  const data = mascotData[mood];
  const displayMessage = currentMessage || data.defaultMessage;

  return (
    <div className={`
      relative flex items-center gap-4 p-4 rounded-2xl border-2 
      bg-gradient-to-r ${data.bgColor} ${data.borderColor}
      ${animated ? 'animate-float' : ''}
      transition-all duration-500
    `}>
      {/* Speech Bubble */}
      <div className="relative bg-white rounded-xl p-3 shadow-lg border border-muted max-w-xs">
        <p className="text-sm font-playful text-foreground font-medium">
          {displayMessage}
        </p>
        {/* Speech bubble tail */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-white border-r border-b border-muted rotate-45 transform origin-center"></div>
        </div>
      </div>
      
      {/* Mascot Image */}
      <div className={`
        relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg
        ${animated ? 'hover:scale-110 transition-transform duration-300' : ''}
      `}>
        <img 
          src={data.image} 
          alt={`${mood} mascot`}
          className="w-full h-full object-cover"
        />
        {mood === 'celebrating' && (
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow/20 animate-star-sparkle"></div>
        )}
      </div>
    </div>
  );
};

interface SoundEffectButtonProps {
  sound: 'cheer' | 'ding' | 'woosh' | 'pop';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const SoundEffectButton: React.FC<SoundEffectButtonProps> = ({
  sound,
  children,
  onClick,
  className = ''
}) => {
  const playSound = () => {
    // In a real app, you'd play actual sound files
    // For demo, we'll just add visual feedback
    console.log(`Playing ${sound} sound effect!`);
    
    // Create a temporary visual effect
    const element = document.querySelector('[data-sound-effect]');
    if (element) {
      element.classList.add('animate-celebration');
      setTimeout(() => {
        element.classList.remove('animate-celebration');
      }, 600);
    }
    
    onClick?.();
  };

  return (
    <button
      data-sound-effect
      onClick={playSound}
      className={`${className} transition-all duration-200 hover:scale-105 active:scale-95`}
    >
      {children}
    </button>
  );
};