
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
import { TrendDirection, ShipmentMetrics, ForwarderPerformance, CountryPerformance, WarehousePerformance, CarrierPerformance } from '@/types/deeptrack';
import { 
  calculateShipmentMetrics, 
  calculateForwarderPerformance, 
  calculateCountryPerformance,
  calculateWarehousePerformance,
  calculateCarrierPerformance
} from '@/utils/analyticsUtils';

// DeepCAL Spinner Component
const DeepCALSpinner: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <div className="absolute w-16 h-16 border-4 border-t-transparent border-[#00FFD1] rounded-full animate-spin"></div>
      <div className="absolute w-12 h-12 border-4 border-t-transparent border-blue-400 rounded-full animate-spin-reverse"></div>
      <div className="absolute text-xs font-bold text-white">DEEP</div>
    </div>
  );
};

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
  const [carriers, setCarriers] = useState<CarrierPerformance[]>([]);
  const [countries, setCountries] = useState<CountryPerformance[]>([]);
  const [warehouses, setWarehouses] = useState<WarehousePerformance[]>([]);
  const [shipmentMetrics, setShipmentMetrics] = useState<ShipmentMetrics | null>(null);

  // Initialize Core engine with validated data
  useEffect(() => {
    if (!shipmentData || shipmentData.length === 0) {
      console.warn("No shipment data available");
      return;
    }

    try {
      // Calculate metrics from the shipment data
      const metrics = calculateShipmentMetrics(shipmentData);
      setShipmentMetrics(metrics);

      // Calculate forwarder, carrier, country, and warehouse performance
      const forwarderPerformance = calculateForwarderPerformance(shipmentData);
      const carrierPerformance = calculateCarrierPerformance(shipmentData);
      const countryPerformance = calculateCountryPerformance(shipmentData);
      const warehousePerformance = calculateWarehousePerformance(shipmentData);

      // Ensure carriers have required properties
      const processedCarriers = carrierPerformance.map(carrier => ({
        ...carrier,
        // Ensure required properties are present
        shipments: carrier.totalShipments,
        reliability: carrier.reliabilityScore * 100
      }));

      setCoreMetrics({
        totalShipments: metrics.totalShipments,
        onTimeRate: metrics.delayedVsOnTimeRate.onTime / (metrics.delayedVsOnTimeRate.onTime + metrics.delayedVsOnTimeRate.delayed),
        avgTransitDays: metrics.avgTransitTime,
        costEfficiency: metrics.avgCostPerKg,
        routeResilience: metrics.resilienceScore / 100,
        modeSplit: {
          air: metrics.shipmentsByMode['Air'] ? (metrics.shipmentsByMode['Air'] / metrics.totalShipments) * 100 : 0,
          sea: metrics.shipmentsByMode['Sea'] ? (metrics.shipmentsByMode['Sea'] / metrics.totalShipments) * 100 : 0,
          road: metrics.shipmentsByMode['Road'] ? (metrics.shipmentsByMode['Road'] / metrics.totalShipments) * 100 : 0
        }
      });

      // Get historical trends
      const trends = {
        totalShipments: { change: 5, direction: 'up' as TrendDirection }
      };

      setTrendData(trends);
      setForwarders(forwarderPerformance);
      setCarriers(processedCarriers);
      setCountries(countryPerformance);
      setWarehouses(warehousePerformance);
      setCalculationError(null);
    } catch (error) {
      console.error("Error calculating metrics:", error);
      setCalculationError(String(error));
    }
  }, [shipmentData]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'deepTalk') {
      setShowDeepTalk(true);
    } else {
      setShowDeepTalk(false);
    }
  };

  return (
    <div className="w-full h-full">
      <AnalyticsLayout activeTab={activeTab} onTabChange={handleTabChange}>
        {activeTab === 'overview' && coreMetrics && (
          <OverviewContent 
            coreMetrics={coreMetrics}
            trendData={trendData}
            forwarderCount={forwarders.length}
            routeCount={(new Set(shipmentData.map(s => `${s.origin_country}-${s.destination_country}`))).size}
            shipmentCount={shipmentData.length}
            carrierCount={carriers.length}
          />
        )}
        
        {activeTab === 'shipments' && shipmentMetrics && (
          <ShipmentAnalytics metrics={shipmentMetrics} />
        )}
        
        {activeTab === 'forwarders' && (
          <ForwarderAnalytics forwarders={forwarders} carriers={carriers} />
        )}
        
        {activeTab === 'countries' && (
          <CountryAnalytics countries={countries} />
        )}
        
        {activeTab === 'warehouses' && (
          <WarehouseAnalytics warehouses={warehouses} />
        )}
      </AnalyticsLayout>
    </div>
  );
};

export default AnalyticsSection;
