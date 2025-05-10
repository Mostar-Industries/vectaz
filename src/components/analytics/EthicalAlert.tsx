import React from 'react';
import { Shipment } from '@/types/deeptrack';

type Props = {
  shipments: Shipment[];
};

export const EthicalAlert = ({ shipments }: Props) => {
  const anomalies = shipments.filter(s => 
    s.emergency_grade && 
    s.freight_carrier_cost && 
    s.freight_carrier_cost < 1000 // Example threshold
  );

  if (!anomalies.length) return null;

  return (
    <div className="bg-red-900 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">🚨 Ethical Violations Detected</h2>
      <p>{anomalies.length} shipments below acceptable cost thresholds</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        <span className="font-semibold">Reference</span>
        <span className="font-semibold">Cost</span>
        <span className="font-semibold">Weight</span>
        <span className="font-semibold">Cost/kg</span>
        {anomalies.slice(0, 5).map(s => (
          <React.Fragment key={s.request_reference}>
            <span>{s.request_reference}</span>
            <span>${s.freight_carrier_cost?.toLocaleString()}</span>
            <span>{s.weight_kg}kg</span>
            <span>${((Number(s.freight_carrier_cost) || 0) / (Number(s.weight_kg) || 1)).toFixed(2)}/kg</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
