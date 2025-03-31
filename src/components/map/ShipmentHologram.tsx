
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Package, ArrowUpRight, Info, AlertTriangle } from 'lucide-react';
import { useBaseDataStore } from '@/store/baseState';

interface ShipmentHologramProps {
  onJumpToLocation: (lat: number, lng: number, name: string) => void;
}

const ShipmentHologram: React.FC<ShipmentHologramProps> = ({ onJumpToLocation }) => {
  // Use the base data store to access shipment data
  const { shipmentData } = useBaseDataStore();
  const [selectedShipment, setSelectedShipment] = useState<number | null>(null);

  // Filter shipments for active/critical ones
  const activeShipments = shipmentData.filter(s => 
    s.delivery_status === 'In Transit' || s.delivery_status === 'Pending'
  );

  const handleJumpTo = (shipment: any) => {
    if (shipment.destination_latitude && shipment.destination_longitude) {
      onJumpToLocation(
        shipment.destination_latitude,
        shipment.destination_longitude,
        shipment.destination_country
      );
      setSelectedShipment(shipment.id);
    }
  };

  return (
    <div className="absolute top-24 right-4 w-72 max-h-[500px] overflow-hidden rounded-lg backdrop-blur-md bg-black/60 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,149,255,0.15)] tech-glow z-10">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-950/80 to-indigo-900/80 border-b border-cyan-500/20">
        <div className="flex items-center">
          <Package className="h-4 w-4 text-cyan-400 mr-2" />
          <h3 className="text-xs font-semibold text-white">Active Shipments</h3>
        </div>
        <span className="px-1.5 py-0.5 text-[10px] bg-cyan-500/30 text-cyan-300 rounded-sm">
          {activeShipments.length} Active
        </span>
      </div>
      
      <div className="custom-scrollbar overflow-y-auto max-h-[400px] p-2">
        {activeShipments.length > 0 ? (
          <div className="space-y-2">
            {activeShipments.map((shipment) => (
              <div 
                key={shipment.request_reference}
                className={cn(
                  "group relative p-2.5 rounded-md transition-all duration-300",
                  selectedShipment === shipment.id ? 
                    "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30" : 
                    "bg-black/40 hover:bg-black/60 border border-white/5 hover:border-cyan-500/30"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-medium text-white/90 mb-1">
                      {shipment.request_reference}
                    </h4>
                    <div className="flex items-center text-[10px] text-cyan-300/80 mb-1">
                      <span>{shipment.origin_country}</span>
                      <ArrowUpRight className="h-3 w-3 mx-1 text-white/50" />
                      <span>{shipment.destination_country}</span>
                    </div>
                    <div className="flex items-center text-[10px] text-white/60">
                      <span className="mr-2">{shipment.freight_carrier}</span>
                      <span className="flex items-center">
                        {shipment.delivery_status === 'Pending' ? (
                          <AlertTriangle className="h-3 w-3 mr-1 text-amber-400" />
                        ) : (
                          <Info className="h-3 w-3 mr-1 text-cyan-400" />
                        )}
                        {shipment.delivery_status}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleJumpTo(shipment)}
                    className="px-2 py-1 text-[10px] rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                  >
                    Jump To
                  </button>
                </div>
                
                {/* Holographic effect overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-scan"></div>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-white/40">
            <Package className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-xs text-center">No active shipments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentHologram;
