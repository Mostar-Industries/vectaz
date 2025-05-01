import { useEffect } from 'react';

export const useVoice = () => {
  const speak = (text: string, lang = "en-US") => {
    if (!text || typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    synth.cancel(); // Cancel previous speech

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 1;
    utter.pitch = 1;

    synth.speak(utter);
  };

  const stop = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { speak, stop };
};
