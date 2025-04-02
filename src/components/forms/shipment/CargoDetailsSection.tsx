
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Truck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CargoDetailsSectionProps {
  defaultValues?: {
    cargoCategory?: string;
    weight?: string;
    volume?: string;
    cargoDescription?: string;
  };
}

const CargoDetailsSection: React.FC<CargoDetailsSectionProps> = ({ defaultValues = {} }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
        <Truck className="h-5 w-5 mr-2" />
        CARGO DETAILS
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="cargoCategory">CATEGORY</Label>
          <Select defaultValue={defaultValues.cargoCategory || "medical"}>
            <SelectTrigger className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medical">Medical Equipment</SelectItem>
              <SelectItem value="food">Food Supplies</SelectItem>
              <SelectItem value="agricultural">Agricultural Supplies</SelectItem>
              <SelectItem value="construction">Construction Materials</SelectItem>
              <SelectItem value="electronics">Electronic Devices</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="weight">WEIGHT (KG)</Label>
          <Input 
            id="weight" 
            type="number"
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.weight || "500"}
            required
          />
        </div>
        <div>
          <Label htmlFor="volume">VOLUME (CBM)</Label>
          <Input 
            id="volume" 
            type="number"
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.volume || "10"}
            required
          />
        </div>
        <div className="md:col-span-3">
          <Label htmlFor="cargoDescription">CARGO DESCRIPTION</Label>
          <Textarea 
            id="cargoDescription" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            placeholder="Provide detailed description of the cargo"
            defaultValue={defaultValues.cargoDescription}
            rows={3}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CargoDetailsSection;
