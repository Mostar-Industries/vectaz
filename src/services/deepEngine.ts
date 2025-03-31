
import { Shipment, ForwarderPerformance, RoutePerformance } from "@/types/deeptrack";

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

// Analytics Engine Functions
export const getKPIs = () => {
  if (!dataLoaded) {
    throw new Error("Base algorithmic data not loaded – system locked.");
  }
  
  // Calculate overall KPIs
  const totalShipments = shipmentData.length;
  const totalWeight = shipmentData.reduce((sum, item) => sum + item.weight_kg, 0);
  const totalVolume = shipmentData.reduce((sum, item) => sum + item.volume_cbm, 0);
  
  // Calculate cost metrics
  const shipmentCosts = shipmentData.filter(s => 
    s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()]
  ).map(s => ({
    cost: s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()],
    weight: s.weight_kg
  }));
  
  const totalCost = shipmentCosts.reduce((sum, item) => sum + item.cost, 0);
  const avgCostPerKg = totalCost / shipmentCosts.reduce((sum, item) => sum + item.weight, 0);
  
  // Calculate time metrics
  const completedShipments = shipmentData.filter(s => 
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
  
  // Calculate reliability metrics
  const airShipments = shipmentData.filter(s => s.mode_of_shipment === 'Air').length;
  const roadShipments = shipmentData.filter(s => s.mode_of_shipment === 'Road').length;
  const seaShipments = shipmentData.filter(s => s.mode_of_shipment === 'Sea').length;
  
  return {
    totalShipments,
    totalWeight,
    totalVolume,
    avgCostPerKg,
    avgTransitDays,
    modeSplit: {
      air: (airShipments / totalShipments) * 100,
      road: (roadShipments / totalShipments) * 100,
      sea: (seaShipments / totalShipments) * 100
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
    
    // Calculate cost metrics
    const totalWeight = shipments.reduce((sum, s) => sum + s.weight_kg, 0);
    
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
  
  // Group shipments by forwarder
  const forwarderMap = new Map<string, Shipment[]>();
  
  shipmentData.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, []);
    }
    forwarderMap.get(forwarder)?.push(shipment);
  });
  
  // Calculate performance metrics for each forwarder
  const forwarderPerformance: ForwarderPerformance[] = Array.from(forwarderMap.entries())
    .filter(([name, _]) => name && name !== 'Hand carried' && name !== 'UNHAS') // Filter out non-forwarders
    .map(([name, shipments]) => {
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
      
      // Calculate on-time rate (simplified)
      const onTimeRate = Math.min(0.5 + Math.random() * 0.5, 0.99); // Simplified for demo
      
      // Calculate reliability score based on on-time rate and completed ratio
      const reliabilityScore = (onTimeRate + (completedShipments.length / totalShipments)) / 2;
      
      return {
        name,
        totalShipments,
        avgCostPerKg: 0, // Would be calculated from real cost data
        avgTransitDays,
        onTimeRate,
        reliabilityScore
      };
    });
  
  // Sort by reliability score
  return forwarderPerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
};

// Decision Engine: AHP-TOPSIS (simplified implementation)
// In a real system, this would be a more robust implementation
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
  
  // This is where the full AHP-TOPSIS would be implemented
  // For demonstration, we're using a simplified approach
  
  // Calculate an overall score for each forwarder
  const rankings = forwarders.map(forwarder => {
    // For demo purposes - in a real system these would be properly normalized values
    const costScore = 1 - Math.random() * 0.3; // Lower is better
    const timeScore = 1 - (forwarder.avgTransitDays / 10); // Lower is better
    const reliabilityScore = forwarder.reliabilityScore; // Higher is better
    
    // Weighted sum
    const weightedScore = 
      (normalizedWeights.cost * costScore) +
      (normalizedWeights.time * timeScore) +
      (normalizedWeights.reliability * reliabilityScore);
    
    return {
      forwarder: forwarder.name,
      score: weightedScore,
      closeness: weightedScore, // In TOPSIS this would be calculated differently
      costPerformance: costScore,
      timePerformance: timeScore,
      reliabilityPerformance: reliabilityScore
    };
  });
  
  return rankings.sort((a, b) => b.score - a.score);
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
    // Add more sample data as needed
  ];
  
  return loadAndValidateData(sampleData);
};

// Initialize with mock data for demonstration
loadMockData();
