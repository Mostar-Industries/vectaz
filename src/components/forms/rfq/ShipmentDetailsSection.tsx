
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Truck } from 'lucide-react';

interface ShipmentDetailsSectionProps {
  defaultValues: {
    origin: string;
    destination: string;
    weight: string;
    volume: string;
    category: string;
  };
}

const ShipmentDetailsSection: React.FC<ShipmentDetailsSectionProps> = ({
  defaultValues
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
        <Truck className="h-5 w-5 mr-2" />
        SHIPMENT DETAILS
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="origin">ORIGIN</Label>
          <Input 
            id="origin" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.origin}
          />
        </div>
        <div>
          <Label htmlFor="destination">DESTINATION</Label>
          <Input 
            id="destination" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.destination}
          />
        </div>
        <div>
          <Label htmlFor="weight">WEIGHT (KG)</Label>
          <Input 
            id="weight" 
            type="number"
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.weight}
          />
        </div>
        <div>
          <Label htmlFor="volume">VOLUME (CBM)</Label>
          <Input 
            id="volume" 
            type="number"
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.volume}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="category">CATEGORY</Label>
          <Input 
            id="category" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.category}
          />
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsSection;
