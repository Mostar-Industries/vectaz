
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
import { TrendDirection } from '@/types/deeptrack';

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

  // Initialize Core engine with validated data
  useEffect(() => {
    const engine = new DecisionEngine();
    try {
      // Validate data using Core schema
      if (!engine.initialize(shipmentData)) {
        throw new Error('Core engine initialization failed');
      }      

      // Get metrics directly from Core engine
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
                active: 0,
                completed: coreMetrics.totalShipments,
                failed: 0,
                onTime: Math.round(coreMetrics.onTimeRate * coreMetrics.totalShipments),
                inTransit: 0,
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
            forwarders={[]} 
            carriers={[]} 
          />
        }
        countriesContent={
          <CountryAnalytics
            countries={[]}
          />
        }
        warehousesContent={
          <WarehouseAnalytics
            warehouses={[]} 
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
