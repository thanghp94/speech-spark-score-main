import React, { useState } from 'react';
import { Confetti } from '@/components/KidComponents';
import { SentenceCard } from './SentenceCard';
import { AchievementsSection } from './AchievementsSection';
import { ResultsModal } from './ResultsModal';
import { useSpeechEvaluation } from '@/hooks/useSpeechEvaluation';
import wiseOwl from '@/assets/wise-owl-mascot.jpg';

export const KidsSpeechEvaluator: React.FC = () => {
  const {
    isRecording,
    recordingState,
    evaluationResult,
    audioLevel,
    showConfetti,
    achievements,
    showResultsModal,
    startRecording,
    stopRecording,
    resetEvaluation,
    setShowResultsModal
  } = useSpeechEvaluation();

  // Kid-friendly sentences
  const sentences = [
    "The happy cat plays with a red ball.",
    "I love eating sweet ice cream on sunny days.",
    "My favorite teddy bear is soft and cuddly.",
    "Rainbow butterflies dance in the garden.",
    "The friendly puppy wags its fluffy tail."
  ];
  
  const [currentSentence, setCurrentSentence] = useState(sentences[0]);

  const getEncouragementMessage = (score: number): string => {
    if (score >= 90) return "You're a pronunciation superstar! Amazing work! 🌟";
    if (score >= 80) return "Great job! You're getting better and better! 😊";
    if (score >= 70) return "Good effort! Keep practicing, you're doing well! 🙂";
    return "Nice try! Every practice makes you stronger! 💪";
  };

  const getMascotMood = (): 'encouraging' | 'celebrating' | 'thinking' | 'listening' => {
    if (recordingState === 'recording') return 'listening';
    if (recordingState === 'processing') return 'thinking';
    if (recordingState === 'complete' && evaluationResult) {
      return evaluationResult.accuracyScore >= 80 ? 'celebrating' : 'encouraging';
    }
    return 'encouraging';
  };

  const getMascotMessage = (): string => {
    if (recordingState === 'recording') return "I'm listening to your beautiful voice! 🎵";
    if (recordingState === 'processing') return "Let me check how amazing you did! ✨";
    if (recordingState === 'complete' && evaluationResult) {
      return getEncouragementMessage(evaluationResult.accuracyScore);
    }
    return "Ready to practice? You've got this! 💪";
  };

  const handleStartRecording = () => {
    startRecording(currentSentence);
  };

  const handleResetEvaluation = () => {
    resetEvaluation();
    // Change to a new random sentence
    const nextSentence = sentences[Math.floor(Math.random() * sentences.length)];
    setCurrentSentence(nextSentence);
  };

  const handleTryAgain = () => {
    handleResetEvaluation();
    setShowResultsModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 font-fredoka">
      <Confetti show={showConfetti} />
      
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Magical Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 mb-4">
            <img src={wiseOwl} alt="Wise Owl" className="w-24 h-24 rounded-full border-4 border-primary shadow-lg animate-float" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-pink to-accent bg-clip-text text-transparent animate-rainbow">
              ✨ Speech Magic Academy ✨
            </h1>
          </div>
          <p className="text-xl text-muted-foreground font-medium">
            Practice speaking and become a pronunciation wizard! 🧙‍♂️
          </p>
        </div>

        {/* Achievements Section */}
        <AchievementsSection achievements={achievements} />

        {/* Practice Sentence with Integrated Recording */}
        <SentenceCard
          currentSentence={currentSentence}
          recordingState={recordingState}
          isRecording={isRecording}
          audioLevel={audioLevel}
          mascotMood={getMascotMood()}
          mascotMessage={getMascotMessage()}
          onStartRecording={handleStartRecording}
          onStopRecording={stopRecording}
          onResetEvaluation={handleResetEvaluation}
        />

        {/* Results Modal */}
        <ResultsModal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          evaluationResult={evaluationResult}
          onTryAgain={handleTryAgain}
        />
      </div>
    </div>
  );
};
