import React, { useState, useCallback } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import EntryAnimation from '@/components/EntryAnimation';

// Import the optimized components
import AnimatedBackground from '@/components/home/AnimatedBackground';
import AppLogo from '@/components/home/AppLogo';
import MapVisualizer from '@/components/MapVisualizer';
import KonamiCodeEasterEgg from '@/components/home/KonamiCodeEasterEgg';
import NotificationHandler from '@/components/home/NotificationHandler';
import useRouteProcessor from '@/hooks/useRouteProcessor';

const Index = () => {
  const { isDataLoaded } = useBaseDataStore();
  const [showEntry, setShowEntry] = useState(true);
  const { routes } = useRouteProcessor();

  const handleEntryComplete = useCallback(() => {
    setShowEntry(false);
  }, []);


  if (showEntry) {
    return <EntryAnimation onComplete={handleEntryComplete} />;
  }

  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      {/* Background components */}
      <AnimatedBackground />
      {/* AppTabs Top Navigation - now global, not inside page content */}
      {/* Removed from here; will be rendered at App root */}
      {/* Application content */}
      <div className="relative z-10">
        <MapVisualizer routes={routes} isLoading={!isDataLoaded} />
        
        {/* App name in top right with enhanced styling */}
        <AppLogo />
      </div>

      {/* Non-visual components */}
      <KonamiCodeEasterEgg />
      <NotificationHandler isDataLoaded={isDataLoaded} />
    </div>
  );
};

export default Index;
