import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Analytics from './pages/Analytics'; // Add import
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from './components/ui/toaster';
import DataBootLoader from './components/DataBootLoader';
import LoadingScreen from './components/LoadingScreen';
import { boot, isSystemBooted } from './init/boot';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isBooted, setIsBooted] = useState(false);
  
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        await boot();
        setIsBooted(isSystemBooted());
      } catch (error) {
        console.error("Boot process failed:", error);
        // Handle boot failure appropriately
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, []);
  
  return (
    <ThemeProvider>
      {isLoading && <LoadingScreen />}
      
      {!isLoading && isBooted && (
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} /> {/* Add Analytics route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      )}
      
      {!isLoading && !isBooted && <DataBootLoader />}
    </ThemeProvider>
  );
};

export default App;
