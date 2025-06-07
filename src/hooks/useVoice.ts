// Voice system removed. Replace with your new implementation.

import { voiceService } from "@/services";
import { useState, useEffect, useMemo } from "react";

export function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (text: string) => {
    try {
      setIsSpeaking(true);
      setError(null);
      const audioUrl = await voiceService.synthesize(text);
      if (!audioUrl) {
        throw new Error('Failed to generate audio');
      }
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        setIsSpeaking(false);
        setError('Audio playback failed');
      };
      await audio.play();
    } catch (err) {
      setIsSpeaking(false);
      setError(err instanceof Error ? err.message : 'Voice synthesis failed');
      console.error('useVoice error:', err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsSpeaking(false);
      setError(null);
    };
  }, []);

  return {
    speak,
    isSpeaking,
    error,
    clearError: () => setError(null),
  };
}
