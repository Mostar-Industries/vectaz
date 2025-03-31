
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Atom, Database, Zap, Server, Cpu } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing DeepCAL Core');
  const [showLogo, setShowLogo] = useState(false);
  
  // Array of loading messages to cycle through
  const loadingMessages = [
    'Initializing DeepCAL Core',
    'Establishing Quantum Network',
    'Calibrating Decision Engine',
    'Loading AHP Matrix',
    'Optimizing N-TOPSIS Algorithms',
    'Aligning Neutrosophic Vectors',
    'Syncing Base Dataset',
    'Preparing Runtime Environment'
  ];
  
  // Simulate the loading process
  useEffect(() => {
    // Show logo with a slight delay for dramatic effect
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 400);
    
    // Progress animation
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Update loading message based on progress
        if (prevProgress % 12 === 0) {
          const msgIndex = Math.floor(prevProgress / 12) % loadingMessages.length;
          setLoadingText(loadingMessages[msgIndex]);
        }
        return prevProgress + 1;
      });
    }, 50);
    
    // Clean up
    return () => {
      clearInterval(timer);
      clearTimeout(logoTimer);
    };
  }, []);
  
  // Floating icons that animate around the screen
  const renderFloatingIcons = () => {
    const icons = [
      { icon: <Atom size={20} className="text-blue-400" />, delay: "0s" },
      { icon: <Database size={20} className="text-blue-300" />, delay: "1.5s" },
      { icon: <Zap size={20} className="text-yellow-400" />, delay: "1s" },
      { icon: <Cpu size={20} className="text-blue-500" />, delay: "0.5s" },
      { icon: <Server size={20} className="text-blue-200" />, delay: "2s" }
    ];
    
    return icons.map((item, index) => (
      <div 
        key={index}
        className="absolute animate-float opacity-70"
        style={{
          top: `${20 + Math.random() * 60}%`,
          left: `${10 + Math.random() * 80}%`,
          animationDelay: item.delay,
          animationDuration: `${5 + Math.random() * 5}s`
        }}
      >
        {item.icon}
      </div>
    ));
  };
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-blue-950 flex flex-col items-center justify-center z-50">
      {/* Floating elements in background */}
      {renderFloatingIcons()}
      
      {/* Overlay effect */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      
      <div className="max-w-md w-full z-10 px-6">
        {/* Logo with reveal animation */}
        <div className="flex justify-center mb-8">
          <div className={cn(
            "transition-all duration-1000 transform", 
            showLogo ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}>
            <img 
              src="/lovable-uploads/dc85e902-d0de-4838-890f-9287ff1d1ec6.png" 
              alt="DeepCAL Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>
        
        {/* System name */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
          DeepCAL
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-sm text-blue-200/80 font-mono uppercase tracking-wider">
            Cargo Augmented Logistics
          </p>
          <p className="text-xs text-blue-200/60 mt-1 font-mono">
            PRIME ORIGIN PROTOCOL
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-4">
          <Progress 
            value={progress} 
            className="h-1.5 bg-blue-950/50" 
          />
          
          {/* Loading message */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
              <p className="text-sm text-blue-200/80 font-mono">
                {loadingText}
              </p>
            </div>
            <p className="text-xs text-blue-200/60 font-mono">{progress}%</p>
          </div>
        </div>
        
        {/* Loading UI elements */}
        <div className="mt-10 space-y-3">
          <Skeleton className="h-3 w-full bg-blue-900/30" />
          <div className="flex space-x-2">
            <Skeleton className="h-3 w-2/3 bg-blue-900/30" />
            <Skeleton className="h-3 w-1/3 bg-blue-900/30" />
          </div>
          <Skeleton className="h-3 w-5/6 bg-blue-900/30" />
        </div>
      </div>
      
      {/* Footer text */}
      <div className="absolute bottom-4 text-xs text-center text-blue-200/40 font-mono">
        <p>MOSTAR INDUSTRIES</p>
        <p className="mt-1 text-[10px]">© DEEPCAL ROUTEVERSE {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
