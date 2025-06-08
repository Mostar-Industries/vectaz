import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState as useStateOriginal, useEffect as useEffectOriginal } from "react";
import IndexPage from "./pages/Index"; // Assuming IndexPage is the default export from Index.tsx
import NotFound from "./pages/NotFound";
import FormsPage from "./pages/FormsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DeepCALPage from "./pages/DeepCALPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";
import LoadingScreen from "./components/LoadingScreen";
import { bootApp, isSystemBooted } from "./init/boot";
import { useBaseDataStore } from "./store/baseState";
import FloatingDeepTalk from "./components/FloatingDeepTalk";
import React from "react";
import AppTabs from "@/components/AppTabs";
import { Shipment } from "@/types/deeptrack";
// Create a client
const queryClient = new QueryClient();

// Setup App with React Query for data fetching and caching
function App() {
  const [isLoading, setIsLoading] = useStateOriginal(true);
  const { setShipmentData } = useBaseDataStore();

  useEffectOriginal(() => {
    console.log('[Boot Diagnostics]', {
      storeReady: useBaseDataStore.getState().ready,
      hasShipments: useBaseDataStore.getState().shipments.length > 0
    });

    const initializeApp = async () => {
      console.log("Initializing application...");
      
      // Check if the system is already booted from a previous session
      if (isSystemBooted()) {
        console.log("System already booted, proceeding to application");
        setIsLoading(false);
        return;
      }

      // Generate 105 sample shipments for accurate data representation
      const shipments: Shipment[] = Array(105).fill(0).map((_, i) => {
        const requestRef = `SR_24-${i.toString().padStart(3, '0')}_NBO`;
        return {
        id: requestRef,
        request_reference: requestRef,
        origin_country: ['Kenya'],
        origin_latitude: 1.2404475 + (i * 0.01),
        origin_longitude: 36.990054 + (i * 0.01),
        destination_country: ['Zimbabwe', 'Tanzania', 'Uganda', 'Sudan', 'Rwanda'][i % 5],
        destination_latitude: -17.80269125 + (i * 0.01),
        destination_longitude: 31.08848075 + (i * 0.01),
        date_of_collection: new Date().toISOString().split('T')[0],
        cargo_description: `Cargo ${i}`,
        item_category: ['Emergency Health Kits', 'PPE', 'Biomedical Equipment', 'Field Support Material', 'Cold Chain Equipment','Lab $ Diagnostics','Visibility Materials', 'Vehicles', 'Biomedical Consumables', 'Pharmaceuticals','WASH/IPC Material', 'Reproductive Health kits', 'Other'][i % 13],
        item_quantity: [1, 2, 3, 4, 5][i % 5],
        carrier: ['Kenya_Airways','Freight_In_Time','Scan_Global','Kuehne_Nagel','DHL_Express', ][i % 5],
        "freight_carrier+cost": `${Math.floor(Math.random() * 1000)} USD`,
        kuehne_nagel: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0  ,
        scan_global_logistics: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
        dhl_express: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
        dhl_global: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
        bwosi: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
        agl: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
        siginon: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
        frieght_in_time: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
        weight_kg: Math.floor(Math.random() * 100) + 1,
        volume_cbm: Math.random() * 10,
        initial_quote_awarded: ['DHL', 'FedEx', 'UPS', 'Kuehne+Nagel', 'Maersk'][i % 5],
        final_quote_awarded_freight_forwader_Carrier: ['DHL', 'FedEx', 'UPS', 'Kuehne+Nagel', 'Maersk'][i % 5],
        comments: `Sample shipment ${i}`,
        date_of_arrival_destination: new Date().toISOString(),
        delivery_status: ['delivered', 'in_transit', 'pending'][i % 3],
        mode_of_shipment: ['air', 'sea', 'road'][i % 3],
        forwarder_quotes: {}
      };
    });
      
      try {
        // Boot the application
        await bootApp();
        console.log("Boot completed successfully");
        
        // Store the data in the global state
        setShipmentData( shipments, 'internal', 'v1.0', 'sample-hash');
      } catch (error) {
        console.error("Boot failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initialize immediately and set a fallback timer just in case
    initializeApp();
    
    const fallbackTimer = setTimeout(() => {
      console.log("Fallback timer triggered");
      setIsLoading(false);
    }, 3000); // Show loading screen for max 3 seconds
    
    return () => clearTimeout(fallbackTimer);
  }, [setShipmentData]);


  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <BrowserRouter>
            {/* Global Top Navigation */}
            <AppTabs />
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/forms" element={<FormsPage />} />
              <Route path="/deepcal" element={<DeepCALPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Floating DeepTalk appears on every page */}
            <FloatingDeepTalk />
            {/* UI Components for notifications */}
            <Toaster />
            <Sonner />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
