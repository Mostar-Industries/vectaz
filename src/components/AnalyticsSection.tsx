
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
import { ShipmentMetrics, CountryPerformance, ForwarderPerformance, WarehousePerformance } from '@/types/deeptrack';

// Analytics section connects all the analytics components together
const AnalyticsSection: React.FC = () => {
  const { shipmentData } = useBaseDataStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeepTalk, setShowDeepTalk] = useState(false);
  const handleDeepTalkQuery = useDeepTalkHandler();

  // Process the shipment data for analytics
  const analyticsData = analyzeShipmentData(shipmentData);

  // Prepare shipment metrics that conform to the ShipmentMetrics interface
  const shipmentMetrics: ShipmentMetrics = {
    totalShipments: shipmentData.length,
    shipmentsByMode: analyticsData.modeBreakdown || {},
    monthlyTrend: Array(12).fill(0).map((_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      count: Math.floor(Math.random() * 100)
    })),
    delayedVsOnTimeRate: {
      onTime: shipmentData.filter(s => s.delivery_status === 'Delivered').length,
      delayed: shipmentData.filter(s => s.delivery_status !== 'Delivered').length
    },
    avgTransitTime: 6.2,
    disruptionProbabilityScore: 4.2,
    shipmentStatusCounts: {
      active: shipmentData.filter(s => s.delivery_status === 'In Transit').length,
      completed: shipmentData.filter(s => s.delivery_status === 'Delivered').length,
      failed: shipmentData.filter(s => s.delivery_status === 'Failed').length,
    },
    resilienceScore: 85,
    noQuoteRatio: 0.05
  };

  // Prepare country performance data conforming to the CountryPerformance interface
  const countryPerformance: CountryPerformance[] = Object.entries(analyticsData.countryBreakdown || {}).map(([country, count]) => ({
    country,
    totalShipments: count as number,
    avgCostPerRoute: 1200 + Math.random() * 500,
    avgCustomsClearanceTime: 2 + Math.random() * 5,
    deliveryFailureRate: Math.random() * 0.1,
    borderDelayIncidents: Math.floor(Math.random() * 10),
    resilienceIndex: 60 + Math.random() * 30,
    preferredMode: ['Air', 'Sea', 'Road', 'Rail'][Math.floor(Math.random() * 4)],
    topForwarders: ['DHL', 'FedEx', 'Maersk'].slice(0, 1 + Math.floor(Math.random() * 3)),
    reliabilityScore: 0.7 + Math.random() * 0.25,
    avgTransitDays: 4 + Math.random() * 8,
    deliverySuccessRate: 0.85 + Math.random() * 0.15
  }));

  // Prepare forwarder data conforming to the ForwarderPerformance interface
  const forwarderData: ForwarderPerformance[] = Object.entries(analyticsData.forwarderBreakdown || {}).map(([name, count]) => ({
    name,
    totalShipments: count as number,
    avgCostPerKg: 10 + Math.random() * 15,
    avgTransitDays: 3 + Math.random() * 7,
    onTimeRate: 0.8 + Math.random() * 0.2,
    reliabilityScore: 0.75 + Math.random() * 0.25,
    deepScore: 70 + Math.random() * 30,
    costScore: 0.6 + Math.random() * 0.4,
    timeScore: 0.65 + Math.random() * 0.35,
    quoteWinRate: 0.3 + Math.random() * 0.4
  }));

  // Prepare warehouse data conforming to the WarehousePerformance interface
  const warehouseData: WarehousePerformance[] = Array(5).fill(0).map((_, i) => ({
    name: `Warehouse ${i+1}`,
    location: ['Nairobi', 'Lagos', 'Cairo', 'Johannesburg', 'Casablanca'][i],
    totalShipments: Math.floor(Math.random() * 1000),
    avgPickPackTime: 1 + Math.random() * 3,
    packagingFailureRate: Math.random() * 0.08,
    missedDispatchRate: Math.random() * 0.1,
    rescheduledShipmentsRatio: Math.random() * 0.15,
    reliabilityScore: 70 + Math.random() * 30,
    preferredForwarders: ['DHL', 'FedEx', 'UPS'].slice(0, 1 + Math.floor(Math.random() * 3)),
    costDiscrepancy: Math.random() * 10 - 5,
    dispatchSuccessRate: 0.85 + Math.random() * 0.15,
    avgTransitDays: 4 + Math.random() * 6
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
