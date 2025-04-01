
/**
 * Shipment Tab Data Processing Utilities
 * Provides functions to compute shipment insights from raw data
 */

import { Shipment, ShipmentMetrics } from "@/types/deeptrack";

/**
 * Group shipments by a specific property
 * @param shipments The shipment data
 * @param property The property to group by
 * @returns Grouped shipments
 */
export const groupBy = <T>(items: T[], key: keyof T): Record<string, T[]> => {
  return items.reduce((result, item) => {
    const groupKey = String(item[key] || 'Unknown');
    result[groupKey] = [...(result[groupKey] || []), item];
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Compute grade breakdown by item category
 * @param categoryGroups Shipments grouped by category
 * @returns Grade breakdown data for charts
 */
export const computeGradeBreakdown = (categoryGroups: Record<string, Shipment[]>) => {
  return Object.entries(categoryGroups).map(([category, shipments]) => ({
    name: category || 'Unspecified',
    value: shipments.length,
    percentage: 0, // Will be calculated later
  }));
};

/**
 * Compute comprehensive shipment insights for analytics
 * @param shipments The shipment data
 * @returns Shipment insights
 */
export const computeShipmentInsights = (shipments: Shipment[]): ShipmentMetrics => {
  const totalShipments = shipments.length;
  
  // Group by different properties
  const byMode = groupBy(shipments, 'mode_of_shipment');
  const byStatus = groupBy(shipments, 'delivery_status');
  
  // Calculate shipments by mode
  const shipmentsByMode: Record<string, number> = {};
  Object.entries(byMode).forEach(([mode, modeShipments]) => {
    shipmentsByMode[mode] = modeShipments.length;
  });
  
  // Calculate shipment status counts
  const shipmentStatusCounts = {
    active: (byStatus['In Transit']?.length || 0) + (byStatus['Pending']?.length || 0),
    completed: byStatus['Delivered']?.length || 0,
    failed: totalShipments - ((byStatus['Delivered']?.length || 0) + (byStatus['In Transit']?.length || 0) + (byStatus['Pending']?.length || 0)),
    onTime: byStatus['Delivered']?.length || 0,
    inTransit: byStatus['In Transit']?.length || 0
  };
  
  // Calculate transit times
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
  
  // Calculate on-time rate
  const onTimePercentage = totalShipments > 0 
    ? (completedShipments.length / totalShipments) * 100 
    : 0;
  
  // Calculate disruption probability score
  const disruptionProbabilityScore = 10 - (onTimePercentage / 10);
  
  // Calculate resilience score
  const resilienceScore = Math.min(100, Math.max(0, 
    50 + 
    (onTimePercentage / 2) - 
    (disruptionProbabilityScore * 5)
  ));
  
  // Calculate monthly trend
  const monthlyData = shipments.reduce((acc: Record<string, number>, shipment) => {
    if (shipment.date_of_collection) {
      const date = new Date(shipment.date_of_collection);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
    }
    return acc;
  }, {});
  
  const monthlyTrend = Object.entries(monthlyData).map(([month, count]) => ({ month, count }));
  
  // Calculate delayed vs on-time rate
  const delayed = shipments.filter(s => s.delivery_status.toLowerCase() !== 'delivered').length;
  const onTime = shipments.filter(s => s.delivery_status.toLowerCase() === 'delivered').length;
  const delayedVsOnTimeRate = { onTime, delayed };
  
  // Calculate no quote ratio
  const noQuoteRatio = shipments.filter(s => !s.forwarder_quotes || Object.keys(s.forwarder_quotes).length === 0).length / Math.max(totalShipments, 1);
  
  // Calculate average cost per kg
  const avgCostPerKg = calculateAvgCostForAllShipments(shipments);
  
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
    forwarderPerformance: {},
    carrierPerformance: {},
    topForwarder: shipments.length > 0 ? (shipments[0].final_quote_awarded_freight_forwader_Carrier || 'Unknown') : 'Unknown',
    topCarrier: shipments.length > 0 ? (shipments[0].freight_carrier || 'Unknown') : 'Unknown',
    carrierCount: new Set(shipments.map(s => s.freight_carrier)).size
  };
};

/**
 * Calculate average cost per kg for all shipments
 * @param shipments The shipment data
 * @returns Average cost per kg
 */
const calculateAvgCostForAllShipments = (shipments: Shipment[]): number => {
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
};

export default {
  computeShipmentInsights,
  groupBy,
  computeGradeBreakdown
};
