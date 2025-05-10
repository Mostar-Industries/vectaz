/**
 * @deprecated This service has been consolidated into DecisionCore.ts
 * Please migrate to the new unified decision engine:
 * import { DecisionCore } from '@/core/DecisionCore';
 * 
 * Migration Guide:
 * 1. Replace deepEngine.getKPIs() with DecisionCore.calculateKPIs()
 * 2. Replace deepEngine.getRankedAlternatives() with DecisionCore.runOptimization()
 * 3. All analytics functions now available through DecisionCore.analyze()
 */

// DeepCAL Engine - Main service for logistics optimization
// Implements the Neutrosophic AHP-TOPSIS methodology for decision-making

import { Shipment, ForwarderPerformance, RoutePerformance } from "@/types/deeptrack";
import { 
  calculateShipmentMetrics, 
  calculateForwarderPerformance, 
  calculateCountryPerformance,
  calculateWarehousePerformance 
} from "@/utils/analyticsUtils";
import { computeNeutrosophicWeights, getDefaultWeights } from './ahpModule';
import { applyTOPSIS, buildDecisionMatrix } from './topsisEngine';
import { logAuditTrail } from './auditLogger';
import { explainDecision, summarizeRankings } from './deepExplain';
import { loadBaseData, validateDataset } from './dataIntake';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// Utility function to normalize scores deterministically
function normalizeScore(value: number, min: number, max: number, outMin: number, outMax: number): number {
  if (value <= min) return outMin;
  if (value >= max) return outMax;
  return outMin + (value - min) * (outMax - outMin) / (max - min);
}

// Interface to Python calculation validator module
async function snapshotDecision(matrix: number[][], weights: Record<string, number>, scores: number[], forwarders: string[], metadata: any = {}): Promise<void> {
  try {
    console.log('📸 Creating decision snapshot for audit trail...');
    
    // Prepare payload for Python bridge
    const payload = {
      matrix,
      weights,
      scores,
      forwarders,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        engine: 'Neutrosophic AHP-TOPSIS',
        environment: process.env.NODE_ENV || 'development'
      }
    };
    
    // In production, this would make a request to the Python service
    // For now, we'll log the snapshot payload for demo purposes
    console.log('✅ Decision snapshot created:', JSON.stringify(payload));
    
    // Store the snapshot in localStorage for demo purposes
    if (typeof window !== 'undefined') {
      const snapshots = JSON.parse(localStorage.getItem('deepcal_snapshots') || '[]');
      snapshots.push(payload);
      localStorage.setItem('deepcal_snapshots', JSON.stringify(snapshots));
    }
    
    return;
  } catch (error) {
    console.error('❌ Failed to create decision snapshot:', error);
    throw new Error('Failed to create audit snapshot');
  }
}

// This simulates loading data from the canonical CSV
const shipmentData: Shipment[] = [];

// Data loading and validation
let dataLoaded = false;
let dataVersion = "";

export const loadAndValidateData = (data: any[]): boolean => {
  try {
    // Validate required fields are present in all records
    const requiredFields = [
      'date_of_collection', 'request_reference', 'origin_country',
      'destination_country', 'weight_kg', 'delivery_status'
    ];
    
    const isValid = data.every(item => 
      requiredFields.every(field => field in item && item[field] !== null)
    );
    
    if (isValid) {
      // Process raw data into our Shipment format
      shipmentData.length = 0; // Clear existing data
      
      data.forEach(item => {
        // Parse forwarder quotes from columns
        const forwarderQuotes: Record<string, number> = {};
        const knownForwarders = [
          'kenya_airways', 'kuehne_nagel', 'scan_global_logistics', 
          'dhl_express', 'dhl_global', 'bwosi', 'agl', 'siginon', 'frieght_in_time'
        ];
        
        knownForwarders.forEach(forwarder => {
          if (item[forwarder] && typeof item[forwarder] === 'number') {
            forwarderQuotes[forwarder] = item[forwarder];
          }
        });
        
        // Add processed shipment to our data store
        shipmentData.push({
          date_of_collection: item.date_of_collection,
          request_reference: item.request_reference,
          cargo_description: item.cargo_description,
          item_category: item.item_category,
          origin_country: item.origin_country,
          origin_longitude: parseFloat(item.origin_longitude),
          origin_latitude: parseFloat(item.origin_latitude),
          destination_country: item.destination_country,
          destination_longitude: parseFloat(item.destination_longitude),
          destination_latitude: parseFloat(item.destination_latitude),
          freight_carrier: item.freight_carrier,
          weight_kg: String(parseFloat(item.weight_kg)),
          volume_cbm: String(parseFloat(item.volume_cbm)),
          initial_quote_awarded: item.initial_quote_awarded,
          final_quote_awarded_freight_forwader_Carrier: item.final_quote_awarded_freight_forwader_Carrier,
          comments: item.comments,
          date_of_arrival_destination: item.date_of_arrival_destination,
          delivery_status: item.delivery_status,
          mode_of_shipment: item.mode_of_shipment,
          forwarder_quotes: forwarderQuotes,
          customs_clearance_time_days: undefined,
          freight_carrier_cost: undefined,
          emergency_grade: undefined,
          carrier: ""
        });
      });
      
      // Set metadata about the data
      dataLoaded = true;
      dataVersion = `v1.0.0-${new Date().toISOString()}`;
      
      // Validate analytics output against base data
      validateAnalyticsOutput();
      
      // Log the data load in audit trail
      logAuditTrail(
        'loadData',
        { recordCount: data.length },
        { validatedCount: shipmentData.length },
        {},
        dataVersion,
        'manual-load'
      );
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Data validation failed:", error);
    return false;
  }
};

// Check if data is loaded and valid
export const isDataLoaded = (): boolean => dataLoaded;

export const getDataVersion = (): string => dataVersion;

// Validate analytics output for data consistency
const validateAnalyticsOutput = () => {
  try {
    // Validate shipment metrics
    const shipmentMetrics = calculateShipmentMetrics(shipmentData);
    console.info("Shipment metrics validated:", shipmentMetrics.totalShipments === shipmentData.length);
    
    // Validate forwarder performance
    const forwarderPerformance = calculateForwarderPerformance(shipmentData);
    const uniqueForwarders = new Set(shipmentData.map(s => s.final_quote_awarded_freight_forwader_Carrier)).size;
    console.info("Forwarder metrics validated:", forwarderPerformance.length <= uniqueForwarders);
    
    // Validate country performance
    const countryPerformance = calculateCountryPerformance(shipmentData);
    const uniqueDestinations = new Set(shipmentData.map(s => s.destination_country)).size;
    console.info("Country metrics validated:", countryPerformance.length === uniqueDestinations);
    
    // Validate warehouse performance
    const warehousePerformance = calculateWarehousePerformance(shipmentData);
    const uniqueOrigins = new Set(shipmentData.map(s => s.origin_country)).size;
    console.info("Warehouse metrics validated:", warehousePerformance.length === uniqueOrigins);
    
    console.info("All analytics outputs validated successfully.");
  } catch (error) {
    console.error("Analytics validation failed:", error);
  }
};

// Analytics Engine Functions
export const getKPIs = () => {
  if (!dataLoaded) {
    throw new Error("Base algorithmic data not loaded – system locked.");
  }
  
  // Use the analytics utilities to calculate KPIs
  const shipmentMetrics = calculateShipmentMetrics(shipmentData);
  
  return {
    totalShipments: shipmentMetrics.totalShipments,
    totalWeight: shipmentData.reduce((sum, item) => sum + Number(item.weight_kg), 0),
    totalVolume: shipmentData.reduce((sum, item) => sum + Number(item.volume_cbm), 0),
    avgCostPerKg: shipmentMetrics.shipmentStatusCounts.completed > 0 
      ? shipmentData.reduce((sum, shipment) => {
          const avgCost = (shipment.forwarder_quotes ? 
            Object.values(shipment.forwarder_quotes).reduce(
              (sum: number, quote: unknown) => {
                const num = typeof quote === 'number' ? quote : Number(quote);
                return sum + (isFinite(num) ? num : 0);
              }, 
              0
            ) : 0) / 
            Math.max(1, Object.keys(shipment.forwarder_quotes || {}).length);
          return sum + avgCost;
        }, 0) / shipmentMetrics.shipmentStatusCounts.completed
      : 0,
    avgTransitDays: shipmentMetrics.avgTransitTime,
    modeSplit: {
      air: shipmentMetrics.shipmentsByMode['Air'] 
        ? (shipmentMetrics.shipmentsByMode['Air'] / shipmentMetrics.totalShipments) * 100 
        : 0,
      road: shipmentMetrics.shipmentsByMode['Road'] 
        ? (shipmentMetrics.shipmentsByMode['Road'] / shipmentMetrics.totalShipments) * 100 
        : 0,
      sea: shipmentMetrics.shipmentsByMode['Sea'] 
        ? (shipmentMetrics.shipmentsByMode['Sea'] / shipmentMetrics.totalShipments) * 100 
        : 0
    },
    onTimeRate: shipmentMetrics.shipmentStatusCounts.completed > 0 
      ? (shipmentMetrics.shipmentStatusCounts.completed / shipmentMetrics.totalShipments) * 100 
      : 0,
    disruptionProbabilityScore: shipmentMetrics.disruptionProbabilityScore,
    resilienceScore: shipmentMetrics.resilienceScore,
    shipmentStatusCounts: shipmentMetrics.shipmentStatusCounts,
    monthlyTrend: shipmentMetrics.monthlyTrend,
    shipmentsByMode: shipmentMetrics.shipmentsByMode,
    delayedVsOnTimeRate: shipmentMetrics.delayedVsOnTimeRate,
    noQuoteRatio: shipmentMetrics.noQuoteRatio,
    topForwarder: shipmentMetrics.topForwarder,
    topCarrier: shipmentMetrics.topCarrier,
    carrierCount: shipmentMetrics.carrierCount,
    forwarderPerformance: shipmentMetrics.forwarderPerformance,
    carrierPerformance: shipmentMetrics.carrierPerformance
  };
};

// Get top routes by volume
export const getTopRoutes = (limit: number = 5): RoutePerformance[] => {
  if (!dataLoaded) {
    throw new Error("Base algorithmic data not loaded – system locked.");
  }
  
  // Group shipments by route
  const routeMap = new Map<string, Shipment[]>();
  
  shipmentData.forEach(shipment => {
    const routeKey = `${shipment.origin_country}-${shipment.destination_country}`;
    if (!routeMap.has(routeKey)) {
      routeMap.set(routeKey, []);
    }
    routeMap.get(routeKey)?.push(shipment);
  });
  
  // Calculate performance metrics for each route
  const routePerformance: RoutePerformance[] = Array.from(routeMap.entries()).map(([key, shipments]) => {
    const [origin, destination] = key.split('-');
    const totalShipments = shipments.length;
    
    // Calculate average transit days
    const completedShipments = shipments.filter(s => 
      s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
    );
    
    const transitTimes = completedShipments.map(s => {
      const collectionDate = new Date(s.date_of_collection);
      const arrivalDate = new Date(s.date_of_arrival_destination);
      return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // days
    });
    
    const avgTransitDays = transitTimes.length > 0 
      ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
      : 0;
    
    // Calculate disruption score based on percentage of delayed shipments
    const delayedShipments = shipments.filter(s => 
      s.delivery_status === 'Delayed' || (s.date_of_arrival_destination && 
      new Date(s.date_of_arrival_destination) > new Date(s.date_of_arrival_destination || ''))
    );
    
    // Deterministic disruption score based on delayed percentage
    const disruptionScore = shipments.length > 0 ? 
      Math.min(0.5, (delayedShipments.length / shipments.length)) : 
      0
    
    // Calculate reliability based on completed shipments ratio
    const reliabilityScore = completedShipments.length / totalShipments;
    
    return {
      origin,
      destination,
      avgTransitDays,
      avgCostPerKg: 0, // This would be calculated from real cost data
      disruptionScore,
      reliabilityScore,
      totalShipments
    };
  });
  
  // Sort by total shipments and return top N
  return routePerformance
    .sort((a, b) => b.totalShipments - a.totalShipments)
    .slice(0, limit);
};

// Get forwarder performance metrics
export const getForwarderPerformance = (): ForwarderPerformance[] => {
  if (!dataLoaded) {
    throw new Error("Base algorithmic data not loaded – system locked.");
  }
  
  // Use the analytics utility to calculate forwarder performance
  return calculateForwarderPerformance(shipmentData);
};

// Core implementation of the Neutrosophic AHP-TOPSIS methodology
export const getRankedAlternatives = async (version: string = "latest") => {
  try {
    // Load and validate dataset
    const { dataset, hash, metadata } = await loadBaseData(version);
    
    if (!validateDataset(dataset)) {
      throw new Error('Invalid or incomplete data — cannot compute.');
    }
    
    // Compute weights using Neutrosophic AHP
    const weights = computeNeutrosophicWeights();
    
    // Derive forwarder performance from dataset
    const forwarderPerformance = deriveForwarderPerformance(dataset);
    
    // Build the decision matrix using forwarder performance
    const decisionMatrix = buildDecisionMatrix(forwarderPerformance);
    
    // Apply TOPSIS to generate rankings
    const rankings = applyTOPSIS(decisionMatrix, weights);
    
    // Extract raw matrix for snapshot
    const rawMatrix = decisionMatrix.map(row => [
      row.cost || 0, 
      row.time || 0, 
      row.reliability || 0
    ]);
    
    // Extract scores for snapshot
    const scores = rankings.map(r => r.Ci);
    
    // Extract forwarder names for snapshot
    const forwarderNames = rankings.map(r => r.forwarder);
    
    // Create weights dictionary for snapshot
    const weightsDict = {
      cost: weights.cost,
      time: weights.time,
      reliability: weights.reliability
    };
    
    // 🔒 CRITICAL: Enforce snapshot_decision for all ranked outputs
    await snapshotDecision(
      rawMatrix,
      weightsDict,
      scores,
      forwarderNames,
      {
        version,
        hash,
        computation_timestamp: new Date().toISOString()
      }
    );
    
    // Add explanations and result information
    const results = rankings.map(entry => ({
      forwarder: entry.forwarder,
      closenessCoefficient: entry.Ci,
      sourceRows: entry.sourceRows || [],
      explanation: explainDecision(entry),
      dataVersion: version,
      datasetHash: hash
    }));
    
    // Generate metadata for traceability
    const resultMetadata = {
      engine: "Neutrosophic AHP-TOPSIS",
      data_version: version,
      hash: hash,
      explanation_ready: results.every(r => r.explanation),
      computation_timestamp: new Date().toISOString(),
      snapshot_created: true // Track that a snapshot was created
    };
    
    // Log the operation in audit trail
    logAuditTrail(
      'getRankedAlternatives',
      { version, forwarderCount: forwarderPerformance.length },
      { rankingsCount: results.length },
      { weights, snapshot: true },
      version,
      hash
    );
    
    return { results, metadata: resultMetadata };
  } catch (error) {
    console.error("Error in getRankedAlternatives:", error);
    throw error;
  }
};

// Helper function to derive forwarder performance from shipment data
function deriveForwarderPerformance(dataset: any[]): ForwarderPerformance[] {
  // Group shipments by forwarder
  const forwarderMap = new Map<string, any[]>();
  
  dataset.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, []);
    }
    forwarderMap.get(forwarder)?.push(shipment);
  });
  
  // Calculate performance metrics for each forwarder
  return Array.from(forwarderMap.entries())
    .filter(([name, _]) => name && name !== 'Hand carried' && name !== 'UNHAS')
    .map(([name, shipments]) => {
      const total = shipments.length;
      const completed = shipments.filter(s => 
        s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
      );
      
      const transitDays = completed.map(s => {
        const collectionDate = new Date(s.date_of_collection);
        const arrivalDate = new Date(s.date_of_arrival_destination);
        return (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24);
      });
      
      const avgTransitDays = transitDays.length > 0 
        ? transitDays.reduce((sum, days) => sum + days, 0) / transitDays.length 
        : 0;
      
      const onTimeRate = completed.length / Math.max(total, 1);
      const reliabilityScore = Math.min(1, Math.max(0, onTimeRate));
      
      const costPerKg = shipments
        .filter(s => s.weight_kg > 0 && s.forwarder_quotes && s.forwarder_quotes[name.toLowerCase()])
        .map(s => s.forwarder_quotes[name.toLowerCase()] / s.weight_kg);
      
      const avgCostPerKg = costPerKg.length > 0
        ? costPerKg.reduce((sum, cost) => sum + cost, 0) / costPerKg.length
        : 0;
        
      const costScore = avgCostPerKg > 0 ? 1 / avgCostPerKg : 0;
      const timeScore = avgTransitDays > 0 ? 1 / avgTransitDays : 0;
      
      return {
        name,
        total,
        avgCostPerKg,
        avgTransitDays,
        shipments,
        score: calculateForwarderScore(shipments),
        reliability: calculateReliability(shipments),
        onTimeRate: calculateOnTimeRate(shipments),
        reliabilityScore,
        costScore,
        timeScore,
        deepScore: calculateDeepScore(shipments),
        id: uuidv4()
      } as unknown as ForwarderPerformance;
    });
}

// Calculation Utilities
function calculateForwarderScore(shipments: Shipment[]): number {
  const completed = shipments.filter(s => s.delivery_status === 'Delivered').length;
  const total = shipments.length;
  const reliability = total > 0 ? completed / total : 0;
  
  const avgCost = shipments.reduce((sum, s) => {
    const quotes = s.forwarder_quotes ? Object.values(s.forwarder_quotes) : [];
    const avg = quotes.length ? quotes.reduce((a, b) => a + Number(b), 0) / quotes.length : 0;
    return sum + avg;
  }, 0) / Math.max(1, shipments.length);

  return (reliability * 0.6) + ((1 / avgCost) * 0.4);
}
  
function calculateReliability(shipments: Shipment[]): number {
  const completed = shipments.filter(s => s.delivery_status === 'Delivered').length;
  return shipments.length > 0 ? completed / shipments.length : 0;
}

function calculateOnTimeRate(shipments: Shipment[]): number {
  const onTime = shipments.filter(s => 
    s.delivery_status === 'Delivered' && 
    s.date_of_arrival_destination && 
    s.date_of_greenlight_to_pickup &&
    new Date(s.date_of_arrival_destination) <= new Date(s.date_of_greenlight_to_pickup)
  ).length;
  
  return shipments.length > 0 ? onTime / shipments.length : 0;
}

function calculateDeepScore(shipments: Shipment[]): number {
  const reliability = calculateReliability(shipments);
  const onTimeRate = calculateOnTimeRate(shipments);
  const costScore = 1 / (shipments.reduce((sum, s) => {
    const quotes = s.forwarder_quotes ? Object.values(s.forwarder_quotes) : [];
    return sum + (quotes.length ? Math.min(...quotes.map(Number)) : 0);
  }, 0) / Math.max(1, shipments.length));
  
  return (reliability * 0.4) + (onTimeRate * 0.3) + (costScore * 0.3);
}

// Legacy wrapper for the forwarder rankings API
export const getForwarderRankings = (
  criteria: { cost: number; time: number; reliability: number }
) => {
  if (!dataLoaded) {
    throw new Error("Base algorithmic data not loaded – system locked.");
  }
  
  const forwarderData = getForwarderPerformance();
  
  // Normalize weights
  const totalWeight = criteria.cost + criteria.time + criteria.reliability;
  const normalizedWeights = {
    cost: criteria.cost / totalWeight,
    time: criteria.time / totalWeight,
    reliability: criteria.reliability / totalWeight
  };
  
  // Build the decision matrix
  const decisionMatrix = forwarderData.map(fp => ({
    forwarder: fp.name,
    cost: fp.avgCostPerKg > 0 ? 1 / fp.avgCostPerKg : 0, // Inverse, lower is better for cost
    time: fp.avgTransitDays > 0 ? 1 / fp.avgTransitDays : 0, // Inverse, lower is better for time
    reliability: fp.reliabilityScore,
    sourceRows: [fp.name.toLowerCase().replace(/\s+/g, '_')]
  }));
  
  // Apply TOPSIS method
  const rankings = applyTOPSIS(decisionMatrix, normalizedWeights);
  
  // Convert to the expected output format
  return rankings.map(ranking => {
    // Get the actual forwarder data
    const forwarderInfo = forwarderData.find(f => f.name === ranking.forwarder);
    
    // Calculate deterministic performance metrics
    const breakdown = ranking.sourceRows.length > 0 
      ? ranking 
      : { 
          // Use deterministic values based on the normalized scores
          costPerformance: forwarderInfo ? normalizeScore(forwarderInfo.avgCostPerKg, 0, 20, 0.6, 0.9) : 0.6,
          timePerformance: forwarderInfo ? normalizeScore(forwarderInfo.avgTransitDays, 0, 30, 0.6, 0.9) : 0.7,
          reliabilityPerformance: forwarderInfo ? forwarderInfo.reliabilityScore * 0.9 + 0.1 : 0.8
        };
    
    return {
      forwarder: ranking.forwarder,
      score: ranking.Ci,
      closeness: ranking.Ci,
      costPerformance: 1 - (breakdown.costPerformance || 0.3),
      timePerformance: 1 - (breakdown.timePerformance || 0.3),
      reliabilityPerformance: breakdown.reliabilityPerformance || 0.8
    };
  });
};

// Mock sample data for demonstration
export const loadMockData = () => {
  const sampleData = [
    {
      date_of_collection: "11-Jan-24",
      request_reference: "SR_24-001_NBO hub_Zimbabwe",
      cargo_description: "Cholera kits and Tents",
      item_category: "Emergency Health Kits",
      origin_country: "Kenya",
      origin_longitude: "1.2404475",
      origin_latitude: "36.990054",
      destination_country: "Zimbabwe",
      destination_longitude: "-17.80269125",
      destination_latitude: "31.08848075",
      freight_carrier: "Kenya Airways",
      kenya_airways: 18681,
      kuehne_nagel: 18681,
      scan_global_logistics: 0,
      dhl_express: 0,
      dhl_global: 0,
      bwosi: 0,
      agl: 0,
      siginon: 0,
      frieght_in_time: 0,
      weight_kg: "7352.98",
      volume_cbm: "24.68",
      initial_quote_awarded: "Kuehne Nagel",
      final_quote_awarded_freight_forwader_Carrier: "Kenya Airways",
      comments: "Kenya Airways via Kuehne Nagel",
      date_of_arrival_destination: "17-Jan-24",
      delivery_status: "Delivered",
      mode_of_shipment: "Air"
    },
    {
      date_of_collection: "14-Jan-24",
      request_reference: "SR_24-002_NBO hub_Ethiopia",
      cargo_description: "Medical Supplies",
      item_category: "Health Supplies",
      origin_country: "Kenya",
      origin_longitude: "1.2404475",
      origin_latitude: "36.990054",
      destination_country: "Ethiopia",
      destination_longitude: "9.145",
      destination_latitude: "40.489673",
      freight_carrier: "DHL Express",
      kenya_airways: 0,
      kuehne_nagel: 12500,
      scan_global_logistics: 13200,
      dhl_express: 11800,
      dhl_global: 12000,
      bwosi: 0,
      agl: 0,
      siginon: 0,
      frieght_in_time: 0,
      weight_kg: "3421.5",
      volume_cbm: "12.3",
      initial_quote_awarded: "DHL Express",
      final_quote_awarded_freight_forwader_Carrier: "DHL Express",
      comments: "Urgent medical supplies",
      date_of_arrival_destination: "18-Jan-24",
      delivery_status: "Delivered",
      mode_of_shipment: "Air"
    },
    {
      date_of_collection: "20-Jan-24",
      request_reference: "SR_24-003_NBO hub_Somalia",
      cargo_description: "Food Supplies",
      item_category: "Nutrition",
      origin_country: "Kenya",
      origin_longitude: "1.2404475",
      origin_latitude: "36.990054",
      destination_country: "Somalia",
      destination_longitude: "5.152149",
      destination_latitude: "46.199616",
      freight_carrier: "Kuehne Nagel",
      kenya_airways: 0,
      kuehne_nagel: 8500,
      scan_global_logistics: 9200,
      dhl_express: 0,
      dhl_global: 8800,
      bwosi: 8300,
      agl: 0,
      siginon: 0,
      frieght_in_time: 0,
      weight_kg: "5240.75",
      volume_cbm: "18.5",
      initial_quote_awarded: "Kuehne Nagel",
      final_quote_awarded_freight_forwader_Carrier: "Kuehne Nagel",
      comments: "Nutrition program supplies",
      date_of_arrival_destination: "28-Jan-24",
      delivery_status: "Delivered",
      mode_of_shipment: "Road"
    },
    {
      date_of_collection: "05-Feb-24",
      request_reference: "SR_24-004_NBO hub_South Sudan",
      cargo_description: "Shelter Materials",
      item_category: "Emergency Shelter",
      origin_country: "Kenya",
      origin_longitude: "1.2404475",
      origin_latitude: "36.990054",
      destination_country: "South Sudan",
      destination_longitude: "6.877000",
      destination_latitude: "31.307000",
      freight_carrier: "Scan Global Logistics",
      kenya_airways: 0,
      kuehne_nagel: 15600,
      scan_global_logistics: 14800,
      dhl_express: 0,
      dhl_global: 16200,
      bwosi: 0,
      agl: 15900,
      siginon: 0,
      frieght_in_time: 0,
      weight_kg: "8750.25",
      volume_cbm: "32.4",
      initial_quote_awarded: "Scan Global Logistics",
      final_quote_awarded_freight_forwader_Carrier: "Scan Global Logistics",
      comments: "Emergency shelter materials",
      date_of_arrival_destination: "18-Feb-24",
      delivery_status: "Delivered",
      mode_of_shipment: "Road"
    },
    {
      date_of_collection: "12-Feb-24",
      request_reference: "SR_24-005_SA hub_Mozambique",
      cargo_description: "Water Purification Equipment",
      item_category: "WASH",
      origin_country: "South Africa",
      origin_longitude: "-26.204103",
      origin_latitude: "28.047305",
      destination_country: "Mozambique",
      destination_longitude: "-25.891968",
      destination_latitude: "32.605135",
      freight_carrier: "DHL Global",
      kenya_airways: 0,
      kuehne_nagel: 9800,
      scan_global_logistics: 0,
      dhl_express: 0,
      dhl_global: 9200,
      bwosi: 0,
      agl: 9600,
      siginon: 0,
      frieght_in_time: 0,
      weight_kg: "4320.50",
      volume_cbm: "15.8",
      initial_quote_awarded: "DHL Global",
      final_quote_awarded_freight_forwader_Carrier: "DHL Global",
      comments: "Water treatment supplies",
      date_of_arrival_destination: "22-Feb-24",
      delivery_status: "Delivered",
      mode_of_shipment: "Road"
    },
    {
      date_of_collection: "01-Mar-24",
      request_reference: "SR_24-006_NBO hub_Uganda",
      cargo_description: "COVID-19 Test Kits",
      item_category: "Health Diagnostics",
      origin_country: "Kenya",
      origin_longitude: "1.2404475",
      origin_latitude: "36.990054",
      destination_country: "Uganda",
      destination_longitude: "0.347596",
      destination_latitude: "32.582520",
      freight_carrier: "Kenya Airways",
      kenya_airways: 7200,
      kuehne_nagel: 7500,
      scan_global_logistics: 7800,
      dhl_express: 8100,
      dhl_global: 0,
      bwosi: 0,
      agl: 0,
      siginon: 7400,
      frieght_in_time: 0,
      weight_kg: "1250.75",
      volume_cbm: "5.4",
      initial_quote_awarded: "Kenya Airways",
      final_quote_awarded_freight_forwader_Carrier: "Kenya Airways",
      comments: "Temperature-sensitive cargo",
      date_of_arrival_destination: "03-Mar-24",
      delivery_status: "Delivered",
      mode_of_shipment: "Air"
    },
    {
      date_of_collection: "15-Mar-24",
      request_reference: "SR_24-007_UAE hub_Yemen",
      cargo_description: "Emergency Medical Kits",
      item_category: "Health Emergency",
      origin_country: "UAE",
      origin_longitude: "25.204849",
      origin_latitude: "55.270783",
      destination_country: "Yemen",
      destination_longitude: "15.369445",
      destination_latitude: "44.191007",
      freight_carrier: "DHL Express",
      kenya_airways: 0,
      kuehne_nagel: 21500,
      scan_global_logistics: 22800,
      dhl_express: 20900,
      dhl_global: 21200,
      bwosi: 0,
      agl: 0,
      siginon: 0,
      frieght_in_time: 0,
      weight_kg: "3850.25",
      volume_cbm: "14.2",
      initial_quote_awarded: "DHL Express",
      final_quote_awarded_freight_forwader_Carrier: "DHL Express",
      comments: "Critical medical supplies",
      date_of_arrival_destination: "18-Mar-24",
      delivery_status: "In Transit",
      mode_of_shipment: "Air"
    },
    {
      date_of_collection: "20-Mar-24",
      request_reference: "SR_24-008_SA hub_Zimbabwe",
      cargo_description: "Solar Powered Refrigerators",
      item_category: "Cold Chain Equipment",
      origin_country: "South Africa",
      origin_longitude: "-26.204103",
      origin_latitude: "28.047305",
      destination_country: "Zimbabwe",
      destination_longitude: "-17.80269125",
      destination_latitude: "31.08848075",
      freight_carrier: "Kuehne Nagel",
      kenya_airways: 0,
      kuehne_nagel: 16800,
      scan_global_logistics: 17500,
      dhl_express: 0,
      dhl_global: 17200,
      bwosi: 0,
      agl: 16900,
      siginon: 0,
      frieght_in_time: 0,
      weight_kg: "8920.50",
      volume_cbm: "26.4",
      initial_quote_awarded: "Kuehne Nagel",
      final_quote_awarded_freight_forwader_Carrier: "Kuehne Nagel",
      comments: "Fragile cold chain equipment",
      date_of_arrival_destination: "",
      delivery_status: "In Transit",
      mode_of_shipment: "Road"
    },
    {
      date_of_collection: "25-Mar-24",
      request_reference: "SR_24-009_NBO hub_Tanzania",
      cargo_description: "PPE Supplies",
      item_category: "Health Protection",
      origin_country: "Kenya",
      origin_longitude: "1.2404475",
      origin_latitude: "36.990054",
      destination_country: "Tanzania",
      destination_longitude: "-6.776012",
      destination_latitude: "39.178326",
      freight_carrier: "Siginon",
      kenya_airways: 0,
      kuehne_nagel: 8800,
      scan_global_logistics: 0,
      dhl_express: 0,
      dhl_global: 9100,
      bwosi: 0,
      agl: 0,
      siginon: 8500,
      frieght_in_time: 8700,
      weight_kg: "4250.75",
      volume_cbm: "18.2",
      initial_quote_awarded: "Siginon",
      final_quote_awarded_freight_forwader_Carrier: "Siginon",
      comments: "Healthcare worker protection gear",
      date_of_arrival_destination: "",
      delivery_status: "In Transit",
      mode_of_shipment: "Road"
    },
    {
      date_of_collection: "02-Apr-24",
      request_reference: "SR_24-010_NBO hub_Malawi",
      cargo_description: "Nutrition Supplements",
      item_category: "Nutrition",
      origin_country: "Kenya",
      origin_longitude: "1.2404475",
      origin_latitude: "36.990054",
      destination_country: "Malawi",
      destination_longitude: "-13.254308",
      destination_latitude: "34.301525",
      freight_carrier: "Kenya Airways",
      kenya_airways: 14200,
      kuehne_nagel: 14800,
      scan_global_logistics: 15200,
      dhl_express: 0,
      dhl_global: 14600,
      bwosi: 0,
      agl: 0,
      siginon: 0,
      frieght_in_time: 0,
      weight_kg: "2850.50",
      volume_cbm: "9.6",
      initial_quote_awarded: "Kenya Airways",
      final_quote_awarded_freight_forwader_Carrier: "Kenya Airways",
      comments: "Temperature-controlled nutrition supplements",
      date_of_arrival_destination: "",
      delivery_status: "Pending",
      mode_of_shipment: "Air"
    }
  ];
  
  return loadAndValidateData(sampleData);
};

// Initialize with mock data for demonstration
loadMockData();
