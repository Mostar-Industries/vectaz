
import React, { useState } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import AnalyticsLayout from '@/components/analytics/AnalyticsLayout';
import AnalyticsTabs from '@/components/analytics/AnalyticsTabs';
import OverviewContent from '@/components/analytics/OverviewContent';
import ShipmentAnalytics from '@/components/analytics/ShipmentAnalytics';
import ForwarderAnalytics from '@/components/analytics/ForwarderAnalytics';
import CountryAnalytics from '@/components/analytics/CountryAnalytics';
import WarehouseAnalytics from '@/components/analytics/WarehouseAnalytics';
import { useDeepTalkHandler } from '@/components/analytics/DeepTalkHandler';
import { analyzeShipmentData } from '@/utils/analyticsUtils';

// Analytics section connects all the analytics components together
const AnalyticsSection: React.FC = () => {
  const { shipmentData } = useBaseDataStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeepTalk, setShowDeepTalk] = useState(false);
  const handleDeepTalkQuery = useDeepTalkHandler();

  // Process the shipment data for analytics
  const analyticsData = analyzeShipmentData(shipmentData);

  // Prepare metrics for components
  const shipmentMetrics = {
    totalCount: shipmentData.length,
    deliveredCount: shipmentData.filter(s => s.delivery_status === 'Delivered').length,
    inTransitCount: shipmentData.filter(s => s.delivery_status === 'In Transit').length,
    pendingCount: shipmentData.filter(s => s.delivery_status === 'Pending').length,
    averageWeight: analyticsData.averageWeight,
  };

  // Prepare country performance data
  const countryPerformance = Object.entries(analyticsData.countryBreakdown).map(([country, count]) => ({
    country,
    count: count as number,
    onTimeRate: Math.random() * 100, // Placeholder data
    costEfficiency: Math.random() * 100 // Placeholder data
  }));

  // Prepare forwarder data
  const forwarderData = Object.entries(analyticsData.forwarderBreakdown).map(([name, count]) => ({
    name,
    shipmentCount: count as number,
    performanceScore: Math.random() * 100, // Placeholder data
    reliabilityIndex: Math.random() * 100, // Placeholder data
    costEfficiency: Math.random() * 100 // Placeholder data
  }));

  // Prepare warehouse data
  const warehouseData = Array(5).fill(0).map((_, i) => ({
    id: `WH${i+1}`,
    name: `Warehouse ${i+1}`,
    location: ['Nairobi', 'Lagos', 'Cairo', 'Johannesburg', 'Casablanca'][i],
    capacityUsed: Math.floor(Math.random() * 100),
    shipmentsThroughput: Math.floor(Math.random() * 1000),
    efficiencyScore: Math.floor(Math.random() * 100)
  }));

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
      value: '89%',
      trend: '+4%',
      trendDirection: 'up',
      iconName: 'clock',
      color: 'green'
    },
    {
      label: 'Average Transit Time',
      value: '6.2 days',
      trend: '-0.5 days',
      trendDirection: 'down',
      iconName: 'truck',
      color: 'cyan'
    },
    {
      label: 'Route Resilience',
      value: '85%',
      trend: '+2%',
      trendDirection: 'up',
      iconName: 'shield',
      color: 'purple'
    }
  ];

  const toggleDeepTalk = () => {
    setShowDeepTalk(!showDeepTalk);
  };

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
        overviewContent={<OverviewContent shipmentMetrics={shipmentMetrics} countryPerformance={countryPerformance} />}
        shipmentsContent={<ShipmentAnalytics metrics={shipmentMetrics} />}
        forwardersContent={<ForwarderAnalytics forwarders={forwarderData} />}
        countriesContent={<CountryAnalytics countries={countryPerformance} />}
        warehousesContent={<WarehouseAnalytics warehouses={warehouseData} />}
      />
    </AnalyticsLayout>
  );
};

export default AnalyticsSection;
