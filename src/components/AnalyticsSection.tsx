
import React, { useState, useEffect } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import AnalyticsLayout from '@/components/analytics/AnalyticsLayout';
import AnalyticsTabs from '@/components/analytics/AnalyticsTabs';
import OverviewContent from '@/components/analytics/OverviewContent';
import ShipmentAnalytics from '@/components/analytics/ShipmentAnalytics';
import ForwarderAnalytics from '@/components/analytics/ForwarderAnalytics';
import CountryAnalytics from '@/components/analytics/CountryAnalytics';
import WarehouseAnalytics from '@/components/analytics/WarehouseAnalytics';
import { getDeepTalkHandler } from '@/components/analytics/DeepTalkHandler';
import { 
  analyzeShipmentData, 
  calculateShipmentMetrics, 
  calculateForwarderPerformance, 
  calculateCountryPerformance, 
  calculateWarehousePerformance,
  calculateCarrierPerformance
} from '@/utils/analyticsUtils';
import { ShipmentMetrics, CountryPerformance, ForwarderPerformance, WarehousePerformance, CarrierPerformance } from '@/types/deeptrack';

// Analytics section connects all the analytics components together
const AnalyticsSection: React.FC = () => {
  const { shipmentData } = useBaseDataStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeepTalk, setShowDeepTalk] = useState(false);
  const handleDeepTalkQuery = getDeepTalkHandler();
  
  console.log(`Total shipments in data store: ${shipmentData.length}`);

  // Process the shipment data for analytics
  const analyticsData = analyzeShipmentData(shipmentData);
  
  // Calculate shipment metrics directly from data
  const shipmentMetrics = calculateShipmentMetrics(shipmentData);
  
  // Calculate country performance
  const countryPerformance = calculateCountryPerformance(shipmentData);
  
  // Calculate forwarder performance
  const forwarderData = calculateForwarderPerformance(shipmentData);
  
  // Calculate carrier performance
  const carrierData = calculateCarrierPerformance(shipmentData);
  
  // Calculate warehouse performance
  const warehouseData = calculateWarehousePerformance(shipmentData);

  // Sample KPI data calculated from the shipment data
  const kpis = [
    {
      label: 'Total Shipments',
      value: shipmentData.length,
      trend: '+12%',
      trendDirection: 'up',
      iconName: 'package',
      color: 'blue'
    },
    {
      label: 'On-Time Delivery',
      value: `${Math.round((shipmentMetrics.delayedVsOnTimeRate.onTime / Math.max(shipmentData.length, 1)) * 100)}%`,
      trend: '+4%',
      trendDirection: 'up',
      iconName: 'clock',
      color: 'green'
    },
    {
      label: 'Average Transit Time',
      value: `${shipmentMetrics.avgTransitTime.toFixed(1)} days`,
      trend: '-0.5 days',
      trendDirection: 'down',
      iconName: 'truck',
      color: 'cyan'
    },
    {
      label: 'Route Resilience',
      value: `${Math.round(shipmentMetrics.resilienceScore)}%`,
      trend: '+2%',
      trendDirection: 'up',
      iconName: 'shield',
      color: 'purple'
    }
  ];

  const toggleDeepTalk = () => {
    setShowDeepTalk(!showDeepTalk);
  };

  useEffect(() => {
    console.log(`Analytics processed ${shipmentData.length} shipments`);
    console.log(`Found ${forwarderData.length} forwarders`);
    console.log(`Found ${carrierData.length} carriers`);
    console.log(`Found ${countryPerformance.length} countries`);
  }, [shipmentData.length, forwarderData.length, carrierData.length, countryPerformance.length]);

  return (
    <AnalyticsLayout
      title="Shipment Analytics"
      kpis={kpis}
      showDeepTalk={showDeepTalk}
      onToggleDeepTalk={toggleDeepTalk}
      onDeepTalkQuery={handleDeepTalkQuery}
    >
      <AnalyticsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        overviewContent={<OverviewContent 
          shipmentMetrics={shipmentMetrics} 
          countryPerformance={countryPerformance} 
        />}
        shipmentsContent={<ShipmentAnalytics 
          metrics={shipmentMetrics} 
        />}
        forwardersContent={<ForwarderAnalytics 
          forwarders={forwarderData} 
          carriers={carrierData}
        />}
        countriesContent={<CountryAnalytics 
          countries={countryPerformance} 
        />}
        warehousesContent={<WarehouseAnalytics 
          warehouses={warehouseData} 
        />}
      />
    </AnalyticsLayout>
  );
};

export default AnalyticsSection;
