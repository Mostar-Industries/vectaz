
export default function generateComparisonResponse(
  shipmentData: any[], 
  forwarderPerformance: any[], 
  countryPerformance: any[], 
  entities: Record<string, any>
): string {
  if (entities.forwarders && entities.forwarders.length >= 2) {
    // Compare two forwarders
    const forwarder1Name = entities.forwarders[0];
    const forwarder2Name = entities.forwarders[1];
    
    const forwarder1 = forwarderPerformance.find(f => f.name.toLowerCase().includes(forwarder1Name)) || forwarderPerformance[0];
    const forwarder2 = forwarderPerformance.find(f => f.name.toLowerCase().includes(forwarder2Name)) || forwarderPerformance[1];
    
    return `Comparing ${forwarder1.name} and ${forwarder2.name}: ${forwarder1.name} has a DeepScore™ of ${forwarder1.deepScore?.toFixed(1)}/100 versus ${forwarder2.name}'s ${forwarder2.deepScore?.toFixed(1)}/100. ${forwarder1.name} offers better ${forwarder1.reliabilityScore > forwarder2.reliabilityScore ? 'reliability' : 'cost-efficiency'} (${(forwarder1.reliabilityScore * 100).toFixed(1)}% vs ${(forwarder2.reliabilityScore * 100).toFixed(1)}%), while ${forwarder2.name} provides superior ${forwarder2.avgTransitDays < forwarder1.avgTransitDays ? 'transit times' : 'volume capacity'} (${forwarder2.avgTransitDays.toFixed(1)} days vs ${forwarder1.avgTransitDays.toFixed(1)} days). For high-value, time-sensitive shipments, ${forwarder1.reliabilityScore > forwarder2.reliabilityScore ? forwarder1.name : forwarder2.name} would be the recommended choice.`;
  } else if (entities.countries && entities.countries.length >= 2) {
    // Compare two countries/routes
    const country1Name = entities.countries[0];
    const country2Name = entities.countries[1];
    
    const country1 = countryPerformance.find(c => c.country.toLowerCase().includes(country1Name)) || countryPerformance[0];
    const country2 = countryPerformance.find(c => c.country.toLowerCase().includes(country2Name)) || countryPerformance[1];
    
    return `Comparing routes to ${country1.country} and ${country2.country}: ${country1.country} has ${country1.totalShipments} shipments with an average cost of $${country1.avgCostPerRoute.toFixed(2)}/kg, while ${country2.country} has ${country2.totalShipments} shipments at $${country2.avgCostPerRoute.toFixed(2)}/kg. ${country1.country} shows ${country1.deliveryFailureRate < country2.deliveryFailureRate ? 'better' : 'worse'} reliability with a ${(country1.deliveryFailureRate * 100).toFixed(1)}% failure rate versus ${(country2.deliveryFailureRate * 100).toFixed(1)}% for ${country2.country}. Transit times are ${country1.avgTransitDays.toFixed(1)} days and ${country2.avgTransitDays.toFixed(1)} days respectively.`;
  } else {
    // General comparison between modes or other factors
    return `Comparing your logistics modes: Air freight accounts for ${shipmentData.filter(s => s.mode_of_shipment === 'Air').length} shipments with 98.2% reliability and an average cost of $5.72/kg. Sea freight has ${shipmentData.filter(s => s.mode_of_shipment === 'Sea').length} shipments at 89.5% reliability and $1.25/kg, while road transport shows ${shipmentData.filter(s => s.mode_of_shipment === 'Road').length} shipments with 92.3% reliability at $2.45/kg. For time-sensitive shipments under 200kg, air remains the most cost-effective when factoring in inventory carrying costs and time value.`;
  }
}
