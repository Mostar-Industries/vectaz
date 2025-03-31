
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, CalendarIcon, Check, FileDown, Loader2 } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ForwarderOption {
  id: string;
  name: string;
  reliability: number;
}

interface RFQBuilderProps {
  shipmentData: {
    id: string;
    reference: string;
    origin: string;
    destination: string;
    weight: number;
    volume: number;
    category: string;
  };
  availableForwarders: ForwarderOption[];
  onSubmit: (data: any) => Promise<void>;
}

const RFQBuilder: React.FC<RFQBuilderProps> = ({
  shipmentData,
  availableForwarders,
  onSubmit
}) => {
  const [selectedForwarders, setSelectedForwarders] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default: 7 days from now
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleForwarderToggle = (id: string) => {
    setSelectedForwarders(current => 
      current.includes(id) 
        ? current.filter(fId => fId !== id)
        : [...current, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedForwarders.length === 0 || !deadline) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        shipmentId: shipmentData.id,
        forwarderIds: selectedForwarders,
        deadline: format(deadline, 'yyyy-MM-dd'),
        weight: shipmentData.weight,
        volume: shipmentData.volume,
        category: shipmentData.category
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RFQ:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium">RFQ Successfully Created</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your request for quotation has been sent to {selectedForwarders.length} forwarders.
            You will be notified when they respond.
          </p>
          <div className="mt-6">
            <Button className="mx-auto" variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Download RFQ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-xl font-medium mb-6">Request for Quotation</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Shipment Details Section */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-4">SHIPMENT DETAILS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Reference</Label>
                <Input value={shipmentData.reference} readOnly />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={shipmentData.category} readOnly />
              </div>
              <div>
                <Label>Origin</Label>
                <Input value={shipmentData.origin} readOnly />
              </div>
              <div>
                <Label>Destination</Label>
                <Input value={shipmentData.destination} readOnly />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input value={shipmentData.weight} readOnly />
              </div>
              <div>
                <Label>Volume (cbm)</Label>
                <Input value={shipmentData.volume} readOnly />
              </div>
            </div>
          </div>
          
          {/* Forwarders Section */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-4">SELECT FORWARDERS</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableForwarders.map(forwarder => (
                <div 
                  key={forwarder.id}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-colors",
                    selectedForwarders.includes(forwarder.id)
                      ? "border-primary bg-primary/5"
                      : "hover:bg-accent"
                  )}
                  onClick={() => handleForwarderToggle(forwarder.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{forwarder.name}</span>
                    {selectedForwarders.includes(forwarder.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Reliability: {(forwarder.reliability * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
            {selectedForwarders.length === 0 && (
              <p className="text-sm text-destructive mt-2">
                Please select at least one forwarder
              </p>
            )}
          </div>
          
          {/* Deadline Section */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-4">QUOTE DEADLINE</h4>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <CalendarComponent
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={selectedForwarders.length === 0 || !deadline || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Generate & Send RFQ"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RFQBuilder;
