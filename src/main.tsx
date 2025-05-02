import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './ThemeProvider';    
import { VoiceSettingsProvider } from './VoiceSettingsContext';
import React from 'react';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <VoiceSettingsProvider>
        <App />
      </VoiceSettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
