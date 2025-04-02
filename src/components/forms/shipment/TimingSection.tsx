
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimingSectionProps {
  collectionDate: Date | undefined;
  deliveryDate: Date | undefined;
  onCollectionDateChange: (date: Date | undefined) => void;
  onDeliveryDateChange: (date: Date | undefined) => void;
}

const TimingSection: React.FC<TimingSectionProps> = ({
  collectionDate,
  deliveryDate,
  onCollectionDateChange,
  onDeliveryDateChange
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        TIMING
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>COLLECTION DATE</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#00FFD1]" />
                {collectionDate ? format(collectionDate, 'PPP') : <span>Select collection date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={collectionDate}
                onSelect={onCollectionDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>EXPECTED DELIVERY DATE</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#00FFD1]" />
                {deliveryDate ? format(deliveryDate, 'PPP') : <span>Select delivery date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={deliveryDate}
                onSelect={onDeliveryDateChange}
                initialFocus
                disabled={(date) => date < (collectionDate || new Date())}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default TimingSection;
