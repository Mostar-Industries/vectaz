
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Weight, DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShippingPreferencesSectionProps {
  defaultValues?: {
    shippingMode?: string;
    customsClearance?: string;
    insurance?: string;
    budget?: string;
    specialInstructions?: string;
  };
}

const ShippingPreferencesSection: React.FC<ShippingPreferencesSectionProps> = ({ defaultValues = {} }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
        <Weight className="h-5 w-5 mr-2" />
        SHIPPING MODE & PREFERENCES
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="shippingMode">PREFERRED MODE</Label>
          <Select defaultValue={defaultValues.shippingMode || "air"}>
            <SelectTrigger className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50">
              <SelectValue placeholder="Select shipping mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="air">Air</SelectItem>
              <SelectItem value="sea">Sea</SelectItem>
              <SelectItem value="road">Road</SelectItem>
              <SelectItem value="optimal">Let DeepCAL decide</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="customsClearance">CUSTOMS CLEARANCE</Label>
          <Select defaultValue={defaultValues.customsClearance || "included"}>
            <SelectTrigger className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="included">Include customs clearance</SelectItem>
              <SelectItem value="excluded">Exclude customs clearance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="insurance">INSURANCE</Label>
          <Select defaultValue={defaultValues.insurance || "required"}>
            <SelectTrigger className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="required">Insurance required</SelectItem>
              <SelectItem value="not-required">Insurance not required</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="budget">BUDGET (USD)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="budget" 
              type="number"
              className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50 pl-10"
              placeholder="Enter budget"
              defaultValue={defaultValues.budget}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="specialInstructions">SPECIAL REQUIREMENTS</Label>
          <Textarea 
            id="specialInstructions" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            placeholder="Enter any special handling instructions, temperature requirements, etc."
            defaultValue={defaultValues.specialInstructions}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingPreferencesSection;
