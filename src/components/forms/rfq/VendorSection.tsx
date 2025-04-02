
import React from 'react';
import { Building } from 'lucide-react';
import { Label } from "@/components/ui/label";
import ForwarderSelector from './ForwarderSelector';

interface ForwarderOption {
  id: string;
  name: string;
  reliability: number;
}

interface VendorSectionProps {
  availableForwarders: ForwarderOption[];
  selectedForwarders: string[];
  onForwarderToggle: (id: string) => void;
}

const VendorSection: React.FC<VendorSectionProps> = ({
  availableForwarders,
  selectedForwarders,
  onForwarderToggle
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
        <Building className="h-5 w-5 mr-2" />
        TO
      </h3>
      <div className="grid gap-4">
        <div>
          <Label>SELECT VENDORS</Label>
          <ForwarderSelector 
            availableForwarders={availableForwarders}
            selectedForwarders={selectedForwarders}
            onForwarderToggle={onForwarderToggle}
          />
        </div>
      </div>
      <p className="text-xs text-gray-400 italic mt-3">
        Vendors interested in bidding on this project are expected to review component's needs identified below and
        provide a proposal to the requestor. All questions shall be directed to the contact provided above.
      </p>
    </div>
  );
};

export default VendorSection;
