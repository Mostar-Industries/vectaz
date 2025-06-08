
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AppTabs from "@/components/AppTabs";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route"
    );
  }, []);


  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      <div className="absolute inset-0 bg-[#0A1A2F] z-0"></div>
      <div className="tech-grid absolute inset-0 z-0"></div>
      <div className="network-lines absolute inset-0 z-0"></div>
      
      {/* App name in top right */}
      <div className="app-logo absolute top-4 right-4 bg-[#0A1A2F]/80 backdrop-blur-md py-2 px-4 rounded-lg shadow-md z-10 border border-[#00FFD1]/30 shadow-[0_0_15px_rgba(0,255,209,0.2)]">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FFD1] to-blue-300">DeepCAL</h1>
      </div>
      
      {/* Top Navigation */}
      <AppTabs />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-screen">
        <div className="text-[#00FFD1] text-8xl font-bold mb-4">404</div>
        <div className="text-xl mb-6 text-white">This page is more missing than SR_24-029. Try again?</div>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#00FFD1]/20 border border-[#00FFD1]/50 rounded-lg text-[#00FFD1] hover:bg-[#00FFD1]/30 transition-colors"
        >
          Back to Known Territory
        </button>
      </div>
    </div>
  );
};

export default NotFound;
