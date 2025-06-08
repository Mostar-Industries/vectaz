import React, { useState, useEffect } from "react";
import { GlassContainer } from '@/components/ui/glass-effects';
import AnimatedBackground from '@/components/home/AnimatedBackground';
import { useBaseDataStore } from '@/store/baseState';

// Import analytics components
import GlobalSummaryRow from '@/components/analytics/GlobalSummaryRow';
import ChartsRow from '@/components/analytics/ChartsRow';
import AnalyticsTabs from '@/components/analytics/AnalyticsTabs';

// Import animation components are removed to fix navigation

// Import tab components
import ShipmentsTab from '@/components/analytics/tabs/ShipmentsTab';
import ForwardersTab from '@/components/analytics/tabs/ForwardersTab';
import CountriesTab from '@/components/analytics/tabs/CountriesTab';
import TrendsTab from '@/components/analytics/tabs/TrendsTab';
import SymbolicTab from '@/components/analytics/tabs/SymbolicTab';

// Define interfaces for our analytics data
interface AnalyticsSummary {
  totalShipments: number;
  totalWeightKg: number;
  totalVolumeCbm: number;
  distinctDestinations: number;
  distinctForwarders: number;
  avgCostPerKg: number;
}

interface ChartData {
  shipmentsByMode: Record<string, number>;
  monthlyTrend: Array<{month: string; count: number}>;
  forwarderCosts: Array<{name: string; cost: number}>;
  delays: {onTime: number; delayed: number};
}

const AnalyticsPage: React.FC = () => {
  const { shipmentData } = useBaseDataStore();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Sample analytics summary data - would be computed from actual data in production
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalShipments: 582,
    totalWeightKg: 248750,
    totalVolumeCbm: 1250.5,
    distinctDestinations: 37,
    distinctForwarders: 14,
    avgCostPerKg: 4.32
  });
  
  // Sample charts data - would be computed from actual data in production
  const [charts, setCharts] = useState<ChartData>({
    shipmentsByMode: {
      air: 243,
      ocean: 187,
      rail: 92,
      road: 60
    },
    monthlyTrend: [
      { month: 'Jan', count: 42 },
      { month: 'Feb', count: 56 },
      { month: 'Mar', count: 68 },
      { month: 'Apr', count: 72 },
      { month: 'May', count: 86 },
      { month: 'Jun', count: 124 }
    ],
    forwarderCosts: [
      { name: 'Global Express', cost: 3.78 },
      { name: 'Skyline Logistics', cost: 4.12 },
      { name: 'Quantum Shipping', cost: 5.21 },
      { name: 'Nexus Freight', cost: 4.75 },
      { name: 'Alpha Transport', cost: 4.08 }
    ],
    delays: {
      onTime: 518,
      delayed: 64
    }
  });
  
  // Process shipment data when available
  // Keep simpler initialization without problematic animations
  
  useEffect(() => {
    if (shipmentData && shipmentData.length > 0) {
      setIsLoading(true);
      // Calculate actual metrics from real shipment data
      console.log(`Processing ${shipmentData.length} shipment records for analytics`);
      
      // Example calculation of summary metrics
      const totalWeight = shipmentData.reduce((sum, shipment) => sum + (shipment.weight_kg || 0), 0);
      const totalVolume = shipmentData.reduce((sum, shipment) => sum + (shipment.volume_cbm || 0), 0);
      const destinations = new Set(shipmentData.map(s => s.destination_country));
      const forwarders = new Set(shipmentData.map(s => s.forwarder_name || s.freight_provider));
      
      setSummary({
        totalShipments: shipmentData.length,
        totalWeightKg: totalWeight,
        totalVolumeCbm: totalVolume,
        distinctDestinations: destinations.size,
        distinctForwarders: forwarders.size,
        avgCostPerKg: totalWeight > 0 ? 
          shipmentData.reduce((sum, s) => sum + (s.freight_cost_usd || 0), 0) / totalWeight : 0
      });
      
      // Process chart data would be done here
      setIsLoading(false);
    } else {
      // If no shipment data is available, use sample data after a brief loading period
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [shipmentData]);
  
  return (
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden relative bg-[#0A1A2F]">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-[#0A1A2F]/90 z-0" />
      <div className="relative z-10 w-full pt-16 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <GlassContainer className="mb-6 p-4 relative overflow-hidden">
            <h1 className="text-3xl font-bold text-center text-[#00FFD1]">
              DeepCAL™ Analytics Engine
            </h1>
            <p className="text-sm text-center text-gray-400 mt-2">
              Real-time logistics intelligence with advanced symbolic AI insights
            </p>
          </GlassContainer>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#00FFD1] border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            </div>
          ) : (
            <>
              <GlobalSummaryRow summary={summary} />
              
              <ChartsRow charts={charts} />
              
              <GlassContainer className="mt-6 p-6">
                <AnalyticsTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  overviewContent={<div className="py-4 space-y-6">
                    <p className="text-gray-300">Overall logistics network performance and key metrics</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-black/30 p-4 rounded-lg border border-mostar-light-blue/20">
                        <h3 className="text-lg text-[#00FFD1] mb-3">Network Summary</h3>
                        <p className="text-sm text-gray-300">Comprehensive overview of your global logistics performance</p>
                      </div>
                      <div className="bg-black/30 p-4 rounded-lg border border-mostar-light-blue/20">
                        <h3 className="text-lg text-[#00FFD1] mb-3">Growth Trend</h3>
                        <p className="text-sm text-gray-300">+18.2% shipment growth compared to previous quarter</p>
                      </div>
                    </div>
                    <div className="text-center py-20">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00FFD1]"></div>
                    </div>
                  </div>}
                  shipmentsContent={<ShipmentsTab data={shipmentData || []} />}
                  forwardersContent={<ForwardersTab data={shipmentData || []} />}
                  countriesContent={<CountriesTab data={shipmentData || []} />}
                  warehousesContent={
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="text-xl text-[#00FFD1] mb-3">Warehouse Analytics Module</div>
                      <p className="text-sm text-gray-300">Coming soon with real-time warehouse operations data</p>
                    </div>
                  }
                  trendsContent={<TrendsTab data={undefined} />}
                  symbolicContent={<SymbolicTab data={undefined} />}
                />
              </GlassContainer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
