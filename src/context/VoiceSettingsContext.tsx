import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VoiceSettings, VoicePersonality } from '@/types/voice';
import { voiceService } from '@/services/voice/VoiceService';

type VoiceSettingsContextType = {
  settings: VoiceSettings;
  setSettings: (settings: VoiceSettings) => void;
  voice: string;
  setVoice: (voice: string) => void;
  personality: VoicePersonality;
  setPersonality: (personality: VoicePersonality) => void;
};

const defaultSettings: VoiceSettings = {
  voice: 'neural-en-US-Jenny',
  personality: 'sassy',
  rate: 1.0,
  volume: 1.0,
  enabled: true
};

const VoiceSettingsContext = createContext<VoiceSettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  voice: defaultSettings.voice,
  setVoice: () => {},
  personality: defaultSettings.personality,
  setPersonality: () => {}
});

export const VoiceSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem('deepcal-voice-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings) as VoiceSettings;
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved voice settings:', e);
      }
    }
    return defaultSettings;
  });

  // Update the voice service when settings change
  useEffect(() => {
    // Update voice service with current settings
    voiceService.setConfig({
      defaultPersonality: settings.personality,
      fallbackToLocal: true,
      volume: settings.volume,
      rate: settings.rate
    });
    
    // Save settings to localStorage
    localStorage.setItem('deepcal-voice-settings', JSON.stringify(settings));
    localStorage.setItem('deepcal-voice-personality', settings.personality);
    localStorage.setItem('deepcal-use-elevenlabs', settings.enabled.toString());
  }, [settings]);

  const value = {
    settings,
    setSettings,
    voice: settings.voice,
    setVoice: (voice: string) => setSettings({...settings, voice}),
    personality: settings.personality,
    setPersonality: (personality: VoicePersonality) => 
      setSettings({...settings, personality})
  };

  return (
    <VoiceSettingsContext.Provider value={value}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};

export const useVoiceSettings = () => useContext(VoiceSettingsContext);
