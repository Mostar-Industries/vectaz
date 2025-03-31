
import { 
  ShipmentMetrics, 
  ForwarderPerformance, 
  CountryPerformance,
  WarehousePerformance
} from '@/types/deeptrack';
import { metricAnalyzers } from '@/core/metricReasoner';

// Define the interface for metric explanations
export interface MetricExplanation {
  title: string;
  description: string;
  calculation: string;
  sampleSize: number;
  dataSource: string;
  filterCriteria: string;
  insights: string[];
  suggestedActions: string[];
  confidence: 'high' | 'moderate' | 'low';
  methodology: string;
  sourceFunction: string;
}

/**
 * Deep analysis for shipment metrics - generates comprehensive explanations
 */
export const explainShipmentMetrics = (metrics: ShipmentMetrics): Record<string, MetricExplanation> => {
  // Get detailed analysis for key metrics
  const resilienceAnalysis = metricAnalyzers.resilience(metrics);
  const disruptionAnalysis = metricAnalyzers.disruption(metrics);
  const networkHealthAnalysis = metricAnalyzers.networkHealth(metrics);
  
  const explanations: Record<string, MetricExplanation> = {
    resilience: {
      title: 'Supply Chain Resilience Analysis',
      description: 'This analysis quantifies your network\'s ability to maintain operations during disruptions and recover quickly afterward.',
      calculation: 'weighted_average(route_success_rates) * adaptability_factor',
      sampleSize: metrics.totalShipments,
      dataSource: 'shipment_records.json, historical_performance.csv',
      filterCriteria: 'time_window = last 90 days',
      insights: resilienceAnalysis.insights,
      suggestedActions: [
        'Focus on improving redundancy for critical routes with resilience < 60%',
        'Implement diversification strategy for carrier selection on high-risk corridors',
        metrics.resilienceScore < 70 ? 'Develop contingency routing options for top 3 destinations' : 'Maintain current resilience protocols'
      ],
      confidence: resilienceAnalysis.confidence,
      methodology: 'Multi-criteria analysis combining route success rates, carrier redundancy, and historical recovery patterns',
      sourceFunction: 'calculateResilienceScore()'
    },
    
    disruption: {
      title: 'Disruption Probability Assessment',
      description: 'This metric predicts the likelihood of significant supply chain disruptions based on historical patterns and current conditions.',
      calculation: 'composite_score(delay_frequency, transit_variance, geo_political_factors, weather_patterns)',
      sampleSize: metrics.totalShipments,
      dataSource: 'disruption_events.json, external_risk_factors.csv',
      filterCriteria: 'severity >= medium, impact_scope = network',
      insights: disruptionAnalysis.insights,
      suggestedActions: [
        'Implement early warning monitoring for routes with disruption score > 7',
        'Establish buffer inventory for destinations with high disruption probability',
        metrics.disruptionProbabilityScore > 6 ? 'Conduct scenario planning exercises for major disruption events' : 'Maintain current monitoring protocols'
      ],
      confidence: disruptionAnalysis.confidence,
      methodology: 'Predictive modeling using historical disruption patterns, geopolitical risk indices, and weather pattern analysis',
      sourceFunction: 'calculateDisruptionProbability()'
    },
    
    networkHealth: {
      title: 'Network Health Assessment',
      description: 'Comprehensive evaluation of your supply chain network\'s overall health and operational effectiveness.',
      calculation: '0.25*resilience + 0.25*onTimeRate + 0.2*disruptionResistance + 0.15*quoteAvailability + 0.15*completionRate',
      sampleSize: metrics.totalShipments,
      dataSource: 'shipment_metrics.json, carrier_performance.csv',
      filterCriteria: 'active_routes = all',
      insights: networkHealthAnalysis.insights,
      suggestedActions: [
        'Address critical bottlenecks in ' + (metrics.resilienceScore < 60 ? 'network resilience' : 'on-time performance'),
        'Implement ' + (metrics.disruptionProbabilityScore > 6 ? 'urgent' : 'routine') + ' monitoring for high-risk corridors',
        networkHealthAnalysis.value < 60 ? 'Develop comprehensive network optimization plan' : 'Fine-tune operations in underperforming segments'
      ],
      confidence: networkHealthAnalysis.confidence,
      methodology: 'Composite scoring using weighted averages of key performance indicators',
      sourceFunction: 'calculateNetworkHealth()'
    },
    
    transitTime: {
      title: 'Transit Time Performance Analysis',
      description: 'Assessment of average transit times across your supply chain network with trend analysis.',
      calculation: 'avg(date_of_arrival_destination - date_of_collection) for completed shipments',
      sampleSize: metrics.shipmentStatusCounts.completed,
      dataSource: 'shipment_tracking.json, delivery_confirmation.csv',
      filterCriteria: 'delivery_status = Delivered, valid tracking data',
      insights: [
        `Current average transit time is ${metrics.avgTransitTime.toFixed(1)} days across all modes.`,
        metrics.delayedVsOnTimeRate.delayed > metrics.delayedVsOnTimeRate.onTime ? 
          'Significant delays are impacting overall performance.' : 
          'Transit times are generally within expected parameters.',
        `On-time delivery rate is ${metrics.delayedVsOnTimeRate.onTime / (metrics.delayedVsOnTimeRate.onTime + metrics.delayedVsOnTimeRate.delayed) * 100}%.`
      ],
      suggestedActions: [
        metrics.avgTransitTime > 7 ? 'Review carrier performance for consistently delayed routes' : 'Maintain current carrier allocations',
        'Optimize mode selection based on transit time requirements and criticality',
        'Implement enhanced tracking for shipments with predicted delays'
      ],
      confidence: metrics.shipmentStatusCounts.completed > 30 ? 'high' : metrics.shipmentStatusCounts.completed > 10 ? 'moderate' : 'low',
      methodology: 'Statistical analysis of historical transit times with outlier detection',
      sourceFunction: 'calculateTransitTimeMetrics()'
    }
  };
  
  return explanations;
};

/**
 * Deep analysis for forwarder performance - generates comprehensive explanations
 */
export const explainForwarderPerformance = (forwarder: ForwarderPerformance): MetricExplanation => {
  return {
    title: `${forwarder.name} Performance Analysis`,
    description: `Comprehensive assessment of ${forwarder.name}'s service quality, cost-efficiency, and reliability across your supply chain.`,
    calculation: 'deepScore = 0.4*normalizedCost + 0.4*reliabilityScore + 0.2*normalizedTime',
    sampleSize: forwarder.totalShipments,
    dataSource: 'forwarder_performance.json, carrier_metrics.csv',
    filterCriteria: `freight_carrier = "${forwarder.name}", status = all`,
    insights: [
      `${forwarder.name} has handled ${forwarder.totalShipments} shipments with an on-time rate of ${(forwarder.onTimeRate * 100).toFixed(1)}%.`,
      `Average transit time is ${forwarder.avgTransitDays.toFixed(1)} days with cost efficiency of $${forwarder.avgCostPerKg.toFixed(2)}/kg.`,
      `Reliability score is ${(forwarder.reliabilityScore * 100).toFixed(1)}%, ranking ${forwarder.deepScore > 75 ? 'above' : 'below'} average.`,
      forwarder.quoteWinRate ? `Quote competitiveness shows ${(forwarder.quoteWinRate * 100).toFixed(1)}% win rate.` : ''
    ].filter(Boolean),
    suggestedActions: [
      forwarder.deepScore > 75 ? 
        `Consider increasing allocation to ${forwarder.name} for critical shipments` : 
        `Review performance metrics with ${forwarder.name} to address challenges`,
      forwarder.avgTransitDays > 7 ? 
        `Investigate consistent transit delays with ${forwarder.name}` : 
        `Acknowledge strong transit performance in carrier reviews`,
      forwarder.reliabilityScore < 0.7 ? 
        `Implement enhanced tracking for ${forwarder.name} shipments` : 
        `Maintain current monitoring protocols`
    ],
    confidence: forwarder.totalShipments > 30 ? 'high' : forwarder.totalShipments > 10 ? 'moderate' : 'low',
    methodology: 'Multi-dimensional performance analysis using normalized scores across key metrics',
    sourceFunction: 'evaluateForwarderPerformance()'
  };
};

/**
 * Deep analysis for country performance - generates comprehensive explanations
 */
export const explainCountryPerformance = (country: CountryPerformance): MetricExplanation => {
  return {
    title: `${country.country} Route Performance Analysis`,
    description: `Comprehensive assessment of shipment performance, challenges, and opportunities for the ${country.country} corridor.`,
    calculation: 'routeScore = f(reliability, cost, clearance_time, disruption_incidents)',
    sampleSize: country.totalShipments,
    dataSource: 'country_metrics.json, route_performance.csv',
    filterCriteria: `destination_country = "${country.country}", status = all`,
    insights: [
      `${country.country} has received ${country.totalShipments} shipments with ${(country.deliveryFailureRate * 100).toFixed(1)}% failure rate.`,
      `Average transit time is ${country.avgTransitDays?.toFixed(1) || 'N/A'} days with customs clearance taking ${country.avgCustomsClearanceTime.toFixed(1)} days.`,
      `Resilience index is ${country.resilienceIndex.toFixed(1)}/100, indicating ${country.resilienceIndex > 70 ? 'strong' : country.resilienceIndex > 50 ? 'moderate' : 'challenging'} route stability.`,
      `Preferred mode is ${country.preferredMode} (${country.topForwarders.length > 0 ? 'top forwarder: ' + country.topForwarders[0] : 'no dominant forwarder'}).`
    ],
    suggestedActions: [
      country.deliveryFailureRate > 0.1 ? 
        `Implement enhanced risk mitigation for ${country.country} shipments` : 
        `Maintain current routing protocols for ${country.country}`,
      country.avgCustomsClearanceTime > 5 ? 
        `Review customs documentation process for ${country.country}` : 
        `Document successful customs protocols for knowledge sharing`,
      country.borderDelayIncidents > 5 ? 
        `Develop contingency plans for border delays` : 
        `Monitor border conditions during seasonal periods`
    ],
    confidence: country.totalShipments > 30 ? 'high' : country.totalShipments > 10 ? 'moderate' : 'low',
    methodology: 'Geo-specific performance analysis combining historical performance data with regional risk factors',
    sourceFunction: 'analyzeCountryPerformance()'
  };
};

/**
 * Deep analysis for warehouse performance - generates comprehensive explanations
 */
export const explainWarehousePerformance = (warehouse: WarehousePerformance): MetricExplanation => {
  return {
    title: `${warehouse.location} Origin Performance Analysis`,
    description: `Comprehensive assessment of operations, efficiency, and quality metrics for shipments originating from ${warehouse.location}.`,
    calculation: 'reliabilityScore = 0.3*(1-packagingFailure) + 0.4*(1-missedDispatch) + 0.3*(1-rescheduled)',
    sampleSize: warehouse.totalShipments,
    dataSource: 'warehouse_metrics.json, origin_performance.csv',
    filterCriteria: `origin_country = "${warehouse.location}", status = all`,
    insights: [
      `${warehouse.location} has processed ${warehouse.totalShipments} shipments with ${warehouse.avgPickPackTime.toFixed(1)} days average processing time.`,
      `Quality metrics show ${(warehouse.packagingFailureRate * 100).toFixed(1)}% packaging issues and ${(warehouse.missedDispatchRate * 100).toFixed(1)}% missed dispatches.`,
      `Overall reliability score is ${warehouse.reliabilityScore.toFixed(1)}/100, ${warehouse.reliabilityScore > 80 ? 'indicating excellent performance' : warehouse.reliabilityScore > 60 ? 'showing acceptable performance' : 'highlighting improvement opportunities'}.`,
      `Cost comparison shows ${warehouse.costDiscrepancy > 0 ? warehouse.costDiscrepancy.toFixed(1) + '% higher' : Math.abs(warehouse.costDiscrepancy).toFixed(1) + '% lower'} costs than network average.`
    ],
    suggestedActions: [
      warehouse.packagingFailureRate > 0.05 ? 
        `Implement enhanced quality controls for packaging in ${warehouse.location}` : 
        `Document successful packaging protocols for knowledge sharing`,
      warehouse.missedDispatchRate > 0.1 ? 
        `Review dispatch scheduling process in ${warehouse.location}` : 
        `Maintain current dispatch protocols`,
      warehouse.costDiscrepancy > 10 ? 
        `Conduct cost optimization assessment for ${warehouse.location} operations` : 
        `Share cost-effective practices across network`
    ],
    confidence: warehouse.totalShipments > 30 ? 'high' : warehouse.totalShipments > 10 ? 'moderate' : 'low',
    methodology: 'Origin-specific performance analysis examining operational efficiency and quality metrics',
    sourceFunction: 'evaluateWarehousePerformance()'
  };
};
