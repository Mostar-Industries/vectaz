import React, { useState, useCallback } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { AppSection } from '@/types/deeptrack';
import AppTabs from '@/components/AppTabs';
import EntryAnimation from '@/components/EntryAnimation';
import { AnimatePresence } from 'framer-motion';

// Import the optimized components
import AnimatedBackground from '@/components/home/AnimatedBackground';
import AppLogo from '@/components/home/AppLogo';
import ContentRouter from '@/components/home/ContentRouter';
import KonamiCodeEasterEgg from '@/components/home/KonamiCodeEasterEgg';
import NotificationHandler from '@/components/home/NotificationHandler';
import useRouteProcessor from '@/hooks/useRouteProcessor';
import IconNavigation from '@/components/IconNavigation';

const Index = () => {
  const { isDataLoaded } = useBaseDataStore();
  const [showEntry, setShowEntry] = useState(true);
  const [activeTab, setActiveTab] = useState<AppSection>('map');
  const { routes } = useRouteProcessor();

  const handleEntryComplete = useCallback(() => {
    setShowEntry(false);
  }, []);

  const handleTabChange = useCallback((tab: AppSection) => {
    setActiveTab(tab);
  }, []);

  if (showEntry) {
    return <EntryAnimation onComplete={handleEntryComplete} />;
  }

  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      {/* Background components */}
      <AnimatedBackground />
      
      {/* Application content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <ContentRouter 
            activeTab={activeTab} 
            routes={routes} 
            isDataLoaded={isDataLoaded} 
          />
        </AnimatePresence>
        
        {/* App name in top right with enhanced styling */}
        <AppLogo />
        
        {/* Navigation tabs (at the top) */}
        <AppTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Non-visual components */}
      <KonamiCodeEasterEgg />
      <NotificationHandler isDataLoaded={isDataLoaded} />
    </div>
  );
};

export default Index;
