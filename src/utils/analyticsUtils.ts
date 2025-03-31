
import { 
  Shipment, 
  ShipmentMetrics, 
  ForwarderPerformance, 
  CountryPerformance,
  WarehousePerformance
} from "@/types/deeptrack";

/**
 * Calculate shipment metrics from raw shipment data
 */
export const calculateShipmentMetrics = (shipmentData: Shipment[]): ShipmentMetrics => {
  // Total shipments
  const totalShipments = shipmentData.length;
  
  // Shipments by mode
  const shipmentsByMode = shipmentData.reduce((acc: Record<string, number>, shipment) => {
    const mode = shipment.mode_of_shipment || 'Unspecified';
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {});
  
  // Monthly shipment trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyData: Record<string, number> = {};
  for (let i = 0; i <= 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = 0;
  }
  
  shipmentData.forEach(shipment => {
    if (!shipment.date_of_collection) return;
    const date = new Date(shipment.date_of_collection);
    if (date < sixMonthsAgo) return;
    
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (monthKey in monthlyData) {
      monthlyData[monthKey]++;
    }
  });
  
  const monthlyTrend = Object.entries(monthlyData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  // Calculate on-time vs delayed shipments
  const completedShipments = shipmentData.filter(s => 
    s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
  );
  
  let onTimeCount = 0;
  let delayedCount = 0;
  
  completedShipments.forEach(shipment => {
    const collectionDate = new Date(shipment.date_of_collection);
    const arrivalDate = new Date(shipment.date_of_arrival_destination);
    const transitDays = (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Assume average transit time is 5 days, and anything 20% longer is "delayed"
    const expectedTransitDays = 5;
    if (transitDays > expectedTransitDays * 1.2) {
      delayedCount++;
    } else {
      onTimeCount++;
    }
  });
  
  // Calculate average transit time
  const transitTimes = completedShipments.map(s => {
    const collectionDate = new Date(s.date_of_collection);
    const arrivalDate = new Date(s.date_of_arrival_destination);
    return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
  });
  
  const avgTransitTime = transitTimes.length > 0 
    ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
    : 0;
  
  // Calculate shipment status counts
  const activeShipments = shipmentData.filter(s => s.delivery_status === 'In Transit').length;
  const completedShipments2 = shipmentData.filter(s => s.delivery_status === 'Delivered').length;
  const failedShipments = shipmentData.filter(s => 
    s.delivery_status === 'Failed' || s.delivery_status === 'Cancelled'
  ).length;
  
  // Calculate "no quote" ratio - shipments with no forwarder quotes
  const shipmentsWithNoQuotes = shipmentData.filter(s => 
    Object.keys(s.forwarder_quotes).length === 0
  ).length;
  
  const noQuoteRatio = totalShipments > 0 ? shipmentsWithNoQuotes / totalShipments : 0;
  
  // Calculate resilience score (simplified for demo)
  // In a real system, this would be a more complex calculation
  const routeSuccessRates: Record<string, {success: number, total: number}> = {};
  
  shipmentData.forEach(shipment => {
    const routeKey = `${shipment.origin_country}-${shipment.destination_country}`;
    if (!routeSuccessRates[routeKey]) {
      routeSuccessRates[routeKey] = { success: 0, total: 0 };
    }
    
    routeSuccessRates[routeKey].total++;
    if (shipment.delivery_status === 'Delivered') {
      routeSuccessRates[routeKey].success++;
    }
  });
  
  // Calculate resilience as weighted average of route success rates
  let totalWeightedSuccessRate = 0;
  let totalRouteWeight = 0;
  
  Object.values(routeSuccessRates).forEach(({ success, total }) => {
    const successRate = total > 0 ? success / total : 0;
    totalWeightedSuccessRate += successRate * total;
    totalRouteWeight += total;
  });
  
  const resilienceScore = totalRouteWeight > 0 
    ? (totalWeightedSuccessRate / totalRouteWeight) * 100 
    : 0;
  
  // Calculate disruption probability score
  // Higher means more likely to face disruptions
  const disruptionProbabilityScore = failedShipments > 0 
    ? (failedShipments / totalShipments) * 10 
    : Math.min(10 - resilienceScore / 10, 8);
  
  return {
    totalShipments,
    shipmentsByMode,
    monthlyTrend,
    delayedVsOnTimeRate: {
      onTime: onTimeCount,
      delayed: delayedCount
    },
    avgTransitTime,
    disruptionProbabilityScore,
    shipmentStatusCounts: {
      active: activeShipments,
      completed: completedShipments2,
      failed: failedShipments
    },
    resilienceScore,
    noQuoteRatio
  };
};

/**
 * Calculate forwarder performance metrics
 */
export const calculateForwarderPerformance = (shipmentData: Shipment[]): ForwarderPerformance[] => {
  // Group shipments by forwarder
  const forwarderMap = new Map<string, Shipment[]>();
  
  shipmentData.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, []);
    }
    forwarderMap.get(forwarder)?.push(shipment);
  });
  
  // Total quotes won per forwarder
  const forwarderQuoteCounts: Record<string, {won: number, total: number}> = {};
  
  shipmentData.forEach(shipment => {
    Object.keys(shipment.forwarder_quotes).forEach(forwarder => {
      if (!forwarderQuoteCounts[forwarder]) {
        forwarderQuoteCounts[forwarder] = { won: 0, total: 0 };
      }
      
      forwarderQuoteCounts[forwarder].total++;
      
      if (shipment.final_quote_awarded_freight_forwader_Carrier.toLowerCase() === forwarder.toLowerCase()) {
        forwarderQuoteCounts[forwarder].won++;
      }
    });
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
      
      // Calculate on-time rate
      const onTimeShipments = transitTimes.filter(days => days <= 5).length;
      const onTimeRate = transitTimes.length > 0 ? onTimeShipments / transitTimes.length : 0;
      
      // Calculate reliability score based on on-time rate and completed ratio
      const reliabilityScore = (onTimeRate + (completedShipments.length / Math.max(totalShipments, 1))) / 2;
      
      // Calculate quote win rate
      const quoteData = forwarderQuoteCounts[name.toLowerCase()] || { won: 0, total: 0 };
      const quoteWinRate = quoteData.total > 0 ? quoteData.won / quoteData.total : 0;
      
      // Calculate deep score (composite ranking)
      // Lower cost, higher reliability, faster transit time = better score
      const costFactor = calculateAvgCostPerKg(shipments);
      const normalizedCost = costFactor > 0 ? 1 - Math.min(costFactor / 100, 0.9) : 0.5;
      const normalizedTime = avgTransitDays > 0 ? 1 - Math.min(avgTransitDays / 14, 0.9) : 0.5;
      
      const deepScore = (
        normalizedCost * 0.4 + 
        reliabilityScore * 0.4 + 
        normalizedTime * 0.2
      ) * 100;
      
      // Calculate replacement frequency (simplified)
      const replacementFrequency = Math.random() * 0.1; // Placeholder for demo
      
      return {
        name,
        totalShipments,
        avgCostPerKg: calculateAvgCostPerKg(shipments),
        avgTransitDays,
        onTimeRate,
        reliabilityScore,
        quoteWinRate,
        deepScore,
        replacementFrequency
      };
    });
  
  // Sort by deep score (highest first)
  return forwarderPerformance.sort((a, b) => (b.deepScore || 0) - (a.deepScore || 0));
};

/**
 * Calculate average cost per kg for a set of shipments
 */
const calculateAvgCostPerKg = (shipments: Shipment[]): number => {
  const shipmentCosts = shipments.filter(s => {
    const forwarder = s.final_quote_awarded_freight_forwader_Carrier.toLowerCase();
    return s.forwarder_quotes[forwarder];
  }).map(s => ({
    cost: s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()],
    weight: s.weight_kg
  }));
  
  if (shipmentCosts.length === 0) return 0;
  
  const totalCost = shipmentCosts.reduce((sum, item) => sum + item.cost, 0);
  const totalWeight = shipmentCosts.reduce((sum, item) => sum + item.weight, 0);
  
  return totalWeight > 0 ? totalCost / totalWeight : 0;
};

/**
 * Calculate country performance metrics
 */
export const calculateCountryPerformance = (shipmentData: Shipment[]): CountryPerformance[] => {
  // Group shipments by destination country
  const countryMap = new Map<string, Shipment[]>();
  
  shipmentData.forEach(shipment => {
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
      
      // Calculate average cost per route
      const avgCostPerRoute = calculateAvgCostPerKg(shipments);
      
      // Calculate average customs clearance time (simplified)
      // In a real system, this would come from actual customs data
      const avgCustomsClearanceTime = 2 + Math.random() * 5; // 2-7 days, random for demo
      
      // Calculate delivery failure rate
      const failedDeliveries = shipments.filter(s => 
        s.delivery_status === 'Failed' || s.delivery_status === 'Cancelled'
      ).length;
      
      const deliveryFailureRate = totalShipments > 0 ? failedDeliveries / totalShipments : 0;
      
      // Calculate border delay incidents (simplified)
      const borderDelayIncidents = Math.floor(totalShipments * (0.05 + Math.random() * 0.2));
      
      // Calculate resilience index
      const successfulDeliveries = shipments.filter(s => s.delivery_status === 'Delivered').length;
      const successRate = totalShipments > 0 ? successfulDeliveries / totalShipments : 0;
      
      const resilienceIndex = (successRate * 0.7 + (1 - deliveryFailureRate) * 0.3) * 100;
      
      // Determine preferred mode
      const modeCounts: Record<string, number> = {};
      shipments.forEach(s => {
        const mode = s.mode_of_shipment || 'Unspecified';
        modeCounts[mode] = (modeCounts[mode] || 0) + 1;
      });
      
      const preferredMode = Object.entries(modeCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([mode]) => mode)[0] || 'Unspecified';
      
      // Determine top forwarders
      const forwarderCounts: Record<string, number> = {};
      shipments.forEach(s => {
        const forwarder = s.final_quote_awarded_freight_forwader_Carrier;
        if (forwarder) {
          forwarderCounts[forwarder] = (forwarderCounts[forwarder] || 0) + 1;
        }
      });
      
      const topForwarders = Object.entries(forwarderCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([forwarder]) => forwarder);
      
      return {
        country,
        totalShipments,
        avgCostPerRoute,
        avgCustomsClearanceTime,
        deliveryFailureRate,
        borderDelayIncidents,
        resilienceIndex,
        preferredMode,
        topForwarders
      };
    });
  
  // Sort by total shipments (highest first)
  return countryPerformance.sort((a, b) => b.totalShipments - a.totalShipments);
};

/**
 * Calculate warehouse performance metrics
 */
export const calculateWarehousePerformance = (shipmentData: Shipment[]): WarehousePerformance[] => {
  // Since warehouse data isn't explicitly in the shipment data model,
  // we'll use origin_country as a proxy for warehouse location
  const warehouseMap = new Map<string, Shipment[]>();
  
  shipmentData.forEach(shipment => {
    const location = shipment.origin_country;
    const warehouseKey = `Warehouse-${location}`;
    
    if (!warehouseMap.has(warehouseKey)) {
      warehouseMap.set(warehouseKey, []);
    }
    warehouseMap.get(warehouseKey)?.push(shipment);
  });
  
  // Calculate performance metrics for each "warehouse"
  const warehousePerformance: WarehousePerformance[] = Array.from(warehouseMap.entries())
    .map(([warehouseKey, shipments]) => {
      const totalShipments = shipments.length;
      const location = shipments[0].origin_country;
      
      // Calculate average pick & pack time (simplified)
      // In a real system, this would come from warehouse management system
      const avgPickPackTime = 1 + Math.random() * 3; // 1-4 days, random for demo
      
      // Calculate packaging failure rate (simplified)
      const packagingFailureRate = Math.random() * 0.05; // 0-5%, random for demo
      
      // Calculate missed dispatch rate (simplified)
      const missedDispatchRate = Math.random() * 0.1; // 0-10%, random for demo
      
      // Calculate rescheduled shipments ratio (simplified)
      const rescheduledShipmentsRatio = Math.random() * 0.15; // 0-15%, random for demo
      
      // Calculate warehouse reliability score
      const reliabilityScore = (
        (1 - packagingFailureRate) * 0.3 +
        (1 - missedDispatchRate) * 0.4 +
        (1 - rescheduledShipmentsRatio) * 0.3
      ) * 100;
      
      // Determine preferred forwarders
      const forwarderCounts: Record<string, number> = {};
      shipments.forEach(s => {
        const forwarder = s.final_quote_awarded_freight_forwader_Carrier;
        if (forwarder) {
          forwarderCounts[forwarder] = (forwarderCounts[forwarder] || 0) + 1;
        }
      });
      
      const preferredForwarders = Object.entries(forwarderCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([forwarder]) => forwarder);
      
      // Calculate cost discrepancy (comparison to average)
      const avgCost = calculateAvgCostPerKg(shipments);
      const overallAvgCost = 15; // Simplified - would be calculated from all shipments
      const costDiscrepancy = ((avgCost - overallAvgCost) / overallAvgCost) * 100;
      
      return {
        name: warehouseKey,
        location,
        totalShipments,
        avgPickPackTime,
        packagingFailureRate,
        missedDispatchRate,
        rescheduledShipmentsRatio,
        reliabilityScore,
        preferredForwarders,
        costDiscrepancy
      };
    });
  
  // Sort by total shipments (highest first)
  return warehousePerformance.sort((a, b) => b.totalShipments - a.totalShipments);
};
