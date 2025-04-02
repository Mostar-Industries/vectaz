
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RequesterSectionProps {
  defaultValues: {
    companyName: string;
    requesterName: string;
    email: string;
    phone: string;
    returnDate: string;
  };
  deadline: Date | undefined;
  onDeadlineChange: (date: Date | undefined) => void;
}

const RequesterSection: React.FC<RequesterSectionProps> = ({
  defaultValues,
  deadline,
  onDeadlineChange
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
        <Users className="h-5 w-5 mr-2" />
        REQUESTOR
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">COMPANY NAME</Label>
          <Input 
            id="companyName" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.companyName}
          />
        </div>
        <div>
          <Label htmlFor="requesterName">NAME</Label>
          <Input 
            id="requesterName" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.requesterName}
          />
        </div>
        <div>
          <Label htmlFor="email">EMAIL</Label>
          <Input 
            id="email" 
            type="email"
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="phone">PHONE</Label>
          <Input 
            id="phone" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            defaultValue={defaultValues.phone}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="returnDate">RETURN COMPLETED QUOTE TO REQUESTER NO LATER THAN</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#00FFD1]" />
                {deadline ? format(deadline, 'PPP') : <span>Select a deadline</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={onDeadlineChange}
                initialFocus
                disabled={(date) => date < new Date()}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default RequesterSection;
