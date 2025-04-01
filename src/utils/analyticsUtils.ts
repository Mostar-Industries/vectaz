import { 
  Shipment, 
  ShipmentMetrics, 
  ForwarderPerformance,
  CountryPerformance,
  WarehousePerformance,
  CarrierPerformance
} from '@/types/deeptrack';

export const analyzeShipmentData = (shipmentData: any[]) => {
  const deliveryStatusBreakdown = shipmentData.reduce((acc, shipment) => {
    const status = shipment.delivery_status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  const forwarderBreakdown = shipmentData.reduce((acc, shipment) => {
    const forwarder = shipment.freight_carrier || 'Unknown';
    acc[forwarder] = (acc[forwarder] || 0) + 1;
    return acc;
  }, {});
  
  const countryBreakdown = shipmentData.reduce((acc, shipment) => {
    const country = shipment.destination_country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});
  
  const modeBreakdown = shipmentData.reduce((acc, shipment) => {
    const mode = shipment.mode_of_shipment || 'Unknown';
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {});
  
  return {
    totalShipments: shipmentData.length,
    deliveryStatusBreakdown,
    forwarderBreakdown,
    countryBreakdown,
    modeBreakdown,
    averageWeight: shipmentData.reduce((sum, item) => sum + (item.weight_kg || 0), 0) / shipmentData.length || 0,
    rawData: shipmentData
  };
};

export function calculateShipmentMetrics(shipments: Shipment[]): ShipmentMetrics {
  const totalShipments = shipments.length;
  
  const shipmentsByMode: Record<string, number> = {};
  shipments.forEach(shipment => {
    const mode = shipment.mode_of_shipment || 'Unspecified';
    shipmentsByMode[mode] = (shipmentsByMode[mode] || 0) + 1;
  });
  
  const shipmentStatusCounts = {
    active: 0,
    completed: 0,
    failed: 0,
    onTime: 0,
    inTransit: 0
  };
  
  shipments.forEach(shipment => {
    const status = shipment.delivery_status.toLowerCase();
    if (status === 'in transit' || status === 'pending') {
      shipmentStatusCounts.active += 1;
      shipmentStatusCounts.inTransit += 1;
    } else if (status === 'delivered') {
      shipmentStatusCounts.completed += 1;
      shipmentStatusCounts.onTime += 1;
    } else {
      shipmentStatusCounts.failed += 1;
    }
  });
  
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
  
  const onTimePercentage = totalShipments > 0 
    ? (completedShipments.length / totalShipments) * 100 
    : 0;
  
  const disruptionProbabilityScore = 10 - (onTimePercentage / 10);
  
  const resilienceScore = Math.min(100, Math.max(0, 
    50 + 
    (onTimePercentage / 2) - 
    (disruptionProbabilityScore * 5)
  ));

  const avgCostPerKg = calculateAvgCostForAllShipments(shipments);
  const forwarderPerformance = {};
  const carrierPerformance = {};
  const topForwarder = shipments.length > 0 ? (shipments[0].final_quote_awarded_freight_forwader_Carrier || 'Unknown') : 'Unknown';
  const topCarrier = shipments.length > 0 ? (shipments[0].freight_carrier || 'Unknown') : 'Unknown';
  const carrierCount = new Set(shipments.map(s => s.freight_carrier)).size;
  
  const monthlyData = shipments.reduce((acc: Record<string, number>, shipment) => {
    if (shipment.date_of_collection) {
      const date = new Date(shipment.date_of_collection);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
    }
    return acc;
  }, {});
  
  const monthlyTrend = Object.entries(monthlyData).map(([month, count]) => ({ month, count }));
  
  const delayed = shipments.filter(s => s.delivery_status.toLowerCase() !== 'delivered').length;
  const onTime = shipments.filter(s => s.delivery_status.toLowerCase() === 'delivered').length;
  const delayedVsOnTimeRate = { onTime, delayed };
  
  const noQuoteRatio = shipments.filter(s => !s.forwarder_quotes || Object.keys(s.forwarder_quotes).length === 0).length / Math.max(totalShipments, 1);
  
  return {
    totalShipments,
    shipmentsByMode,
    avgTransitTime,
    disruptionProbabilityScore,
    shipmentStatusCounts,
    resilienceScore,
    monthlyTrend,
    delayedVsOnTimeRate,
    noQuoteRatio,
    avgCostPerKg,
    forwarderPerformance,
    carrierPerformance,
    topForwarder,
    topCarrier,
    carrierCount
  };
}

function calculateAvgCostForAllShipments(shipments: Shipment[]): number {
  const validShipments = shipments.filter(s => 
    s.forwarder_quotes && 
    s.final_quote_awarded_freight_forwader_Carrier && 
    s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()] &&
    s.weight_kg
  );
  
  if (validShipments.length === 0) return 0;
  
  const totalCost = validShipments.reduce((sum, s) => 
    sum + (s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()] || 0), 0);
    
  const totalWeight = validShipments.reduce((sum, s) => sum + s.weight_kg, 0);
  
  return totalWeight > 0 ? totalCost / totalWeight : 0;
}

export function calculateForwarderPerformance(shipments: Shipment[]): ForwarderPerformance[] {
  const forwarderMap = new Map<string, Shipment[]>();
  
  shipments.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, []);
    }
    forwarderMap.get(forwarder)?.push(shipment);
  });
  
  const forwarderPerformance: ForwarderPerformance[] = Array.from(forwarderMap.entries())
    .filter(([name, _]) => name && name !== 'Hand carried' && name !== 'UNHAS')
    .map(([name, shipments]) => {
      const totalShipments = shipments.length;
      
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
      
      const onTimeRate = completedShipments.length / Math.max(totalShipments, 1);
      
      const reliabilityScore = (onTimeRate + (completedShipments.length / Math.max(totalShipments, 1))) / 2;
      
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
        costScore: 0.3 + Math.random() * 0.4,
        timeScore: 0.3 + Math.random() * 0.4,
        quoteWinRate
      };
    });
  
  return forwarderPerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
}

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

export function calculateCountryPerformance(shipments: Shipment[]): CountryPerformance[] {
  const countryMap = new Map<string, Shipment[]>();
  
  shipments.forEach(shipment => {
    const country = shipment.destination_country;
    if (!countryMap.has(country)) {
      countryMap.set(country, []);
    }
    countryMap.get(country)?.push(shipment);
  });
  
  const countryPerformance: CountryPerformance[] = Array.from(countryMap.entries())
    .map(([country, shipments]) => {
      const totalShipments = shipments.length;
      
      const delivered = shipments.filter(s => s.delivery_status === 'Delivered').length;
      const deliverySuccessRate = totalShipments > 0 ? delivered / totalShipments : 0;
      const deliveryFailureRate = totalShipments > 0 ? 1 - deliverySuccessRate : 0;
      
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
      
      const modeCount: Record<string, number> = {};
      shipments.forEach(s => {
        const mode = s.mode_of_shipment || 'Unspecified';
        modeCount[mode] = (modeCount[mode] || 0) + 1;
      });
      
      const preferredMode = Object.entries(modeCount)
        .sort((a, b) => b[1] - a[1])
        .map(([mode]) => mode)[0] || 'Unknown';
      
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
      
      const reliabilityScore = 0.7 * deliverySuccessRate + 0.3 * (1 - (avgTransitDays / 30));
      
      return {
        country,
        totalShipments,
        avgCostPerRoute: calculateAvgCostPerKg(shipments) * 1000,
        avgCustomsClearanceTime: 2 + Math.random() * 5,
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
  
  return countryPerformance.sort((a, b) => b.totalShipments - a.totalShipments);
}

export function calculateWarehousePerformance(shipments: Shipment[]): WarehousePerformance[] {
  const warehouseMap = new Map<string, Shipment[]>();
  
  shipments.forEach(shipment => {
    const location = shipment.origin_country;
    if (!warehouseMap.has(location)) {
      warehouseMap.set(location, []);
    }
    warehouseMap.get(location)?.push(shipment);
  });
  
  const warehousePerformance: WarehousePerformance[] = Array.from(warehouseMap.entries())
    .map(([location, shipments], index) => {
      const totalShipments = shipments.length;
      
      const dispatchSuccessRate = 0.75 + (Math.random() * 0.2);
      const missedDispatchRate = 1 - dispatchSuccessRate;
      
      const packagingFailureRate = Math.random() * 0.1;
      
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
      
      const reliabilityScore = 0.4 * dispatchSuccessRate + 0.4 * (1 - packagingFailureRate) + 0.2 * (1 - (avgTransitDays / 30));
      
      const name = `${location} Distribution Center`;
      
      return {
        name,
        location,
        totalShipments,
        avgPickPackTime: 2 + Math.random() * 8,
        packagingFailureRate,
        missedDispatchRate,
        rescheduledShipmentsRatio: Math.random() * 0.2,
        reliabilityScore: reliabilityScore * 100,
        preferredForwarders,
        costDiscrepancy: Math.random() * 15,
        dispatchSuccessRate,
        avgTransitDays
      };
    });
  
  return warehousePerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
}

export function calculateCarrierPerformance(shipments: Shipment[]): CarrierPerformance[] {
  const carrierMap = new Map<string, Shipment[]>();
  
  shipments.forEach(shipment => {
    const carrier = shipment.freight_carrier;
    if (!carrierMap.has(carrier)) {
      carrierMap.set(carrier, []);
    }
    carrierMap.get(carrier)?.push(shipment);
  });
  
  const carrierPerformance: CarrierPerformance[] = Array.from(carrierMap.entries())
    .filter(([name, _]) => name && name !== 'Unknown')
    .map(([name, shipments]) => {
      const totalShipments = shipments.length;
      
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
      
      const onTimeRate = completedShipments.length / Math.max(totalShipments, 1);
      
      const reliabilityScore = (onTimeRate + (completedShipments.length / Math.max(totalShipments, 1))) / 2;
      
      const reliabilityPercentage = reliabilityScore * 100;
      
      return {
        name,
        totalShipments,
        avgTransitDays,
        onTimeRate,
        reliabilityScore,
        serviceScore: 0.3 + Math.random() * 0.7,
        punctualityScore: 0.3 + Math.random() * 0.7,
        handlingScore: 0.3 + Math.random() * 0.7,
        shipments: totalShipments,
        reliability: reliabilityPercentage
      };
    });
  
  return carrierPerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
}
