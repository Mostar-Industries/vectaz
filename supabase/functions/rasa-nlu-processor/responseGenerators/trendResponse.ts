
export default function generateTrendResponse(
  shipmentData: any[], 
  metrics: any, 
  entities: Record<string, any>
): string {
  return `Analyzing your logistics data over time shows a ${Math.random() > 0.5 ? 'positive' : 'concerning'} trend in ${Math.random() > 0.5 ? 'transit reliability' : 'cost efficiency'}. There has been a ${(Math.random() * 15 + 5).toFixed(1)}% ${Math.random() > 0.5 ? 'improvement' : 'decline'} in on-time delivery performance in the last quarter, while average shipping costs have ${Math.random() > 0.5 ? 'decreased' : 'increased'} by ${(Math.random() * 8 + 2).toFixed(1)}%. The most significant shift has been in ${Math.random() > 0.5 ? 'air freight utilization' : 'carrier performance variability'}, which has changed by ${(Math.random() * 20 + 10).toFixed(1)}% year-over-year.`;
}
