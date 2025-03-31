
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import { isSystemBooted, boot } from "./init/boot";
import { useBaseDataStore } from "@/store/baseState";
import { Shipment } from "./types/deeptrack";

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

      // Sample data for faster boot with all required Shipment type fields
      const sampleData: Shipment[] = Array(10).fill(0).map((_, i) => ({
        request_reference: `SR_24-00${i}_NBO`,
        origin_country: 'Kenya',
        origin_latitude: 1.2404475,
        origin_longitude: 36.990054,
        destination_country: 'Zimbabwe',
        destination_latitude: -17.80269125,
        destination_longitude: 31.08848075,
        weight_kg: 100 + i * 50,
        delivery_status: i % 2 === 0 ? 'Delivered' : 'Pending',
        freight_carrier: ['Kenya Airways', 'DHL', 'Kuehne Nagel'][i % 3],
        date_of_collection: "2024-01-11",
        date_of_arrival_destination: "2024-01-17",
        cargo_description: "Agricultural supplies",
        item_category: "Supplies",
        volume_cbm: 2.5 + i * 0.5,
        initial_quote_awarded: ['Kenya Airways', 'DHL', 'Kuehne Nagel'][i % 3], // Changed from boolean to string
        final_quote_awarded_freight_forwader_Carrier: ['Kenya Airways', 'DHL', 'Kuehne Nagel'][i % 3],
        comments: "No issues reported",
        mode_of_shipment: "Air",
        forwarder_quotes: { 'Kenya Airways': 2500, 'DHL': 2700, 'Kuehne Nagel': 2600 }
      }));
      
      // Boot with the sample data
      const success = await boot({
        file: 'internal_data.json',
        requireShape: [
          'request_reference', 'origin_country', 'destination_country', 
          'weight_kg', 'delivery_status'
        ],
        minRows: 1,
        onSuccess: () => {
          console.log("Boot completed successfully");
          // Store the data in the global state
          setShipmentData(sampleData, 'internal', 'v1.0', 'sample-hash');
          setIsLoading(false);
        }
      }, sampleData);
      
      if (!success) {
        console.error("Boot failed, proceeding with limited functionality");
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
          <>
            {/* Router for navigation */}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
        
            {/* UI Components for notifications */}
            <Toaster />
            <Sonner />
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
