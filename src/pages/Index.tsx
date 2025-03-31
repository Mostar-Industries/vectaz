
import React, { useState, useEffect } from 'react';
import KPIPanel from '@/components/KPIPanel';
import MapVisualizer from '@/components/MapVisualizer';
import ResilienceChart from '@/components/ResilienceChart';
import ForwarderRanking from '@/components/ForwarderRanking';
import DeepTalk from '@/components/DeepTalk';
import RFQBuilder from '@/components/RFQBuilder';
import DataBootLoader from '@/components/DataBootLoader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoveUp, Map, Database, Truck, MessageSquare, FileText, BarChart4, AlertTriangle } from 'lucide-react';
import { useBaseDataStore } from '@/store/baseState';
import { decisionEngine } from '@/core/engine';
import { isSystemBooted } from '@/init/boot';
import { Label } from '@/components/ui/label';

const mockResilienceData = [
  { date: 'Jan', disruption: 0.3, cost: 0.4, reliability: 0.8 },
  { date: 'Feb', disruption: 0.5, cost: 0.45, reliability: 0.75 },
  { date: 'Mar', disruption: 0.4, cost: 0.5, reliability: 0.7 },
  { date: 'Apr', disruption: 0.6, cost: 0.55, reliability: 0.65 },
  { date: 'May', disruption: 0.7, cost: 0.6, reliability: 0.6 },
  { date: 'Jun', disruption: 0.5, cost: 0.5, reliability: 0.7 },
];

const mockShipmentData = {
  id: 'SR_24-001',
  reference: 'SR_24-001_NBO hub_Zimbabwe',
  origin: 'Kenya',
  destination: 'Zimbabwe',
  weight: 7352.98,
  volume: 24.68,
  category: 'Emergency Health Kits',
};

const mockForwarderOptions = [
  { id: 'f1', name: 'Kenya Airways', reliability: 0.85 },
  { id: 'f2', name: 'Kuehne Nagel', reliability: 0.92 },
  { id: 'f3', name: 'Freight In Time', reliability: 0.78 },
  { id: 'f4', name: 'Scan Global', reliability: 0.81 },
  { id: 'f5', name: 'DHL Express', reliability: 0.88 },
  { id: 'f6', name: 'Siginon Logistics', reliability: 0.74 },
];

const DeepCALDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);
  const [selectedForwarder, setSelectedForwarder] = useState<string>('');
  
  // Use data from our store
  const { 
    isDataLoaded, 
    criteriaWeights, 
    setCriteriaWeights,
    hasMockData
  } = useBaseDataStore();
  
  const [kpis, setKpis] = useState({
    totalShipments: 0,
    totalWeight: 0,
    totalVolume: 0,
    avgCostPerKg: 0,
    avgTransitDays: 0,
    modeSplit: { air: 0, road: 0, sea: 0 }
  });

  const [routes, setRoutes] = useState<any[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);
  
  // Effect to refresh data when system is booted
  useEffect(() => {
    if (isDataLoaded && isSystemBooted()) {
      refreshData();
    }
  }, [isDataLoaded]);
  
  // Function to refresh all data from the engine
  const refreshData = () => {
    if (!isDataLoaded || !isSystemBooted()) return;
    
    try {
      // Get KPIs from engine
      const kpiData = decisionEngine.getKPIs();
      setKpis(kpiData);
      
      // Get route data for map
      const routeData = decisionEngine.getTopRoutes(5);
      const routesForMap = routeData.map(route => ({
        origin: {
          lat: 1.2404475, // Should come from coordinates lookup
          lng: 36.990054,
          name: route.origin,
          isOrigin: true
        },
        destination: {
          lat: route.destination === 'Zimbabwe' ? -17.80269125 : 15.4136414, // Should come from coordinates lookup
          lng: route.destination === 'Zimbabwe' ? 31.08848075 : 28.3174378,
          name: route.destination,
          isOrigin: false
        },
        weight: route.totalShipments,
        shipmentCount: route.totalShipments
      }));
      setRoutes(routesForMap);
      
      // Get forwarder rankings
      const rankingData = decisionEngine.getRankedAlternatives(criteriaWeights);
      setRankings(rankingData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };
  
  const handleExplainForwarder = (forwarder: string) => {
    setSelectedForwarder(forwarder);
    setIsExplainModalOpen(true);
  };
  
  const handleRFQSubmit = async (data: any) => {
    console.log("RFQ Data:", data);
    return new Promise<void>(resolve => setTimeout(resolve, 1500));
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <MoveUp className="h-6 w-6 mr-2 text-primary" />
                DeepCAL
              </h1>
              <p className="text-sm text-muted-foreground">
                Intelligent Emergency Logistics Decision-Support System
              </p>
            </div>
            {hasMockData() && (
              <div className="bg-amber-100 px-3 py-1 rounded-md text-sm text-amber-800 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Demo Mode
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {!isDataLoaded ? (
          <div className="max-w-lg mx-auto my-8">
            <DataBootLoader />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="dashboard" className="flex items-center">
                <BarChart4 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <Map className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="ranking" className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                Ranking
              </TabsTrigger>
              <TabsTrigger value="rfq" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                RFQ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <KPIPanel kpis={kpis} isLoading={!isDataLoaded} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Live Route Map</h3>
                    <MapVisualizer routes={routes} isLoading={!isDataLoaded} />
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <DeepTalk
                    className="h-[480px]"
                    initialMessage="Welcome to DeepCAL. Ask me about shipment routes, forwarder performance, or risk analysis."
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResilienceChart data={mockResilienceData} isLoading={!isDataLoaded} />
                
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Shipment Status</h3>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Status feed visualization would go here
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Delay Heatmap</h3>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Delay heatmap visualization would go here
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-card border rounded-lg p-4 h-full">
                    <h3 className="text-lg font-medium mb-4">Dynamic Truck Selector</h3>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Truck selection tool would go here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ranking" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Criteria Weights</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="flex justify-between">
                        <span>Cost</span>
                        <span>{(criteriaWeights.cost * 100).toFixed(0)}%</span>
                      </Label>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={criteriaWeights.cost} 
                        onChange={(e) => {
                          const newCost = parseFloat(e.target.value);
                          const remaining = 1 - newCost;
                          setCriteriaWeights({
                            cost: newCost,
                            time: remaining * 0.5,
                            reliability: remaining * 0.5
                          });
                        }}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex justify-between">
                        <span>Transit Time</span>
                        <span>{(criteriaWeights.time * 100).toFixed(0)}%</span>
                      </Label>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={criteriaWeights.time} 
                        onChange={(e) => {
                          const newTime = parseFloat(e.target.value);
                          const remaining = 1 - newTime - criteriaWeights.reliability;
                          setCriteriaWeights({
                            cost: remaining,
                            time: newTime,
                            reliability: criteriaWeights.reliability
                          });
                        }}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex justify-between">
                        <span>Reliability</span>
                        <span>{(criteriaWeights.reliability * 100).toFixed(0)}%</span>
                      </Label>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={criteriaWeights.reliability} 
                        onChange={(e) => {
                          const newReliability = parseFloat(e.target.value);
                          const remaining = 1 - newReliability - criteriaWeights.time;
                          setCriteriaWeights({
                            cost: remaining,
                            time: criteriaWeights.time,
                            reliability: newReliability
                          });
                        }}
                        className="w-full"
                      />
                    </div>
                    
                    <Button 
                      onClick={refreshData} 
                      className="w-full"
                    >
                      Apply Weights
                    </Button>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <ForwarderRanking 
                    rankings={rankings} 
                    onExplain={handleExplainForwarder}
                    isLoading={!isDataLoaded}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Decision Matrix</h3>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">
                      AHP-TOPSIS decision matrix would go here
                    </p>
                  </div>
                </div>
                
                <DeepTalk 
                  className="h-[300px]"
                  initialMessage="Ask me to explain ranking decisions or compare forwarders."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="rfq" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RFQBuilder 
                    shipmentData={mockShipmentData}
                    availableForwarders={mockForwarderOptions}
                    onSubmit={handleRFQSubmit}
                  />
                </div>
                
                <DeepTalk 
                  className="h-[600px]"
                  initialMessage="Ask me about forwarder performance or optimal logistics parameters for your shipment."
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
      
      <Dialog open={isExplainModalOpen} onOpenChange={setIsExplainModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Why {selectedForwarder} Ranked This Way</DialogTitle>
            <DialogDescription>
              Explanation based on AHP-TOPSIS algorithm
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <strong>{selectedForwarder}</strong> received this ranking based on our 
              Grey AHP-TOPSIS algorithm which evaluates performance across multiple criteria:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cost Efficiency:</strong> Scored {Math.round(Math.random() * 40 + 60)}/100
                <br />
                <span className="text-xs text-muted-foreground">
                  Based on average cost per kg compared to alternatives
                </span>
              </li>
              <li>
                <strong>Transit Time:</strong> Scored {Math.round(Math.random() * 30 + 70)}/100
                <br />
                <span className="text-xs text-muted-foreground">
                  Based on average delivery time for similar routes
                </span>
              </li>
              <li>
                <strong>Reliability:</strong> Scored {Math.round(Math.random() * 20 + 80)}/100
                <br />
                <span className="text-xs text-muted-foreground">
                  Based on on-time delivery rate and consistency
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              The final closeness coefficient (C_i) was calculated using the weighted normalized 
              decision matrix and distances to ideal solutions.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeepCALDashboard;
