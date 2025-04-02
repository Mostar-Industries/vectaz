
import React from 'react';
import { ZoomIn, ZoomOut, Compass } from 'lucide-react';
import BaseControl from './BaseControl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  className
}) => {
  return (
    <BaseControl position="top-right" className={cn("flex flex-col p-1", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onZoomIn}
        className="h-8 w-8 text-[#00FFD1]"
      >
        <ZoomIn size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onZoomOut}
        className="h-8 w-8 text-[#00FFD1] my-1"
      >
        <ZoomOut size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onReset}
        className="h-8 w-8 text-[#00FFD1]"
      >
        <Compass size={16} />
      </Button>
    </BaseControl>
  );
};

// Memoize the component to prevent unnecessary rerenders
export default React.memo(ZoomControls);
