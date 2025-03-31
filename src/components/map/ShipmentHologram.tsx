
import React, { useState, useEffect } from 'react';
import { Motion, Shield, Zap, MapPin, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Route } from '@/types/deeptrack';

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
      return 'text-green-500';
    case 'In Transit':
      return 'text-amber-500';
    default:
      return 'text-red-500';
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
      "cyber-panel rounded-lg p-4 backdrop-blur-md border border-mostar-light-blue/30 cyber-terminal relative max-h-[500px] overflow-auto",
      className
    )}>
      {/* Holographic header */}
      <div className="flex justify-between items-center mb-4 border-b border-mostar-light-blue/20 pb-2">
        <h3 className="text-lg font-semibold text-cyber-blue flex items-center">
          <Motion className="mr-2 h-5 w-5 text-mostar-light-blue" />
          Active Shipments
        </h3>
        <div className="text-xs text-mostar-light-blue/70">
          {shipments.length} shipments
        </div>
      </div>
      
      {/* Shipment list */}
      <div className="space-y-2">
        {shipments.map((shipment, index) => {
          const isHovered = hoveredIndex === index;
          const riskScore = generateRiskScore();
          const statusColor = getStatusColor(shipment.deliveryStatus);
          
          return (
            <div 
              key={index}
              className={cn(
                "glassmorphism-card p-3 rounded-md cursor-pointer transition-all duration-300 border border-mostar-light-blue/10 hover:border-mostar-light-blue/30",
                isHovered && "shadow-neon-blue border-mostar-light-blue/40"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSelect(shipment, index)}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-medium text-sm flex items-center">
                    <Package className="h-3.5 w-3.5 mr-1.5 text-mostar-light-blue" />
                    {`Shipment #${1000 + index}`}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {`${shipment.origin.name} → ${shipment.destination.name}`}
                  </span>
                </div>
                <span className={cn("text-xs font-medium flex items-center", statusColor)}>
                  {shipment.deliveryStatus}
                </span>
              </div>
              
              {/* Additional details that appear on hover */}
              <div className={cn(
                "mt-2 pt-2 border-t border-mostar-light-blue/10 grid grid-cols-2 gap-x-2 gap-y-1 text-xs transition-opacity",
                isHovered ? "opacity-100" : "opacity-50"
              )}>
                <div className="flex items-center">
                  <Shield className="h-3 w-3 mr-1 text-mostar-green" />
                  <span className="text-muted-foreground">Resilience:</span>
                  <span className="ml-1 text-mostar-green">{Math.floor(Math.random() * 30) + 70}%</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-3 w-3 mr-1 text-mostar-yellow" />
                  <span className="text-muted-foreground">Risk:</span>
                  <span className={`ml-1 ${riskScore > 7 ? 'text-red-500' : riskScore > 4 ? 'text-amber-500' : 'text-mostar-green'}`}>
                    {riskScore}/10
                  </span>
                </div>
                <div className="col-span-2 text-right mt-1">
                  <button 
                    className="text-mostar-light-blue hover:text-mostar-cyan transition-colors text-xs underline-offset-2 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(shipment, index);
                    }}
                  >
                    Jump to location
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipmentHologram;
