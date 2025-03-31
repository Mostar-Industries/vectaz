
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

// Analytics section connects all the analytics components together
const AnalyticsSection: React.FC = () => {
  const { shipmentData } = useBaseDataStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeepTalk, setShowDeepTalk] = useState(false);
  const handleDeepTalkQuery = useDeepTalkHandler();

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
        overviewContent={<OverviewContent />}
        shipmentsContent={<ShipmentAnalytics />}
        forwardersContent={<ForwarderAnalytics />}
        countriesContent={<CountryAnalytics />}
        warehousesContent={<WarehouseAnalytics />}
      />
    </AnalyticsLayout>
  );
};

export default AnalyticsSection;
