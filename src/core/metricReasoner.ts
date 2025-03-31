
import { ShipmentMetrics, Shipment } from "@/types/deeptrack";

interface MetricDetail {
  value: number;
  calculation: string;
  sampleSize: number;
  confidence: 'high' | 'moderate' | 'low';
  sourceRows?: number[];
  insights: string[];
}

/**
 * Performs detailed analysis of a resilience score and provides
 * explanations of how it was calculated and what it means
 */
export const analyzeResilienceScore = (metrics: ShipmentMetrics, rawData?: Shipment[]): MetricDetail => {
  // In a real implementation, this would recompute the metric from raw data
  // For this demo, we'll use the pre-calculated value
  
  const sampleSize = metrics.totalShipments;
  
  // Determine confidence based on sample size
  const confidence = 
    sampleSize >= 100 ? 'high' :
    sampleSize >= 30 ? 'moderate' : 'low';
  
  // Generate insights based on the score
  const insights = [];
  
  if (metrics.resilienceScore < 50) {
    insights.push('Network redundancy is limited, increasing vulnerability to disruptions');
    insights.push('Recovery capacity is constrained by limited alternative routing options');
  } else if (metrics.resilienceScore < 75) {
    insights.push('Moderate resilience with some vulnerability to concurrent disruptions');
    insights.push('Network has partial redundancy but may struggle with multiple simultaneous issues');
  } else {
    insights.push('Strong resilience architecture with robust contingency capabilities');
    insights.push('Multiple redundant pathways available for critical routes');
  }
  
  if (metrics.noQuoteRatio > 0.2) {
    insights.push(`Limited carrier options (${(metrics.noQuoteRatio * 100).toFixed(0)}% no-quote ratio) contribute to resilience challenges`);
  }
  
  // Mock source rows - in reality, these would be the indices of relevant shipments
  const mockSourceRows = Array.from({length: 5}, () => Math.floor(Math.random() * sampleSize));
  
  return {
    value: metrics.resilienceScore,
    calculation: 'weighted_average(route_success_rates) * adaptability_factor',
    sampleSize,
    confidence,
    sourceRows: mockSourceRows,
    insights
  };
};

/**
 * Analyzes disruption probability and provides detailed breakdown
 */
export const analyzeDisruptionProbability = (metrics: ShipmentMetrics): MetricDetail => {
  const sampleSize = metrics.totalShipments;
  
  // Determine confidence based on sample size and recent data
  const confidence = 
    sampleSize >= 50 ? 'high' :
    sampleSize >= 20 ? 'moderate' : 'low';
  
  // Generate insights
  const insights = [];
  
  if (metrics.disruptionProbabilityScore > 7) {
    insights.push('High risk of disruption based on historical patterns and current conditions');
    insights.push('Consider proactive intervention for critical shipments');
  } else if (metrics.disruptionProbabilityScore > 4) {
    insights.push('Moderate disruption risk with increased vigilance recommended');
    insights.push('Specific routes or carriers may require contingency planning');
  } else {
    insights.push('Low disruption probability with stable operating conditions');
    insights.push('Standard monitoring protocols are sufficient');
  }
  
  // Add insight about failed shipments if relevant
  const failureRate = metrics.shipmentStatusCounts.failed / metrics.totalShipments;
  if (failureRate > 0.05) {
    insights.push(`Historical failure rate of ${(failureRate * 100).toFixed(1)}% indicates systemic vulnerabilities`);
  }
  
  return {
    value: metrics.disruptionProbabilityScore,
    calculation: 'composite_score(delay_frequency, transit_variance, geo_political_factors, weather_patterns)',
    sampleSize,
    confidence,
    insights
  };
};

/**
 * Calculates the network health score based on multiple metrics
 */
export const calculateNetworkHealth = (metrics: ShipmentMetrics): MetricDetail => {
  // Calculate the component values
  const resilienceComponent = metrics.resilienceScore;
  const onTimeRate = metrics.delayedVsOnTimeRate.onTime / 
    (metrics.delayedVsOnTimeRate.onTime + metrics.delayedVsOnTimeRate.delayed) * 100 || 0;
  const disruptionResistance = Math.max(0, 100 - (metrics.disruptionProbabilityScore * 10));
  const quoteAvailability = (1 - metrics.noQuoteRatio) * 100;
  const completionRate = metrics.shipmentStatusCounts.completed / 
    (metrics.totalShipments || 1) * 100;
    
  // Calculate the weighted score
  const networkHealthScore = (
    resilienceComponent * 0.25 + 
    onTimeRate * 0.25 + 
    disruptionResistance * 0.2 + 
    quoteAvailability * 0.15 + 
    completionRate * 0.15
  );
  
  // Generate insights
  const insights = [];
  
  // Identify the weakest component
  const components = [
    { name: 'Resilience', value: resilienceComponent },
    { name: 'On-Time Performance', value: onTimeRate },
    { name: 'Disruption Resistance', value: disruptionResistance },
    { name: 'Quote Availability', value: quoteAvailability },
    { name: 'Completion Rate', value: completionRate }
  ];
  
  const weakestComponent = components.reduce((prev, current) => 
    (prev.value < current.value) ? prev : current
  );
  
  insights.push(`Network health is primarily constrained by ${weakestComponent.name.toLowerCase()} (${weakestComponent.value.toFixed(1)})`);
  
  if (networkHealthScore < 50) {
    insights.push('Critical intervention required to improve network stability');
  } else if (networkHealthScore < 70) {
    insights.push('Targeted improvements needed in specific performance areas');
  } else {
    insights.push('Network is functioning well with robust performance across key metrics');
  }
  
  return {
    value: networkHealthScore,
    calculation: '0.25*resilience + 0.25*onTimeRate + 0.2*disruptionResistance + 0.15*quoteAvailability + 0.15*completionRate',
    sampleSize: metrics.totalShipments,
    confidence: metrics.totalShipments > 30 ? 'high' : 'moderate',
    insights
  };
};

/**
 * Map of metric functions for easy access
 */
export const metricAnalyzers = {
  resilience: analyzeResilienceScore,
  disruption: analyzeDisruptionProbability,
  networkHealth: calculateNetworkHealth
};
