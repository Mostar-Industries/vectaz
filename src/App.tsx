
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FormsPage from "./pages/FormsPage";
import LoadingScreen from "./components/LoadingScreen";
import { isSystemBooted, bootApp } from "./init/boot";
import { useBaseDataStore } from "@/store/baseState";
import { Shipment } from "./types/deeptrack";
import { ThemeProvider } from "./ThemeProvider";
import FloatingDeepTalk from "./components/FloatingDeepTalk";

// Create a client
const queryClient = new QueryClient();

// Setup App with React Query for data fetching and caching
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setShipmentData } = useBaseDataStore();

  useEffect(() => {
    // Load sample data faster for demonstration
    const initializeApp = async () => {
      console.log("Initializing application...");
      
      // Check if the system is already booted from a previous session
      if (isSystemBooted()) {
        console.log("System already booted, proceeding to application");
        setIsLoading(false);
        return;
      }

      // Generate 105 sample shipments for accurate data representation
      const sampleData: Shipment[] = Array(105).fill(0).map((_, i) => ({
        request_reference: `SR_24-${i.toString().padStart(3, '0')}_NBO`,
        origin_country: ['Kenya', 'South Africa', 'Ethiopia', 'Nigeria', 'Egypt'][i % 5],
        origin_latitude: 1.2404475 + (i * 0.01),
        origin_longitude: 36.990054 + (i * 0.01),
        destination_country: ['Zimbabwe', 'Tanzania', 'Uganda', 'Sudan', 'Rwanda'][i % 5],
        destination_latitude: -17.80269125 + (i * 0.01),
        destination_longitude: 31.08848075 + (i * 0.01),
        weight_kg: 100 + i * 10,
        delivery_status: i % 10 === 0 ? 'Pending' : i % 5 === 0 ? 'In Transit' : 'Delivered',
        freight_carrier: ['Kenya Airways', 'DHL', 'Kuehne Nagel', 'FedEx', 'UPS'][i % 5],
        date_of_collection: `2024-${(Math.floor(i/30) + 1).toString().padStart(2, '0')}-${(i % 30 + 1).toString().padStart(2, '0')}`,
        date_of_arrival_destination: i % 10 === 0 ? null : `2024-${(Math.floor(i/30) + 1).toString().padStart(2, '0')}-${((i % 30) + 5).toString().padStart(2, '0')}`,
        cargo_description: ["Agricultural supplies", "Medical equipment", "Construction materials", "Food supplies", "Electronic devices"][i % 5],
        item_category: ["Supplies", "Equipment", "Materials", "Food", "Electronics"][i % 5],
        volume_cbm: 2.5 + i * 0.15,
        initial_quote_awarded: ['Kenya Airways', 'DHL', 'Kuehne Nagel', 'FedEx', 'UPS'][i % 5],
        final_quote_awarded_freight_forwader_Carrier: ['Kenya Airways', 'DHL', 'Kuehne Nagel', 'FedEx', 'UPS'][i % 5],
        comments: "No issues reported",
        mode_of_shipment: i % 3 === 0 ? "Air" : i % 3 === 1 ? "Sea" : "Road",
        forwarder_quotes: { 
          'kenya airways': 2500 + i * 50, 
          'dhl': 2700 + i * 45, 
          'kuehne nagel': 2600 + i * 55,
          'fedex': 2800 + i * 40,
          'ups': 2550 + i * 52
        }
      }));
      
      try {
        // Boot the application
        await bootApp();
        console.log("Boot completed successfully");
        
        // Store the data in the global state
        setShipmentData(sampleData, 'internal', 'v1.0', 'sample-hash');
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
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {/* Router for navigation */}
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/forms" element={<FormsPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Floating DeepTalk appears on every page */}
                <FloatingDeepTalk />
              </BrowserRouter>
          
              {/* UI Components for notifications */}
              <Toaster />
              <Sonner />
            </>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
