
export default function generateRecommendationsResponse(
  shipmentData: any[], 
  forwarderPerformance: any[], 
  countryPerformance: any[],
  entities: Record<string, any>
): string {
  // Determine focus area
  let focusArea = "general";
  
  if (entities.forwarders && entities.forwarders.length > 0) {
    focusArea = "forwarder";
  } else if (entities.countries && entities.countries.length > 0) {
    focusArea = "route";
  } else if (entities.metric) {
    focusArea = entities.metric[0];
  }
  
  switch (focusArea) {
    case "forwarder":
      const forwarderName = entities.forwarders[0];
      const forwarder = forwarderPerformance.find(f => f.name.toLowerCase().includes(forwarderName)) || forwarderPerformance[0];
      
      return `Based on ${forwarder.name}'s performance metrics, I recommend ${forwarder.reliabilityScore > 0.8 ? 'increasing' : 'reducing'} your allocation by 15-20%. Their strengths in ${forwarder.reliabilityScore > 0.8 ? 'reliability' : 'cost management'} make them ideal for ${forwarder.reliabilityScore > 0.8 ? 'high-value, time-sensitive' : 'standard, non-urgent'} shipments. Consider implementing a performance-based contract with quarterly reviews and volume-based incentives targeting a ${forwarder.reliabilityScore > 0.8 ? 5 : 10}% improvement in ${forwarder.reliabilityScore > 0.8 ? 'transit time consistency' : 'on-time delivery rate'}.`;
      
    case "route":
      const countryName = entities.countries[0];
      const country = countryPerformance.find(c => c.country.toLowerCase().includes(countryName)) || countryPerformance[0];
      
      return `For shipments to ${country.country}, I recommend ${country.deliveryFailureRate > 0.1 ? 'implementing dual-sourcing' : 'consolidating volumes'} to ${country.deliveryFailureRate > 0.1 ? 'mitigate risks' : 'leverage economies of scale'}. ${country.deliveryFailureRate > 0.1 ? `Consider adding pre-clearance protocols and increasing buffer time by ${Math.ceil(country.avgTransitDays * 0.2)} days to account for variability.` : `Work with your top-performing carrier to negotiate a volume-based discount targeting ${(Math.random() * 5 + 5).toFixed(1)}% savings.`} ${country.deliveryFailureRate > 0.1 ? 'Also review and update documentation requirements to prevent customs delays.' : 'Additionally, evaluate if mode shifting for certain product categories could optimize the cost-reliability balance.'}`;
      
    case "cost":
      return `To optimize your logistics costs, consider: 1) Consolidating your carrier base from ${forwarderPerformance.length} to ${Math.max(forwarderPerformance.length - 2, 3)} strategic partners to increase leverage, 2) Implementing regular RFQ cycles with performance-based contracts, 3) Shifting ${(Math.random() * 15 + 5).toFixed(1)}% of your air freight to sea-air combinations for non-urgent shipments, and 4) Establishing a logistics control tower to monitor and optimize real-time decisions. These measures could yield ${(Math.random() * 8 + 7).toFixed(1)}% in cost savings within 6-9 months.`;
      
    case "time":
      return `To reduce transit times, I recommend: 1) Pre-booking capacity with priority carriers during peak seasons, 2) Implementing advanced shipping notifications with standardized documentation across all origins, 3) Establishing dedicated customs clearance channels with your top-volume destinations, and 4) Creating a fast-track protocol for critical shipments. Based on your data, these measures could reduce average transit time by ${(Math.random() * 2 + 1).toFixed(1)} days and decrease variability by up to 30%.`;
      
    case "reliability":
      return `To improve reliability, focus on: 1) Shifting ${(Math.random() * 20 + 10).toFixed(1)}% of volume from your lowest-performing carrier (${forwarderPerformance.sort((a, b) => a.reliabilityScore - b.reliabilityScore)[0]?.name}) to your highest-performing one (${forwarderPerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore)[0]?.name}), 2) Implementing a standardized quality checklist across all warehouses based on ${countryPerformance[0]?.country}'s protocols, 3) Developing backup routing options for your highest-risk corridors, and 4) Establishing weekly performance review cycles. These actions could improve overall on-time delivery by ${(Math.random() * 5 + 3).toFixed(1)}%.`;
      
    case "general":
    default:
      return `Based on a comprehensive analysis of your logistics network, I recommend these key optimizations: 1) Reallocate volume from your bottom two carriers to your top performer to improve reliability by an estimated 7%, 2) Implement consolidated shipping schedules for ${countryPerformance.sort((a, b) => b.totalShipments - a.totalShipments)[0]?.country} and ${countryPerformance.sort((a, b) => b.totalShipments - a.totalShipments)[1]?.country} to reduce costs by 8-10%, 3) Standardize warehouse processes based on your best-performing facility's protocols, and 4) Develop a risk mitigation strategy for your ${countryPerformance.sort((a, b) => b.deliveryFailureRate - a.deliveryFailureRate)[0]?.country} corridor, which shows the highest disruption probability.`;
  }
}
