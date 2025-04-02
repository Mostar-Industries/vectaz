
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OriginDestinationSectionProps {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
}

const OriginDestinationSection: React.FC<OriginDestinationSectionProps> = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange
}) => {
  return (
    <div>
      <h4 className="font-medium text-sm text-muted-foreground mb-4">ORIGIN & DESTINATION</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="origin">Origin</Label>
          <Input 
            id="origin" 
            placeholder="City, Country" 
            value={origin}
            onChange={(e) => onOriginChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">Format: City, Country</p>
        </div>
        
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input 
            id="destination" 
            placeholder="City, Country" 
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">Format: City, Country</p>
        </div>
      </div>
    </div>
  );
};

export default OriginDestinationSection;
