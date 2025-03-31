
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MetricExplanation } from '@/services/deepSightNarrator';
import { FlaskConical, Calculator, Scale, Lightbulb } from 'lucide-react';

interface DeepExplainModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricKey: string;
  explanation?: MetricExplanation;
}

const DeepExplainModal: React.FC<DeepExplainModalProps> = ({
  open,
  onOpenChange,
  metricKey,
  explanation
}) => {
  if (!explanation) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glassmorphism-card border-mostar-light-blue/30 shadow-neon-blue">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center text-cyber-blue">
            <FlaskConical className="h-5 w-5 mr-2 text-mostar-light-blue" />
            {explanation.title}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {explanation.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div>
            <h4 className="text-sm font-medium flex items-center mb-1 text-mostar-light-blue">
              <Calculator className="h-4 w-4 mr-2 text-mostar-light-blue" />
              Calculation Method
            </h4>
            <p className="text-sm text-muted-foreground">{explanation.calculation}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on a sample size of {explanation.sampleSize} shipments
            </p>
          </div>

          <Separator className="bg-mostar-light-blue/10" />

          <div>
            <h4 className="text-sm font-medium flex items-center mb-1 text-mostar-light-blue">
              <Scale className="h-4 w-4 mr-2 text-mostar-light-blue" />
              Methodology
            </h4>
            <p className="text-sm text-muted-foreground">{explanation.methodology}</p>
            <div className="bg-mostar-blue/5 p-2 rounded text-xs mt-2 border border-mostar-light-blue/20">
              <p className="font-medium text-cyber-blue">Neutrosophic AHP-TOPSIS Approach:</p>
              <p className="mt-1">
                This metric is calculated using our Neutrosophic AHP-TOPSIS methodology, which handles 
                uncertainty and incomplete information common in logistics data. This approach produces 
                more reliable and accurate predictions than traditional methods.
              </p>
            </div>
          </div>

          <Separator className="bg-mostar-light-blue/10" />

          <div>
            <h4 className="text-sm font-medium flex items-center mb-1 text-mostar-light-blue">
              <Lightbulb className="h-4 w-4 mr-2 text-mostar-light-blue" />
              Interpretation & Recommendations
            </h4>
            <p className="text-sm text-muted-foreground">{explanation.interpretation}</p>
            
            <div className="mt-3">
              <p className="text-sm font-medium text-mostar-light-blue">Recommended Actions:</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                {explanation.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="cyber-button">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeepExplainModal;
