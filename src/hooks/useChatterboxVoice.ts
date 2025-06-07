import { useState } from 'react';

/**
 * Ultra-futuristic hook for using the new Chatterbox voice backend.
 * Assumes you will connect to a local REST/WebSocket endpoint exposed by your Python backend (e.g., FastAPI, Flask, etc.)
 *
 * Replace the fetch URL with your actual endpoint for TTS/STT.
 */
export function useChatterboxVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Text-to-Speech: send text to Chatterbox backend and play audio
  const speak = async (text: string) => {
    setIsSpeaking(true);
    setError(null);
    try {
      // Replace with your actual backend endpoint
      const response = await fetch('http://localhost:5001/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('TTS backend error');
      const { audioUrl, audioBase64 } = await response.json();
      let audio: HTMLAudioElement;
      if (audioUrl) {
        audio = new Audio(audioUrl);
      } else if (audioBase64) {
        audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      } else {
        throw new Error('No audio returned from backend');
      }
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        setIsSpeaking(false);
        setError('Audio playback failed');
      };
      await audio.play();
    } catch (err) {
      setIsSpeaking(false);
      setError(err instanceof Error ? err.message : 'Voice synthesis failed');
    }
  };

  // Optionally: add STT or other voice features here

  return { speak, isSpeaking, error };
}

export default useChatterboxVoice;
