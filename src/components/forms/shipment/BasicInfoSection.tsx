
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PackagePlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';

interface BasicInfoSectionProps {
  defaultValues?: {
    requestor?: string;
    email?: string;
    department?: string;
    priority?: string;
  };
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ defaultValues = {} }) => {
  const randomId = Math.floor(Math.random() * 1000);
  const shipmentRef = `SR_${format(new Date(), 'yyyyMMdd')}-${randomId}`;

  return (
    <div>
      <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
        <PackagePlus className="h-5 w-5 mr-2" />
        BASIC INFORMATION
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="reference">SHIPMENT REFERENCE</Label>
          <Input 
            id="reference" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={shipmentRef}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="requestor">REQUESTOR NAME</Label>
          <Input 
            id="requestor" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            placeholder="Enter requestor name"
            defaultValue={defaultValues.requestor}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">EMAIL</Label>
          <Input 
            id="email" 
            type="email"
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            placeholder="Enter email address"
            defaultValue={defaultValues.email}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">DEPARTMENT</Label>
          <Input 
            id="department" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            placeholder="Enter department"
            defaultValue={defaultValues.department}
            required
          />
        </div>
        <div>
          <Label htmlFor="priority">PRIORITY</Label>
          <Select defaultValue={defaultValues.priority || "normal"}>
            <SelectTrigger className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
