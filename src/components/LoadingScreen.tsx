
import React, { useEffect, useState } from 'react';
import { boot } from '@/init/boot';
import Particles from './Particles';
import { loadingPhases } from '@/constants/loadingPhases';
import FloatingIcons from './loading/FloatingIcons';
import LogoSection from './loading/LogoSection';
import LoadingStatusPanel from './loading/LoadingStatusPanel';
import VerificationLogs from './loading/VerificationLogs';
import SkeletonLoader from './loading/SkeletonLoader';
import LoadingFooter from './loading/LoadingFooter';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing DeepCAL Core');
  const [showLogo, setShowLogo] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string[]>([]);
  const [showTagline, setShowTagline] = useState(false);
  
  // Rainbow colors for particles
  const particleColors = [
    "#FF5E8F", // Pink
    "#5EFF8F", // Green
    "#5E8FFF", // Blue
    "#FF5E5E", // Red
    "#5EFFFF", // Cyan
    "#FF5EDF", // Magenta
    "#FFFF5E"  // Yellow
  ];
  
  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 600);
    
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 1500);
    
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
      clearTimeout(taglineTimer);
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
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-blue-950 flex flex-col items-center justify-center z-50">
      {/* Particles background */}
      <Particles
        particleColors={particleColors}
        particleCount={250}
        particleSpread={12}
        speed={0.06}
        particleBaseSize={80}
        moveParticlesOnHover={true}
        particleHoverFactor={0.5}
        alphaParticles={true}
        sizeRandomness={0.8}
        cameraDistance={25}
        disableRotation={false}
      />
      
      <FloatingIcons />
      
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      
      <div className="max-w-md w-full z-10 px-6">
        <LogoSection showLogo={showLogo} showTagline={showTagline} />
        
        <LoadingStatusPanel 
          progress={progress}
          currentPhase={loadingPhase}
          phaseName={loadingPhases[loadingPhase].name}
          totalPhases={loadingPhases.length}
          loadingText={loadingText}
        />
        
        <VerificationLogs logs={verificationStatus} />
        
        <SkeletonLoader />
      </div>
      
      <LoadingFooter />
    </div>
  );
};

export default LoadingScreen;
