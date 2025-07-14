import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

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

export const SpeechEvaluator: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingState, setRecordingState] = useState<'ready' | 'recording' | 'processing' | 'complete'>('ready');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  
  const { toast } = useToast();

  // Reference sentence to read
  const referenceText = "The quick brown fox jumps over the lazy dog.";

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 90) return 'default';
    if (score >= 80) return 'secondary';
    return 'destructive';
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
      
      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setRecordingState('processing');
        
        try {
          // Call real backend API
          const formData = new FormData();
          formData.append('audio', blob, 'recording.webm');
          formData.append('referenceText', referenceText);
          
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
          
          toast({
            title: "Evaluation Complete!",
            description: `Overall accuracy: ${result.accuracyScore}%`,
          });
          
        } catch (error) {
          console.error('Evaluation error:', error);
          setRecordingState('ready');
          
          toast({
            title: "Evaluation Failed",
            description: error instanceof Error ? error.message : "Could not process your speech. Please try again.",
            variant: "destructive",
          });
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      setIsRecording(true);
      setRecordingState('recording');
      analyzeAudio();
      
      toast({
        title: "Recording Started",
        description: "Speak the sentence clearly",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone",
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
  };

  const renderWordAnalysis = () => {
    if (!evaluationResult) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Word-by-Word Analysis</h3>
        <div className="flex flex-wrap gap-2">
          {evaluationResult.words.map((wordResult, index) => (
            <div key={index} className="relative group">
              <span 
                className={`px-2 py-1 rounded-md font-medium cursor-help transition-all duration-200 ${getScoreColor(wordResult.accuracyScore)} bg-muted/50 hover:bg-muted`}
              >
                {wordResult.word}
              </span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg border">
                Score: {wordResult.accuracyScore}%
                {wordResult.errorType && (
                  <div className="text-destructive">
                    Error: {wordResult.errorType}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Speech Evaluation
          </h1>
          <p className="text-muted-foreground text-lg">
            Practice your pronunciation and get detailed feedback
          </p>
        </div>

        {/* Reference Text */}
        <Card className="bg-gradient-to-r from-card/80 to-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Practice Sentence
            </CardTitle>
            <CardDescription>
              Read this sentence aloud clearly and naturally
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-medium text-center p-4 bg-muted/30 rounded-lg">
              "{referenceText}"
            </p>
          </CardContent>
        </Card>

        {/* Recording Section */}
        <Card className="bg-gradient-to-br from-card to-card/80">
          <CardHeader className="text-center">
            <CardTitle>
              {recordingState === 'ready' && 'Ready to Record'}
              {recordingState === 'recording' && 'Recording...'}
              {recordingState === 'processing' && 'Processing Audio...'}
              {recordingState === 'complete' && 'Evaluation Complete'}
            </CardTitle>
            <CardDescription>
              {recordingState === 'ready' && 'Click the microphone to start recording'}
              {recordingState === 'recording' && 'Speak clearly into your microphone'}
              {recordingState === 'processing' && 'Analyzing your pronunciation...'}
              {recordingState === 'complete' && 'Review your results below'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Audio Level Visualizer */}
            {isRecording && (
              <div className="flex justify-center items-end space-x-1 h-20">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-audio-primary to-audio-secondary rounded-full w-3 transition-all duration-150"
                    style={{
                      height: `${Math.max(10, (audioLevel + Math.random() * 20))}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Recording Button */}
            <div className="flex justify-center space-x-4">
              {recordingState === 'ready' && (
                <Button 
                  variant="record" 
                  size="lg" 
                  onClick={startRecording}
                  className="h-16 w-16 rounded-full"
                >
                  <Mic className="h-8 w-8" />
                </Button>
              )}
              
              {recordingState === 'recording' && (
                <Button 
                  variant="recording" 
                  size="lg" 
                  onClick={stopRecording}
                  className="h-16 w-16 rounded-full"
                >
                  <MicOff className="h-8 w-8" />
                </Button>
              )}
              
              {recordingState === 'processing' && (
                <div className="h-16 w-16 rounded-full bg-muted animate-pulse flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              
              {recordingState === 'complete' && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={resetEvaluation}
                  className="h-16 px-8"
                >
                  <RotateCcw className="h-6 w-6 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
            
            {recordingState === 'processing' && (
              <Progress value={75} className="w-full max-w-md mx-auto" />
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {evaluationResult && recordingState === 'complete' && (
          <div className="space-y-6">
            {/* Overall Scores */}
            <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/30">
              <CardHeader>
                <CardTitle>Overall Scores</CardTitle>
                <CardDescription>
                  Your pronunciation assessment results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {evaluationResult.accuracyScore}%
                    </div>
                    <Badge variant={getScoreBadgeVariant(evaluationResult.accuracyScore)}>
                      Accuracy
                    </Badge>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {evaluationResult.fluencyScore}%
                    </div>
                    <Badge variant={getScoreBadgeVariant(evaluationResult.fluencyScore)}>
                      Fluency
                    </Badge>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {evaluationResult.completenessScore}%
                    </div>
                    <Badge variant={getScoreBadgeVariant(evaluationResult.completenessScore)}>
                      Completeness
                    </Badge>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {evaluationResult.prosodyScore}%
                    </div>
                    <Badge variant={getScoreBadgeVariant(evaluationResult.prosodyScore)}>
                      Prosody
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Word Analysis */}
            <Card>
              <CardContent className="pt-6">
                {renderWordAnalysis()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};