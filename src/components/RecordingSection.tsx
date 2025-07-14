import React from 'react';
import { Mic, MicOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SoundEffectButton } from '@/components/MascotComponents';

interface RecordingSectionProps {
  recordingState: 'ready' | 'recording' | 'processing' | 'complete';
  isRecording: boolean;
  audioLevel: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetEvaluation: () => void;
}

export const RecordingSection: React.FC<RecordingSectionProps> = ({
  recordingState,
  isRecording,
  audioLevel,
  onStartRecording,
  onStopRecording,
  onResetEvaluation
}) => {
  return (
    <div className="flex-shrink-0 flex flex-col items-center space-y-4">
      {/* Recording Status */}
      {recordingState !== 'ready' && (
        <div className="text-center">
          <p className="text-lg font-fredoka font-bold text-primary">
            {recordingState === 'recording' && '🎵 Recording...'}
            {recordingState === 'processing' && '✨ Processing...'}
            {recordingState === 'complete' && '🎉 Done!'}
          </p>
        </div>
      )}
      
      {/* Audio Visualizer - Compact Version */}
      {isRecording && (
        <div className="flex justify-center items-end space-x-1 h-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-150"
              style={{
                width: '4px',
                height: `${Math.max(6, (audioLevel + Math.random() * 15))}%`,
                backgroundColor: [
                  'hsl(var(--audio-primary))',
                  'hsl(var(--audio-secondary))',
                  'hsl(var(--audio-tertiary))',
                  'hsl(var(--audio-quaternary))'
                ][i % 4],
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Recording Button */}
      <div className="flex justify-center">
        {recordingState === 'ready' && (
          <SoundEffectButton sound="pop">
            <Button 
              variant="magical" 
              size="lg" 
              onClick={onStartRecording}
              className="h-16 w-16 rounded-full text-xl font-fredoka font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-4 border-white"
              title="Press to start recording!"
            >
              <Mic className="h-8 w-8" />
            </Button>
          </SoundEffectButton>
        )}
        
        {recordingState === 'recording' && (
          <SoundEffectButton sound="ding">
            <Button 
              variant="recording" 
              size="lg" 
              onClick={onStopRecording}
              className="h-16 w-16 rounded-full text-xl font-fredoka font-bold"
              title="Press to stop recording!"
            >
              <MicOff className="h-8 w-8" />
            </Button>
          </SoundEffectButton>
        )}
        
        {recordingState === 'processing' && (
          <div className="h-16 w-16 rounded-full bg-purple/20 animate-pulse flex items-center justify-center border-4 border-purple/40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-purple"></div>
          </div>
        )}
        
        {recordingState === 'complete' && (
          <SoundEffectButton sound="woosh">
            <Button 
              variant="celebration" 
              size="lg" 
              onClick={onResetEvaluation}
              className="h-14 px-6 text-lg font-fredoka font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-full"
              title="Try another sentence!"
            >
              <RotateCcw className="h-6 w-6 mr-2" />
              Try Again! 🌟
            </Button>
          </SoundEffectButton>
        )}
      </div>
      
      {/* Processing Progress */}
      {recordingState === 'processing' && (
        <div className="w-24">
          <Progress value={75} className="h-2 bg-purple/20" />
          <p className="mt-1 text-xs text-purple font-fredoka font-medium text-center">
            Analyzing... ✨
          </p>
        </div>
      )}
    </div>
  );
};
