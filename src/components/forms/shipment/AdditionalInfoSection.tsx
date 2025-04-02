
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, AlertCircle } from 'lucide-react';

interface AdditionalInfoSectionProps {
  defaultValues?: {
    additionalComments?: string;
  };
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ defaultValues = {} }) => {
  return (
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
            defaultValue={defaultValues.additionalComments}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoSection;
