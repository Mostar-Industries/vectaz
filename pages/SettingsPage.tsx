import React from "react";
import { GlassContainer } from '@/components/ui/glass-effects';
import AnimatedBackground from '@/components/home/AnimatedBackground';
import IconNavigation from '@/components/IconNavigation';

const SettingsPage: React.FC = () => {
  return (
    <div className="h-screen w-full overflow-x-hidden relative bg-[#0A1A2F]">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-[#0A1A2F] z-0" />
      <div className="relative z-10 w-full pt-16 px-4">
        <div className="max-w-2xl mx-auto">
          <GlassContainer className="mb-6 p-4">
            <h1 className="text-2xl font-bold text-center text-[#00FFD1]">Settings</h1>
            <p className="text-sm text-center text-gray-400 mt-2">
              Manage your preferences, notifications, and app integrations
            </p>
          </GlassContainer>
          {/* Add actual settings controls here */}
          <div className="bg-[#131C2B] rounded-lg p-6 border border-[#00FFD1]/10 shadow-md">
            <p className="text-[#00FFD1] text-lg mb-2">Ultra Futuristic Settings Panel</p>
            <p className="text-gray-400">Coming soon: profile, theme, and advanced system controls.</p>
          </div>
        </div>
      </div>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <IconNavigation />
      </div>
    </div>
  );
};

export default SettingsPage;
