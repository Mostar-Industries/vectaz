
import React from 'react';
import { Ship, Globe } from 'lucide-react';
import BaseControl from './BaseControl';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MapControlsProps {
  is3DMode: boolean;
  toggle3DMode: () => void;
  className?: string;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  is3DMode, 
  toggle3DMode, 
  className 
}) => {
  return (
    <BaseControl position="bottom-right" className={className}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle 
              pressed={is3DMode}
              onPressedChange={toggle3DMode}
              className="p-2 flex items-center space-x-2 text-xs text-[#00FFD1] hover:bg-[#00FFD1]/10 transition-colors"
            >
              {is3DMode ? (
                <Globe size={16} className="text-[#00FFD1]" />
              ) : (
                <Ship size={16} className="text-[#00FFD1]" />
              )}
              <span>{is3DMode ? "2D View" : "3D View"}</span>
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle between 2D and 3D terrain view</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </BaseControl>
  );
};

// Memoize the component to prevent unnecessary rerenders
export default React.memo(MapControls);
