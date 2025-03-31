import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Atom, Database, Zap, Server, Cpu, CheckCircle, Shield, RefreshCw } from 'lucide-react';
import { boot } from '@/init/boot';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing DeepCAL Core');
  const [showLogo, setShowLogo] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string[]>([]);
  
  const loadingPhases = [
    {
      name: 'Core Initialization',
      messages: [
        'Initializing DeepCAL Core',
        'Establishing Quantum Network',
        'Calibrating Decision Engine'
      ]
    },
    {
      name: 'Data Verification',
      messages: [
        'Verifying Base Dataset Integrity',
        'Loading AHP Matrix',
        'Optimizing N-TOPSIS Algorithms'
      ]
    },
    {
      name: 'Network Sync',
      messages: [
        'Connecting to Supabase Cloud',
        'Syncing Remote Data Nodes',
        'Aligning Neutrosophic Vectors'
      ]
    },
    {
      name: 'Final Checks',
      messages: [
        'Running Integrity Verification',
        'Preparing Runtime Environment',
        'Finalizing System Boot Sequence'
      ]
    }
  ];
  
  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 600);
    
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        const newPhase = Math.floor(prevProgress / 25);
        if (newPhase !== loadingPhase) {
          setLoadingPhase(newPhase);
          setVerificationStatus(prev => [...prev, `${loadingPhases[Math.min(newPhase - 1, 3)].name} Complete`]);
        }
        
        const phaseProgress = prevProgress % 25;
        if (phaseProgress % 8 === 0) {
          const currentPhase = Math.min(newPhase, loadingPhases.length - 1);
          const msgIndex = Math.floor(phaseProgress / 8) % loadingPhases[currentPhase].messages.length;
          setLoadingText(loadingPhases[currentPhase].messages[msgIndex]);
        }
        
        if (prevProgress === 45) {
          simulateDataIntegrityCheck();
        }
        
        if (prevProgress === 70) {
          simulateSupabaseSync();
        }
        
        return prevProgress + 0.5;
      });
    }, 100);
    
    return () => {
      clearInterval(timer);
      clearTimeout(logoTimer);
    };
  }, [loadingPhase]);
  
  const simulateDataIntegrityCheck = () => {
    setVerificationStatus(prev => [...prev, "Local Data Integrity: Verified"]);
    
    const sampleData = Array(3).fill(0).map((_, i) => ({
      request_reference: `SR_24-00${i}_NBO`,
      origin_country: 'Kenya',
      destination_country: 'Zimbabwe',
      weight_kg: 100,
      delivery_status: 'Pending'
    }));
    
    boot({
      file: 'internal_data.json',
      requireShape: [
        'request_reference', 'origin_country', 'destination_country', 
        'weight_kg', 'delivery_status'
      ],
      minRows: 1
    }, sampleData);
  };
  
  const simulateSupabaseSync = () => {
    setVerificationStatus(prev => [...prev, "Supabase Connection: Established"]);
    setTimeout(() => {
      setVerificationStatus(prev => [...prev, "Remote Data Sync: Complete"]);
    }, 800);
  };
  
  const renderFloatingIcons = () => {
    const icons = [
      { icon: <Atom size={20} className="text-blue-400" />, delay: "0s", duration: "12s" },
      { icon: <Database size={20} className="text-blue-300" />, delay: "1.5s", duration: "15s" },
      { icon: <Zap size={20} className="text-yellow-400" />, delay: "1s", duration: "14s" },
      { icon: <Cpu size={20} className="text-blue-500" />, delay: "0.5s", duration: "13s" },
      { icon: <Server size={20} className="text-blue-200" />, delay: "2s", duration: "16s" },
      { icon: <RefreshCw size={20} className="text-emerald-400" />, delay: "2.5s", duration: "15s" },
      { icon: <Shield size={20} className="text-violet-400" />, delay: "3s", duration: "17s" }
    ];
    
    return icons.map((item, index) => (
      <div 
        key={index}
        className="absolute animate-float opacity-70"
        style={{
          top: `${20 + Math.random() * 60}%`,
          left: `${10 + Math.random() * 80}%`,
          animationDelay: item.delay,
          animationDuration: item.duration
        }}
      >
        {item.icon}
      </div>
    ));
  };
  
  const renderVerificationLogs = () => {
    return verificationStatus.map((status, index) => (
      <div 
        key={index} 
        className={cn(
          "flex items-center text-xs font-mono mb-1 transition-all duration-500",
          "text-blue-200/80 opacity-0 animate-fade-in"
        )}
        style={{ animationDelay: `${index * 0.4}s` }}
      >
        <CheckCircle size={12} className="mr-2 text-emerald-400" />
        {status}
      </div>
    ));
  };
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-blue-950 flex flex-col items-center justify-center z-50">
      {renderFloatingIcons()}
      
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      
      <div className="max-w-md w-full z-10 px-6">
        <div className="flex justify-center mb-8">
          <div className={cn(
            "transition-all duration-1500 transform",
            showLogo ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}>
            <img 
              src="/lovable-uploads/dc85e902-d0de-4838-890f-9287ff1d1ec6.png" 
              alt="DeepCAL Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
          DeepCAL
        </h1>
        
        <div className="text-center mb-6">
          <p className="text-sm text-blue-200/80 font-mono uppercase tracking-wider">
            Cargo Augmented Logistics
          </p>
          <p className="text-xs text-blue-200/60 mt-1 font-mono">
            PRIME ORIGIN PROTOCOL
          </p>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-semibold text-blue-200">
              Phase {loadingPhase + 1}/{loadingPhases.length}: {loadingPhases[loadingPhase].name}
            </p>
            <p className="text-xs text-blue-200/60 font-mono">{progress}%</p>
          </div>
          
          <Progress 
            value={progress} 
            className="h-1.5 bg-blue-950/50" 
          />
        </div>
        
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" 
            style={{ animationDuration: '2s' }}
          />
          <p className="text-sm text-blue-200/80 font-mono">
            {loadingText}
          </p>
        </div>
        
        <div className="bg-blue-950/40 border border-blue-900/50 rounded-md p-3 mb-6 h-24 overflow-hidden">
          <p className="text-xs text-blue-300 font-semibold mb-2 font-mono">System Verification Log:</p>
          <div className="h-full overflow-y-auto scrollbar-hide">
            {renderVerificationLogs()}
          </div>
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-3 w-full bg-blue-900/30" />
          <div className="flex space-x-2">
            <Skeleton className="h-3 w-2/3 bg-blue-900/30" />
            <Skeleton className="h-3 w-1/3 bg-blue-900/30" />
          </div>
          <Skeleton className="h-3 w-5/6 bg-blue-900/30" />
        </div>
      </div>
      
      <div className="absolute bottom-4 text-xs text-center text-blue-200/40 font-mono">
        <p>MOSTAR INDUSTRIES</p>
        <p className="mt-1 text-[10px]">© DEEPCAL ROUTEVERSE {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
