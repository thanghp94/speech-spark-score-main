import { useState, useRef, useCallback } from 'react';
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

export const useSpeechEvaluation = () => {
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

  const processAudioBlob = async (blob: Blob, currentSentence: string) => {
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

  const startRecording = async (currentSentence: string) => {
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
          processAudioBlob(blob, currentSentence);
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
  };

  return {
    // State
    isRecording,
    recordingState,
    audioBlob,
    evaluationResult,
    audioLevel,
    showConfetti,
    achievements,
    totalAttempts,
    showResultsModal,
    
    // Actions
    startRecording,
    stopRecording,
    resetEvaluation,
    setShowResultsModal,
    setShowConfetti
  };
};
