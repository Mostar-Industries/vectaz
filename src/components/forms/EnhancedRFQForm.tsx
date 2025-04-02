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
  // Prefill with selected forwarders for testing
  const [selectedForwarders, setSelectedForwarders] = useState<string[]>(['1', '3', '5']);
  
  // Set deadline to 7 days from now
  const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const [deadline, setDeadline] = useState<Date | undefined>(defaultDeadline);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  // Prefill form with test data
  const form = useForm({
    defaultValues: {
      companyName: "Nairobi Hub",
      requesterName: "Jane Doe",
      email: "jane.doe@nairobihub.com",
      phone: "+254 712 345 678",
      returnDate: defaultDeadline.toISOString().substring(0, 10),
      origin: "Nairobi, Kenya",
      destination: "Mombasa, Kenya",
      weight: "500",
      volume: "10",
      category: "Medical Supplies",
      description: "Urgent medical supplies including PPE, vaccines, and medicine for Mombasa General Hospital",
      goals: "Looking for reliable and cost-effective shipping solution with temperature control capabilities",
      background: "Part of ongoing COVID-19 response program. This shipment requires special handling and temperature control."
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
    setDeadline(defaultDeadline);
    form.reset();
  };

  // Prepare RFQ data for PDF generation and email
  const formValues = form.getValues();
  const rfqData = {
    reference: `RFQ-${Date.now().toString().slice(-6)}`,
    requesterName: formValues.requesterName,
    companyName: formValues.companyName,
    origin: formValues.origin,
    destination: formValues.destination,
    weight: formValues.weight,
    volume: formValues.volume,
    category: formValues.category,
    description: formValues.description,
    deadline: deadline,
    forwarders: selectedForwarders.map(id => {
      const forwarder = availableForwarders.find(f => f.id === id);
      return { id, name: forwarder?.name || id };
    })
  };

  if (submitted) {
    return (
      <SuccessView 
        selectedForwardersCount={selectedForwarders.length} 
        onCreateAnother={handleCreateAnother}
        rfqData={rfqData}
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
