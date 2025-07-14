import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, RotateCcw, Star, Trophy, Sparkles, X, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { StarRating, AchievementBadge, Confetti } from '@/components/KidComponents';
import { Mascot, SoundEffectButton } from '@/components/MascotComponents';
import wiseOwl from '@/assets/wise-owl-mascot.jpg';

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

// Helper function to create WAV buffer from Float32Array PCM data
const createWavBuffer = (audioData: Float32Array, sampleRate: number): ArrayBuffer => {
  const length = audioData.length;
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);
  
  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, audioData[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }
  
  return buffer;
};

export const KidsSpeechEvaluator: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingState, setRecordingState] = useState<'ready' | 'recording' | 'processing' | 'complete'>('ready');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showResultsModal, setShowResultsModal] = useState(false);
  
  const mediaRecorderRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  
  const { toast } = useToast();

  // Kid-friendly sentences
  const sentences = [
    "The happy cat plays with a red ball.",
    "I love eating sweet ice cream on sunny days.",
    "My favorite teddy bear is soft and cuddly.",
    "Rainbow butterflies dance in the garden.",
    "The friendly puppy wags its fluffy tail."
  ];
  
  const [currentSentence, setCurrentSentence] = useState(sentences[0]);

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

  const checkAchievements = (result: EvaluationResult) => {
    const newAchievements: string[] = [];
    
    if (result.accuracyScore >= 95 && !achievements.includes('perfect-pronunciation')) {
      newAchievements.push('perfect-pronunciation');
    }
    if (result.fluencyScore >= 90 && !achievements.includes('fluency-master')) {
      newAchievements.push('fluency-master');
    }
    if (totalAttempts >= 5 && !achievements.includes('practice-champion')) {
      newAchievements.push('practice-champion');
    }
    if (result.accuracyScore >= 85 && result.fluencyScore >= 85 && !achievements.includes('speech-star')) {
      newAchievements.push('speech-star');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    setAudioLevel(average);
    
    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, [isRecording]);

  const processAudioBlob = async (blob: Blob) => {
    try {
      // Call real backend API
      const formData = new FormData();
      formData.append('audio', blob, 'recording.wav');
      formData.append('referenceText', currentSentence);
      
      const response = await fetch('http://localhost:3001/api/evaluate', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to evaluate speech');
      }
      
      const data = await response.json();
      const result: EvaluationResult = {
        accuracyScore: data.result.accuracyScore,
        fluencyScore: data.result.fluencyScore,
        completenessScore: data.result.completenessScore,
        prosodyScore: data.result.prosodyScore,
        words: data.result.words
      };
      
      setEvaluationResult(result);
      setRecordingState('complete');
      setTotalAttempts(prev => prev + 1);
      
      checkAchievements(result);
      
      // Show results in modal instead of toast
      setShowResultsModal(true);
      
    } catch (error) {
      console.error('Evaluation error:', error);
      setRecordingState('ready');
      
      toast({
        title: "Oops! Something went wrong! 🤖",
        description: error instanceof Error ? error.message : "Let's try again! Make sure you speak clearly.",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      streamRef.current = stream;
      
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      // Use Web Audio API to capture raw PCM data instead of MediaRecorder
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      const audioChunks: Float32Array[] = [];
      
      processor.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);
        audioChunks.push(new Float32Array(inputData));
      };
      
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      
      // Create a custom recorder object
      const mediaRecorder = {
        start: () => {
          console.log('Started PCM audio capture');
        },
        stop: () => {
          processor.disconnect();
          
          // Convert Float32Array chunks to WAV
          const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
          const combinedData = new Float32Array(totalLength);
          let offset = 0;
          
          for (const chunk of audioChunks) {
            combinedData.set(chunk, offset);
            offset += chunk.length;
          }
          
          // Convert to 16-bit PCM and create WAV
          const wavBuffer = createWavBuffer(combinedData, 16000);
          const blob = new Blob([wavBuffer], { type: 'audio/wav' });
          
          // Store the blob and process it
          setAudioBlob(blob);
          setRecordingState('processing');
          processAudioBlob(blob);
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      setIsRecording(true);
      setRecordingState('recording');
      analyzeAudio();
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Oops! Microphone Problem",
        description: "Let's try again! Make sure your microphone is working.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const resetEvaluation = () => {
    setRecordingState('ready');
    setAudioBlob(null);
    setEvaluationResult(null);
    setAudioLevel(0);
    setShowResultsModal(false);
    
    // Change to a new random sentence
    const nextSentence = sentences[Math.floor(Math.random() * sentences.length)];
    setCurrentSentence(nextSentence);
  };

  const getMascotMood = () => {
    if (recordingState === 'recording') return 'listening';
    if (recordingState === 'processing') return 'thinking';
    if (recordingState === 'complete' && evaluationResult) {
      return evaluationResult.accuracyScore >= 80 ? 'celebrating' : 'encouraging';
    }
    return 'encouraging';
  };

  const getMascotMessage = () => {
    if (recordingState === 'recording') return "I'm listening to your beautiful voice! 🎵";
    if (recordingState === 'processing') return "Let me check how amazing you did! ✨";
    if (recordingState === 'complete' && evaluationResult) {
      return getEncouragementMessage(evaluationResult.accuracyScore);
    }
    return "Ready to practice? You've got this! 💪";
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


        {/* Achievements Section - Compact */}
        {achievements.length > 0 && (
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
        )}

        {/* Practice Sentence with Integrated Recording */}
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
                  mood={getMascotMood()}
                  message={getMascotMessage()}
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
                        onClick={startRecording}
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
                        onClick={stopRecording}
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
                        onClick={resetEvaluation}
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

        {/* Results Modal */}
        <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
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
                      onClick={resetEvaluation}
                      className="text-xl font-fredoka font-bold px-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <RotateCcw className="h-6 w-6 mr-2" />
                      Try Again! 🌟
                    </Button>
                  </SoundEffectButton>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setShowResultsModal(false)}
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
      </div>
    </div>
  );
};
