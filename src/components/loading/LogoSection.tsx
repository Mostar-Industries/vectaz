
import React from 'react';
import { motion } from 'framer-motion';
import { Ship } from 'lucide-react';

interface LogoSectionProps {
  showLogo: boolean;
  showTagline: boolean;
}

const LogoSection: React.FC<LogoSectionProps> = ({ showLogo, showTagline }) => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 0.9, 1],
            opacity: [0, 1, 0.8, 1]
          }}
          transition={{ 
            duration: 3,
            times: [0, 0.4, 0.7, 1],
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="relative"
        >
          <Ship size={48} className="text-[#00FFD1]" />
          <motion.div
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-[#00FFD1]/20 blur-md z-[-1]"
          />
        </motion.div>
      </div>
      
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: showLogo ? 1 : 0, scale: showLogo ? 1 : 0.9 }}
          transition={{ duration: 1 }}
        >
          <img 
            src="/lovable-uploads/dc85e902-d0de-4838-890f-9287ff1d1ec6.png" 
            alt="DeepCAL Logo" 
            className="w-32 h-32 object-contain"
          />
        </motion.div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#00FFD1]">
        DeepCAL
      </h1>
      
      <div className="text-center mb-4">
        <p className="text-sm text-blue-200/80 font-mono uppercase tracking-wider">
          Cargo Augmented Logistics
        </p>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showTagline ? 1 : 0, y: showTagline ? 0 : 10 }}
          transition={{ duration: 0.8 }}
          className="italic text-xs text-[#00FFD1] mt-3"
        >
          "Analytics so sharp, they could cut through customs delays."
        </motion.p>
      </div>
    </>
  );
};

export default LogoSection;
