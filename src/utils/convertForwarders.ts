import type { ForwarderPerformance, Shipment } from '@/types/deeptrack';

export function convertForwarders(forwarders: ForwarderPerformance[]): Shipment[] {
  return forwarders.map(f => ({
    ...f,
    customs_clearance_time_days: 0,
    freight_carrier_cost: 0,
    // Map all required Shipment properties
    freight_carrier: f.name,
    forwarder_quotes: {},
    // Other defaults
  }));
}
