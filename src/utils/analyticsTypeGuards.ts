import type { Shipment, ForwarderPerformance } from '@/types/deeptrack';

export function isShipmentArray(data: any[]): data is Shipment[] {
  return data.every(item => 
    'freight_carrier' in item && 
    'forwarder_quotes' in item &&
    'customs_clearance_time_days' in item
  );
}

export function isForwarderPerformanceArray(data: any[]): data is ForwarderPerformance[] {
  return data.every(item =>
    'avgCostPerKg' in item &&
    'reliabilityScore' in item
  );
}
