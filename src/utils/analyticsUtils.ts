import { 
  Shipment, 
  ShipmentMetrics, 
  ForwarderPerformance,
  CountryPerformance,
  WarehousePerformance
} from '@/types/deeptrack';

// Calculate shipment metrics
export function calculateShipmentMetrics(shipments: Shipment[]): Omit<ShipmentMetrics, 'monthlyTrend' | 'delayedVsOnTimeRate' | 'noQuoteRatio'> {
  const totalShipments = shipments.length;
  
  // Calculate shipments by mode
  const shipmentsByMode: Record<string, number> = {};
  shipments.forEach(shipment => {
    const mode = shipment.mode_of_shipment || 'Unspecified';
    shipmentsByMode[mode] = (shipmentsByMode[mode] || 0) + 1;
  });
  
  // Count shipments by status
  const shipmentStatusCounts = {
    active: 0,
    completed: 0,
    failed: 0
  };
  
  shipments.forEach(shipment => {
    const status = shipment.delivery_status.toLowerCase();
    if (status === 'in transit' || status === 'pending') {
      shipmentStatusCounts.active += 1;
    } else if (status === 'delivered') {
      shipmentStatusCounts.completed += 1;
    } else {
      shipmentStatusCounts.failed += 1;
    }
  });
  
  // Calculate average transit time
  const completedShipments = shipments.filter(s => 
    s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
  );
  
  const transitTimes = completedShipments.map(s => {
    const collectionDate = new Date(s.date_of_collection);
    const arrivalDate = new Date(s.date_of_arrival_destination);
    return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
  });
  
  const avgTransitTime = transitTimes.length > 0 
    ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
    : 0;
  
  // Calculate disruption probability score (0-10)
  // This would involve a complex algorithm in a real system
  // For this example, we'll use a simplified calculation
  const onTimePercentage = totalShipments > 0 
    ? (completedShipments.length / totalShipments) * 100 
    : 0;
  
  // Lower on-time percentage = higher disruption probability
  const disruptionProbabilityScore = 10 - (onTimePercentage / 10);
  
  // Calculate resilience score (0-100)
  // This would involve a complex algorithm in a real system
  // For this example, we'll use a simplified calculation
  const resilienceScore = Math.min(100, Math.max(0, 
    50 + 
    (onTimePercentage / 2) - 
    (disruptionProbabilityScore * 5)
  ));
  
  return {
    totalShipments,
    shipmentsByMode,
    avgTransitTime,
    disruptionProbabilityScore,
    shipmentStatusCounts,
    resilienceScore
  };
}

// Calculate forwarder performance
export function calculateForwarderPerformance(shipments: Shipment[]): ForwarderPerformance[] {
  // Group shipments by forwarder
  const forwarderMap = new Map<string, Shipment[]>();
  
  shipments.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, []);
    }
    forwarderMap.get(forwarder)?.push(shipment);
  });
  
  // Calculate performance metrics for each forwarder
  const forwarderPerformance: ForwarderPerformance[] = Array.from(forwarderMap.entries())
    .filter(([name, _]) => name && name !== 'Hand carried' && name !== 'UNHAS') // Filter out non-forwarders
    .map(([name, shipments]) => {
      const totalShipments = shipments.length;
      
      // Calculate average transit days
      const completedShipments = shipments.filter(s => 
        s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
      );
      
      const transitTimes = completedShipments.map(s => {
        const collectionDate = new Date(s.date_of_collection);
        const arrivalDate = new Date(s.date_of_arrival_destination);
        return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
      });
      
      const avgTransitDays = transitTimes.length > 0 
        ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
        : 0;
      
      // Calculate on-time rate (simplified)
      const onTimeRate = completedShipments.length / Math.max(totalShipments, 1);
      
      // Calculate reliability score based on on-time rate and completed ratio
      const reliabilityScore = (onTimeRate + (completedShipments.length / Math.max(totalShipments, 1))) / 2;
      
      // Calculate win rate for quotes
      const totalQuotes = shipments.reduce((count, s) => {
        return count + Object.keys(s.forwarder_quotes || {}).length;
      }, 0);
      
      const quoteWinRate = totalQuotes > 0 ? totalShipments / totalQuotes : 0;
      
      return {
        name,
        totalShipments,
        avgCostPerKg: calculateAvgCostPerKg(shipments),
        avgTransitDays,
        onTimeRate,
        reliabilityScore,
        deepScore: reliabilityScore * 100,
        costScore: 0.3 + Math.random() * 0.4, // Example score (lower is better)
        timeScore: 0.3 + Math.random() * 0.4, // Example score (lower is better)
        quoteWinRate
      };
    });
  
  // Sort by reliability score
  return forwarderPerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
}

// Calculate average cost per kg for a set of shipments
function calculateAvgCostPerKg(shipments: Shipment[]): number {
  const shipmentCosts = shipments.filter(s => 
    s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()]
  ).map(s => ({
    cost: s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()],
    weight: s.weight_kg
  }));
  
  if (shipmentCosts.length === 0) return 0;
  
  const totalCost = shipmentCosts.reduce((sum, item) => sum + item.cost, 0);
  const totalWeight = shipmentCosts.reduce((sum, item) => sum + item.weight, 0);
  
  return totalWeight > 0 ? totalCost / totalWeight : 0;
}

// Calculate country performance metrics
export function calculateCountryPerformance(shipments: Shipment[]): CountryPerformance[] {
  // Group shipments by destination country
  const countryMap = new Map<string, Shipment[]>();
  
  shipments.forEach(shipment => {
    const country = shipment.destination_country;
    if (!countryMap.has(country)) {
      countryMap.set(country, []);
    }
    countryMap.get(country)?.push(shipment);
  });
  
  // Calculate performance metrics for each country
  const countryPerformance: CountryPerformance[] = Array.from(countryMap.entries())
    .map(([country, shipments]) => {
      const totalShipments = shipments.length;
      
      // Calculate delivery success/failure rates
      const delivered = shipments.filter(s => s.delivery_status === 'Delivered').length;
      const deliverySuccessRate = totalShipments > 0 ? delivered / totalShipments : 0;
      const deliveryFailureRate = totalShipments > 0 ? 1 - deliverySuccessRate : 0;
      
      // Calculate average transit days
      const completedShipments = shipments.filter(s => 
        s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
      );
      
      const transitTimes = completedShipments.map(s => {
        const collectionDate = new Date(s.date_of_collection);
        const arrivalDate = new Date(s.date_of_arrival_destination);
        return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
      });
      
      const avgTransitDays = transitTimes.length > 0 
        ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
        : 0;
      
      // Get preferred shipping mode
      const modeCount: Record<string, number> = {};
      shipments.forEach(s => {
        const mode = s.mode_of_shipment || 'Unspecified';
        modeCount[mode] = (modeCount[mode] || 0) + 1;
      });
      
      const preferredMode = Object.entries(modeCount)
        .sort((a, b) => b[1] - a[1])
        .map(([mode]) => mode)[0] || 'Unknown';
      
      // Get top forwarders
      const forwarderCount: Record<string, number> = {};
      shipments.forEach(s => {
        const forwarder = s.final_quote_awarded_freight_forwader_Carrier;
        if (forwarder) {
          forwarderCount[forwarder] = (forwarderCount[forwarder] || 0) + 1;
        }
      });
      
      const topForwarders = Object.entries(forwarderCount)
        .sort((a, b) => b[1] - a[1])
        .map(([forwarder]) => forwarder)
        .slice(0, 3);
      
      // Calculate reliability score
      const reliabilityScore = 0.7 * deliverySuccessRate + 0.3 * (1 - (avgTransitDays / 30));
      
      return {
        country,
        totalShipments,
        avgCostPerRoute: calculateAvgCostPerKg(shipments) * 1000, // Example calculation
        avgCustomsClearanceTime: 2 + Math.random() * 5, // Example data
        deliveryFailureRate,
        borderDelayIncidents: Math.floor(totalShipments * deliveryFailureRate * 0.5),
        resilienceIndex: 40 + Math.random() * 60,
        preferredMode,
        topForwarders,
        reliabilityScore,
        avgTransitDays,
        deliverySuccessRate
      };
    });
  
  // Sort by total shipments
  return countryPerformance.sort((a, b) => b.totalShipments - a.totalShipments);
}

// Calculate warehouse performance metrics
export function calculateWarehousePerformance(shipments: Shipment[]): WarehousePerformance[] {
  // Group shipments by origin country (as proxy for warehouse location)
  const warehouseMap = new Map<string, Shipment[]>();
  
  shipments.forEach(shipment => {
    const location = shipment.origin_country;
    if (!warehouseMap.has(location)) {
      warehouseMap.set(location, []);
    }
    warehouseMap.get(location)?.push(shipment);
  });
  
  // Calculate performance metrics for each warehouse
  const warehousePerformance: WarehousePerformance[] = Array.from(warehouseMap.entries())
    .map(([location, shipments], index) => {
      const totalShipments = shipments.length;
      
      // Calculate dispatch success/failure rates
      const dispatchSuccessRate = 0.75 + (Math.random() * 0.2);
      const missedDispatchRate = 1 - dispatchSuccessRate;
      
      // Simulate packaging failure rate
      const packagingFailureRate = Math.random() * 0.1;
      
      // Calculate average transit days
      const transitTimes = shipments
        .filter(s => s.date_of_collection && s.date_of_arrival_destination)
        .map(s => {
          const collectionDate = new Date(s.date_of_collection);
          const arrivalDate = new Date(s.date_of_arrival_destination);
          return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
        });
      
      const avgTransitDays = transitTimes.length > 0 
        ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
        : 0;
      
      // Get preferred forwarders
      const forwarderCount: Record<string, number> = {};
      shipments.forEach(s => {
        const forwarder = s.final_quote_awarded_freight_forwader_Carrier;
        if (forwarder) {
          forwarderCount[forwarder] = (forwarderCount[forwarder] || 0) + 1;
        }
      });
      
      const preferredForwarders = Object.entries(forwarderCount)
        .sort((a, b) => b[1] - a[1])
        .map(([forwarder]) => forwarder)
        .slice(0, 3);
      
      // Calculate reliability score
      const reliabilityScore = 0.4 * dispatchSuccessRate + 0.4 * (1 - packagingFailureRate) + 0.2 * (1 - (avgTransitDays / 30));
      
      // Generate a warehouse name based on location
      const name = `${location} Distribution Center`;
      
      return {
        name,
        location,
        totalShipments,
        avgPickPackTime: 2 + Math.random() * 8, // Example data in hours
        packagingFailureRate,
        missedDispatchRate,
        rescheduledShipmentsRatio: Math.random() * 0.2,
        reliabilityScore: reliabilityScore * 100,
        preferredForwarders,
        costDiscrepancy: Math.random() * 15, // Example data in percentage
        dispatchSuccessRate,
        avgTransitDays
      };
    });
  
  // Sort by reliability score
  return warehousePerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
}
