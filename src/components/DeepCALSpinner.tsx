
import React from 'react';

const DeepCALSpinner: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <div className="absolute w-16 h-16 border-4 border-t-transparent border-[#00FFD1] rounded-full animate-spin"></div>
      <div className="absolute w-12 h-12 border-4 border-t-transparent border-blue-400 rounded-full animate-spin-reverse"></div>
      <div className="absolute text-xs font-bold text-white">DEEP</div>
    </div>
  );
};

export default DeepCALSpinner;
