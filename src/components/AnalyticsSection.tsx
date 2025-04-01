import React, { useState, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import AnalyticsLayout from '@/components/analytics/AnalyticsLayout';
import { DecisionEngine } from '@/core/engine'; 
import WarehouseAnalytics from './analytics/WarehouseAnalytics';
import CountryAnalytics from './analytics/CountryAnalytics';
import ForwarderAnalytics from './analytics/ForwarderAnalytics';
import OverviewContent from './analytics/OverviewContent';
import ShipmentAnalytics from './analytics/ShipmentAnalytics'; 
import { ShipmentMetrics, ForwarderPerformance, CountryPerformance, WarehousePerformance, CarrierPerformance } from '@/types/deeptrack';
import { 
  calculateShipmentMetrics, 
  calculateForwarderPerformance, 
  calculateCountryPerformance,
  calculateWarehousePerformance,
  calculateCarrierPerformance
} from '@/utils/analyticsUtils';

// Import the DeepCALSpinner from its own file
import DeepCALSpinner from './DeepCALSpinner';
import DeepCALExplainer from './analytics/DeepCALExplainer';

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

  // Determine the title based on the active tab
  const getTabTitle = () => {
    switch(activeTab) {
      case 'overview': return 'Analytics Overview';
      case 'shipments': return 'Shipment Analytics';
      case 'forwarders': return 'Forwarder Analytics';
      case 'countries': return 'Country Analytics';
      case 'warehouses': return 'Warehouse Analytics';
      default: return 'Analytics Dashboard';
    }
  };

  return (
    <div className="w-full h-full">
      <AnalyticsLayout 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        title={getTabTitle()}
      >
        {activeTab === 'overview' && coreMetrics && (
          <OverviewContent 
            metrics={coreMetrics}
          />
        )}
        
        {activeTab === 'shipments' && shipmentMetrics && (
          <>
            <ShipmentAnalytics metrics={shipmentMetrics} />
            <DeepCALExplainer metricType="shipment" data={shipmentMetrics} />
          </>
        )}
        
        {activeTab === 'forwarders' && (
          <>
            <ForwarderAnalytics forwarders={forwarders} carriers={carriers} />
            <DeepCALExplainer metricType="forwarder" data={forwarders[0]} />
          </>
        )}
        
        {activeTab === 'countries' && (
          <>
            <CountryAnalytics countries={countries} />
            <DeepCALExplainer metricType="country" data={countries[0]} />
          </>
        )}
        
        {activeTab === 'warehouses' && (
          <>
            <WarehouseAnalytics warehouses={warehouses} />
            <DeepCALExplainer metricType="warehouse" data={warehouses[0]} />
          </>
        )}
      </AnalyticsLayout>
    </div>
  );
};

export default AnalyticsSection;
