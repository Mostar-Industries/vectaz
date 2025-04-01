
export default function generateWarehouseResponse(
  warehousePerformance: any[], 
  entities: Record<string, any>
): string {
  const bestWarehouse = warehousePerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore)[0];
  const worstWarehouse = warehousePerformance.sort((a, b) => a.reliabilityScore - b.reliabilityScore)[0];
  
  return `I've analyzed your origin performance metrics and found significant variability. ${bestWarehouse?.location} demonstrates superior reliability (${bestWarehouse?.reliabilityScore.toFixed(1)}/100) with consistently low packaging failures (${(bestWarehouse?.packagingFailureRate * 100).toFixed(1)}%). In contrast, ${worstWarehouse?.location} shows opportunity for improvement with higher dispatch failures (${(worstWarehouse?.missedDispatchRate * 100).toFixed(1)}%). Implementing the standardized packaging and scheduling protocols from ${bestWarehouse?.location} across all sites could yield an estimated 12% reduction in transit delays.`;
}
