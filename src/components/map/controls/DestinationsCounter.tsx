
import React from 'react';
import { MapPin } from 'lucide-react';
import BaseControl from './BaseControl';
import { cn } from '@/lib/utils';

interface DestinationsCounterProps {
  count: number;
  className?: string;
}

const DestinationsCounter: React.FC<DestinationsCounterProps> = ({ 
  count,
  className 
}) => {
  return (
    <BaseControl position="top-left" className={cn("p-2 text-xs", className)}>
      <div className="text-[#00FFD1] font-semibold flex items-center">
        <MapPin size={14} className="mr-1" />
        {count} Destination Countries
      </div>
    </BaseControl>
  );
};

// Memoize the component to prevent unnecessary rerenders
export default React.memo(DestinationsCounter);
