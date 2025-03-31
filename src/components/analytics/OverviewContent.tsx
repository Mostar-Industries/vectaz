
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
      <Card>
        <CardHeader>
          <CardTitle>Shipment Analytics</CardTitle>
          <CardDescription>Performance metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ShipmentAnalytics metrics={shipmentMetrics} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Destination Countries</CardTitle>
          <CardDescription>Shipment distribution by destination country</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <CountryAnalytics countries={countryPerformance.slice(0, 5)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewContent;
