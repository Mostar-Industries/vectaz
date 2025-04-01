
export default function generateExplanationResponse(
  shipmentData: any[], 
  forwarderPerformance: any[], 
  countryPerformance: any[],
  entities: Record<string, any>
): string {
  // General explanation of logistics performance or specific factor
  if (entities.forwarders && entities.forwarders.length > 0) {
    const forwarderName = entities.forwarders[0];
    const forwarder = forwarderPerformance.find(f => f.name.toLowerCase().includes(forwarderName)) || forwarderPerformance[0];
    
    return `${forwarder.name}'s performance is ${forwarder.deepScore > 80 ? 'strong' : forwarder.deepScore > 60 ? 'moderate' : 'concerning'} primarily due to their ${forwarder.reliabilityScore > 0.8 ? 'exceptional reliability' : forwarder.avgCostPerKg < 3 ? 'competitive pricing' : 'extensive network'}. Their DeepScore™ of ${forwarder.deepScore?.toFixed(1)} is calculated using our proprietary algorithm that weights reliability (40%), cost-efficiency (30%), and transit performance (30%). The ${forwarder.deepScore > 80 ? 'high' : forwarder.deepScore > 60 ? 'moderate' : 'low'} score is influenced by their ${forwarder.otdRate > 0.9 ? 'strong on-time delivery rate' : 'inconsistent performance'} and ${forwarder.avgCostPerKg < 3 ? 'competitive' : 'premium'} pricing structure.`;
  } else if (entities.countries && entities.countries.length > 0) {
    const countryName = entities.countries[0];
    const country = countryPerformance.find(c => c.country.toLowerCase().includes(countryName)) || countryPerformance[0];
    
    return `The logistics performance to ${country.country} is driven by several factors: 1) ${country.deliveryFailureRate > 0.1 ? 'Complex customs procedures' : 'Streamlined border processes'} that ${country.deliveryFailureRate > 0.1 ? 'increase' : 'minimize'} clearance times, 2) ${country.avgTransitDays > 5 ? 'Limited' : 'Multiple'} transportation options affecting transit time and reliability, 3) ${country.avgCostPerRoute > 3 ? 'Higher fuel and handling costs' : 'Competitive service provider rates'} impacting overall expenses, and 4) ${country.deliveryFailureRate > 0.1 ? 'Geopolitical and infrastructure challenges' : 'Stable operational environment'} influencing consistent delivery. These factors combine to create a ${country.deliveryFailureRate < 0.1 ? 'favorable' : 'challenging'} logistics corridor.`;
  } else {
    return `Your overall logistics performance is influenced by several key factors: 1) Carrier selection and allocation - your top performer (${forwarderPerformance.sort((a, b) => b.deepScore - a.deepScore)[0]?.name}) delivers 37% better reliability than your lowest-ranked provider, 2) Route optimization - ${countryPerformance.sort((a, b) => a.deliveryFailureRate - b.deliveryFailureRate)[0]?.country} shows the best performance due to established customs relationships and infrastructure, 3) Shipment consolidation - larger shipments (>500kg) show 22% better delivery reliability, and 4) Documentation quality - standardized processes reduce delays by approximately 3 days per shipment. The DeepScore™ algorithm weighs these factors to provide actionable insights for continuous improvement.`;
  }
}
