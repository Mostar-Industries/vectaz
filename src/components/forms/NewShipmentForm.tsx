
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { GlassContainer } from '@/components/ui/glass-effects';

// Import refactored components
import ShipmentHeader from './shipment/ShipmentHeader';
import BasicInfoSection from './shipment/BasicInfoSection';
import OriginDestinationSection from './shipment/OriginDestinationSection';
import TimingSection from './shipment/TimingSection';
import CargoDetailsSection from './shipment/CargoDetailsSection';
import ShippingPreferencesSection from './shipment/ShippingPreferencesSection';
import AdditionalInfoSection from './shipment/AdditionalInfoSection';
import ShipmentSubmitButton from './shipment/ShipmentSubmitButton';
import ShipmentSuccessView from './shipment/ShipmentSuccessView';

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

  const handleCreateAnother = () => {
    setSubmitted(false);
    setCollectionDate(new Date());
    setDeliveryDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  };

  if (submitted) {
    return <ShipmentSuccessView onCreateAnother={handleCreateAnother} />;
  }

  return (
    <GlassContainer className="max-w-4xl mx-auto p-6 mt-8">
      <ShipmentHeader />
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Basic Info Section */}
          <BasicInfoSection />
          
          {/* Origin & Destination */}
          <OriginDestinationSection />
          
          {/* Timing */}
          <TimingSection 
            collectionDate={collectionDate}
            deliveryDate={deliveryDate}
            onCollectionDateChange={setCollectionDate}
            onDeliveryDateChange={setDeliveryDate}
          />
          
          {/* Cargo Details */}
          <CargoDetailsSection />
          
          {/* Shipping Mode */}
          <ShippingPreferencesSection />
          
          {/* Additional Information */}
          <AdditionalInfoSection />
          
          {/* Submission Button */}
          <ShipmentSubmitButton isSubmitting={isSubmitting} />
        </div>
      </form>
    </GlassContainer>
  );
};

export default NewShipmentForm;
