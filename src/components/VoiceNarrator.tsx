import { useEffect, useState } from 'react';
import { useVoice } from '@/hooks/useVoice';

export const VoiceNarrator = ({ result }) => {
  const { speak, isMuted, toggleMute } = useVoice();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getTone = (score) => {
    if (score >= 85) return { speed: 1.2, pitch: 1.3, color: '#4ade80' };
    if (score >= 70) return { speed: 1.1, pitch: 1.2, color: '#60a5fa' };
    return { speed: 1.0, pitch: 1.1, color: '#f87171' };
  };

  useEffect(() => {
    if (!result || isMuted) return;
    
    const tone = getTone(result.topAlternative.score);
    const line = `${result.topAlternative.name} scored ${result.topAlternative.score.toFixed(1)}`;
    
    setIsSpeaking(true);
    speak(line, 'en-US', tone.speed, tone.pitch);
    
    const timer = setTimeout(() => setIsSpeaking(false), 3000);
    return () => clearTimeout(timer);
  }, [result, speak, isMuted]);

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
      borderRadius: '0.5rem'
    }}>
      <button 
        onClick={toggleMute}
        style={{
          background: isMuted ? '#ef4444' : '#10b981',
          border: 'none',
          borderRadius: '50%',
          width: '2rem',
          height: '2rem',
          display: 'grid',
          placeItems: 'center'
        }}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
      {isSpeaking && (
        <div style={{
          width: '1rem',
          height: '1rem',
          borderRadius: '50%',
          background: getTone(result?.topAlternative?.score || 0).color,
          animation: 'pulse 1.5s infinite'
        }} />
      )}
    </div>
  );
};
