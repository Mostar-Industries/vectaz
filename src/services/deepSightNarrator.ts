
// DeepSight Narrator Service
// Provides explanations for metrics and insights in the system

export interface MetricExplanation {
  title: string;
  description: string;
  calculation: string;
  sampleSize: number;
  methodology: string;
  interpretation: string;
  recommendations: string[];
}

export function explainShipmentMetrics(metricKey: string): MetricExplanation {
  const explanations: Record<string, MetricExplanation> = {
    'shipment_total': {
      title: 'Total Shipments',
      description: 'The complete count of all shipments tracked in the system across all origins, destinations, and statuses.',
      calculation: 'Simple count of all shipment records in the dataset.',
      sampleSize: 100, // Example value
      methodology: 'Comprehensive count with no filtering or exclusions.',
      interpretation: 'This number provides a baseline for all other metrics and insights. A higher number generally indicates more robust data.',
      recommendations: [
        'Use this as context for other metrics',
        'Track this number over time to identify volume trends'
      ]
    },
    'transit_time': {
      title: 'Average Transit Time',
      description: 'The average number of days from collection to delivery across all completed shipments.',
      calculation: 'Sum of transit days for all delivered shipments divided by the count of delivered shipments.',
      sampleSize: 75, // Example value
      methodology: 'Calculated only from shipments with "Delivered" status and valid collection/arrival dates.',
      interpretation: 'Lower values indicate more efficient logistics operations. Industry benchmarks vary by region and mode.',
      recommendations: [
        'Compare against industry benchmarks by region',
        'Analyze outliers to identify inefficient routes',
        'Track over time to observe impact of operational changes'
      ]
    },
    'disruption_score': {
      title: 'Disruption Probability Score',
      description: 'A predictive risk index (0-10) estimating the likelihood of future disruptions based on historical patterns and current conditions.',
      calculation: 'Composite score derived from on-time rates, geopolitical factors, and seasonal patterns using Neutrosophic AHP-TOPSIS methodology.',
      sampleSize: 100, // Example value
      methodology: 'The score is calculated using a combination of historical performance data and predictive models that account for uncertainty and incomplete information.',
      interpretation: '0-3: Low risk, 4-7: Moderate risk, 8-10: High risk. Higher scores indicate greater likelihood of disruptions.',
      recommendations: [
        'Focus mitigation strategies on routes with scores above 7',
        'Develop contingency plans for moderate risk corridors',
        'Re-evaluate forwarder selection for high-risk segments'
      ]
    },
    'resilience_score': {
      title: 'Resilience Score',
      description: 'Measures the supply chain\'s ability to recover quickly from disruptions and maintain delivery reliability.',
      calculation: 'Calculated using a multifactor model based on historical recovery rates, forwarder diversity, and route flexibility.',
      sampleSize: 100, // Example value
      methodology: 'The score is derived using Neutrosophic AHP-TOPSIS analysis of recovery patterns from past disruptions.',
      interpretation: '0-50: Weak resilience, 51-75: Moderate resilience, 76-100: Strong resilience. Higher scores indicate better ability to overcome disruptions.',
      recommendations: [
        'For scores below 50, increase forwarder diversity',
        'For scores below 75, develop alternative routing strategies',
        'Regularly simulate disruptions to test and improve resilience'
      ]
    }
  };

  return explanations[metricKey] || {
    title: 'Metric Explanation',
    description: 'Detailed explanation not available for this metric.',
    calculation: 'Calculation method not documented.',
    sampleSize: 0,
    methodology: 'Methodology not documented.',
    interpretation: 'Interpretation guidelines not available.',
    recommendations: ['Documentation needed for this metric.']
  };
}

export function explainForwarderMetrics(metricKey: string, forwarder: string): MetricExplanation {
  const explanations: Record<string, MetricExplanation> = {
    'reliability_score': {
      title: `${forwarder} Reliability Score`,
      description: 'A composite assessment of a forwarder\'s overall dependability based on multiple performance factors.',
      calculation: 'Weighted average of on-time delivery rate, quote accuracy, and communication responsiveness.',
      sampleSize: 30, // Example value
      methodology: 'Calculated using normalized scores for each factor and Neutrosophic AHP-TOPSIS weighting.',
      interpretation: 'Higher scores indicate more reliable forwarders. Scores above 0.8 are considered excellent.',
      recommendations: [
        'Consider consolidating volume with high-scoring forwarders',
        'Request performance improvement plans from low-scoring forwarders',
        'Use as a key factor in tender decisions'
      ]
    },
    'transit_days': {
      title: `${forwarder} Transit Days`,
      description: 'The average number of days this forwarder takes to complete shipments from collection to delivery.',
      calculation: 'Sum of transit days for all delivered shipments divided by the count of delivered shipments.',
      sampleSize: 25, // Example value
      methodology: 'Calculated only from shipments with "Delivered" status and valid collection/arrival dates.',
      interpretation: 'Lower values indicate faster delivery performance. Compare against market averages for context.',
      recommendations: [
        'Identify routes where this forwarder excels in speed',
        'Negotiate improved transit times on underperforming routes',
        'Consider mode switching for time-sensitive cargo'
      ]
    },
    'quote_win_rate': {
      title: `${forwarder} Quote Win Rate`,
      description: 'The percentage of quotes submitted by this forwarder that were selected for shipment execution.',
      calculation: 'Number of shipments awarded divided by total number of quotes submitted.',
      sampleSize: 50, // Example value
      methodology: 'Calculated across all routes and time periods where this forwarder submitted quotes.',
      interpretation: 'Higher percentages indicate more competitive pricing and/or better overall value proposition.',
      recommendations: [
        'Analyze winning quotes to identify competitive advantages',
        'Consider increasing volume with high win-rate forwarders',
        'Provide feedback to low win-rate forwarders to improve competitiveness'
      ]
    }
  };

  return explanations[metricKey] || {
    title: `${forwarder} Metric`,
    description: 'Detailed explanation not available for this metric.',
    calculation: 'Calculation method not documented.',
    sampleSize: 0,
    methodology: 'Methodology not documented.',
    interpretation: 'Interpretation guidelines not available.',
    recommendations: ['Documentation needed for this metric.']
  };
}

export function explainCountryMetrics(metricKey: string, country: string): MetricExplanation {
  // Similar implementation to the above functions
  return {
    title: `${country} ${metricKey.replace('_', ' ')}`,
    description: 'Detailed explanation not available for this metric.',
    calculation: 'Calculation method not documented.',
    sampleSize: 0,
    methodology: 'Neutrosophic AHP-TOPSIS analysis applied to country-specific logistics data.',
    interpretation: 'Interpretation guidelines not available.',
    recommendations: ['Documentation needed for this metric.']
  };
}

export function getMetricInsight(metric: string, value: number): string {
  // Provide contextual insights based on metric values
  const insights: Record<string, (val: number) => string> = {
    'transit_time': (val) => 
      val < 5 ? "Exceptional transit time, well below industry average." :
      val < 10 ? "Good transit time, within industry standards." :
      val < 15 ? "Average transit time, consider optimization." :
      "Above average transit time, investigate delays.",
    
    'disruption_score': (val) =>
      val < 3 ? "Low disruption risk, maintain current strategies." :
      val < 7 ? "Moderate disruption risk, monitor closely." :
      "High disruption risk, immediate mitigation recommended.",
    
    'resilience_score': (val) =>
      val < 50 ? "Weak resilience, significant improvements needed." :
      val < 75 ? "Moderate resilience, continue strengthening strategies." :
      "Strong resilience, maintain and share best practices."
  };
  
  return insights[metric] ? 
    insights[metric](value) : 
    "No specific insight available for this metric value.";
}
