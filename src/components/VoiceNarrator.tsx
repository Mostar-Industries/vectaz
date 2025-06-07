import { useEffect, useState } from 'react';
import useChatterboxVoice from '@/hooks/useChatterboxVoice';

// Ultra-futuristic Chatterbox integration
const VoiceNarrator = ({ result }: { result: any }) => {
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
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      background: '#1e293b',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 24px 0 #00FFD1AA',
      zIndex: 1000
    }}>
      {isSpeaking && (
        <div style={{
          width: '1.5rem',
          height: '1.5rem',
          borderRadius: '50%',
          background: getTone(result?.topAlternative?.score || 0).color,
          animation: 'pulse 1.5s infinite',
          boxShadow: '0 0 12px 2px #00FFD1',
        }} />
      )}
      <span style={{ color: '#00FFD1', fontWeight: 700, fontSize: '1rem' }}>
        {result?.topAlternative?.name} narration
      </span>
      {error && (
        <span style={{ color: '#f87171', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
          Voice error: {error}
        </span>
      )}
    </div>
  );
};

export default VoiceNarrator;
