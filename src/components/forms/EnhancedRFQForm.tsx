
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/hooks/use-toast";
import { GlassContainer } from '@/components/ui/glass-effects';

// Import our refactored components
import RFQHeader from './rfq/RFQHeader';
import RequesterSection from './rfq/RequesterSection';
import VendorSection from './rfq/VendorSection';
import ShipmentDetailsSection from './rfq/ShipmentDetailsSection';
import ProjectInfoSection from './rfq/ProjectInfoSection';
import TimelineServicesSection from './rfq/TimelineServicesSection';
import RFQFooter from './rfq/RFQFooter';
import SuccessView from './rfq/SuccessView';

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
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
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

  const handleCreateAnother = () => {
    setSubmitted(false);
    setSelectedForwarders([]);
    setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    form.reset();
  };

  if (submitted) {
    return (
      <SuccessView 
        selectedForwardersCount={selectedForwarders.length} 
        onCreateAnother={handleCreateAnother}
      />
    );
  }

  return (
    <GlassContainer className="max-w-4xl mx-auto p-6 mt-8">
      <RFQHeader />
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Requester Section */}
          <RequesterSection 
            defaultValues={form.getValues()} 
            deadline={deadline}
            onDeadlineChange={setDeadline}
          />
          
          {/* To Vendor Section */}
          <VendorSection 
            availableForwarders={availableForwarders}
            selectedForwarders={selectedForwarders}
            onForwarderToggle={handleForwarderToggle}
          />
          
          {/* Shipment Details */}
          <ShipmentDetailsSection defaultValues={form.getValues()} />
          
          {/* Project Description & Requirements */}
          <ProjectInfoSection defaultValues={form.getValues()} />
          
          {/* Services Requested */}
          <TimelineServicesSection />
          
          {/* Submission Button and Footer */}
          <RFQFooter 
            isSubmitting={isSubmitting} 
            isFormValid={selectedForwarders.length > 0 && !!deadline}
          />
        </div>
      </form>
    </GlassContainer>
  );
};

export default EnhancedRFQForm;
