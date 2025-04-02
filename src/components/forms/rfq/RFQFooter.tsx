
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface RFQFooterProps {
  isSubmitting: boolean;
  isFormValid: boolean;
}

const RFQFooter: React.FC<RFQFooterProps> = ({ isSubmitting, isFormValid }) => {
  return (
    <>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-black font-medium"
          disabled={isSubmitting || !isFormValid}
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
    </>
  );
};

export default RFQFooter;
