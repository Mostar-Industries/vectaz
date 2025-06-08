import { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { VoiceSettingsProvider } from '@/context/VoiceSettingsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import LoadingScreen from '@/components/LoadingScreen';
import FloatingDeepTalk from '@/components/FloatingDeepTalk';
import AppTabs from '@/components/AppTabs';
import { bootApp, isSystemBooted } from '@/init/boot';
import { useBaseDataStore } from '@/store/baseState';
import { useShipmentStore } from '@/store/shipmentStore';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { setShipmentData } = useBaseDataStore();

  useEffect(() => {
    const initializeApp = async () => {
      if (isSystemBooted()) {
        setIsLoading(false);
        return;
      }
      try {
        await bootApp();
        const loaded = useShipmentStore.getState().shipments;
        if (loaded && loaded.length > 0) {
          setShipmentData(loaded, 'deeptrack_json', 'v1.0', 'deeptrack_3.json');
        }
      } catch (err) {
        console.error('Boot failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [setShipmentData]);

  return (
    <QueryClientProvider client={queryClient}>
      <VoiceSettingsProvider>
        <TooltipProvider>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              <AppTabs />
              <Component {...pageProps} />
              <FloatingDeepTalk />
              <Toaster />
              <Sonner />
            </>
          )}
        </TooltipProvider>
      </VoiceSettingsProvider>
    </QueryClientProvider>
  );
}
