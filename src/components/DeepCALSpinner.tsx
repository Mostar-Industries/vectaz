
import React from 'react';
import { Loader2 } from 'lucide-react';

const DeepCALSpinner: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
      </div>
      <Loader2 className="h-12 w-12 text-blue-400 animate-pulse" />
    </div>
  );
};

export default DeepCALSpinner;
