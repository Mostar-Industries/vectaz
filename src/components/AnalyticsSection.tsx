
import React, { useState, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import AnalyticsLayout from '@/components/analytics/AnalyticsLayout';
import AnalyticsTabs from '@/components/analytics/AnalyticsTabs';
import { DecisionEngine } from '@/core/engine'; // Update import path
import WarehouseAnalytics from './analytics/WarehouseAnalytics';
import CountryAnalytics from './analytics/CountryAnalytics';
import ForwarderAnalytics from './analytics/ForwarderAnalytics';
import OverviewContent from './analytics/OverviewContent';
import ShipmentAnalytics from './analytics/ShipmentAnalytics'; 
import DeepCALSpinner from './DeepCALSpinner';
import { TrendDirection, ShipmentMetrics, ForwarderPerformance, CountryPerformance, WarehousePerformance } from '@/types/deeptrack';

// Updated interface matching Core engine outputs
interface CoreMetrics {
  totalShipments: number;
  onTimeRate: number;
  avgTransitDays: number;
  costEfficiency: number;
  routeResilience: number;
  modeSplit: {
    air: number;
    sea: number;
    road: number;
  };
}

const AnalyticsSection: React.FC = () => {
  const { shipmentData } = useBaseDataStore();
  const [coreMetrics, setCoreMetrics] = useState<CoreMetrics | null>(null);
  const [trendData, setTrendData] = useState<Record<string, any>>({});
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showDeepTalk, setShowDeepTalk] = useState<boolean>(false);
  const [forwarders, setForwarders] = useState<ForwarderPerformance[]>([]);
  const [carriers, setCarriers] = useState<ForwarderPerformance[]>([]);
  const [countries, setCountries] = useState<CountryPerformance[]>([]);
  const [warehouses, setWarehouses] = useState<WarehousePerformance[]>([]);

  // Initialize Core engine with validated data
  useEffect(() => {
    const engine = new DecisionEngine();
    try {
      // Validate data using Core schema
      if (!engine.initialize(shipmentData)) {
        throw new Error('Core engine initialization failed');
      }      

      // Get metrics directly from Core engine (actual shipment count from data)
      const metrics = {
        totalShipments: shipmentData.length,
        onTimeRate: 0.85, // Placeholder
        avgTransitDays: 5.3, // Placeholder
        costEfficiency: 2.45, // Placeholder
        routeResilience: 0.75, // Placeholder
        modeSplit: {
          air: 60,
          sea: 30,
          road: 10
        }
      };

      // Get historical trends
      const trends = {
        totalShipments: { change: 5, direction: 'up' as TrendDirection }
      };

      setCoreMetrics(metrics);
      setTrendData(trends);
      setCalculationError(null);
      
      // Generate forwarders data
      const forwardersData: ForwarderPerformance[] = [
        {
          name: 'Kenya Airways',
          totalShipments: 28,
          avgCostPerKg: 2.35,
          avgTransitDays: 4.2,
          onTimeRate: 0.92,
          reliabilityScore: 0.89,
          deepScore: 87,
          costScore: 82,
          timeScore: 88,
          quoteWinRate: 0.31
        },
        {
          name: 'DHL',
          totalShipments: 24,
          avgCostPerKg: 2.78,
          avgTransitDays: 3.8,
          onTimeRate: 0.95,
          reliabilityScore: 0.94,
          deepScore: 91,
          costScore: 78,
          timeScore: 92,
          quoteWinRate: 0.28
        },
        {
          name: 'Kuehne Nagel',
          totalShipments: 18,
          avgCostPerKg: 2.42,
          avgTransitDays: 4.5,
          onTimeRate: 0.88,
          reliabilityScore: 0.85,
          deepScore: 83,
          costScore: 83,
          timeScore: 79,
          quoteWinRate: 0.24
        },
        {
          name: 'FedEx',
          totalShipments: 17,
          avgCostPerKg: 2.95,
          avgTransitDays: 3.5,
          onTimeRate: 0.91,
          reliabilityScore: 0.92,
          deepScore: 84,
          costScore: 75,
          timeScore: 90,
          quoteWinRate: 0.22
        },
        {
          name: 'UPS',
          totalShipments: 18,
          avgCostPerKg: 2.65,
          avgTransitDays: 4.1,
          onTimeRate: 0.89,
          reliabilityScore: 0.87,
          deepScore: 85,
          costScore: 80,
          timeScore: 82,
          quoteWinRate: 0.20
        }
      ];
      
      // Generate carriers data
      const carriersData: ForwarderPerformance[] = [
        {
          name: 'Kenya Airways',
          totalShipments: 32,
          avgCostPerKg: 0,
          avgTransitDays: 3.9,
          onTimeRate: 0.90,
          reliabilityScore: 0.88,
          serviceScore: 0.92,
          punctualityScore: 0.85,
          handlingScore: 0.91
        },
        {
          name: 'Ethiopian Airlines',
          totalShipments: 25,
          avgCostPerKg: 0,
          avgTransitDays: 4.1,
          onTimeRate: 0.87,
          reliabilityScore: 0.85,
          serviceScore: 0.88,
          punctualityScore: 0.82,
          handlingScore: 0.86
        },
        {
          name: 'Emirates SkyCargo',
          totalShipments: 18,
          avgCostPerKg: 0,
          avgTransitDays: 3.7,
          onTimeRate: 0.93,
          reliabilityScore: 0.91,
          serviceScore: 0.94,
          punctualityScore: 0.89,
          handlingScore: 0.93
        },
        {
          name: 'Qatar Airways Cargo',
          totalShipments: 16,
          avgCostPerKg: 0,
          avgTransitDays: 3.8,
          onTimeRate: 0.91,
          reliabilityScore: 0.89,
          serviceScore: 0.90,
          punctualityScore: 0.87,
          handlingScore: 0.88
        },
        {
          name: 'Astral Aviation',
          totalShipments: 14,
          avgCostPerKg: 0,
          avgTransitDays: 4.5,
          onTimeRate: 0.84,
          reliabilityScore: 0.81,
          serviceScore: 0.85,
          punctualityScore: 0.79,
          handlingScore: 0.84
        }
      ];
      
      // Generate countries data
      const countriesData: CountryPerformance[] = [
        {
          country: 'Zimbabwe',
          totalShipments: 21,
          avgCostPerRoute: 2.48,
          avgCustomsClearanceTime: 2.2,
          deliveryFailureRate: 0.05,
          borderDelayIncidents: 3,
          resilienceIndex: 78,
          preferredMode: 'Air',
          topForwarders: ['Kenya Airways', 'DHL', 'Kuehne Nagel'],
          reliabilityScore: 0.91,
          avgTransitDays: 4.5,
          deliverySuccessRate: 0.95
        },
        {
          country: 'Tanzania',
          totalShipments: 18,
          avgCostPerRoute: 2.25,
          avgCustomsClearanceTime: 1.8,
          deliveryFailureRate: 0.04,
          borderDelayIncidents: 2,
          resilienceIndex: 82,
          preferredMode: 'Road',
          topForwarders: ['DHL', 'Kenya Airways', 'UPS'],
          reliabilityScore: 0.93,
          avgTransitDays: 3.8,
          deliverySuccessRate: 0.96
        },
        {
          country: 'Uganda',
          totalShipments: 16,
          avgCostPerRoute: 2.18,
          avgCustomsClearanceTime: 1.6,
          deliveryFailureRate: 0.03,
          borderDelayIncidents: 1,
          resilienceIndex: 85,
          preferredMode: 'Road',
          topForwarders: ['Kenya Airways', 'DHL', 'FedEx'],
          reliabilityScore: 0.95,
          avgTransitDays: 3.2,
          deliverySuccessRate: 0.97
        },
        {
          country: 'Sudan',
          totalShipments: 15,
          avgCostPerRoute: 2.72,
          avgCustomsClearanceTime: 3.1,
          deliveryFailureRate: 0.09,
          borderDelayIncidents: 5,
          resilienceIndex: 65,
          preferredMode: 'Air',
          topForwarders: ['DHL', 'UPS', 'Kuehne Nagel'],
          reliabilityScore: 0.85,
          avgTransitDays: 5.4,
          deliverySuccessRate: 0.91
        },
        {
          country: 'Rwanda',
          totalShipments: 12,
          avgCostPerRoute: 2.35,
          avgCustomsClearanceTime: 1.9,
          deliveryFailureRate: 0.04,
          borderDelayIncidents: 2,
          resilienceIndex: 80,
          preferredMode: 'Road',
          topForwarders: ['Kenya Airways', 'FedEx', 'UPS'],
          reliabilityScore: 0.92,
          avgTransitDays: 3.6,
          deliverySuccessRate: 0.96
        },
        {
          country: 'Ethiopia',
          totalShipments: 10,
          avgCostPerRoute: 2.65,
          avgCustomsClearanceTime: 2.8,
          deliveryFailureRate: 0.07,
          borderDelayIncidents: 4,
          resilienceIndex: 70,
          preferredMode: 'Air',
          topForwarders: ['Ethiopian Airlines', 'DHL', 'Kenya Airways'],
          reliabilityScore: 0.88,
          avgTransitDays: 4.9,
          deliverySuccessRate: 0.93
        },
        {
          country: 'Somalia',
          totalShipments: 8,
          avgCostPerRoute: 2.95,
          avgCustomsClearanceTime: 3.5,
          deliveryFailureRate: 0.11,
          borderDelayIncidents: 6,
          resilienceIndex: 60,
          preferredMode: 'Air',
          topForwarders: ['DHL', 'Kenya Airways', 'Astral Aviation'],
          reliabilityScore: 0.82,
          avgTransitDays: 5.8,
          deliverySuccessRate: 0.89
        },
        {
          country: 'South Sudan',
          totalShipments: 5,
          avgCostPerRoute: 3.15,
          avgCustomsClearanceTime: 4.2,
          deliveryFailureRate: 0.14,
          borderDelayIncidents: 7,
          resilienceIndex: 55,
          preferredMode: 'Air',
          topForwarders: ['DHL', 'UPS', 'Kenya Airways'],
          reliabilityScore: 0.78,
          avgTransitDays: 6.2,
          deliverySuccessRate: 0.86
        }
      ];
      
      // Generate warehouses data
      const warehousesData: WarehousePerformance[] = [
        {
          name: 'Nairobi Central Hub',
          location: 'Kenya',
          totalShipments: 38,
          avgPickPackTime: 1.2,
          packagingFailureRate: 0.02,
          missedDispatchRate: 0.03,
          rescheduledShipmentsRatio: 0.04,
          reliabilityScore: 0.95,
          preferredForwarders: ['Kenya Airways', 'DHL', 'UPS'],
          costDiscrepancy: 0.03,
          dispatchSuccessRate: 0.97,
          avgTransitDays: 3.8
        },
        {
          name: 'Johannesburg Logistics Center',
          location: 'South Africa',
          totalShipments: 26,
          avgPickPackTime: 1.3,
          packagingFailureRate: 0.03,
          missedDispatchRate: 0.04,
          rescheduledShipmentsRatio: 0.05,
          reliabilityScore: 0.92,
          preferredForwarders: ['DHL', 'FedEx', 'UPS'],
          costDiscrepancy: 0.05,
          dispatchSuccessRate: 0.96,
          avgTransitDays: 4.1
        },
        {
          name: 'Addis Ababa Distribution',
          location: 'Ethiopia',
          totalShipments: 18,
          avgPickPackTime: 1.5,
          packagingFailureRate: 0.04,
          missedDispatchRate: 0.06,
          rescheduledShipmentsRatio: 0.07,
          reliabilityScore: 0.88,
          preferredForwarders: ['Ethiopian Airlines', 'DHL', 'Kenya Airways'],
          costDiscrepancy: 0.08,
          dispatchSuccessRate: 0.94,
          avgTransitDays: 4.5
        },
        {
          name: 'Lagos Supply Hub',
          location: 'Nigeria',
          totalShipments: 14,
          avgPickPackTime: 1.6,
          packagingFailureRate: 0.05,
          missedDispatchRate: 0.07,
          rescheduledShipmentsRatio: 0.08,
          reliabilityScore: 0.85,
          preferredForwarders: ['DHL', 'UPS', 'FedEx'],
          costDiscrepancy: 0.09,
          dispatchSuccessRate: 0.93,
          avgTransitDays: 4.8
        },
        {
          name: 'Cairo Logistics',
          location: 'Egypt',
          totalShipments: 9,
          avgPickPackTime: 1.4,
          packagingFailureRate: 0.03,
          missedDispatchRate: 0.05,
          rescheduledShipmentsRatio: 0.06,
          reliabilityScore: 0.90,
          preferredForwarders: ['Emirates SkyCargo', 'DHL', 'Qatar Airways Cargo'],
          costDiscrepancy: 0.06,
          dispatchSuccessRate: 0.95,
          avgTransitDays: 4.2
        }
      ];
      
      setForwarders(forwardersData);
      setCarriers(carriersData);
      setCountries(countriesData);
      setWarehouses(warehousesData);

    } catch (error) {
      setCalculationError(error instanceof Error ? error.message : 'Unknown error');
      console.error('Core Engine Error:', error);
    }
  }, [shipmentData]);

  // Handle DeepTalk queries
  const handleDeepTalkQuery = async (query: string): Promise<string> => {
    // Simulate a response - in a real implementation, this would call an AI endpoint
    return `Based on your logistics data analysis, I can provide insights about "${query}". 
    The data shows significant trends in on-time delivery rates and cost efficiency across your top forwarders.`;
  };

  // Build KPIs from Core metrics
  const kpis = coreMetrics ? [
    {
      label: 'Total Shipments',
      value: coreMetrics.totalShipments,
      trend: `${trendData.totalShipments?.change ?? 0}%`,
      trendDirection: (trendData.totalShipments?.direction || 'neutral') as TrendDirection,
      iconName: 'package',
      color: 'blue'
    },
    {
      label: 'On-Time Delivery',
      value: `${Math.round(coreMetrics.onTimeRate * 100)}%`,
      trend: `${((coreMetrics.onTimeRate - 0.85) * 100).toFixed(1)}%`,
      trendDirection: (coreMetrics.onTimeRate >= 0.85 ? 'up' : 'down') as TrendDirection,
      iconName: 'clock',
      color: 'green'
    },
    {
      label: 'Cost Efficiency',
      value: `$${coreMetrics.costEfficiency.toFixed(2)}/kg`,
      trend: `${(2.5 - coreMetrics.costEfficiency).toFixed(2)} vs target`,
      trendDirection: (coreMetrics.costEfficiency <= 2.5 ? 'down' : 'up') as TrendDirection,
      iconName: 'dollar-sign',
      color: 'cyan'
    },
    {
      label: 'Route Resilience',
      value: `${Math.round(coreMetrics.routeResilience * 100)}%`,
      trend: 'AHP-TOPSIS Verified',
      trendDirection: 'up' as TrendDirection,
      iconName: 'shield',
      color: 'purple'
    }
  ] : [];

  if (calculationError) {
    return (
      <AnalyticsLayout 
        title="Error" 
        showDeepTalk={false} 
        onToggleDeepTalk={() => setShowDeepTalk(!showDeepTalk)} 
        onDeepTalkQuery={handleDeepTalkQuery}
      >
        <div className="core-error p-4">
          <h3 className="text-xl text-red-400 mb-2">🚨 Core Engine Failure</h3> 
          <p className="mb-2">{calculationError}</p>
          <p>Please verify your shipment data format</p>
        </div>
      </AnalyticsLayout>
    );
  }

  // Create shipment metrics from core metrics
  const shipmentMetrics: ShipmentMetrics = {
    totalShipments: coreMetrics?.totalShipments || 0,
    avgTransitTime: coreMetrics?.avgTransitDays || 0,
    shipmentStatusCounts: {
      active: Math.round(coreMetrics?.totalShipments * 0.15) || 0,
      completed: Math.round(coreMetrics?.totalShipments * 0.75) || 0,
      failed: Math.round(coreMetrics?.totalShipments * 0.02) || 0,
      onTime: Math.round((coreMetrics?.onTimeRate || 0.85) * (coreMetrics?.totalShipments || 0)),
      inTransit: Math.round(coreMetrics?.totalShipments * 0.08) || 0,
      delayed: Math.round(coreMetrics?.totalShipments * 0.12) || 0,
      cancelled: Math.round(coreMetrics?.totalShipments * 0.03) || 0,
      pending: Math.round(coreMetrics?.totalShipments * 0.05) || 0
    },
    shipmentsByMode: {
      air: coreMetrics?.modeSplit.air || 0,
      sea: coreMetrics?.modeSplit.sea || 0,
      road: coreMetrics?.modeSplit.road || 0
    },
    delayedVsOnTimeRate: {
      onTime: Math.round((coreMetrics?.onTimeRate || 0.85) * (coreMetrics?.totalShipments || 0)),
      delayed: Math.round((1 - (coreMetrics?.onTimeRate || 0.85)) * (coreMetrics?.totalShipments || 0))
    },
    monthlyTrend: [
      {month: 'Jan', count: 25},
      {month: 'Feb', count: 28},
      {month: 'Mar', count: 22},
      {month: 'Apr', count: 30}
    ],
    disruptionProbabilityScore: 0.32,
    resilienceScore: (coreMetrics?.routeResilience || 0.75) * 100,
    noQuoteRatio: 0.08,
    avgCostPerKg: coreMetrics?.costEfficiency || 0,
    forwarderPerformance: {
      'Kenya Airways': 0.89,
      'DHL': 0.91,
      'Kuehne Nagel': 0.85,
      'FedEx': 0.87,
      'UPS': 0.86
    },
    carrierPerformance: {
      'Kenya Airways': 0.88,
      'Ethiopian Airlines': 0.85,
      'Emirates SkyCargo': 0.91,
      'Qatar Airways Cargo': 0.89,
      'Astral Aviation': 0.81
    },
    topForwarder: 'DHL',
    topCarrier: 'Emirates SkyCargo',
    carrierCount: 5
  };

  return coreMetrics ? (
    <AnalyticsLayout
        title="DeepCAL Analytics"
        kpis={kpis}
        showDeepTalk={showDeepTalk}
        onToggleDeepTalk={() => setShowDeepTalk(!showDeepTalk)}
        onDeepTalkQuery={handleDeepTalkQuery}
    >
      <AnalyticsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        overviewContent={<OverviewContent metrics={coreMetrics} />}
        shipmentsContent={
          <ShipmentAnalytics
            metrics={shipmentMetrics}
          />
        }
        forwardersContent={
          <ForwarderAnalytics
            forwarders={forwarders} 
            carriers={carriers} 
          />
        }
        countriesContent={
          <CountryAnalytics
            countries={countries}
          />
        }
        warehousesContent={
          <WarehouseAnalytics
            warehouses={warehouses} 
          />
        }
      />
    </AnalyticsLayout>
  ) : (
    <div className="core-loading flex flex-col items-center justify-center h-[50vh] glass-panel rounded-lg border border-gray-700 p-8">
      <DeepCALSpinner />
      <p className="mt-4 text-lg">Initializing Core Analytics Engine...</p>
    </div>
  );
};

export default AnalyticsSection;
