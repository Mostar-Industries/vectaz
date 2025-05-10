import React from 'react';
import { useVoice } from '@/hooks/useVoice';

interface RasaVoiceProps {
  message: string;
  autoSpeak?: boolean;
}

/**
 * RasaVoice component handles text-to-speech for Rasa bot messages
 * Uses the centralized voice system via useVoice hook
 */
export const RasaVoice: React.FC<RasaVoiceProps> = ({ 
  message, 
  autoSpeak = true 
}) => {
  const { speak, toggleMute } = useVoice();
  
  React.useEffect(() => {
    if (autoSpeak && message) {
      speak(message);
    }
    
    return () => {
      toggleMute(); // Clean up any ongoing speech when component unmounts or changes
    };  
  }, [message, autoSpeak, speak, toggleMute]);

  return (
    <div className="rasa-voice">
      <button 
        onClick={() => speak(message)}
        className="voice-button"
        aria-label="Speak message"
      >
        <span className="sr-only">Speak</span>
        🔊
      </button>
    </div>
  );
};

export default RasaVoice;
