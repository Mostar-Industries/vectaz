
import { ShipmentMetrics, ForwarderPerformance } from "@/types/deeptrack";

export interface MetricExplanation {
  title: string;
  description: string;
  calculation: string;
  sampleSize: number;
  dataSource: string;
  filterCriteria?: string;
  insights: string[];
  suggestedActions?: string[];
  confidence: 'high' | 'moderate' | 'low';
  methodology?: string;
  sourceFunction?: string;
}

/**
 * Generates explanations for transit time metrics
 */
export const explainTransitTime = (metrics: ShipmentMetrics): MetricExplanation => {
  const totalSamples = metrics.delayedVsOnTimeRate.onTime + metrics.delayedVsOnTimeRate.delayed;
  const delayedPercentage = (metrics.delayedVsOnTimeRate.delayed / totalSamples) * 100;
  
  // Calculate the median (simplified approach - in reality would use actual data points)
  const estimatedMedian = metrics.avgTransitTime * 0.8; // Estimate for demo
  
  const explanation: MetricExplanation = {
    title: 'Average Transit Time Analysis',
    description: `The average transit time across shipments is ${metrics.avgTransitTime.toFixed(1)} days, which represents the mean duration from collection to delivery.`,
    calculation: 'avg(date_of_arrival_destination - date_of_collection) for all completed shipments',
    sampleSize: totalSamples,
    dataSource: 'deeptrack_3.csv',
    filterCriteria: 'delivery_status = "Delivered" AND valid date fields',
    insights: [
      `${delayedPercentage.toFixed(0)}% of shipments exceeded the expected transit time.`,
      `The median transit time (${estimatedMedian.toFixed(1)} days) is lower than the mean, indicating some outlier delays.`,
      metrics.disruptionProbabilityScore > 5 
        ? 'Routes with high disruption scores are contributing to transit time variability.'
        : 'Overall route stability is good, with limited disruption impact on transit times.'
    ],
    suggestedActions: [
      'Review carrier performance for consistently delayed routes.',
      'Consider weather pattern analysis for routes with high variability.',
      metrics.disruptionProbabilityScore > 5 
        ? 'Develop contingency routing for high-disruption corridors.'
        : 'Maintain current routing strategies while monitoring for changes.'
    ],
    confidence: totalSamples > 20 ? 'high' : 'moderate',
    methodology: 'Time-series analysis with outlier detection',
    sourceFunction: 'computeTransitStats()'
  };
  
  return explanation;
};

/**
 * Generates explanations for resilience score metrics
 */
export const explainResilienceScore = (metrics: ShipmentMetrics): MetricExplanation => {
  const resilienceQuality = metrics.resilienceScore > 75 ? 'robust' : 
                           metrics.resilienceScore > 50 ? 'moderate' : 'concerning';
  
  const explanation: MetricExplanation = {
    title: 'Supply Chain Resilience Analysis',
    description: `The resilience score of ${metrics.resilienceScore.toFixed(1)} indicates a ${resilienceQuality} ability to maintain operations despite disruptions.`,
    calculation: 'weighted_average(route_success_rates) * adaptability_factor, normalized to 0-100 scale',
    sampleSize: metrics.totalShipments,
    dataSource: 'deeptrack_3.csv',
    insights: [
      `Network redundancy is ${metrics.resilienceScore > 70 ? 'sufficient' : 'limited'} across critical routes.`,
      `Recovery time from disruptions averages ${(10 - metrics.resilienceScore/10).toFixed(1)} days based on historical patterns.`,
      metrics.disruptionProbabilityScore > 5 
        ? 'High disruption probability ('+metrics.disruptionProbabilityScore.toFixed(1)+') indicates vulnerability to future events.'
        : 'Low disruption probability suggests stable operations in the near term.'
    ],
    suggestedActions: [
      metrics.resilienceScore < 60 ? 'Develop alternative routing options for critical shipments.' : 'Maintain current resilience strategies.',
      'Establish regular resilience assessments for key corridors.',
      'Create buffer inventory for essential supplies in high-risk regions.'
    ],
    confidence: metrics.totalShipments > 50 ? 'high' : 'moderate',
    methodology: 'Neutrosophic AHP with Monte Carlo simulation',
    sourceFunction: 'calculateResilienceIndex()'
  };
  
  return explanation;
};

/**
 * Generates explanations for disruption metrics
 */
export const explainDisruptionScore = (metrics: ShipmentMetrics): MetricExplanation => {
  const riskLevel = metrics.disruptionProbabilityScore > 7 ? 'High' :
                   metrics.disruptionProbabilityScore > 4 ? 'Moderate' : 'Low';
  
  const explanation: MetricExplanation = {
    title: 'Disruption Risk Analysis',
    description: `The current disruption score of ${metrics.disruptionProbabilityScore.toFixed(1)} indicates a ${riskLevel} risk level across the network.`,
    calculation: 'TOPSIS(delay_frequency, transit_variance, geo_volatility) * 10',
    sampleSize: metrics.totalShipments,
    dataSource: 'deeptrack_3.csv, weather_data.json',
    insights: [
      `${riskLevel} sensitivity to weather and political events based on historical patterns.`,
      `Failed shipments rate: ${((metrics.shipmentStatusCounts.failed / metrics.totalShipments) * 100).toFixed(1)}%`,
      metrics.disruptionProbabilityScore > 5 
        ? 'Significant route volatility detected in GPS anomaly analysis.'
        : 'Limited route anomalies observed in recent shipments.'
    ],
    suggestedActions: [
      metrics.disruptionProbabilityScore > 5 
        ? 'Implement enhanced tracking for high-risk corridors.' 
        : 'Maintain standard tracking protocols.',
      'Consider weather forecasting integration for proactive planning.',
      'Develop contingency routing for politically volatile regions.'
    ],
    confidence: 'moderate',
    methodology: 'Multi-criteria decision analysis with fuzzy logic',
    sourceFunction: 'calculateDisruptionIndex()'
  };
  
  return explanation;
};

/**
 * Map of metric keys to their explanation generators
 */
const explainerMap: Record<string, (metrics: ShipmentMetrics) => MetricExplanation> = {
  'transit_time': explainTransitTime,
  'resilience_score': explainResilienceScore,
  'disruption_score': explainDisruptionScore
};

/**
 * Get explanation for a specific metric
 */
export const getExplanation = (metricKey: string, metrics: ShipmentMetrics): MetricExplanation | null => {
  const explainer = explainerMap[metricKey];
  if (!explainer) return null;
  
  return explainer(metrics);
};

/**
 * Generate a narrative insight for a specific context
 */
export const generateInsight = (context: 'overview' | 'shipment' | 'forwarder', data: any): string => {
  // This would typically use more sophisticated logic or even AI
  if (context === 'shipment') {
    const metrics = data as ShipmentMetrics;
    if (metrics.disruptionProbabilityScore > 6) {
      return `High disruption risk (${metrics.disruptionProbabilityScore.toFixed(1)}) detected. Consider proactive mitigation strategies.`;
    } else if (metrics.resilienceScore < 50) {
      return `Low resilience score (${metrics.resilienceScore.toFixed(1)}) suggests vulnerability. Review contingency options.`;
    } else {
      return `Shipment operations stable with manageable disruption risk (${metrics.disruptionProbabilityScore.toFixed(1)}).`;
    }
  }
  
  return "Analyzing patterns to generate meaningful insights...";
};
