
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, FileDown } from 'lucide-react';
import { GlassContainer } from '@/components/ui/glass-effects';

interface SuccessViewProps {
  selectedForwardersCount: number;
  onCreateAnother: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({
  selectedForwardersCount,
  onCreateAnother
}) => {
  return (
    <GlassContainer className="max-w-4xl mx-auto p-8 mt-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="mt-4 text-xl font-medium text-[#00FFD1]">RFQ Successfully Created</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your request for quotation has been sent to {selectedForwardersCount} forwarders.
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
            onClick={onCreateAnother}
          >
            Create Another RFQ
          </Button>
        </div>
      </div>
    </GlassContainer>
  );
};

export default SuccessView;
