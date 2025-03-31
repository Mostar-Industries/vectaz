
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle, Check, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricExplanation {
  title: string;
  description: string;
  calculation: string;
  sampleSize: number;
  dataSource: string;
  filterCriteria?: string;
  insights: string[];
  suggestedActions?: string[];
  confidence: 'high' | 'moderate' | 'low';
  methodology?: string;
  sourceFunction?: string;
}

interface DeepExplainModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricKey?: string;
  explanation?: MetricExplanation;
}

const defaultExplanation: MetricExplanation = {
  title: 'Loading explanation...',
  description: 'Please wait while we analyze this metric.',
  calculation: '',
  sampleSize: 0,
  dataSource: '',
  insights: [],
  confidence: 'moderate'
};

const DeepExplainModal: React.FC<DeepExplainModalProps> = ({ 
  open, 
  onOpenChange,
  metricKey,
  explanation = defaultExplanation 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Info className="h-5 w-5 text-primary" />
            {explanation.title}
          </DialogTitle>
          <DialogDescription>
            {explanation.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Calculation Methodology */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-2">Calculation Methodology</h3>
              <div className="bg-muted p-3 rounded-md text-sm font-mono">
                {explanation.calculation}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Sample size: <span className="font-medium">{explanation.sampleSize} shipments</span></p>
                {explanation.filterCriteria && (
                  <p>Filter criteria: <span className="font-medium">{explanation.filterCriteria}</span></p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-2">Key Insights</h3>
              <ul className="space-y-2">
                {explanation.insights.map((insight, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Suggested Actions */}
          {explanation.suggestedActions && explanation.suggestedActions.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-2">Suggested Actions</h3>
                <ul className="space-y-2">
                  {explanation.suggestedActions.map((action, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Data Provenance */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-2">Data Provenance</h3>
              <div className="space-y-1 text-sm">
                <p>Source: <span className="font-medium">{explanation.dataSource}</span></p>
                {explanation.sourceFunction && (
                  <p>Function: <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{explanation.sourceFunction}</span></p>
                )}
                {explanation.methodology && (
                  <p>Methodology: <span className="font-medium">{explanation.methodology}</span></p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Confidence Level */}
          <Alert variant={explanation.confidence === 'high' ? 'default' : 'destructive'}>
            <div className="flex items-center gap-2">
              {explanation.confidence === 'high' ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <span className="font-medium capitalize">
                {explanation.confidence} Confidence
              </span>
            </div>
            <AlertDescription>
              {explanation.confidence === 'high' 
                ? 'This analysis is based on robust data and validated methodology.'
                : 'This analysis may be affected by data limitations or assumptions.'}
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeepExplainModal;
