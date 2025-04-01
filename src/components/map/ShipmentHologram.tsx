
import React, { useState } from 'react';
import { Activity, Shield, Zap, MapPin, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Route } from '@/types/deeptrack';
import { GlassContainer, GlassIconContainer } from '@/components/ui/glass-effects';

interface ShipmentHologramProps {
  shipments: Route[];
  onSelect: (shipment: Route, index: number) => void;
  className?: string;
}

// Randomly generate a risk score between 1-10
const generateRiskScore = (): number => {
  return Math.floor(Math.random() * 10) + 1;
};

// Get color based on delivery status
const getStatusColor = (status: string): string => {
  switch(status) {
    case 'Delivered':
      return 'text-green-400';
    case 'In Transit':
      return 'text-amber-400';
    default:
      return 'text-red-400';
  }
};

const ShipmentHologram: React.FC<ShipmentHologramProps> = ({ 
  shipments, 
  onSelect,
  className 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div className={cn(
      "system-status-card",
      className
    )}>
      {/* Holographic header */}
      <div className="system-status-header flex justify-between items-center">
        <div className="flex items-center">
          <Activity className="mr-2 h-5 w-5 text-blue-400" />
          <span>Recent Shipments</span>
        </div>
        <div className="text-xs text-blue-400/80">
          {shipments.length} shipments
        </div>
      </div>
      
      {/* Shipment list - now fixed to maximum 3 */}
      <div className="p-3 space-y-2">
        {shipments.map((shipment, index) => {
          const isHovered = hoveredIndex === index;
          const riskScore = generateRiskScore();
          const statusColor = getStatusColor(shipment.deliveryStatus || 'Delivered');
          
          return (
            <GlassContainer
              key={index}
              variant={isHovered ? 'blue' : 'default'}
              className={cn(
                "p-3 rounded-md cursor-pointer",
                isHovered && "border-blue-500/30"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSelect(shipment, index)}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-medium text-sm flex items-center">
                    <Package className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                    {`Shipment #${1000 + index}`}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {`${shipment.origin.name} → ${shipment.destination.name}`}
                  </span>
                </div>
                <span className={cn("text-xs font-medium flex items-center", statusColor)}>
                  {shipment.deliveryStatus || 'Delivered'}
                </span>
              </div>
              
              {/* Additional details that appear on hover */}
              <div className={cn(
                "mt-2 pt-2 border-t border-blue-500/10 grid grid-cols-2 gap-x-2 gap-y-1 text-xs",
                isHovered ? "opacity-100" : "opacity-60"
              )}>
                <div className="flex items-center">
                  <Shield className="h-3 w-3 mr-1 text-green-400" />
                  <span className="text-gray-400">Resilience:</span>
                  <span className="ml-1 text-green-400">{Math.floor(Math.random() * 30) + 70}%</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-3 w-3 mr-1 text-yellow-400" />
                  <span className="text-gray-400">Risk:</span>
                  <span className={`ml-1 ${riskScore > 7 ? 'text-red-400' : riskScore > 4 ? 'text-amber-400' : 'text-green-400'}`}>
                    {riskScore}/10
                  </span>
                </div>
                <div className="col-span-2 text-right mt-1">
                  <button 
                    className="text-blue-400 hover:text-blue-300 transition-colors text-xs underline-offset-2 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(shipment, index);
                    }}
                  >
                    Jump to location
                  </button>
                </div>
              </div>
            </GlassContainer>
          );
        })}
      </div>
    </div>
  );
};

export default ShipmentHologram;
