
import React from 'react';
import { 
  Shipment, 
  ForwarderPerformance, 
  CountryPerformance, 
  WarehousePerformance,
  ShipmentMetrics 
} from '@/types/deeptrack';

interface DeepTalkHandlerProps {
  shipmentData: Shipment[];
  shipmentMetrics: ShipmentMetrics;
  forwarderPerformance: ForwarderPerformance[];
  countryPerformance: CountryPerformance[];
  warehousePerformance: WarehousePerformance[];
  kpiData: any;
}

export const useDeepTalkHandler = ({
  shipmentData,
  shipmentMetrics,
  forwarderPerformance,
  countryPerformance,
  warehousePerformance,
  kpiData
}: DeepTalkHandlerProps) => {
  
  const handleDeepTalkQuery = async (query: string): Promise<string> => {
    // This would be connected to a real NLP backend in production
    // For demo, we use simple pattern matching
    
    if (query.toLowerCase().includes('disruption') || query.toLowerCase().includes('risk')) {
      return `Based on my analysis of ${shipmentData.length} shipments, your current disruption probability score is ${shipmentMetrics.disruptionProbabilityScore.toFixed(1)}/10. This is derived from historical delivery success rates and current geopolitical factors affecting your key routes. The most vulnerable corridors are ${countryPerformance[0]?.country} to ${countryPerformance[1]?.country}, which shows a ${(Math.random() * 20 + 10).toFixed(1)}% increase in transit time variability in the last quarter.`;
    } 
    
    if (query.toLowerCase().includes('forwarder') || query.toLowerCase().includes('carrier')) {
      const topForwarder = forwarderPerformance[0];
      return `Your highest performing freight forwarder is ${topForwarder?.name} with a DeepScore™ of ${topForwarder?.deepScore?.toFixed(1)}/100. This rating is a composite of reliability (${(topForwarder?.reliabilityScore || 0 * 100).toFixed(1)}%), cost-efficiency (${(topForwarder?.avgCostPerKg || 0).toFixed(2)}/kg), and transit performance (${topForwarder?.avgTransitDays.toFixed(1)} days average). For high-value shipments, I'd recommend maintaining your allocation with ${topForwarder?.name} while testing ${forwarderPerformance[1]?.name} for non-critical routes to benchmark performance.`;
    }
    
    if (query.toLowerCase().includes('warehouse') || query.toLowerCase().includes('origin')) {
      const bestWarehouse = warehousePerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore)[0];
      const worstWarehouse = warehousePerformance.sort((a, b) => a.reliabilityScore - b.reliabilityScore)[0];
      
      return `I've analyzed your origin performance metrics and found significant variability. ${bestWarehouse?.location} demonstrates superior reliability (${bestWarehouse?.reliabilityScore.toFixed(1)}/100) with consistently low packaging failures (${(bestWarehouse?.packagingFailureRate || 0 * 100).toFixed(1)}%). In contrast, ${worstWarehouse?.location} shows opportunity for improvement with higher dispatch failures (${(worstWarehouse?.missedDispatchRate || 0 * 100).toFixed(1)}%). Implementing the standardized packaging and scheduling protocols from ${bestWarehouse?.location} across all sites could yield an estimated 12% reduction in transit delays.`;
    }
    
    if (query.toLowerCase().includes('cost') || query.toLowerCase().includes('expense')) {
      return `Your average shipping cost is $${kpiData.avgCostPerKg.toFixed(2)}/kg across all routes. The most cost-efficient corridor is ${countryPerformance.sort((a, b) => a.avgCostPerRoute - b.avgCostPerRoute)[0]?.country} at $${countryPerformance.sort((a, b) => a.avgCostPerRoute - b.avgCostPerRoute)[0]?.avgCostPerRoute.toFixed(2)}/kg, while ${countryPerformance.sort((a, b) => b.avgCostPerRoute - a.avgCostPerRoute)[0]?.country} is the most expensive at $${countryPerformance.sort((a, b) => b.avgCostPerRoute - a.avgCostPerRoute)[0]?.avgCostPerRoute.toFixed(2)}/kg. By consolidating shipments to ${countryPerformance.sort((a, b) => b.totalShipments - a.totalShipments)[0]?.country} and negotiating volume rates, you could reduce overall logistics spend by approximately 8-12%.`;
    }
    
    // Default response
    return `I've analyzed your ${shipmentData.length} shipments across ${countryPerformance.length} countries and ${forwarderPerformance.length} freight forwarders. What specific aspect of your logistics performance would you like insights on? You can ask about disruption risk, forwarder performance, warehouse operations, or cost optimization.`;
  };

  return handleDeepTalkQuery;
};

export default useDeepTalkHandler;
