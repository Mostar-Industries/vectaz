
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChartIcon, Package, Users, Globe, Warehouse } from 'lucide-react';

interface AnalyticsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  overviewContent: React.ReactNode;
  shipmentsContent: React.ReactNode;
  forwardersContent: React.ReactNode;
  countriesContent: React.ReactNode;
  warehousesContent: React.ReactNode;
}

const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({
  activeTab,
  onTabChange,
  overviewContent,
  shipmentsContent,
  forwardersContent,
  countriesContent,
  warehousesContent
}) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-5 mb-6">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <BarChartIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="shipments" className="flex items-center gap-1">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">Shipments</span>
        </TabsTrigger>
        <TabsTrigger value="forwarders" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Forwarders</span>
        </TabsTrigger>
        <TabsTrigger value="countries" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">Countries</span>
        </TabsTrigger>
        <TabsTrigger value="warehouses" className="flex items-center gap-1">
          <Warehouse className="h-4 w-4" />
          <span className="hidden sm:inline">Warehouses</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        {overviewContent}
      </TabsContent>
      
      <TabsContent value="shipments">
        {shipmentsContent}
      </TabsContent>
      
      <TabsContent value="forwarders">
        {forwardersContent}
      </TabsContent>
      
      <TabsContent value="countries">
        {countriesContent}
      </TabsContent>
      
      <TabsContent value="warehouses">
        {warehousesContent}
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabs;
