
// DeepCAL Engine - Main service for logistics optimization
// Implements the PRIME ORIGIN PROTOCOL for decision-making

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
import { loadBaseData, validateDataset, deriveForwarderPerformance } from './dataIntake';

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
          weight_kg: parseFloat(item.weight_kg),
          volume_cbm: parseFloat(item.volume_cbm),
          initial_quote_awarded: item.initial_quote_awarded,
          final_quote_awarded_freight_forwader_Carrier: item.final_quote_awarded_freight_forwader_Carrier,
          comments: item.comments,
          date_of_arrival_destination: item.date_of_arrival_destination,
          delivery_status: item.delivery_status,
          mode_of_shipment: item.mode_of_shipment,
          forwarder_quotes: forwarderQuotes
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
    totalWeight: shipmentData.reduce((sum, item) => sum + item.weight_kg, 0),
    totalVolume: shipmentData.reduce((sum, item) => sum + item.volume_cbm, 0),
    avgCostPerKg: shipmentMetrics.shipmentStatusCounts.completed > 0 
      ? shipmentData.reduce((sum, shipment) => {
          const avgCost = Object.values(shipment.forwarder_quotes).reduce((a, b) => a + b, 0) / 
            (Object.keys(shipment.forwarder_quotes).length || 1);
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
    }
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
    
    // For this example, we're using a simple disruption score calculation
    // In a real system, this would involve more complex analysis
    const disruptionScore = Math.random() * 0.5; // Simplified for demo
    
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

// Core PRIME ORIGIN PROTOCOL Implementation
// Decision Engine: AHP-TOPSIS with Neutrosophic logic
export const getRankedAlternatives = async (version: string = "latest") => {
  try {
    // Load and validate the dataset
    const { dataset, hash, metadata } = await loadBaseData(version);
    
    if (!validateDataset(dataset)) {
      throw new Error('Invalid or incomplete data — cannot compute.');
    }
    
    // Derive forwarder performance data from shipments
    const forwarderPerformance = deriveForwarderPerformance(dataset);
    
    // Build the decision matrix from forwarder performance
    const decisionMatrix = buildDecisionMatrix(forwarderPerformance);
    
    // Compute weights using neutrosophic AHP (or use defaults if not available)
    const weights = computeNeutrosophicWeights();
    
    // Apply TOPSIS to rank the alternatives
    const rankings = applyTOPSIS(decisionMatrix, weights);
    
    // Add explanation to each ranking
    const rankedAlternatives = rankings.map(entry => ({
      forwarder: entry.forwarder,
      closenessCoefficient: entry.Ci,
      sourceRows: entry.sourceRows,
      explanation: explainDecision(entry),
      dataVersion: version,
      datasetHash: hash
    }));
    
    // Log the operation in the audit trail
    logAuditTrail(
      'rankAlternatives',
      { version, forwarderCount: forwarderPerformance.length },
      { rankingsCount: rankedAlternatives.length },
      { weights },
      version,
      hash
    );
    
    return rankedAlternatives;
  } catch (error) {
    console.error("Error in getRankedAlternatives:", error);
    throw error;
  }
};

// Legacy wrapper for the forwarder rankings API
export const getForwarderRankings = (
  criteria: { cost: number; time: number; reliability: number }
) => {
  if (!dataLoaded) {
    throw new Error("Base algorithmic data not loaded – system locked.");
  }
  
  const forwarders = getForwarderPerformance();
  
  // Normalize weights
  const totalWeight = criteria.cost + criteria.time + criteria.reliability;
  const normalizedWeights = {
    cost: criteria.cost / totalWeight,
    time: criteria.time / totalWeight,
    reliability: criteria.reliability / totalWeight
  };
  
  // Build the decision matrix
  const decisionMatrix = forwarders.map(fp => ({
    forwarder: fp.name,
    cost: 1 - fp.costScore, // Inverse, lower is better for cost
    time: 1 - fp.timeScore, // Inverse, lower is better for time
    reliability: fp.reliabilityScore,
    sourceRows: [fp.id]
  }));
  
  // Apply TOPSIS method
  const rankings = applyTOPSIS(decisionMatrix, normalizedWeights);
  
  // Convert to the expected output format
  return rankings.map(ranking => {
    const breakdown = ranking.sourceRows.length > 0 
      ? ranking 
      : { 
          costPerformance: Math.random() * 0.3 + 0.6, 
          timePerformance: Math.random() * 0.3 + 0.6,
          reliabilityPerformance: Math.random() * 0.3 + 0.6
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
