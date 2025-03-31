
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Maximize2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Shipment } from '@/types/deeptrack';
import { useBaseDataStore } from '@/store/baseState';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface ShipmentHologramProps {
  onJumpToLocation: (lat: number, lng: number, name: string) => void;
  className?: string;
}

const ShipmentHologram: React.FC<ShipmentHologramProps> = ({ onJumpToLocation, className }) => {
  const { shipmentData } = useBaseDataStore();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleJumpToShipment = (shipment: Shipment) => {
    onJumpToLocation(
      shipment.destination_latitude,
      shipment.destination_longitude,
      shipment.destination_country
    );
  };

  return (
    <motion.div 
      className={cn(
        "fixed left-4 top-1/4 z-20 w-64 rounded-lg bg-background/40 backdrop-blur-xl border border-blue-500/30 tech-glow overflow-hidden",
        isExpanded ? "max-h-96" : "max-h-12",
        className
      )}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between p-3 cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-center">
          <div className="relative mr-2">
            <Box className="w-5 h-5 text-cyber-blue animate-pulse" />
            <div className="absolute inset-0 w-5 h-5 bg-cyber-blue/20 rounded-sm animate-ping" />
          </div>
          <h3 className="text-sm font-bold text-cyber-blue">Shipment Network</h3>
        </div>
        <Maximize2 className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-3"
          >
            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1 pb-1 custom-scrollbar">
              {shipmentData.map((shipment, index) => (
                <HoverCard key={shipment.request_reference}>
                  <HoverCardTrigger asChild>
                    <motion.div
                      className="p-2 rounded bg-background/60 border border-blue-500/20 hover:border-cyber-blue/50 cursor-pointer group flex items-center"
                      onClick={() => handleJumpToShipment(shipment)}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <Package className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-cyber-blue" />
                      <div className="flex-1">
                        <p className="text-xs font-medium truncate">{shipment.request_reference}</p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {shipment.origin_country} → {shipment.destination_country}
                        </p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ml-1 ${
                        shipment.delivery_status === 'Delivered' 
                          ? 'bg-green-500' 
                          : shipment.delivery_status === 'Pending' 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`} />
                    </motion.div>
                  </HoverCardTrigger>
                  <HoverCardContent side="right" className="w-72 p-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{shipment.request_reference}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          shipment.delivery_status === 'Delivered' 
                            ? 'bg-green-500/20 text-green-400' 
                            : shipment.delivery_status === 'Pending' 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : 'bg-red-500/20 text-red-400'
                        }`}>
                          {shipment.delivery_status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Origin</p>
                          <p>{shipment.origin_country}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Destination</p>
                          <p>{shipment.destination_country}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Weight</p>
                          <p>{shipment.weight_kg} kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Carrier</p>
                          <p>{shipment.freight_carrier}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p>{shipment.date_of_collection}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Mode</p>
                          <p>{shipment.mode_of_shipment}</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJumpToShipment(shipment);
                          }}
                          className="w-full text-xs bg-background/60 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 py-1 rounded-sm transition-colors"
                        >
                          Jump to Location
                        </button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShipmentHologram;
