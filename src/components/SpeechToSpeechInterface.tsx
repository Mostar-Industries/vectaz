
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, VolumeX, RotateCcw, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SpeechToSpeechInput from "./analytics/SpeechToSpeechInput";
import useDeepTalkHandler from "./analytics/DeepTalkHandler";
import useChatterboxVoice from "@/hooks/useChatterboxVoice";

interface SpeechToSpeechInterfaceProps {
  className?: string;
}

const SpeechToSpeechInterface: React.FC<SpeechToSpeechInterfaceProps> = ({ className }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { handleSpeechInput } = useDeepTalkHandler();
  const { speak, isSpeaking, error } = useChatterboxVoice();
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedVoiceEnabled = localStorage.getItem('deepcal-voice-enabled');
    if (savedVoiceEnabled !== null) {
      setVoiceEnabled(savedVoiceEnabled === 'true');
    }
  }, []);
  
  // Toggle voice output
  const toggleVoice = () => {
    const newValue = !voiceEnabled;
    setVoiceEnabled(newValue);
    localStorage.setItem('deepcal-voice-enabled', String(newValue));
    toast({
      title: newValue ? "Voice Enabled" : "Voice Disabled",
      description: newValue ? "DeepCAL will speak responses." : "DeepCAL voice has been muted.",
      duration: 3000
    });
  };

  
  // Process the speech input
  const handleTranscriptReceived = async (text: string) => {
    setTranscript(text);
    setIsProcessing(true);
    
    try {
      // Process the input
      const responseText = await handleSpeechInput(text);
      setResponse(responseText);
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speak(responseText);
      }
    } catch (error) {
      console.error("Error processing speech:", error);
      
      toast({
        title: "Processing Error",
        description: "Could not process your speech query. Please try again.",
        variant: "destructive"
      });
      
      setResponse("I'm sorry, I couldn't process that. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Reset the interface
  const resetInterface = () => {
    setTranscript("");
    setResponse("");
  };

  return (
    <Card className={`${className} border-blue-500/20 bg-black/60 backdrop-blur-md`}>
      <CardHeader className="border-b border-blue-500/20 pb-3">
        <CardTitle className="text-xl text-cyan-400">Speech-to-Speech Interface</CardTitle>
        <CardDescription className="text-gray-400">
          Speak to DeepCAL and get voice responses
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 flex flex-col items-center">
        <div className="flex justify-center mb-6 space-x-4">
          {/* Voice toggle button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVoice}
            className={`h-10 w-10 rounded-full 
              ${voiceEnabled ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-gray-800/50 text-gray-400 border-gray-700'}`}
            title={voiceEnabled ? "Mute responses" : "Enable voice responses"}
          >
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          
          {/* Chatterbox status indicator */}
          {isSpeaking && (
            <div className="h-10 w-10 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center animate-pulse" title="Speaking...">
              <Volume2 className="h-5 w-5 text-cyan-400 animate-pulse" />
            </div>
          )}
          {error && (
            <div className="text-red-500 text-xs ml-2">Voice error: {error}</div>
          )}
          
          {/* Reset button */}
          <Button
            variant="outline"
            size="icon"
            onClick={resetInterface}
            className="h-10 w-10 rounded-full bg-gray-800/50 text-gray-400 border-gray-700"
            title="Reset conversation"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="w-full mb-4">
          <div className="font-medium text-sm text-gray-400 mb-1">Your speech:</div>
          <div className="min-h-[40px] p-3 rounded-md bg-black/40 border border-blue-500/20 text-sm text-gray-300">
            {transcript || "Click the microphone button to start speaking..."}
          </div>
        </div>
        
        <div className="w-full mb-6">
          <div className="font-medium text-sm text-gray-400 mb-1">DeepCAL's response:</div>
          <div className="min-h-[80px] p-3 rounded-md bg-black/40 border border-blue-500/20 text-sm text-gray-300">
            {isProcessing ? (
              <span className="text-cyan-400 animate-pulse">Processing your request...</span>
            ) : response ? (
              response
            ) : (
              "DeepCAL's response will appear here..."
            )}
          </div>
        </div>
        
        <SpeechToSpeechInput 
          onTranscriptReceived={handleTranscriptReceived} 
          className="mt-4" 
        />
        
        <p className="text-xs text-gray-500 mt-8 max-w-sm text-center">
          {useElevenLabs ? 
            "Using ElevenLabs for premium voice quality. Each response consumes voice tokens." : 
            "Using browser's built-in speech synthesis to save ElevenLabs tokens."
          }
        </p>
      </CardContent>
      
      <CardFooter className="border-t border-blue-500/20 pt-3 justify-center">
        <span className="text-xs text-gray-400">
          Speak clearly and pause briefly after clicking the microphone button
        </span>
      </CardFooter>
    </Card>
  );
};

export default SpeechToSpeechInterface;
