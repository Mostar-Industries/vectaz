import { useEffect, useState } from 'react';
import useChatterboxVoice from '@/hooks/useChatterboxVoice';
import styles from './VoiceNarrator.module.css';

// Ultra-futuristic Chatterbox integration
interface VoiceNarratorProps {
  result: {
    topAlternative: {
      name: string;
      score: number;
    };
  };
}

const VoiceNarrator = ({ result }: VoiceNarratorProps) => {
  const { speak, isSpeaking, error } = useChatterboxVoice();

  const getTone = (score) => {
    if (score >= 85) return { speed: 1.2, pitch: 1.3, color: '#4ade80' };
    if (score >= 70) return { speed: 1.1, pitch: 1.2, color: '#60a5fa' };
    return { speed: 1.0, pitch: 1.1, color: '#f87171' };
  };

  useEffect(() => {
    if (!result) return;
    const tone = getTone(result.topAlternative.score);
    const line = `${result.topAlternative.name} scored ${result.topAlternative.score.toFixed(1)}`;
    speak(line); // Optionally pass extra params if you extend useChatterboxVoice
  }, [result, speak]);

  return (
    <div className={styles.voiceNarrator}>
      {isSpeaking && (
        <div
          className={styles.pulse}
          style={{ background: getTone(result?.topAlternative?.score || 0).color }}
        />
      )}
      <span className={styles.narrationName}>
        {result?.topAlternative?.name} narration
      </span>
      {error && (
        <span className={styles.voiceError}>
          Voice error: {error}
        </span>
      )}
    </div>
  );
};

export default VoiceNarrator;
