
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";

// Create a client
const queryClient = new QueryClient();

// Setup App with React Query for data fetching and caching
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial system loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Show loading screen for 5 seconds

    return () => clearTimeout(timer);
  }, []);

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
