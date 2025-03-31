
import React, { useState } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { 
  calculateShipmentMetrics,
  calculateForwarderPerformance,
  calculateCountryPerformance,
  calculateWarehousePerformance
} from '@/utils/analyticsUtils';

// Import the new components
import AnalyticsLayout from '@/components/analytics/AnalyticsLayout';
import AnalyticsTabs from '@/components/analytics/AnalyticsTabs';
import OverviewContent from '@/components/analytics/OverviewContent';
import { useDeepTalkHandler } from '@/components/analytics/DeepTalkHandler';

// Import the analytics components
import ShipmentAnalytics from '@/components/analytics/ShipmentAnalytics';
import ForwarderAnalytics from '@/components/analytics/ForwarderAnalytics';
import CountryAnalytics from '@/components/analytics/CountryAnalytics';
import WarehouseAnalytics from '@/components/analytics/WarehouseAnalytics';

const AnalyticsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { shipmentData } = useBaseDataStore();
  const [showDeepTalk, setShowDeepTalk] = useState(false);

  // Calculate analytics data
  const shipmentMetrics = calculateShipmentMetrics(shipmentData);
  const forwarderPerformance = calculateForwarderPerformance(shipmentData);
  const countryPerformance = calculateCountryPerformance(shipmentData);
  const warehousePerformance = calculateWarehousePerformance(shipmentData);

  // Compute KPI data from shipment data
  const kpiData = {
    totalShipments: shipmentMetrics.totalShipments,
    totalWeight: shipmentData.reduce((sum, shipment) => sum + shipment.weight_kg, 0),
    totalVolume: shipmentData.reduce((sum, shipment) => sum + shipment.volume_cbm, 0),
    avgCostPerKg: shipmentData.reduce((sum, shipment) => {
      const avgCost = Object.values(shipment.forwarder_quotes).reduce((a, b) => a + b, 0) / 
        (Object.keys(shipment.forwarder_quotes).length || 1);
      return sum + avgCost;
    }, 0) / (shipmentData.length || 1),
    avgTransitDays: shipmentMetrics.avgTransitTime,
    modeSplit: {
      air: Object.entries(shipmentMetrics.shipmentsByMode)
            .find(([mode]) => mode.toLowerCase() === 'air')?.[1] || 0,
      road: Object.entries(shipmentMetrics.shipmentsByMode)
            .find(([mode]) => mode.toLowerCase() === 'road')?.[1] || 0,
      sea: Object.entries(shipmentMetrics.shipmentsByMode)
            .find(([mode]) => mode.toLowerCase() === 'sea')?.[1] || 0
    }
  };

  // Convert mode counts to percentages
  const totalModeCount = kpiData.modeSplit.air + kpiData.modeSplit.road + kpiData.modeSplit.sea;
  if (totalModeCount > 0) {
    kpiData.modeSplit.air = (kpiData.modeSplit.air / totalModeCount) * 100;
    kpiData.modeSplit.road = (kpiData.modeSplit.road / totalModeCount) * 100;
    kpiData.modeSplit.sea = (kpiData.modeSplit.sea / totalModeCount) * 100;
  }

  // Use the DeepTalk handler
  const handleDeepTalkQuery = useDeepTalkHandler({
    shipmentData,
    shipmentMetrics,
    forwarderPerformance,
    countryPerformance,
    warehousePerformance,
    kpiData
  });

  return (
    <AnalyticsLayout
      title="DeepCAL Analytics"
      kpis={kpiData}
      showDeepTalk={showDeepTalk}
      onToggleDeepTalk={() => setShowDeepTalk(!showDeepTalk)}
      onDeepTalkQuery={handleDeepTalkQuery}
    >
      <AnalyticsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        overviewContent={
          <OverviewContent 
            shipmentMetrics={shipmentMetrics} 
            countryPerformance={countryPerformance} 
          />
        }
        shipmentsContent={<ShipmentAnalytics metrics={shipmentMetrics} />}
        forwardersContent={<ForwarderAnalytics forwarders={forwarderPerformance} />}
        countriesContent={<CountryAnalytics countries={countryPerformance} />}
        warehousesContent={<WarehouseAnalytics warehouses={warehousePerformance} />}
      />
    </AnalyticsLayout>
  );
};

export default AnalyticsSection;
