
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForwarderOption {
  id: string;
  name: string;
  reliability: number;
}

interface ForwarderSelectorProps {
  availableForwarders: ForwarderOption[];
  selectedForwarders: string[];
  onForwarderToggle: (id: string) => void;
}

const ForwarderSelector: React.FC<ForwarderSelectorProps> = ({
  availableForwarders,
  selectedForwarders,
  onForwarderToggle
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        {availableForwarders.map(forwarder => (
          <div 
            key={forwarder.id}
            className={cn(
              "border rounded-lg p-3 cursor-pointer transition-colors",
              selectedForwarders.includes(forwarder.id)
                ? "border-[#00FFD1] bg-[#00FFD1]/5"
                : "border-[#00FFD1]/20 hover:bg-[#00FFD1]/5"
            )}
            onClick={() => onForwarderToggle(forwarder.id)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{forwarder.name}</span>
              {selectedForwarders.includes(forwarder.id) && (
                <Check className="h-4 w-4 text-[#00FFD1]" />
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Reliability: {(forwarder.reliability * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
      {selectedForwarders.length === 0 && (
        <p className="text-sm text-red-400 mt-2">
          Please select at least one vendor
        </p>
      )}
    </div>
  );
};

export default ForwarderSelector;
