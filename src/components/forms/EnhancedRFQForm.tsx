
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Check, FileDown, Loader2, Users, Building, Mail, Phone, Clock, Truck, CalendarDays, FileText } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { GlassContainer } from '@/components/ui/glass-effects';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';

interface ForwarderOption {
  id: string;
  name: string;
  reliability: number;
}

interface EnhancedRFQFormProps {
  availableForwarders: ForwarderOption[];
}

const EnhancedRFQForm: React.FC<EnhancedRFQFormProps> = ({
  availableForwarders
}) => {
  const [selectedForwarders, setSelectedForwarders] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default: 7 days from now
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      companyName: "Nairobi Hub",
      requesterName: "Jane Doe",
      email: "jane.doe@nairobihub.com",
      phone: "+254 712 345 678",
      returnDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      origin: "Nairobi, Kenya",
      destination: "Mombasa, Kenya",
      weight: "500",
      volume: "10",
      category: "Medical Supplies",
      description: "",
      goals: "",
      background: ""
    }
  });

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
      toast({
        title: "Form Error",
        description: "Please select at least one forwarder and set a deadline",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "RFQ Created",
        description: `Your RFQ has been sent to ${selectedForwarders.length} forwarders`,
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RFQ:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your RFQ.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <GlassContainer className="max-w-4xl mx-auto p-8 mt-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-[#00FFD1]">RFQ Successfully Created</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your request for quotation has been sent to {selectedForwarders.length} forwarders.
            You will be notified when they respond.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Button variant="outline" className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10">
              <FileDown className="mr-2 h-4 w-4" />
              Download RFQ
            </Button>
            <Button 
              variant="outline" 
              className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
              onClick={() => setSubmitted(false)}
            >
              Create Another RFQ
            </Button>
          </div>
        </div>
      </GlassContainer>
    );
  }

  return (
    <GlassContainer className="max-w-4xl mx-auto p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#00FFD1]">NAIROBI HUB</h2>
          <p className="text-sm text-gray-400">Request for Quotation</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">RFQ #: NBO-{format(new Date(), 'yyyyMMdd')}-01</div>
          <div className="text-sm text-gray-400">Date: {format(new Date(), 'MMM dd, yyyy')}</div>
        </div>
      </div>
      
      <div className="border-b border-[#00FFD1]/20 mb-6 pb-2">
        <p className="text-xs text-gray-400 italic">
          This form is designed to obtain competitive quotes from vendors for project goods and services.
          The form is important to assist vendor hub in making necessary decisions regarding contractors.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Requester Section */}
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
                  defaultValue={form.getValues().companyName}
                />
              </div>
              <div>
                <Label htmlFor="requesterName">NAME</Label>
                <Input 
                  id="requesterName" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  defaultValue={form.getValues().requesterName}
                />
              </div>
              <div>
                <Label htmlFor="email">EMAIL</Label>
                <Input 
                  id="email" 
                  type="email"
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  defaultValue={form.getValues().email}
                />
              </div>
              <div>
                <Label htmlFor="phone">PHONE</Label>
                <Input 
                  id="phone" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  defaultValue={form.getValues().phone}
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          {/* To Vendor Section */}
          <div>
            <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              TO
            </h3>
            <div className="grid gap-4">
              <div>
                <Label>SELECT VENDORS</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {availableForwarders.map(forwarder => (
                    <div 
                      key={forwarder.id}
                      className={cn(
                        "border rounded-lg p-3 cursor-pointer transition-colors",
                        selectedForwarders.includes(forwarder.id)
                          ? "border-[#00FFD1] bg-[#00FFD1]/5"
                          : "border-[#00FFD1]/20 hover:bg-[#00FFD1]/5"
                      )}
                      onClick={() => handleForwarderToggle(forwarder.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{forwarder.name}</span>
                        {selectedForwarders.includes(forwarder.id) && (
                          <Check className="h-4 w-4 text-[#00FFD1]" />
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Reliability: {(forwarder.reliability * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
                {selectedForwarders.length === 0 && (
                  <p className="text-sm text-red-400 mt-2">
                    Please select at least one vendor
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 italic mt-3">
              Vendors interested in bidding on this project are expected to review component's needs identified below and
              provide a proposal to the requestor. All questions shall be directed to the contact provided above.
            </p>
          </div>
          
          {/* Shipment Details */}
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
                  defaultValue={form.getValues().origin}
                />
              </div>
              <div>
                <Label htmlFor="destination">DESTINATION</Label>
                <Input 
                  id="destination" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  defaultValue={form.getValues().destination}
                />
              </div>
              <div>
                <Label htmlFor="weight">WEIGHT (KG)</Label>
                <Input 
                  id="weight" 
                  type="number"
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  defaultValue={form.getValues().weight}
                />
              </div>
              <div>
                <Label htmlFor="volume">VOLUME (CBM)</Label>
                <Input 
                  id="volume" 
                  type="number"
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  defaultValue={form.getValues().volume}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="category">CATEGORY</Label>
                <Input 
                  id="category" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  defaultValue={form.getValues().category}
                />
              </div>
            </div>
          </div>
          
          {/* Project Description & Requirements */}
          <div>
            <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              PROJECT INFORMATION
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">PROJECT DESCRIPTION</Label>
                <p className="text-xs text-gray-400 italic mb-1">
                  Please provide as much information as possible for the vendor's review.
                </p>
                <Textarea 
                  id="description" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="goals">PROJECT GOALS AND OBJECTIVES</Label>
                <Textarea 
                  id="goals" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="background">PROJECT BACKGROUND</Label>
                <Textarea 
                  id="background" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          {/* Services Requested */}
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
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          initialFocus
                          disabled={(date) => date < new Date()}
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
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          initialFocus
                          disabled={(date) => date < new Date()}
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
          
          {/* Submission Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-black font-medium"
              disabled={isSubmitting || selectedForwarders.length === 0 || !deadline}
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
          
          <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-[#00FFD1]/20">
            <strong>DISCLAIMER:</strong> Any details, templates, or information provided by this system are for reference only. 
            While we strive to keep the information up to date and correct, we make no representations or warranties of any kind 
            about the completeness, accuracy, reliability, suitability or availability with respect to the information provided.
          </div>
        </div>
      </form>
    </GlassContainer>
  );
};

export default EnhancedRFQForm;
