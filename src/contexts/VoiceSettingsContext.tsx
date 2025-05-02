import { createContext, useContext, useState } from 'react';

type VoiceSettings = {
  enabled: boolean;
  speed: number;
  pitch: number;
};

type VoiceSettingsContextType = {
  settings: VoiceSettings;
  updateSettings: (newSettings: Partial<VoiceSettings>) => void;
};

const VoiceSettingsContext = createContext<VoiceSettingsContextType>({
  settings: { enabled: true, speed: 1.0, pitch: 1.0 },
  updateSettings: () => {}
});

export const VoiceSettingsProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [settings, setSettings] = useState<VoiceSettings>({ 
    enabled: true, 
    speed: 1.0, 
    pitch: 1.0 
  });

  const updateSettings = (newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <VoiceSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};

export const useVoiceSettings = () => useContext(VoiceSettingsContext);
