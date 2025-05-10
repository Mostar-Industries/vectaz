import {
  CarrierPerformance,
  CountryPerformance,
  ForwarderPerformance,
  Shipment,
  ShipmentMetrics,
  WarehousePerformance,
} from "@/types/deeptrack";
import { fetchShipmentsWithCache } from './analyticsCache';
import { assertForwarderShape } from './typeAssertions';
import { mean, std } from 'mathjs';

export const analyzeShipmentData = (shipmentData: any[]) => {
  const deliveryStatusBreakdown = shipmentData.reduce((acc, shipment) => {
    const status = shipment.delivery_status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const forwarderBreakdown = shipmentData.reduce((acc, shipment) => {
    const forwarder = shipment.freight_carrier || "Unknown";
    acc[forwarder] = (acc[forwarder] || 0) + 1;
    return acc;
  }, {});

  const countryBreakdown = shipmentData.reduce((acc, shipment) => {
    const country = shipment.destination_country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const modeBreakdown = shipmentData.reduce((acc, shipment) => {
    const mode = shipment.mode_of_shipment || "Unknown";
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {});

  return {
    totalShipments: shipmentData.length,
    deliveryStatusBreakdown,
    forwarderBreakdown,
    countryBreakdown,
    modeBreakdown,
    averageWeight:
      shipmentData.reduce((sum, item) => sum + (item.weight_kg || 0), 0) /
        shipmentData.length || 0,
    rawData: shipmentData,
  };
};

export function calculateShipmentMetrics(
  shipments: Shipment[],
): ShipmentMetrics {
  const totalShipments = shipments.length;

  const shipmentsByMode: Record<string, number> = {};
  shipments.forEach((shipment) => {
    const mode = shipment.mode_of_shipment || "Unspecified";
    shipmentsByMode[mode] = (shipmentsByMode[mode] || 0) + 1;
  });

  const shipmentStatusCounts = {
    active: 0,
    completed: 0,
    failed: 0,
    onTime: 0,
    inTransit: 0,
  };

  shipments.forEach((shipment) => {
    const status = shipment.delivery_status.toLowerCase();
    if (status === "in transit" || status === "pending") {
      shipmentStatusCounts.active += 1;
      shipmentStatusCounts.inTransit += 1;
    } else if (status === "delivered") {
      shipmentStatusCounts.completed += 1;
      shipmentStatusCounts.onTime += 1;
    } else {
      shipmentStatusCounts.failed += 1;
    }
  });

  const completedShipments = shipments.filter((s) =>
    s.delivery_status === "Delivered" && s.date_of_collection &&
    s.date_of_arrival_destination
  );

  const transitTimes = completedShipments.map((s) => {
    const collectionDate = new Date(s.date_of_collection);
    const arrivalDate = new Date(s.date_of_arrival_destination);
    return (arrivalDate.getTime() - collectionDate.getTime()) /
      (1000 * 60 * 60 * 24); // days
  });

  const avgTransitTime = transitTimes.length > 0
    ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length
    : 0;

  const onTimePercentage = totalShipments > 0
    ? (completedShipments.length / totalShipments) * 100
    : 0;

  const disruptionProbabilityScore = 10 - (onTimePercentage / 10);

  const resilienceScore = Math.min(
    100,
    Math.max(
      0,
      50 +
        (onTimePercentage / 2) -
        (disruptionProbabilityScore * 5),
    ),
  );

  const avgCostPerKg = calculateAvgCostForAllShipments(shipments);
  const forwarderPerformance = {};
  const carrierPerformance = {};
  const topForwarder = shipments.length > 0
    ? (shipments[0].final_quote_awarded_freight_forwader_Carrier || "Unknown")
    : "Unknown";
  const topCarrier = shipments.length > 0
    ? (shipments[0].carrier || "Unknown")
    : "Unknown";
  const carrierCount = new Set(shipments.map((s) => s.freight_carrier)).size;

  const monthlyData = shipments.reduce(
    (acc: Record<string, number>, shipment) => {
      if (shipment.date_of_collection) {
        const date = new Date(shipment.date_of_collection);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  const monthlyTrend = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    count,
  }));

  const delayed =
    shipments.filter((s) => s.delivery_status.toLowerCase() !== "delivered")
      .length;
  const onTime =
    shipments.filter((s) => s.delivery_status.toLowerCase() === "delivered")
      .length;
  const delayedVsOnTimeRate = { onTime, delayed };

  const noQuoteRatio =
    shipments.filter((s) =>
      !s.forwarder_quotes || Object.keys(s.forwarder_quotes).length === 0
    ).length / Math.max(totalShipments, 1);

  return {
    totalShipments,
    shipmentsByMode,
    avgTransitTime,
    disruptionProbabilityScore,
    shipmentStatusCounts,
    resilienceScore,
    monthlyTrend,
    delayedVsOnTimeRate,
    noQuoteRatio,
    avgCostPerKg,
    forwarderPerformance,
    carrierPerformance,
    topForwarder,
    topCarrier,
    carrierCount,
  };
}

function calculateAvgCostForAllShipments(shipments: Shipment[]): number {
  const validShipments = shipments.filter((s) =>
    s.forwarder_quotes &&
    s.final_quote_awarded_freight_forwader_Carrier &&
    s.forwarder_quotes[
      s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()
    ] &&
    s.weight_kg
  );

  if (validShipments.length === 0) return 0;

  const totalCost = validShipments.reduce<number>(
    (sum, s) =>
      sum +
      (Number(s.forwarder_quotes[
        s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()
      ]) || 0),
    0,
  );

  const totalWeight = validShipments.reduce<number>(
    (sum, s) => sum + (Number(s.weight_kg) || 0),
    0,
  );

  return totalWeight > 0 ? totalCost / totalWeight : 0;
}

export function calculateForwarderPerformance(
  shipments: Shipment[],
): ForwarderPerformance[] {
  const forwarderMap = new Map<string, Shipment[]>();

  shipments.forEach((shipment) => {
    const forwarder = shipment.freight_carrier;
    if (!forwarderMap.has(forwarder)) {
      forwarderMap.set(forwarder, []);
    }
    forwarderMap.get(forwarder)?.push(shipment);
  });

  const results = Array.from(forwarderMap.entries())
    .filter(([name]) => name && name !== "Hand carried" && name !== "UNHAS")
    .map(([freight_carrier, shipments]) => {
      const result = {
        freight_carrier,
        avg_transit_days: calculateAvgTransitDays(shipments),
        avg_cost_per_kg: calculateAvgCostPerKg(shipments),
        on_time_rate: calculateOnTimeRate(shipments),
        reliability_score: calculateReliabilityScore(shipments),
        shipments,
        score: 0, // Will be calculated
        reliability: 0, // Will be calculated
        deepScore: 0,
        costScore: 0,
        timeScore: 0,
        quoteWinRate: 0,
      };
      assertForwarderShape(result);
      return result;
    })
    .sort((a, b) => b.reliability_score - a.reliability_score);

  return results;
}

export function calculateCountryPerformance(shipments: Shipment[]): CountryPerformance[] {
  const countryMap = new Map<string, Shipment[]>();

  shipments.forEach(shipment => {
    const country = shipment.destination_country?.trim() || 'Unknown';
    if (!countryMap.has(country)) {
      countryMap.set(country, []);
    }
    countryMap.get(country)?.push(shipment);
  });

  return Array.from(countryMap.values()).map(calculation => {
    return calculateCountryMetrics(calculation);
  }).sort((a, b) => b.resilienceIndex - a.resilienceIndex);
}

export function calculateWarehousePerformance(
  shipments: Shipment[],
): WarehousePerformance[] {
  const warehouseMap = new Map<string, Shipment[]>();

  shipments.forEach((shipment) => {
    const origin = shipment.origin_country?.trim() || "Unknown";
    if (!warehouseMap.has(origin)) {
      warehouseMap.set(origin, []);
    }
    warehouseMap.get(origin)?.push(shipment);
  });

  const globalAvgCostPerKg = calculateAvgCostForAllShipments(shipments);

  const warehousePerformance: WarehousePerformance[] = Array.from(
    warehouseMap.entries(),
  )
    .map(([origin, sList]) => {
      const totalShipments = sList.length;

      // Pick & pack time (simulated)
      const avgPickPackTime = 2 + Math.random() * 3; // 2–5 days default

      // Missed dispatch (no collection date)
      const missedDispatches = sList.filter((s) =>
        !s.date_of_collection
      ).length;
      const missedDispatchRate = missedDispatches / totalShipments;

      // Packaging failures simulated (no label in schema yet)
      const packagingFailureRate = 0.05 + Math.random() * 0.1;

      // Transit days
      const transitTimes = sList
        .filter((s) => s.date_of_collection && s.date_of_arrival_destination)
        .map((s) => {
          const start = new Date(s.date_of_collection);
          const end = new Date(s.date_of_arrival_destination);
          return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        });
      const avgTransitDays = transitTimes.length
        ? transitTimes.reduce((sum, d) => sum + d, 0) / transitTimes.length
        : 0;

      // Preferred forwarders
      const forwarderFreq: Record<string, number> = {};
      sList.forEach((s) => {
        const f = s.final_quote_awarded_freight_forwader_Carrier?.trim();
        if (f) forwarderFreq[f] = (forwarderFreq[f] || 0) + 1;
      });
      const preferredForwarders = Object.entries(forwarderFreq)
        .sort((a, b) => b[1] - a[1])
        .map(([f]) => f)
        .slice(0, 3);

      // Cost discrepancy
      const totalWeight = sList.reduce<number>(
        (sum, s) => sum + (Number(s.weight_kg) || 0),
        0,
      );
      const totalCost = sList.reduce<number>(
        (sum, s) => {
          const q = s.forwarder_quotes
            ?.[s.final_quote_awarded_freight_forwader_Carrier?.toLowerCase()];
          return sum + (Number(q) || 0);
        },
        0,
      );
      const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;
      const costDiscrepancy = globalAvgCostPerKg > 0
        ? ((avgCostPerKg - globalAvgCostPerKg) / globalAvgCostPerKg) * 100
        : 0;

      // Success rate
      const dispatched = sList.filter((s) => s.date_of_collection).length;
      const delivered =
        sList.filter((s) => s.delivery_status === "Delivered").length;
      const dispatchSuccessRate = dispatched > 0 ? delivered / dispatched : 0;

      // Composite reliability score
      const reliabilityScore = (
        0.4 * dispatchSuccessRate +
        0.3 * (1 - missedDispatchRate) +
        0.2 * (1 - packagingFailureRate) +
        0.1 * (1 - costDiscrepancy / 100)
      ) * 100;

      return {
        name: `${origin} Distribution Center`,
        location: origin,
        totalShipments,
        avgPickPackTime,
        packagingFailureRate,
        missedDispatchRate,
        rescheduledShipmentsRatio: 0.15 + Math.random() * 0.1, // Simulated for now
        avgTransitDays,
        preferredForwarders,
        costDiscrepancy,
        dispatchSuccessRate,
        reliabilityScore,
      };
    });

  return warehousePerformance.sort((a, b) =>
    b.reliabilityScore - a.reliabilityScore
  );
}

export function calculateCarrierPerformance(shipments: Shipment[]): CarrierPerformance[] {
  const carrierMap = new Map<string, Shipment[]>();

  shipments.forEach(shipment => {
    const carrier = shipment.freight_carrier?.trim();
    if (!carrier) return;
    if (!carrierMap.has(carrier)) {
      carrierMap.set(carrier, []);
    }
    carrierMap.get(carrier)?.push(shipment);
  });

  const carrierPerformance: CarrierPerformance[] = Array.from(carrierMap.entries())
    .filter(([name]) => name && name.toLowerCase() !== 'unknown' && name !== 'Hand carried')
    .map(([name, sList]) => {
      const totalShipments = sList.length;
      const completed = sList.filter(s => s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination);

      // Average transit time
      const transitTimes = completed.map(s => {
        const d1 = new Date(s.date_of_collection);
        const d2 = new Date(s.date_of_arrival_destination);
        return (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
      });
      const avgTransitDays = transitTimes.length > 0
        ? transitTimes.reduce((sum, t) => sum + t, 0) / transitTimes.length
        : 0;

      // Cost per kg
      const costData = sList
        .filter(s =>
          s.forwarder_quotes?.[s.final_quote_awarded_freight_forwader_Carrier?.toLowerCase()] &&
          s.weight_kg
        )
        .map(s => ({
          cost: s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier?.toLowerCase()],
          weight: s.weight_kg
        }));
      const totalWeight = costData.reduce<number>((sum, d) => sum + (Number(d.weight) || 0), 0);
      const totalCost = costData.reduce<number>((sum, d) => sum + (Number(d.cost) || 0), 0);
      const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;

      // Success/failure rates
      const successRate = completed.length / totalShipments;

      // Quote win rate
      const quoteWins = sList.filter(s => {
        const awarded = s.final_quote_awarded_freight_forwader_Carrier?.trim()?.toLowerCase();
        return awarded && awarded === name.toLowerCase();
      }).length;

      const totalQuotesReceived = sList.reduce<number>(
        (sum, s) =>
          sum + Object.keys(s.forwarder_quotes || {}).length, 0);
      const quoteWinRate = totalQuotesReceived > 0
        ? quoteWins / totalQuotesReceived
        : 0;

      // Reliability & scoring
      const punctualityScore = Math.max(0, 1 - avgTransitDays / 30);
      const serviceScore = successRate;

      const reliabilityScore = 0.4 * punctualityScore + 0.4 * serviceScore + 0.2 * quoteWinRate;
      const deepScore = reliabilityScore * 100;

      return {
        name,
        totalShipments,
        avgTransitDays,
        avgCostPerKg,
        onTimeRate: successRate,
        reliabilityScore,
        reliability: reliabilityScore * 100,
        serviceScore,
        punctualityScore,
        handlingScore: 0.4 + Math.random() * 0.4, // Placeholder: no direct metric yet
        shipments: totalShipments,
        quoteWinRate,
        deepScore
      };
    });

  return carrierPerformance.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
}

export function calculateCountryMetrics(shipments: Shipment[]): CountryPerformance {
  const country = shipments[0]?.destination_country?.trim() || 'Unknown';
  const totalShipments = shipments.length;

  const totalWeight = shipments.reduce<number>(
    (sum, s) => sum + (Number(s.weight_kg) || 0),
    0,
  );
  const totalVolume = shipments.reduce<number>(
    (sum, s) => sum + (Number(s.volume_cbm) || 0),
    0,
  );

  const validQuotes = shipments.filter(s =>
    s.forwarder_quotes &&
    s.final_quote_awarded_freight_forwader_Carrier &&
    s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()]
  );
  const totalCost = validQuotes.reduce<number>(
    (sum, s) =>
      sum + (Number(s.forwarder_quotes[s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()]) || 0),
    0,
  );

  const avgCostPerRoute = totalShipments > 0 ? totalCost / totalShipments : 0;

  const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;

  const completed = shipments.filter(s =>
    s.delivery_status === 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
  );

  const transitTimes = completed.map(s => {
    const d1 = new Date(s.date_of_collection);
    const d2 = new Date(s.date_of_arrival_destination);
    return (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
  });

  const avgTransitDays = transitTimes.length > 0
    ? transitTimes.reduce((sum, t) => sum + t, 0) / transitTimes.length
    : 0;

  const onTimeRate = completed.length / Math.max(totalShipments, 1);

  const delayedShipments = shipments.filter(s =>
    s.delivery_status !== 'Delivered' && s.date_of_collection && s.date_of_arrival_destination
  );

  const delayTimes = delayedShipments.map(s => {
    const d1 = new Date(s.date_of_collection);
    const d2 = new Date(s.date_of_arrival_destination);
    return Math.max(0, (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24) - avgTransitDays);
  });

  const avgDelayDays = delayTimes.length > 0
    ? delayTimes.reduce((sum, t) => sum + t, 0) / delayTimes.length
    : 0;

  const deliverySuccessRate = onTimeRate;

  const deliveryFailureRate = 1 - deliverySuccessRate;

  const customsClearanceTimes = shipments
    .filter(s => s.customs_clearance_time_days !== undefined && s.customs_clearance_time_days !== null)
    .map(s => Number(s.customs_clearance_time_days));

  const avgCustomsClearanceTime = customsClearanceTimes.length > 0
    ? customsClearanceTimes.reduce((sum, t) => sum + t, 0) / customsClearanceTimes.length
    : 0;

  const preferredMode = Object.entries(
    shipments.reduce((acc: Record<string, number>, s) => {
      const mode = s.mode_of_shipment?.trim() || 'Unknown';
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {})
  ).sort(([, countA], [, countB]) => countB - countA)[0]?.[0] || 'Unknown';

  const forwarderCounts: Record<string, number> = {};
  shipments.forEach(s => {
    const forwarder = s.final_quote_awarded_freight_forwader_Carrier?.trim() || 'Unknown';
    forwarderCounts[forwarder] = (forwarderCounts[forwarder] || 0) + 1;
  });

  const topForwarders = Object.entries(forwarderCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([forwarder]) => forwarder)
    .slice(0, 3);

  const reliabilityScore = onTimeRate;

  const resilienceIndex = Math.max(0, 100 * (1 - (avgDelayDays / 30) + (onTimeRate * 0.5) - (deliveryFailureRate * 0.2)));

  return {
    name: country,
    country,
    totalShipments,
    totalWeight,
    totalVolume,
    totalCost,
    avgDelayDays,
    avgCostPerRoute,
    avgCustomsClearanceTime,
    deliveryFailureRate,
    preferredMode,
    topForwarders,
    reliabilityScore,
    resilienceIndex,
  } as CountryPerformance;
}

export const getValidShipments = (shipments: Shipment[]) => shipments?.filter(s => 
  s?.request_reference &&
  typeof s?.freight_carrier_cost === 'number' &&
  typeof s?.weight_kg === 'number'
) || [];

export const calculateTotalShipments = (shipments: Shipment[]) => {
  const valid = getValidShipments(shipments);
  return new Set(valid.map(s => s.request_reference)).size;
};

export const calculateEmergencyRatio = (shipments: Shipment[]) => {
  const valid = shipments?.filter(s => s?.emergency_grade !== undefined) || [];
  return valid.length ? valid.filter(s => s.emergency_grade).length / valid.length : 0;
};

export const calculateLiveMetrics = (shipments: Shipment[]) => {
  const validShipments = shipments.filter(s => 
    s?.request_reference && 
    typeof s?.freight_carrier_cost === 'number' && 
    typeof s?.weight_kg === 'number'
  );

  const totalCost = validShipments.reduce<number>(
    (sum, s) => sum + (Number(s.freight_carrier_cost) || 0),
    0,
  );

  const totalWeight = validShipments.reduce<number>(
    (sum, s) => sum + (Number(s.weight_kg) || 0),
    0,
  );

  const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;

  const emergencyRatio = calculateEmergencyRatio(validShipments);

  const avgTransitTime = validShipments.reduce((sum, s) => {
    const days = (new Date(s.date_of_arrival_destination).getTime() - new Date(s.date_of_collection).getTime()) / (1000 * 60 * 60 * 24);
    return sum + (isNaN(days) ? 0 : days);
  }, 0) / validShipments.length

  return {
    total_shipments: new Set(validShipments.map(s => s.request_reference)).size,
    total_cost: totalCost,
    avg_cost_kg: avgCostPerKg,
    emergency_ratio: emergencyRatio,
    avg_transit_time: avgTransitTime
  };
};

function createBaseForwarderPerformance(name: string) {
  return {
    name,
    totalShipments: 0,
    avgCostPerKg: 0,
    avgTransitDays: 0,
    onTimeRate: 0,
    reliabilityScore: 0,
    deepScore: 0,
    costScore: 0,
    timeScore: 0,
    quoteWinRate: 0,
  };
}

function calculateAvgCostPerKg(shipments: Shipment[]) {
  const totalCost = shipments.reduce<number>(
    (sum, s) =>
      sum +
      (Number(s.forwarder_quotes[
        s.final_quote_awarded_freight_forwader_Carrier.toLowerCase()
      ]) || 0),
    0,
  );

  const totalWeight = shipments.reduce<number>(
    (sum, s) => sum + (Number(s.weight_kg) || 0),
    0,
  );

  return totalWeight > 0 ? totalCost / totalWeight : 0;
}

function calculateAvgTransitDays(shipments: Shipment[]) {
  const completedShipments = shipments.filter((s) =>
    s.delivery_status === "Delivered" && s.date_of_collection &&
    s.date_of_arrival_destination
  );

  const transitTimes = completedShipments.map((s) => {
    const collectionDate = new Date(s.date_of_collection);
    const arrivalDate = new Date(s.date_of_arrival_destination);
    return (arrivalDate.getTime() - collectionDate.getTime()) /
      (1000 * 60 * 60 * 24); // days
  });

  return transitTimes.length > 0
    ? transitTimes.reduce((sum, days) => sum + days, 0) / transitTimes.length
    : 0;
}

function calculateOnTimeRate(shipments: Shipment[]) {
  const completedShipments = shipments.filter((s) =>
    s.delivery_status === "Delivered" && s.date_of_collection &&
    s.date_of_arrival_destination
  );

  return completedShipments.length / shipments.length;
}

function calculateReliabilityScore(shipments: Shipment[]) {
  const onTimeRate = calculateOnTimeRate(shipments);
  const avgTransitDays = calculateAvgTransitDays(shipments);

  return (onTimeRate + (1 - avgTransitDays / 30)) / 2;
}

export const computeCoreKPIs = (shipments: Shipment[]) => {
  const validShipments = shipments.filter(s =>
    s.delivery_status === 'Delivered' &&
    s.weight_kg > 0 &&
    s.forwarder_quotes &&
    Object.keys(s.forwarder_quotes).length > 0
  );

  const totalWeight = validShipments.reduce(
    (sum, s) => sum + (Number(s.weight_kg) || 0), 0
  );

  const totalVolume = validShipments.reduce(
    (sum, s) => sum + (Number(s.volume_cbm) || 0), 0
  );

  const totalShipments = new Set(validShipments.map(s => s.request_reference)).size;

  let totalCost = 0;
  validShipments.forEach(s => {
    const quoteSum = Object.values(s.forwarder_quotes).reduce((a, b) => Number(a) + Number(b), 0);
    const quoteAvg = quoteSum / Object.keys(s.forwarder_quotes).length;
    totalCost += quoteAvg;
  });

  const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;

  const modeCounts = validShipments.reduce((acc, s) => {
    const mode = s.mode_of_shipment || 'Unknown';
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total_shipments: totalShipments,
    total_weight_kg: totalWeight,
    total_volume_cbm: totalVolume,
    avg_cost_per_kg: Number(avgCostPerKg.toFixed(2)),
    mode_split: modeCounts,
  };
};

export const computeCostConfidenceAndAnomalies = (shipments: Shipment[]) => {
  const validShipments = shipments.filter(s =>
    s.delivery_status === 'Delivered' &&
    s.weight_kg > 0 &&
    s.forwarder_quotes &&
    Object.keys(s.forwarder_quotes).length > 0
  );

  const costPerKgArray: number[] = [];
  const requestReferences: string[] = [];

  validShipments.forEach(s => {
    const quoteAvg = Object.values(s.forwarder_quotes).reduce((a, b) => Number(a) + Number(b), 0)
      / Object.keys(s.forwarder_quotes).length;

    const weight = Number(s.weight_kg);
    if (weight > 0) {
      costPerKgArray.push(quoteAvg / weight);
      requestReferences.push(s.request_reference);
    }
  });

  const μ = mean(costPerKgArray);
  const σ = std(costPerKgArray);

  const confidence = Number((100 - (σ / μ) * 100).toFixed(1));

  const anomalies = costPerKgArray.map((cpk, i) => {
    if (Math.abs(cpk - μ) > 2.5 * σ) {
      return {
        request_reference: requestReferences[i],
        cost_per_kg: Number(cpk.toFixed(2)),
        z_score: Number(((cpk - μ) / σ).toFixed(2))
      };
    }
    return null;
  }).filter(Boolean);

  return {
    cost_confidence_percent: Math.max(0, Math.min(confidence, 100)),
    cost_anomaly_count: anomalies.length,
    anomaly_details: anomalies
  };
};
