import { Shipment, ForwarderPerformance, CountryPerformance, WarehousePerformance } from '@/types/deeptrack';

// Calculate shipment metrics
export function calculateShipmentMetrics(shipments: Shipment[]) {
  const totalShipments = shipments.length;
  const shipmentsByMode: { [key: string]: number } = {};
  const shipmentStatusCounts: { [key: string]: number } = {};
  let totalTransitTime = 0;
  let validTransitTimes = 0;
  let disruptionProbabilityScore = 0;
  let resilienceScore = 0;

  shipments.forEach(shipment => {
    // Count shipments by mode
    const mode = shipment.mode_of_shipment || 'Unknown';
    shipmentsByMode[mode] = (shipmentsByMode[mode] || 0) + 1;

    // Count shipments by status
    const status = shipment.delivery_status || 'Unknown';
    shipmentStatusCounts[status] = (shipmentStatusCounts[status] || 0) + 1;

    // Calculate transit time (assuming date_of_collection and date_of_arrival_destination are valid)
    if (shipment.date_of_collection && shipment.date_of_arrival_destination) {
      const collectionDate = new Date(shipment.date_of_collection);
      const arrivalDate = new Date(shipment.date_of_arrival_destination);
      const transitTime = (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24); // in days

      if (!isNaN(transitTime) && transitTime > 0) {
        totalTransitTime += transitTime;
        validTransitTimes++;
      }
    }

    // Aggregate disruption probability (simplified - needs actual logic)
    disruptionProbabilityScore += Math.random() * 0.1;

    // Aggregate resilience score (simplified - needs actual logic)
    resilienceScore += Math.random() * 0.1;
  });

  // Calculate average transit time
  const avgTransitTime = validTransitTimes > 0 ? totalTransitTime / validTransitTimes : 0;

  // Normalize disruption probability and resilience scores
  disruptionProbabilityScore = Math.min(10, disruptionProbabilityScore);
  resilienceScore = Math.min(100, resilienceScore * 10);

  return {
    totalShipments,
    shipmentsByMode,
    shipmentStatusCounts,
    avgTransitTime,
    disruptionProbabilityScore,
    resilienceScore
  };
}

// Fix the created_at reference by using date_of_collection instead
export function calculateForwarderPerformance(shipments: Shipment[]): ForwarderPerformance[] {
  const forwarders = new Map<string, {
    shipments: Shipment[];
    completedShipments: Shipment[];
    transitTimes: number[];
  }>();

  // Group shipments by forwarder
  shipments.forEach(shipment => {
    const forwarder = shipment.final_quote_awarded_freight_forwader_Carrier;
    
    // Skip invalid forwarders
    if (!forwarder || forwarder === 'UNHAS' || forwarder === 'Hand carried') return;
    
    if (!forwarders.has(forwarder)) {
      forwarders.set(forwarder, {
        shipments: [],
        completedShipments: [],
        transitTimes: []
      });
    }
    
    const forwarderData = forwarders.get(forwarder);
    if (forwarderData) {
      forwarderData.shipments.push(shipment);
      
      if (shipment.delivery_status === 'Delivered' && 
          shipment.date_of_collection && shipment.date_of_arrival_destination) {
        forwarderData.completedShipments.push(shipment);
        
        // Calculate transit time in days
        const collectionDate = new Date(shipment.date_of_collection);
        const deliveryDate = new Date(shipment.date_of_arrival_destination);
        const transitDays = (deliveryDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24);
        
        forwarderData.transitTimes.push(transitDays);
      }
    }
  });

  return Array.from(forwarders.entries()).map(([name, data]) => {
    const { shipments, completedShipments, transitTimes } = data;
    
    // Calculate average transit days
    const avgTransitDays = transitTimes.length > 0 
      ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length 
      : 0;
    
    // Calculate on-time rate (simplified)
    const onTimeRate = shipments.length > 0 ? completedShipments.length / shipments.length : 0;
    
    // Calculate average cost per kg
    const costPerKgValues = shipments
      .filter(s => s.weight_kg > 0 && s.forwarder_quotes && s.forwarder_quotes[name.toLowerCase()])
      .map(s => s.forwarder_quotes[name.toLowerCase()] / s.weight_kg);
    
    const avgCostPerKg = costPerKgValues.length > 0
      ? costPerKgValues.reduce((sum, cost) => sum + cost, 0) / costPerKgValues.length
      : 0;

    // Calculate reliability score
    const reliabilityScore = Math.min(1, Math.max(0, onTimeRate));
    
    // Calculate normalized scores for TOPSIS (higher is better)
    const costScore = avgCostPerKg > 0 ? 1 / avgCostPerKg : 0;
    const timeScore = avgTransitDays > 0 ? 1 / avgTransitDays : 0;
    
    // Calculate DeepScore (composite score from 0-100)
    const deepScore = (reliabilityScore + (costScore / 100) + (timeScore / 10)) / 3 * 100;

    return {
      name,
      totalShipments: shipments.length,
      avgCostPerKg,
      avgTransitDays,
      onTimeRate,
      reliabilityScore,
      deepScore,
      costScore,
      timeScore
    };
  }).sort((a, b) => b.reliabilityScore - a.reliabilityScore);
}

// Calculate country performance metrics
export function calculateCountryPerformance(shipments: Shipment[]): CountryPerformance[] {
  const countryData = new Map<string, {
    shipments: Shipment[];
    successfulDeliveries: number;
    totalCost: number;
    totalTransitTime: number;
  }>();

  shipments.forEach(shipment => {
    const country = shipment.destination_country;
    if (!countryData.has(country)) {
      countryData.set(country, {
        shipments: [],
        successfulDeliveries: 0,
        totalCost: 0,
        totalTransitTime: 0
      });
    }

    const data = countryData.get(country);
    if (data) {
      data.shipments.push(shipment);
      if (shipment.delivery_status === 'Delivered') {
        data.successfulDeliveries++;
      }

      // Calculate total cost for the route
      if (shipment.forwarder_quotes && typeof shipment.forwarder_quotes === 'object') {
        const costs = Object.values(shipment.forwarder_quotes).reduce((a, b) => a + b, 0);
        data.totalCost += costs;
      }

      // Calculate total transit time for the route
      if (shipment.date_of_collection && shipment.date_of_arrival_destination) {
        const collectionDate = new Date(shipment.date_of_collection);
        const arrivalDate = new Date(shipment.date_of_arrival_destination);
        const transitTime = (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24);
        data.totalTransitTime += transitTime;
      }
    }
  });

  return Array.from(countryData.entries()).map(([country, data]) => {
    const totalShipments = data.shipments.length;
    const deliverySuccessRate = totalShipments > 0 ? data.successfulDeliveries / totalShipments : 0;
    const deliveryFailureRate = 1 - deliverySuccessRate;
    const avgCostPerRoute = totalShipments > 0 ? data.totalCost / totalShipments : 0;
    const avgTransitDays = totalShipments > 0 && data.totalTransitTime > 0 ? data.totalTransitTime / totalShipments : 0;
    const reliabilityScore = deliverySuccessRate;

    return {
      country,
      totalShipments,
      deliverySuccessRate,
      deliveryFailureRate,
      avgCostPerRoute,
      avgTransitDays,
      reliabilityScore
    };
  }).sort((a, b) => b.totalShipments - a.totalShipments);
}

// Calculate warehouse performance metrics
export function calculateWarehousePerformance(shipments: Shipment[]): WarehousePerformance[] {
  const warehouseData = new Map<string, {
    shipments: Shipment[];
    successfulDispatches: number;
    packagingFailures: number;
    totalTransitTime: number;
  }>();

  shipments.forEach(shipment => {
    const location = shipment.origin_country;
    if (!warehouseData.has(location)) {
      warehouseData.set(location, {
        shipments: [],
        successfulDispatches: 0,
        packagingFailures: 0,
        totalTransitTime: 0
      });
    }

    const data = warehouseData.get(location);
    if (data) {
      data.shipments.push(shipment);
      
      // Mock dispatch success (replace with actual data)
      const isSuccessfulDispatch = Math.random() > 0.05;
      if (isSuccessfulDispatch) {
        data.successfulDispatches++;
      }
      
      // Mock packaging failures (replace with actual data)
      const isPackagingFailure = Math.random() < 0.02;
      if (isPackagingFailure) {
        data.packagingFailures++;
      }

      if (shipment.date_of_collection && shipment.date_of_arrival_destination) {
        const collectionDate = new Date(shipment.date_of_collection);
        const arrivalDate = new Date(shipment.date_of_arrival_destination);
        const transitTime = (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24);
        data.totalTransitTime += transitTime;
      }
    }
  });

  return Array.from(warehouseData.entries()).map(([location, data]) => {
    const totalShipments = data.shipments.length;
    const dispatchSuccessRate = totalShipments > 0 ? data.successfulDispatches / totalShipments : 0;
    const missedDispatchRate = 1 - dispatchSuccessRate;
    const packagingFailureRate = totalShipments > 0 ? data.packagingFailures / totalShipments : 0;
    const avgTransitDays = totalShipments > 0 && data.totalTransitTime > 0 ? data.totalTransitTime / totalShipments : 0;
    const reliabilityScore = dispatchSuccessRate * (1 - packagingFailureRate);

    return {
      location,
      totalShipments,
      dispatchSuccessRate,
      missedDispatchRate,
      packagingFailureRate,
      avgTransitDays,
      reliabilityScore
    };
  }).sort((a, b) => b.totalShipments - a.totalShipments);
}
