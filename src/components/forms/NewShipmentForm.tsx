
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { GlassContainer } from '@/components/ui/glass-effects';
import { supabase } from '@/integrations/supabase/client';

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
  const [shipmentData, setShipmentData] = useState<any>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    reference: `SHIP-${Date.now().toString().slice(-8)}`,
    description: '',
    category: 'Medical Supplies',
    origin: 'Nairobi, Kenya',
    originCountry: 'Kenya',
    destination: 'Mombasa, Kenya',
    destinationCountry: 'Kenya',
    weight: 500,
    volume: 10,
    mode: 'road',
    priority: 'standard'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
      // Format data for Supabase according to shipment schema
      const shipmentRecord = {
        id: formData.reference,
        origin_country: formData.originCountry,
        destination_country: formData.destinationCountry,
        mode_of_shipment: formData.mode,
        weight_kg: formData.weight,
        volume_cbm: formData.volume,
        item_category: formData.category,
        cargo_description: formData.description,
        date_of_collection: collectionDate.toISOString(),
        date_of_arrival_destination: deliveryDate.toISOString(),
        delivery_status: 'pending',
        priority: formData.priority
      };
      
      // Send to Supabase
      const { data, error } = await supabase
        .from('shipments')
        .insert(shipmentRecord)
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      setShipmentData({
        id: formData.reference,
        reference: formData.reference
      });
      
      toast({
        title: "Shipment Created",
        description: "Your new shipment has been created and saved to the database",
      });
      
      setSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error creating your shipment.",
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
    setFormData({
      ...formData,
      reference: `SHIP-${Date.now().toString().slice(-8)}`
    });
  };

  if (submitted) {
    return <ShipmentSuccessView 
      onCreateAnother={handleCreateAnother} 
      shipmentData={shipmentData}
    />;
  }

  return (
    <GlassContainer className="max-w-4xl mx-auto p-6 mt-8">
      <ShipmentHeader />
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Basic Info Section */}
          <BasicInfoSection 
            reference={formData.reference}
            description={formData.description}
            category={formData.category}
            onDescriptionChange={(value) => handleInputChange('description', value)}
            onCategoryChange={(value) => handleInputChange('category', value)}
          />
          
          {/* Origin & Destination */}
          <OriginDestinationSection 
            origin={formData.origin}
            destination={formData.destination}
            onOriginChange={(value) => {
              handleInputChange('origin', value);
              // Extract country from location string
              const country = value.split(',').pop()?.trim() || 'Unknown';
              handleInputChange('originCountry', country);
            }}
            onDestinationChange={(value) => {
              handleInputChange('destination', value);
              // Extract country from location string
              const country = value.split(',').pop()?.trim() || 'Unknown';
              handleInputChange('destinationCountry', country);
            }}
          />
          
          {/* Timing */}
          <TimingSection 
            collectionDate={collectionDate}
            deliveryDate={deliveryDate}
            onCollectionDateChange={setCollectionDate}
            onDeliveryDateChange={setDeliveryDate}
          />
          
          {/* Cargo Details */}
          <CargoDetailsSection 
            weight={formData.weight}
            volume={formData.volume}
            onWeightChange={(value) => handleInputChange('weight', value)}
            onVolumeChange={(value) => handleInputChange('volume', value)}
          />
          
          {/* Shipping Mode */}
          <ShippingPreferencesSection 
            mode={formData.mode}
            priority={formData.priority}
            onModeChange={(value) => handleInputChange('mode', value)}
            onPriorityChange={(value) => handleInputChange('priority', value)}
          />
          
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
