
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
      <TabsList className="grid grid-cols-5 mb-6 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-mostar-light-blue/20 shadow-sm">
        <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-mostar-blue/20 data-[state=active]:text-mostar-light-blue data-[state=active]:shadow-inner">
          <BarChartIcon className="h-4 w-4" />
          <span className="font-medium">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="shipments" className="flex items-center gap-2 data-[state=active]:bg-mostar-blue/20 data-[state=active]:text-mostar-light-blue data-[state=active]:shadow-inner">
          <Package className="h-4 w-4" />
          <span className="font-medium">Shipments</span>
        </TabsTrigger>
        <TabsTrigger value="forwarders" className="flex items-center gap-2 data-[state=active]:bg-mostar-blue/20 data-[state=active]:text-mostar-light-blue data-[state=active]:shadow-inner">
          <Users className="h-4 w-4" />
          <span className="font-medium">Forwarders</span>
        </TabsTrigger>
        <TabsTrigger value="countries" className="flex items-center gap-2 data-[state=active]:bg-mostar-blue/20 data-[state=active]:text-mostar-light-blue data-[state=active]:shadow-inner">
          <Globe className="h-4 w-4" />
          <span className="font-medium">Countries</span>
        </TabsTrigger>
        <TabsTrigger value="warehouses" className="flex items-center gap-2 data-[state=active]:bg-mostar-blue/20 data-[state=active]:text-mostar-light-blue data-[state=active]:shadow-inner">
          <Warehouse className="h-4 w-4" />
          <span className="font-medium">Warehouses</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6 mt-0">
        {overviewContent}
      </TabsContent>
      
      <TabsContent value="shipments" className="mt-0">
        {shipmentsContent}
      </TabsContent>
      
      <TabsContent value="forwarders" className="mt-0">
        {forwardersContent}
      </TabsContent>
      
      <TabsContent value="countries" className="mt-0">
        {countriesContent}
      </TabsContent>
      
      <TabsContent value="warehouses" className="mt-0">
        {warehousesContent}
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabs;
