
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './ThemeProvider';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
