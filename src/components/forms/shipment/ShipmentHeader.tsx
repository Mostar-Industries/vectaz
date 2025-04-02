
import React from 'react';
import { format } from 'date-fns';

const ShipmentHeader: React.FC = () => {
  const randomId = Math.floor(Math.random() * 1000);
  const shipmentRef = `SR_${format(new Date(), 'yyyyMMdd')}-${randomId}`;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#00FFD1]">NEW SHIPMENT</h2>
          <p className="text-sm text-gray-400">Create a new shipment in the system</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Ref #: {shipmentRef}</div>
          <div className="text-sm text-gray-400">Created: {format(new Date(), 'MMM dd, yyyy')}</div>
        </div>
      </div>
      
      <div className="border-b border-[#00FFD1]/20 mb-6 pb-2">
        <p className="text-xs text-gray-400 italic">
          Complete this form to register a new shipment in the DeepCAL system. All shipments are automatically
          analyzed for optimal routing and carrier selection.
        </p>
      </div>
    </>
  );
};

export default ShipmentHeader;
