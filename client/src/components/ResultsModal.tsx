import React from 'react';
import { Star, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StarRating } from '@/components/KidComponents';
import { SoundEffectButton } from '@/components/MascotComponents';

interface WordResult {
  word: string;
  accuracyScore: number;
  errorType?: string;
}

interface EvaluationResult {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
  words: WordResult[];
}

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationResult: EvaluationResult | null;
  onTryAgain: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  evaluationResult,
  onTryAgain
}) => {
  const getScoreEmoji = (score: number): string => {
    if (score >= 90) return '🌟';
    if (score >= 80) return '😊';
    if (score >= 70) return '🙂';
    return '💪';
  };

  const getEncouragementMessage = (score: number): string => {
    if (score >= 90) return "You're a pronunciation superstar! Amazing work! 🌟";
    if (score >= 80) return "Great job! You're getting better and better! 😊";
    if (score >= 70) return "Good effort! Keep practicing, you're doing well! 🙂";
    return "Nice try! Every practice makes you stronger! 💪";
  };

  const renderWordAnalysis = () => {
    if (!evaluationResult) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-fredoka font-bold text-center text-primary">
          🌈 How Did Each Word Sound? 🌈
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {evaluationResult.words.map((wordResult, index) => {
            const emoji = getScoreEmoji(wordResult.accuracyScore);
            return (
              <div key={index} className="relative group inline-block">
                <div className={`
                  px-4 py-3 rounded-2xl font-fredoka font-medium text-lg cursor-help transition-all duration-300
                  ${wordResult.accuracyScore >= 90 ? 'bg-success/20 text-success border-2 border-success/40' : 
                    wordResult.accuracyScore >= 80 ? 'bg-warning/20 text-warning border-2 border-warning/40' : 
                    'bg-destructive/20 text-destructive border-2 border-destructive/40'}
                  hover:scale-110 hover:shadow-lg transform
                `}>
                  <div className="flex items-center gap-2">
                    <span>{wordResult.word}</span>
                    <span className="text-xl">{emoji}</span>
                  </div>
                </div>
                
                {/* Fun tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-purple-600 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg border-2 border-purple-400 pointer-events-none">
                  <div className="font-fredoka font-bold text-white">{wordResult.accuracyScore}% Perfect!</div>
                  <div className="text-xs text-white">Keep practicing! 🌟</div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                    <div className="w-3 h-3 bg-purple-600 rotate-45 border-r border-b border-purple-400"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-primary/5">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-4xl font-fredoka text-primary flex items-center justify-center gap-2">
            <Star className="h-10 w-10 text-yellow animate-star-sparkle" />
            Your Magic Scores!
            <Star className="h-10 w-10 text-yellow animate-star-sparkle" />
          </DialogTitle>
          <p className="text-xl font-medium text-muted-foreground">
            Look how amazing you did! 🌟
          </p>
          {evaluationResult && (
            <p className="text-lg font-fredoka text-primary">
              {getEncouragementMessage(evaluationResult.accuracyScore)}
            </p>
          )}
        </DialogHeader>
        
        {evaluationResult && (
          <div className="space-y-8 animate-celebration">
            {/* Overall Scores with Stars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center space-y-2 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-fredoka font-bold text-primary">Pronunciation</span>
                  <span className="text-2xl font-bold text-primary">{evaluationResult.accuracyScore}%</span>
                </div>
                <StarRating score={evaluationResult.accuracyScore} size="md" />
              </div>
              <div className="text-center space-y-2 p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border-2 border-accent/20">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-fredoka font-bold text-accent">Fluency</span>
                  <span className="text-2xl font-bold text-accent">{evaluationResult.fluencyScore}%</span>
                </div>
                <StarRating score={evaluationResult.fluencyScore} size="md" />
              </div>
              <div className="text-center space-y-2 p-4 bg-gradient-to-br from-purple/10 to-purple/5 rounded-xl border-2 border-purple/20">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-fredoka font-bold text-purple">Completeness</span>
                  <span className="text-2xl font-bold text-purple">{evaluationResult.completenessScore}%</span>
                </div>
                <StarRating score={evaluationResult.completenessScore} size="md" />
              </div>
              <div className="text-center space-y-2 p-4 bg-gradient-to-br from-orange/10 to-orange/5 rounded-xl border-2 border-orange/20">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-fredoka font-bold text-orange">Rhythm</span>
                  <span className="text-2xl font-bold text-orange">{evaluationResult.prosodyScore}%</span>
                </div>
                <StarRating score={evaluationResult.prosodyScore} size="md" />
              </div>
            </div>

            {/* Word Analysis */}
            <div className="space-y-4">
              {renderWordAnalysis()}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <SoundEffectButton sound="woosh">
                <Button 
                  variant="celebration" 
                  size="lg" 
                  onClick={onTryAgain}
                  className="text-xl font-fredoka font-bold px-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <RotateCcw className="h-6 w-6 mr-2" />
                  Try Again! 🌟
                </Button>
              </SoundEffectButton>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onClose}
                className="text-xl font-fredoka font-bold px-8 bg-gray-100 text-gray-800 border-2 border-gray-300 hover:bg-gray-200 transition-all duration-300"
              >
                <X className="h-6 w-6 mr-2" />
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
