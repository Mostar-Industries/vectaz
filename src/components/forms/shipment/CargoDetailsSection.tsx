
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CargoDetailsSectionProps {
  weight: number;
  volume: number;
  onWeightChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
}

const CargoDetailsSection: React.FC<CargoDetailsSectionProps> = ({
  weight,
  volume,
  onWeightChange,
  onVolumeChange
}) => {
  return (
    <div>
      <h4 className="font-medium text-sm text-muted-foreground mb-4">CARGO DETAILS</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input 
            id="weight" 
            type="number" 
            min={0}
            value={weight}
            onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div>
          <Label htmlFor="volume">Volume (cbm)</Label>
          <Input 
            id="volume" 
            type="number" 
            min={0}
            step={0.1}
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default CargoDetailsSection;
