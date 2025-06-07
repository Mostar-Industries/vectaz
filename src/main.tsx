import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './ThemeProvider';    
import { VoiceSettingsProvider } from './context/VoiceSettingsContext';
import React from 'react';
import TestComp from '@/components/test/TestComp';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <VoiceSettingsProvider>
        <App />
        <TestComp />
      </VoiceSettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
