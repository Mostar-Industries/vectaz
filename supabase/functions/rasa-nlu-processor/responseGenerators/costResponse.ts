
export default function generateCostResponse(
  shipmentData: any[], 
  kpiData: any, 
  countryPerformance: any[], 
  entities: Record<string, any>
): string {
  return `Your average shipping cost is $${kpiData.avgCostPerKg.toFixed(2)}/kg across all routes. The most cost-efficient corridor is ${countryPerformance.sort((a, b) => a.avgCostPerRoute - b.avgCostPerRoute)[0]?.country} at $${countryPerformance.sort((a, b) => a.avgCostPerRoute - b.avgCostPerRoute)[0]?.avgCostPerRoute.toFixed(2)}/kg, while ${countryPerformance.sort((a, b) => b.avgCostPerRoute - a.avgCostPerRoute)[0]?.country} is the most expensive at $${countryPerformance.sort((a, b) => b.avgCostPerRoute - a.avgCostPerRoute)[0]?.avgCostPerRoute.toFixed(2)}/kg. By consolidating shipments to ${countryPerformance.sort((a, b) => b.totalShipments - a.totalShipments)[0]?.country} and negotiating volume rates, you could reduce overall logistics spend by approximately 8-12%.`;
}
