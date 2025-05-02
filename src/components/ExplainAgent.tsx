import React, { useState, useEffect } from 'react';
import { useVoice } from '@/hooks/useVoice';

interface ExplainAgentProps {
  explanation: string;
  title?: string;
  autoSpeak?: boolean;
  onClose?: () => void;
}

/**
 * ExplainAgent provides contextual explanations with text-to-speech capability
 * Uses the centralized voice system via useVoice hook
 */
export const ExplainAgent: React.FC<ExplainAgentProps> = ({
  explanation,
  title = "Vectaz Assistant",
  autoSpeak = true,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { speak, stop } = useVoice();
  
  useEffect(() => {
    if (autoSpeak && explanation && isExpanded) {
      speak(explanation);
    }
    
    return () => {
      stop(); // Clean up any ongoing speech when component unmounts or changes
    };
  }, [explanation, autoSpeak, isExpanded, speak, stop]);

  const handleClose = () => {
    stop();
    setIsExpanded(false);
    if (onClose) onClose();
  };

  const handleSpeakClick = () => {
    speak(explanation);
  };

  if (!isExpanded) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-background border border-border rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-t-lg">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleSpeakClick}
            className="p-1 rounded-full hover:bg-primary/20 transition-colors"
            aria-label="Speak explanation"
          >
            <span className="sr-only">Speak</span>
            🔊
          </button>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-primary/20 transition-colors"
            aria-label="Close explanation"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>
      </div>
      <div className="p-4 text-sm max-h-60 overflow-y-auto">
        {explanation}
      </div>
    </div>
  );
};

export default ExplainAgent;
