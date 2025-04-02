
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface ShipmentSubmitButtonProps {
  isSubmitting: boolean;
}

const ShipmentSubmitButton: React.FC<ShipmentSubmitButtonProps> = ({ isSubmitting }) => {
  return (
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
  );
};

export default ShipmentSubmitButton;
