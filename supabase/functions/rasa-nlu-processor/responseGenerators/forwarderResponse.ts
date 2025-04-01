
export default function generateForwarderResponse(
  forwarderPerformance: any[], 
  entities: Record<string, any>
): string {
  // Find specific forwarders if mentioned
  let focusedForwarders = forwarderPerformance;
  if (entities.forwarders && entities.forwarders.length > 0) {
    focusedForwarders = forwarderPerformance.filter(fp => 
      entities.forwarders.some((f: string) => fp.name.toLowerCase().includes(f))
    );
  }
  
  if (focusedForwarders.length === 0) {
    // No matches, fall back to top performers
    focusedForwarders = forwarderPerformance.sort((a, b) => b.deepScore - a.deepScore).slice(0, 3);
  }
  
  if (focusedForwarders.length === 1) {
    // Single forwarder detailed analysis
    const forwarder = focusedForwarders[0];
    return `${forwarder.name} has a DeepScore™ of ${forwarder.deepScore?.toFixed(1)}/100. This rating is a composite of reliability (${(forwarder.reliabilityScore * 100).toFixed(1)}%), cost-efficiency (${(forwarder.avgCostPerKg || 0).toFixed(2)}/kg), and transit performance (${forwarder.avgTransitDays.toFixed(1)} days average). Their on-time delivery rate is ${(forwarder.otdRate * 100).toFixed(1)}% and they handle approximately ${forwarder.totalShipments} shipments in your network.`;
  } else {
    // Comparative analysis
    const topForwarder = focusedForwarders.sort((a, b) => b.deepScore - a.deepScore)[0];
    return `Your highest performing freight forwarder is ${topForwarder.name} with a DeepScore™ of ${topForwarder.deepScore?.toFixed(1)}/100. This rating is a composite of reliability (${(topForwarder.reliabilityScore * 100).toFixed(1)}%), cost-efficiency (${(topForwarder.avgCostPerKg || 0).toFixed(2)}/kg), and transit performance (${topForwarder.avgTransitDays.toFixed(1)} days average). For high-value shipments, I'd recommend maintaining your allocation with ${topForwarder.name} while testing ${forwarderPerformance[1]?.name} for non-critical routes to benchmark performance.`;
  }
}
