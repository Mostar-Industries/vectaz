
import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ValidationState } from '@/types/deeptrack';

interface DataValidationBannerProps {
  validationState: ValidationState;
  onRefresh?: () => void;
}

const DataValidationBanner: React.FC<DataValidationBannerProps> = ({ 
  validationState, 
  onRefresh 
}) => {
  if (!validationState.isDataLoaded) {
    return (
      <div className="w-full bg-red-600 text-white py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Base data not loaded – system locked.</span>
        </div>
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        )}
      </div>
    );
  }

  if (!validationState.isDataValidated) {
    return (
      <div className="w-full bg-amber-600 text-white py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Base data integrity check failed. Please re-sync or fix dataset.</span>
        </div>
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
          >
            <RefreshCw className="h-3 w-3" /> Reload
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-green-600 text-white py-1 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">Data validated: {validationState.dataSource} @ {new Date(validationState.lastValidated).toLocaleString()}</span>
      </div>
      <span className="text-xs opacity-80">All visualizations traceable to source data</span>
    </div>
  );
};

export default DataValidationBanner;
