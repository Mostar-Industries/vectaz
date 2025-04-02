
import React from 'react';
import { Ship } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapControlsProps {
  is3DMode: boolean;
  toggle3DMode: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ is3DMode, toggle3DMode }) => {
  return (
    <button
      onClick={toggle3DMode}
      className="absolute bottom-24 right-4 glass-panel p-2 flex items-center space-x-2 text-xs text-[#00FFD1] hover:bg-[#00FFD1]/10 transition-colors"
    >
      <Ship size={16} className="text-[#00FFD1]" />
      <span>{is3DMode ? "2D View" : "3D View"}</span>
    </button>
  );
};

export default MapControls;
