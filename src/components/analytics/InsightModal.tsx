
import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  LightbulbIcon,
  X,
  Podcast,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DeepSightAlert } from '@/store/deepcalEngineStore';
import { useVoiceFunctions } from '@/components/chat/useVoiceFunctions';

interface InsightModalProps {
  insight: DeepSightAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss: () => void;
}

const InsightModal: React.FC<InsightModalProps> = ({
  insight,
  open,
  onOpenChange,
  onDismiss,
}) => {
  const { speakResponse } = useVoiceFunctions();
  
  if (!insight) {
    return null;
  }
  
  const handleSpeak = () => {
    if (insight) {
      speakResponse(insight.message);
    }
  };
  
  const getIcon = () => {
    switch (insight.type) {
      case 'risk':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case 'insight':
      default:
        return <LightbulbIcon className="h-6 w-6 text-cyan-400" />;
    }
  };
  
  const getTitle = () => {
    switch (insight.type) {
      case 'risk':
        return 'Risk Alert';
      case 'warning':
        return 'Warning';
      case 'insight':
      default:
        return 'DeepSight Insight';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            <span>
              {getTitle()}{' '}
              {insight.severity === 'high' && (
                <span className="text-red-500">(High Priority)</span>
              )}
            </span>
          </DialogTitle>
          <DialogDescription>
            {insight.relatedEntity && (
              <span className="text-sm font-medium text-blue-400">
                {insight.relatedEntity}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-foreground">{insight.message}</p>
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSpeak}
            className="flex items-center gap-1"
          >
            <Podcast className="h-4 w-4" />
            <span>Listen</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              <span>Dismiss</span>
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Got it
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InsightModal;
