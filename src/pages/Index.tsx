
import React, { useState } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { AppSection } from '@/types/deeptrack';
import AppTabs from '@/components/AppTabs';
import EntryAnimation from '@/components/EntryAnimation';
import { AnimatePresence } from 'framer-motion';

// Import the newly created components
import AnimatedBackground from '@/components/home/AnimatedBackground';
import AppLogo from '@/components/home/AppLogo';
import ContentRouter from '@/components/home/ContentRouter';
import KonamiCodeEasterEgg from '@/components/home/KonamiCodeEasterEgg';
import NotificationHandler from '@/components/home/NotificationHandler';
import useRouteProcessor from '@/hooks/useRouteProcessor';

const Index = () => {
  const { isDataLoaded } = useBaseDataStore();
  const [showEntry, setShowEntry] = useState(true);
  const [activeTab, setActiveTab] = useState<AppSection>('map');
  const { routes } = useRouteProcessor();

  const handleEntryComplete = () => {
    setShowEntry(false);
  };

  // Handle 404 (Using our extracted KonamiCodeEasterEgg component)
  const render404 = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0A1A2F] text-white">
      <div className="text-[#00FFD1] text-8xl font-bold mb-4">404</div>
      <div className="text-xl mb-6">This page is more missing than SR_24-029. Try again?</div>
      <img src="/lovable-uploads/lost-parcel.gif" alt="Lost Parcel" className="w-80 h-80 object-contain mb-8" />
      <button 
        onClick={() => setActiveTab('map')}
        className="px-6 py-3 bg-[#00FFD1]/20 border border-[#00FFD1]/50 rounded-lg text-[#00FFD1] hover:bg-[#00FFD1]/30 transition-colors"
      >
        Back to Known Territory
      </button>
    </div>
  );

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
        <AppTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Non-visual components */}
      <KonamiCodeEasterEgg />
      <NotificationHandler isDataLoaded={isDataLoaded} />
    </div>
  );
};

export default Index;
