
import React from 'react';
import { MapPin } from 'lucide-react';

interface DestinationsCounterProps {
  count: number;
}

const DestinationsCounter: React.FC<DestinationsCounterProps> = ({ count }) => {
  return (
    <div className="absolute top-4 left-4 glass-panel p-2 text-xs">
      <div className="text-[#00FFD1] font-semibold flex items-center">
        <MapPin size={14} className="mr-1" />
        {count} Destination Countries
      </div>
    </div>
  );
};

export default DestinationsCounter;
