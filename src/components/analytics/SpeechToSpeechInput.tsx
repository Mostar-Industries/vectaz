
import React, { useState, useRef } from 'react';
import { Mic, StopCircle, Loader } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { blobToBase64 } from '@/utils/audioUtils';

interface SpeechToSpeechInputProps {
  onTranscriptReceived: (text: string) => void;
  isListening?: boolean;
  className?: string;
}

const SpeechToSpeechInput: React.FC<SpeechToSpeechInputProps> = ({
  onTranscriptReceived,
  isListening: externalIsListening,
  className
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  
  // Use external state if provided, otherwise use internal state
  const listening = externalIsListening !== undefined ? externalIsListening : isListening;
  
  const startListening = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        
        // Combine audio chunks into a single blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          // Convert audio to base64
          const base64Audio = await blobToBase64(audioBlob);
          
          // Use the Supabase client
          const supabaseUrl = 'https://hpogoxrxcnyxiqjmqtaw.supabase.co';
          const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwb2dveHJ4Y255eGlxam1xdGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDEwMjEsImV4cCI6MjA1ODc3NzAyMX0.9JA8cI1FYpyLJGn8VJGSQcUbnBmzNtMH_I_fkI-JMAE';
          
          const supabase = createClient(
            supabaseUrl,
            supabaseAnonKey,
            { auth: { persistSession: false } }
          );
          
          // Call the speech-to-text edge function
          const { data, error } = await supabase.functions.invoke('speech-to-text', {
            body: { audio: base64Audio }
          });
          
          if (error) {
            throw new Error(`Error in speech recognition: ${error.message}`);
          }
          
          if (!data?.text) {
            throw new Error('No transcript received');
          }
          
          // Pass the transcript to the parent component
          onTranscriptReceived(data.text);
          
        } catch (error) {
          console.error('Error processing speech:', error);
          toast({
            title: 'Speech Recognition Error',
            description: 'Could not understand the audio. Please try again.',
            variant: 'destructive',
          });
        } finally {
          // Stop all tracks in the stream
          stream.getTracks().forEach(track => track.stop());
          setIsProcessing(false);
          
          // Only update internal state if external state isn't provided
          if (externalIsListening === undefined) {
            setIsListening(false);
          }
        }
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Only update internal state if external state isn't provided
      if (externalIsListening === undefined) {
        setIsListening(true);
      }
      
      toast({
        title: 'Listening',
        description: 'Speak now... Click the mic button again to stop.',
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Microphone Error',
        description: 'Could not access your microphone. Please check your permissions.',
        variant: 'destructive',
      });
    }
  };
  
  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };
  
  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className={`h-10 w-10 rounded-full ${listening ? 'bg-red-500/20 text-red-500 border-red-500' : 'bg-blue-500/20 text-blue-400 border-blue-400'}`}
        onClick={toggleListening}
        disabled={isProcessing}
        aria-label={listening ? 'Stop recording' : 'Start recording'}
      >
        {isProcessing ? (
          <Loader className="h-5 w-5 animate-spin" />
        ) : listening ? (
          <StopCircle className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      
      {isProcessing && (
        <span className="ml-2 text-sm text-gray-400">Processing speech...</span>
      )}
      
      {listening && !isProcessing && (
        <span className="ml-2 text-sm text-green-400 animate-pulse">Listening...</span>
      )}
    </div>
  );
};

export default SpeechToSpeechInput;
