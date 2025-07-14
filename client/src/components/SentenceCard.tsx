import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mascot } from '@/components/MascotComponents';
import { RecordingSection } from './RecordingSection';

interface SentenceCardProps {
  currentSentence: string;
  recordingState: 'ready' | 'recording' | 'processing' | 'complete';
  isRecording: boolean;
  audioLevel: number;
  mascotMood: 'encouraging' | 'celebrating' | 'thinking' | 'listening';
  mascotMessage: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetEvaluation: () => void;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({
  currentSentence,
  recordingState,
  isRecording,
  audioLevel,
  mascotMood,
  mascotMessage,
  onStartRecording,
  onStopRecording,
  onResetEvaluation
}) => {
  return (
    <Card className="bg-gradient-to-br from-card to-primary/5 border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl font-fredoka text-primary flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 animate-star-sparkle" />
              Your Magic Sentence
              <Sparkles className="h-6 w-6 animate-star-sparkle" />
            </CardTitle>
            <CardDescription className="text-lg font-medium mt-2">
              Read this sentence with your best voice! 🗣️
            </CardDescription>
          </div>
          {/* Mascot in line with title */}
          <div className="flex-shrink-0">
            <Mascot 
              mood={mascotMood}
              message={mascotMessage}
              animated={true}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Sentence Text */}
          <div className="flex-1 text-center p-6 bg-gradient-to-r from-purple/10 to-pink/10 rounded-2xl border-2 border-purple/20">
            <p className="text-xl md:text-2xl font-fredoka font-bold text-foreground leading-relaxed">
              "{currentSentence}"
            </p>
          </div>
          
          {/* Recording Button and Controls - Right Side */}
          <RecordingSection
            recordingState={recordingState}
            isRecording={isRecording}
            audioLevel={audioLevel}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            onResetEvaluation={onResetEvaluation}
          />
        </div>
        
        {/* Mobile Layout - Stack vertically on small screens */}
        <div className="md:hidden mt-4">
          <div className="flex justify-center">
            {recordingState === 'ready' && (
              <div className="text-center">
                <p className="text-lg font-fredoka font-medium text-muted-foreground mb-3">
                  Press the magical microphone to start! 🎤
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
