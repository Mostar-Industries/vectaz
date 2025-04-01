
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface LoadingStatusPanelProps {
  progress: number;
  currentPhase: number;
  phaseName: string;
  totalPhases: number;
  loadingText: string;
}

const LoadingStatusPanel: React.FC<LoadingStatusPanelProps> = ({
  progress,
  currentPhase,
  phaseName,
  totalPhases,
  loadingText,
}) => {
  return (
    <>
      <div className="mb-2 backdrop-blur-sm bg-blue-950/30 p-3 rounded-lg border border-[#00FFD1]/20">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-semibold text-blue-200">
            Phase {currentPhase + 1}/{totalPhases}: {phaseName}
          </p>
          <p className="text-xs text-blue-200/60 font-mono">{Math.round(progress)}%</p>
        </div>
        
        <Progress 
          value={progress} 
          className="h-2 bg-blue-950/50" 
        />
      </div>
      
      <div className="flex items-center mb-4 backdrop-blur-sm bg-blue-950/30 p-3 rounded-lg border border-blue-500/20">
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0"
        />
        <p className="text-sm text-blue-200/80 font-mono break-words">
          {loadingText}
        </p>
      </div>
    </>
  );
};

export default LoadingStatusPanel;
