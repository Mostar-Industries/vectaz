
import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-3 backdrop-blur-sm bg-blue-950/30 p-3 rounded-lg border border-blue-500/20">
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="h-3 w-full bg-blue-900/30 rounded"
      />
      <div className="flex space-x-2">
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="h-3 w-2/3 bg-blue-900/30 rounded"
        />
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="h-3 w-1/3 bg-blue-900/30 rounded"
        />
      </div>
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
        className="h-3 w-5/6 bg-blue-900/30 rounded"
      />
    </div>
  );
};

export default SkeletonLoader;
