
import { 
  Shipment, 
  ShipmentMetrics, 
  ForwarderPerformance, 
  CountryPerformance,
  WarehousePerformance
} from "@/types/deeptrack";

/**
 * Calculate shipment metrics from raw shipment data
 * This function processes raw shipment data to generate accurate analytics metrics
 */
export const calculateShipmentMetrics = (shipmentData: Shipment[]): ShipmentMetrics => {
  console.log("Calculating shipment metrics from", shipmentData.length, "shipments");
  
  // Total shipments - basic count
  const totalShipments = shipmentData.length;
  
  // Shipments by mode - group by transportation mode
  const shipmentsByMode = shipmentData.reduce((acc: Record<string, number>, shipment) => {
    const mode = shipment.mode_of_shipment || 'Unspecified';
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {});
  
  console.log("Shipments by mode:", shipmentsByMode);
  
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
    
    try {
      const date = new Date(shipment.date_of_collection);
      if (date < sixMonthsAgo) return;
      
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthKey in monthlyData) {
        monthlyData[monthKey]++;
      }
    } catch (err) {
      console.error("Error processing date:", shipment.date_of_collection, err);
    }
  });
  
  const monthlyTrend = Object.entries(monthlyData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  console.log("Monthly trend data calculated:", monthlyTrend);
  
  // Calculate on-time vs delayed shipments
  const completedShipments = shipmentData.filter(s => 
    s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
  );
  
  console.log("Found", completedShipments.length, "completed shipments with valid dates");
  
  let onTimeCount = 0;
  let delayedCount = 0;
  
  // Calculate transit times for each shipment
  const transitTimes: number[] = [];
  
  completedShipments.forEach(shipment => {
    try {
      const collectionDate = new Date(shipment.date_of_collection);
      const arrivalDate = new Date(shipment.date_of_arrival_destination);
      
      // Verify dates are valid
      if (isNaN(collectionDate.getTime()) || isNaN(arrivalDate.getTime())) {
        console.warn("Invalid date found for shipment:", shipment.request_reference);
        return;
      }
      
      const transitDays = (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24);
      transitTimes.push(transitDays);
      
      // Use mode-specific expected transit times
      let expectedTransitDays = 5; // Default
      
      if (shipment.mode_of_shipment === 'Air') {
        expectedTransitDays = 3;
      } else if (shipment.mode_of_shipment === 'Sea') {
        expectedTransitDays = 10;
      } else if (shipment.mode_of_shipment === 'Road') {
        expectedTransitDays = 5;
      }
      
      // Determine if shipment is delayed
      if (transitDays > expectedTransitDays * 1.2) {
        delayedCount++;
      } else {
        onTimeCount++;
      }
    } catch (err) {
      console.error("Error calculating transit time:", err, shipment);
    }
  });
  
  console.log("Transit times calculated:", transitTimes.length, "valid times");
  
  // Calculate average transit time
  const avgTransitTime = transitTimes.length > 0 
    ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
    : 0;
  
  console.log("Average transit time:", avgTransitTime.toFixed(2), "days");
  
  // Calculate shipment status counts
  const activeShipments = shipmentData.filter(s => s.delivery_status === 'In Transit').length;
  const completedShipmentCount = shipmentData.filter(s => s.delivery_status === 'Delivered').length;
  const failedShipments = shipmentData.filter(s => 
    s.delivery_status === 'Failed' || s.delivery_status === 'Cancelled'
  ).length;
  
  console.log("Status counts - Active:", activeShipments, "Completed:", completedShipmentCount, "Failed:", failedShipments);
  
  // Calculate "no quote" ratio - shipments with no forwarder quotes
  const shipmentsWithNoQuotes = shipmentData.filter(s => 
    Object.keys(s.forwarder_quotes || {}).length === 0
  ).length;
  
  const noQuoteRatio = totalShipments > 0 ? shipmentsWithNoQuotes / totalShipments : 0;
  
  // Calculate resilience score based on route success rates
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
  
  Object.entries(routeSuccessRates).forEach(([route, { success, total }]) => {
    const successRate = total > 0 ? success / total : 0;
    console.log(`Route ${route} success rate: ${(successRate * 100).toFixed(1)}% (${success}/${total})`);
    totalWeightedSuccessRate += successRate * total;
    totalRouteWeight += total;
  });
  
  const resilienceScore = totalRouteWeight > 0 
    ? (totalWeightedSuccessRate / totalRouteWeight) * 100 
    : 0;
  
  console.log("Calculated resilience score:", resilienceScore.toFixed(2));
  
  // Calculate disruption probability score - higher means more likely to face disruptions
  const disruptionProbabilityScore = failedShipments > 0 
    ? Math.min((failedShipments / totalShipments) * 10, 10) 
    : Math.min(10 - resilienceScore / 10, 8);
  
  console.log("Calculated disruption probability score:", disruptionProbabilityScore.toFixed(2));
  
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
      completed: completedShipmentCount,
      failed: failedShipments
    },
    resilienceScore,
    noQuoteRatio
  };
};

/**
 * Calculate forwarder performance metrics with accurate data
 */
export const calculateForwarderPerformance = (shipmentData: Shipment[]): ForwarderPerformance[] => {
  console.log("Calculating forwarder performance from", shipmentData.length, "shipments");
  
  // Group shipments by forwarder
  const forwarderMap = new Map<string, Shipment[]>();
  
  shipmentData.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    if (!forwarder || forwarder === "") return;
    
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, []);
    }
    forwarderMap.get(forwarder)?.push(shipment);
  });
  
  console.log("Found", forwarderMap.size, "forwarders with shipments");
  
  // Total quotes won per forwarder
  const forwarderQuoteCounts: Record<string, {won: number, total: number}> = {};
  
  shipmentData.forEach(shipment => {
    const quotes = shipment.forwarder_quotes || {};
    
    Object.keys(quotes).forEach(forwarder => {
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
        try {
          const collectionDate = new Date(s.date_of_collection);
          const arrivalDate = new Date(s.date_of_arrival_destination);
          return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
        } catch (err) {
          console.error("Error calculating transit time for forwarder:", name, err);
          return 0;
        }
      }).filter(time => time > 0);
      
      const avgTransitDays = transitTimes.length > 0 
        ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
        : 0;
      
      // Calculate on-time rate
      let onTimeShipments = 0;
      transitTimes.forEach(days => {
        // Use average transit time as threshold
        const avgThreshold = totalShipments > 5 ? avgTransitDays * 1.2 : 6; // 20% buffer or default 6 days
        if (days <= avgThreshold) {
          onTimeShipments++;
        }
      });
      
      const onTimeRate = transitTimes.length > 0 ? onTimeShipments / transitTimes.length : 0;
      
      // Calculate reliability score based on on-time rate and completed ratio
      const reliabilityScore = (onTimeRate + (completedShipments.length / Math.max(totalShipments, 1))) / 2;
      
      // Calculate quote win rate
      const quoteData = forwarderQuoteCounts[name.toLowerCase()] || { won: 0, total: 0 };
      const quoteWinRate = quoteData.total > 0 ? quoteData.won / quoteData.total : 0;
      
      // Calculate cost per kg
      const avgCostPerKg = calculateAvgCostPerKg(shipments);
      
      // Calculate deep score (composite ranking)
      // Lower cost, higher reliability, faster transit time = better score
      const costFactor = avgCostPerKg;
      const normalizedCost = costFactor > 0 ? 1 - Math.min(costFactor / 100, 0.9) : 0.5;
      const normalizedTime = avgTransitDays > 0 ? 1 - Math.min(avgTransitDays / 14, 0.9) : 0.5;
      
      const deepScore = (
        normalizedCost * 0.4 + 
        reliabilityScore * 0.4 + 
        normalizedTime * 0.2
      ) * 100;
      
      // Calculate replacement frequency (based on actual cancellations)
      const cancellations = shipments.filter(s => s.delivery_status === 'Cancelled').length;
      const replacementFrequency = totalShipments > 0 ? cancellations / totalShipments : 0;
      
      console.log(`Forwarder ${name}: ${totalShipments} shipments, ${avgTransitDays.toFixed(1)} days avg transit, ${(onTimeRate * 100).toFixed(1)}% on-time`);
      
      return {
        name,
        totalShipments,
        avgCostPerKg,
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
  console.log("Calculating avg cost per kg for", shipments.length, "shipments");
  
  const shipmentCosts = shipments.filter(s => {
    const forwarder = s.final_quote_awarded_freight_forwader_Carrier.toLowerCase();
    const quotes = s.forwarder_quotes || {};
    return quotes[forwarder] !== undefined;
  }).map(s => {
    const forwarder = s.final_quote_awarded_freight_forwader_Carrier.toLowerCase();
    const quotes = s.forwarder_quotes || {};
    return {
      cost: quotes[forwarder] || 0,
      weight: s.weight_kg || 0
    };
  });
  
  if (shipmentCosts.length === 0) {
    console.log("No valid shipment costs found");
    return 0;
  }
  
  const totalCost = shipmentCosts.reduce((sum, item) => sum + item.cost, 0);
  const totalWeight = shipmentCosts.reduce((sum, item) => sum + item.weight, 0);
  
  const result = totalWeight > 0 ? totalCost / totalWeight : 0;
  console.log(`Avg cost per kg: $${result.toFixed(2)} (Total cost: $${totalCost.toFixed(2)}, Total weight: ${totalWeight.toFixed(2)} kg)`);
  
  return result;
};

/**
 * Calculate country performance metrics based on actual data
 */
export const calculateCountryPerformance = (shipmentData: Shipment[]): CountryPerformance[] => {
  console.log("Calculating country performance from", shipmentData.length, "shipments");
  
  // Group shipments by destination country
  const countryMap = new Map<string, Shipment[]>();
  
  shipmentData.forEach(shipment => {
    const country = shipment.destination_country;
    if (!country) return;
    
    if (!countryMap.has(country)) {
      countryMap.set(country, []);
    }
    countryMap.get(country)?.push(shipment);
  });
  
  console.log("Found", countryMap.size, "destination countries");
  
  // Calculate performance metrics for each country
  const countryPerformance: CountryPerformance[] = Array.from(countryMap.entries())
    .map(([country, shipments]) => {
      const totalShipments = shipments.length;
      
      // Calculate average cost per route
      const avgCostPerRoute = calculateAvgCostPerKg(shipments);
      
      // Calculate average transit time
      const completedShipments = shipments.filter(s => 
        s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
      );
      
      const transitTimes = completedShipments.map(s => {
        try {
          const collectionDate = new Date(s.date_of_collection);
          const arrivalDate = new Date(s.date_of_arrival_destination);
          return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
        } catch (err) {
          console.error("Error calculating transit time for country:", country, err);
          return 0;
        }
      }).filter(time => time > 0);
      
      const avgTransitDays = transitTimes.length > 0 
        ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
        : 0;
      
      // Calculate average customs clearance time based on time difference patterns
      // In a real system, this would come from actual customs data
      const avgCustomsClearanceTime = transitTimes.length > 0 
        ? Math.min(transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length * 0.3, 7) 
        : 3; // Estimate customs as 30% of transit time, max 7 days
      
      // Calculate delivery failure rate
      const failedDeliveries = shipments.filter(s => 
        s.delivery_status === 'Failed' || s.delivery_status === 'Cancelled'
      ).length;
      
      const deliveryFailureRate = totalShipments > 0 ? failedDeliveries / totalShipments : 0;
      
      // Calculate border delay incidents based on actual delayed shipments
      const delayedShipments = transitTimes.filter(days => days > avgTransitDays * 1.3).length;
      const borderDelayIncidents = delayedShipments;
      
      // Calculate reliability score
      const successfulDeliveries = shipments.filter(s => s.delivery_status === 'Delivered').length;
      const reliabilityScore = totalShipments > 0 ? successfulDeliveries / totalShipments : 0;
      
      // Calculate resilience index
      const resilienceIndex = (reliabilityScore * 0.7 + (1 - deliveryFailureRate) * 0.3) * 100;
      
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
      
      console.log(`Country ${country}: ${totalShipments} shipments, ${avgTransitDays.toFixed(1)} days avg transit, ${(reliabilityScore * 100).toFixed(1)}% reliability`);
      
      return {
        country,
        totalShipments,
        avgCostPerRoute,
        avgCustomsClearanceTime,
        deliveryFailureRate,
        borderDelayIncidents,
        resilienceIndex,
        preferredMode,
        topForwarders,
        reliabilityScore,
        avgTransitDays
      };
    });
  
  // Sort by total shipments (highest first)
  return countryPerformance.sort((a, b) => b.totalShipments - a.totalShipments);
};

/**
 * Calculate warehouse performance metrics based on actual data
 */
export const calculateWarehousePerformance = (shipmentData: Shipment[]): WarehousePerformance[] => {
  console.log("Calculating warehouse performance from", shipmentData.length, "shipments");
  
  // Group shipments by origin country (proxy for warehouse location)
  const warehouseMap = new Map<string, Shipment[]>();
  
  shipmentData.forEach(shipment => {
    const location = shipment.origin_country;
    if (!location) return;
    
    const warehouseKey = `Warehouse-${location}`;
    
    if (!warehouseMap.has(warehouseKey)) {
      warehouseMap.set(warehouseKey, []);
    }
    warehouseMap.get(warehouseKey)?.push(shipment);
  });
  
  console.log("Found", warehouseMap.size, "origin warehouses");
  
  // Calculate performance metrics for each "warehouse"
  const warehousePerformance: WarehousePerformance[] = Array.from(warehouseMap.entries())
    .map(([warehouseKey, shipments]) => {
      const totalShipments = shipments.length;
      const location = shipments[0].origin_country;
      
      // Calculate actual metrics based on shipment performance
      
      // Calculate average pick & pack time based on collection date patterns
      // In reality, this would come from warehouse management system
      const dispatchTimes = shipments
        .filter(s => s.date_of_collection)
        .map(s => {
          // Calculate time between created_at and collection as proxy for warehouse processing time
          const createdAt = new Date(s.created_at || new Date());
          const collectionDate = new Date(s.date_of_collection);
          
          if (isNaN(createdAt.getTime()) || isNaN(collectionDate.getTime())) return 0;
          
          const days = (collectionDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return Math.max(0, Math.min(days, 10)); // Cap at 10 days to avoid outliers
        })
        .filter(days => days > 0);
      
      const avgPickPackTime = dispatchTimes.length > 0
        ? dispatchTimes.reduce((sum, days) => sum + days, 0) / dispatchTimes.length
        : 2; // Default if no data
      
      // Calculate packaging failure rate based on actual failures or returns
      // In a real system, this would come from failure records
      const packagingFailures = shipments.filter(s => 
        s.comments && s.comments.toLowerCase().includes('packaging')
      ).length;
      
      const packagingFailureRate = totalShipments > 0 ? packagingFailures / totalShipments : 0;
      
      // Calculate missed dispatch rate based on delayed collections
      // In a real system, this would come from scheduled vs actual collection times
      const missedDispatches = shipments.filter(s => 
        s.comments && (
          s.comments.toLowerCase().includes('delay') || 
          s.comments.toLowerCase().includes('late') ||
          s.comments.toLowerCase().includes('missed')
        )
      ).length;
      
      const missedDispatchRate = totalShipments > 0 ? missedDispatches / totalShipments : 0;
      
      // Calculate rescheduled shipments ratio based on comments
      const rescheduledShipments = shipments.filter(s => 
        s.comments && (
          s.comments.toLowerCase().includes('reschedul') || 
          s.comments.toLowerCase().includes('postpone')
        )
      ).length;
      
      const rescheduledShipmentsRatio = totalShipments > 0 ? rescheduledShipments / totalShipments : 0;
      
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
      
      // Calculate cost discrepancy compared to average
      const avgCost = calculateAvgCostPerKg(shipments);
      
      // Calculate overall average cost from all shipments
      const allShipmentsAvgCost = calculateAvgCostPerKg(shipmentData);
      
      const costDiscrepancy = allShipmentsAvgCost > 0 
        ? ((avgCost - allShipmentsAvgCost) / allShipmentsAvgCost) * 100 
        : 0;
      
      console.log(`Warehouse ${location}: ${totalShipments} shipments, ${avgPickPackTime.toFixed(1)} days avg processing, ${reliabilityScore.toFixed(1)} reliability score`);
      
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
