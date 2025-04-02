
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock, CalendarDays } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TimelineServicesSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        TIMELINE & SERVICES
      </h3>
      <div className="space-y-4">
        <div>
          <Label>PROJECT TIMELINE</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="estimatedStart">ESTIMATED START DATE</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  >
                    <CalendarDays className="mr-2 h-4 w-4 text-[#00FFD1]" />
                    <span>Select a start date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="estimatedEnd">ESTIMATED END DATE</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  >
                    <CalendarDays className="mr-2 h-4 w-4 text-[#00FFD1]" />
                    <span>Select an end date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div>
          <Label>SERVICES REQUESTED (check all that apply)</Label>
          <div className="mt-2 border border-[#00FFD1]/20 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
              {[
                "Air Freight", "Sea Freight", "Road Transport", 
                "Customs Clearance", "Warehousing", "Insurance",
                "Temperature Control", "Tracking & Monitoring", "Packaging"
              ].map((service, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 hover:bg-[#00FFD1]/5 rounded">
                  <input 
                    type="checkbox" 
                    id={`service-${index}`}
                    className="h-4 w-4 rounded border-[#00FFD1]/20 text-[#00FFD1] focus:ring-[#00FFD1]/30"
                  />
                  <Label htmlFor={`service-${index}`} className="cursor-pointer text-sm font-normal">
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="additionalComments">ADDITIONAL COMMENTS OR REQUIREMENTS</Label>
          <Textarea 
            id="additionalComments" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            rows={3}
            placeholder="Please include any specific requirements, preferences, or constraints that vendors should be aware of."
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineServicesSection;
