
import React, { useState, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import AnalyticsLayout from '@/components/analytics/AnalyticsLayout';
import AnalyticsTabs from '@/components/analytics/AnalyticsTabs';
import { DeepCALEngine, HistoricalTrends } from '@/CORE/base_engine/ts/engine'; // Core engine import
import {
  validateShipments,
  calculateHistoricalTrend
} from '@/CORE/base_engine/ts/dataUtils'; // Core validation
import WarehouseAnalytics from './analytics/WarehouseAnalytics';
import CountryAnalytics from './analytics/CountryAnalytics';
import ForwarderAnalytics from './analytics/ForwarderAnalytics';
import OverviewContent from './analytics/OverviewContent';
import ShipmentAnalytics from './analytics/ShipmentAnalytics'; 
import DeepCALSpinner from './DeepCALSpinner';

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
  const [trendData, setTrendData] = useState<HistoricalTrends>({});
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showDeepTalk, setShowDeepTalk] = useState<boolean>(false);

  // Initialize Core engine with validated data
  useEffect(() => {
    const engine = new DeepCALEngine();
    try {
      // Validate data using Core schema
      const validData = validateShipments(shipmentData);

      // Initialize engine with validated data
      if (!engine.initialize(validData)) {
        throw new Error('Core engine initialization failed');
      }      

      // Get metrics directly from Core engine
      const metrics = {
        totalShipments: validData.length,
        onTimeRate: engine.getKPIs().onTimeRate,
        avgTransitDays: engine.getKPIs().avgTransitDays,
        costEfficiency: engine.getForwarderPerformance()[0]?.avgCostPerKg || 0,
        routeResilience: engine.getRankedAlternatives({cost: 0.3, time: 0.4, reliability: 0.3})[0]?.closeness || 0,
        modeSplit: engine.getKPIs().modeSplit
      };

      // Get historical trends from Core
      const trends = calculateHistoricalTrend(validData);

      setCoreMetrics(metrics);
      setTrendData(trends);
      setCalculationError(null);

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
      trendDirection: trendData.totalShipments?.direction || 'neutral',
      iconName: 'package',
      color: 'blue'
    },
    {
      label: 'On-Time Delivery',
      value: `${Math.round(coreMetrics.onTimeRate * 100)}%`,
      trend: `${((coreMetrics.onTimeRate - (trendData.onTimeRate?.baseline || 0.85)) * 100).toFixed(1)}%`,
      trendDirection: coreMetrics.onTimeRate >= 0.85 ? 'up' : 'down',
      iconName: 'clock',
      color: 'green'
    },
    {
      label: 'Cost Efficiency',
      value: `$${coreMetrics.costEfficiency.toFixed(2)}/kg`,
      trend: `${(2.5 - coreMetrics.costEfficiency).toFixed(2)} vs target`,
      trendDirection: coreMetrics.costEfficiency <= 2.5 ? 'down' : 'up',
      iconName: 'dollar-sign',
      color: 'cyan'
    },
    {
      label: 'Route Resilience',
      value: `${Math.round(coreMetrics.routeResilience * 100)}%`,
      trend: 'AHP-TOPSIS Verified',
      trendDirection: 'up',
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
            transitTime={coreMetrics.avgTransitDays}
            metrics={{
              totalShipments: coreMetrics.totalShipments,
              avgTransitTime: coreMetrics.avgTransitDays,
              shipmentStatusCounts: {
                pending: 0,
                active: 0,
                completed: coreMetrics.totalShipments,
                delayed: 0,
                cancelled: 0
              },
              shipmentsByMode: {
                air: coreMetrics.modeSplit.air,
                sea: coreMetrics.modeSplit.sea,
                road: coreMetrics.modeSplit.road
              },
              delayedVsOnTimeRate: {
                onTime: Math.round(coreMetrics.onTimeRate * coreMetrics.totalShipments),
                delayed: Math.round((1 - coreMetrics.onTimeRate) * coreMetrics.totalShipments)
              },
              monthlyTrend: [],
              disruptionProbabilityScore: 0,
              resilienceScore: coreMetrics.routeResilience * 100,
              noQuoteRatio: 0, 
              avgCostPerKg: coreMetrics.costEfficiency
            }}
            modeSplit={coreMetrics.modeSplit}
          />
        }
        forwardersContent={
          <ForwarderAnalytics
            forwarders={new DeepCALEngine().getForwarderPerformance()} 
            carriers={[]} 
          />
        }
        countriesContent={
          <CountryAnalytics
            countries={new DeepCALEngine().getTopRoutes(10)}
          />
        }
        warehousesContent={
          <WarehouseAnalytics
            warehouses={new DeepCALEngine().getWarehousePerformance()} 
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
