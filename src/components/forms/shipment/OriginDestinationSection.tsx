
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OriginDestinationSectionProps {
  defaultValues?: {
    originCountry?: string;
    originCity?: string;
    originAddress?: string;
    destinationCountry?: string;
    destinationCity?: string;
    destinationAddress?: string;
  };
}

const OriginDestinationSection: React.FC<OriginDestinationSectionProps> = ({ defaultValues = {} }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2" />
        ORIGIN & DESTINATION
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 border border-[#00FFD1]/20 rounded-md">
          <h4 className="font-medium text-[#00FFD1]">ORIGIN</h4>
          <div>
            <Label htmlFor="originCountry">COUNTRY</Label>
            <Select defaultValue={defaultValues.originCountry || "Kenya"}>
              <SelectTrigger className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kenya">Kenya</SelectItem>
                <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="Egypt">Egypt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="originCity">CITY</Label>
            <Input 
              id="originCity" 
              className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
              defaultValue={defaultValues.originCity || "Nairobi"}
              required
            />
          </div>
          <div>
            <Label htmlFor="originAddress">ADDRESS</Label>
            <Textarea 
              id="originAddress" 
              className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
              placeholder="Enter complete address"
              defaultValue={defaultValues.originAddress}
              rows={2}
              required
            />
          </div>
        </div>
        
        <div className="space-y-4 p-4 border border-[#00FFD1]/20 rounded-md">
          <h4 className="font-medium text-[#00FFD1] flex items-center justify-between">
            <span>DESTINATION</span>
            <ArrowRight className="h-4 w-4 text-[#00FFD1]" />
          </h4>
          <div>
            <Label htmlFor="destinationCountry">COUNTRY</Label>
            <Select defaultValue={defaultValues.destinationCountry || "Tanzania"}>
              <SelectTrigger className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tanzania">Tanzania</SelectItem>
                <SelectItem value="Uganda">Uganda</SelectItem>
                <SelectItem value="Rwanda">Rwanda</SelectItem>
                <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                <SelectItem value="Sudan">Sudan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="destinationCity">CITY</Label>
            <Input 
              id="destinationCity" 
              className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
              defaultValue={defaultValues.destinationCity || "Dar es Salaam"}
              required
            />
          </div>
          <div>
            <Label htmlFor="destinationAddress">ADDRESS</Label>
            <Textarea 
              id="destinationAddress" 
              className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
              placeholder="Enter complete address"
              defaultValue={defaultValues.destinationAddress}
              rows={2}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OriginDestinationSection;
