
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShipmentMetrics, CountryPerformance } from '@/types/deeptrack';
import ShipmentAnalytics from './ShipmentAnalytics';
import CountryAnalytics from './CountryAnalytics';

interface OverviewContentProps {
  shipmentMetrics: ShipmentMetrics;
  countryPerformance: CountryPerformance[];
}

const OverviewContent: React.FC<OverviewContentProps> = ({ 
  shipmentMetrics, 
  countryPerformance 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border border-border/30 shadow-sm hover:border-border/50 transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Shipment Analytics</CardTitle>
          <CardDescription>Performance metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[360px]">
            <ShipmentAnalytics metrics={shipmentMetrics} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border/30 shadow-sm hover:border-border/50 transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Top Destination Countries</CardTitle>
          <CardDescription>Shipment distribution by destination country</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[360px]">
            <CountryAnalytics countries={countryPerformance.slice(0, 5)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewContent;
