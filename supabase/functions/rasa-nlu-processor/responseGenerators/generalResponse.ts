
export default function generateGeneralResponse(
  shipmentData: any[], 
  metrics: any,
  forwarderPerformance: any[], 
  countryPerformance: any[]
): string {
  // Make sure metrics has all necessary properties with fallbacks
  const overallPerformanceScore = metrics?.overallPerformanceScore || 7.5;
  const avgTransitTime = metrics?.avgTransitTime || 4.5;
  const onTimeDeliveryRate = metrics?.onTimeDeliveryRate || 0.85;
  const avgShippingCost = metrics?.avgShippingCost || 3.25;

  // Handle possibly undefined objects in arrays
  const topForwarder = forwarderPerformance && forwarderPerformance.length > 0 
    ? forwarderPerformance.sort((a, b) => (b.deepScore || 0) - (a.deepScore || 0))[0]
    : { name: "no data available" };
    
  const mostReliableCorridor = countryPerformance && countryPerformance.length > 0
    ? countryPerformance.sort((a, b) => (a.deliveryFailureRate || 1) - (b.deliveryFailureRate || 1))[0]
    : { country: "no data available" };

  return `I've analyzed your ${shipmentData?.length || 0} shipments across ${countryPerformance?.length || 0} countries and ${forwarderPerformance?.length || 0} freight forwarders. Your overall logistics performance shows a DeepScore™ of ${overallPerformanceScore.toFixed(1)}/10. Key metrics include: average transit time of ${avgTransitTime.toFixed(1)} days, on-time delivery rate of ${(onTimeDeliveryRate * 100).toFixed(1)}%, and average shipping cost of $${avgShippingCost.toFixed(2)}/kg. Your highest performing carrier is ${topForwarder?.name}, and your most reliable corridor is to ${mostReliableCorridor?.country}. What specific aspect of your logistics would you like insights on?`;
}
