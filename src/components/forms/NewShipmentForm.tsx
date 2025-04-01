
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, FileDown, Loader2, PackagePlus, MapPin, Clock, FileText, AlertCircle, Truck, ArrowRight, Weight, DollarSign } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { GlassContainer } from '@/components/ui/glass-effects';

interface NewShipmentFormProps {
  onSuccess?: () => void;
}

const NewShipmentForm: React.FC<NewShipmentFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [collectionDate, setCollectionDate] = useState<Date | undefined>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!collectionDate || !deliveryDate) {
      toast({
        title: "Form Error",
        description: "Please select collection and delivery dates",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Shipment Created",
        description: "Your new shipment has been created successfully",
      });
      
      setSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error creating your shipment.",
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
          <h3 className="mt-4 text-xl font-medium text-[#00FFD1]">Shipment Successfully Created</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your new shipment has been registered in the system.
            You can track its progress in the Map view.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Button variant="outline" className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10">
              <FileDown className="mr-2 h-4 w-4" />
              Download Shipment Details
            </Button>
            <Button 
              variant="outline" 
              className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
              onClick={() => setSubmitted(false)}
            >
              Create Another Shipment
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
          <h2 className="text-2xl font-bold text-[#00FFD1]">NEW SHIPMENT</h2>
          <p className="text-sm text-gray-400">Create a new shipment in the system</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Ref #: SR_{format(new Date(), 'yyyyMMdd')}-{Math.floor(Math.random() * 1000)}</div>
          <div className="text-sm text-gray-400">Created: {format(new Date(), 'MMM dd, yyyy')}</div>
        </div>
      </div>
      
      <div className="border-b border-[#00FFD1]/20 mb-6 pb-2">
        <p className="text-xs text-gray-400 italic">
          Complete this form to register a new shipment in the DeepCAL system. All shipments are automatically
          analyzed for optimal routing and carrier selection.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Basic Info Section */}
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
                  defaultValue={`SR_${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000)}`}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="requestor">REQUESTOR NAME</Label>
                <Input 
                  id="requestor" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  placeholder="Enter requestor name"
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">DEPARTMENT</Label>
                <Input 
                  id="department" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  placeholder="Enter department"
                  required
                />
              </div>
              <div>
                <Label htmlFor="priority">PRIORITY</Label>
                <Select defaultValue="normal">
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
          
          {/* Origin & Destination */}
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
                  <Select defaultValue="Kenya">
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
                    defaultValue="Nairobi"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originAddress">ADDRESS</Label>
                  <Textarea 
                    id="originAddress" 
                    className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                    placeholder="Enter complete address"
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
                  <Select defaultValue="Tanzania">
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
                    defaultValue="Dar es Salaam"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destinationAddress">ADDRESS</Label>
                  <Textarea 
                    id="destinationAddress" 
                    className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                    placeholder="Enter complete address"
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Timing */}
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={collectionDate}
                      onSelect={setCollectionDate}
                      initialFocus
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={setDeliveryDate}
                      initialFocus
                      disabled={(date) => date < (collectionDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          {/* Cargo Details */}
          <div>
            <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              CARGO DETAILS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cargoCategory">CATEGORY</Label>
                <Select defaultValue="medical">
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
                  defaultValue="500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="volume">VOLUME (CBM)</Label>
                <Input 
                  id="volume" 
                  type="number"
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  defaultValue="10"
                  required
                />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="cargoDescription">CARGO DESCRIPTION</Label>
                <Textarea 
                  id="cargoDescription" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  placeholder="Provide detailed description of the cargo"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Shipping Mode */}
          <div>
            <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
              <Weight className="h-5 w-5 mr-2" />
              SHIPPING MODE & PREFERENCES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shippingMode">PREFERRED MODE</Label>
                <Select defaultValue="air">
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
                <Select defaultValue="included">
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
                <Select defaultValue="required">
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
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="specialInstructions">SPECIAL REQUIREMENTS</Label>
                <Textarea 
                  id="specialInstructions" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  placeholder="Enter any special handling instructions, temperature requirements, etc."
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              ADDITIONAL INFORMATION
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start space-x-2 p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-md">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-500 font-medium">Important Note</p>
                  <p className="text-xs text-gray-400">
                    DeepCAL will analyze your shipment details and provide recommendations for the most optimal carriers and routes.
                    You can view these recommendations in the DeepCAL analytics section after submission.
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="additionalComments">ADDITIONAL COMMENTS</Label>
                <Textarea 
                  id="additionalComments" 
                  className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
                  placeholder="Enter any additional information relevant to this shipment"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          {/* Submission Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-black font-medium px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Create Shipment"
              )}
            </Button>
          </div>
        </div>
      </form>
    </GlassContainer>
  );
};

export default NewShipmentForm;
