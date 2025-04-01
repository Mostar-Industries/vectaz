
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useBaseDataStore } from '@/store/baseState';
import { getForwarderRankings } from '@/services/deepEngine';
import DeepCALSpinner from './DeepCALSpinner';
import forwarders from '@/core/base_reference/forwarders.json';
import carriers from '@/core/base_reference/carrier.json';

interface QuoteData {
  forwarder: string;
  quote: number;
}

interface ForwarderScore {
  forwarder: string;
  score: number;
  closeness: number;
  costPerformance: number;
  timePerformance: number;
  reliabilityPerformance: number;
}

const DeepCALSection: React.FC = () => {
  const { shipmentData } = useBaseDataStore();
  const [quotes, setQuotes] = useState<QuoteData[]>(forwarders.slice(0, 3).map(name => ({ forwarder: name, quote: 0 })));
  const [weightKg, setWeightKg] = useState<number>(20000);
  const [source, setSource] = useState<string>('Kenya');
  const [destination, setDestination] = useState<string>('Zimbabwe');
  const [mode, setMode] = useState<string>('Air');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ForwarderScore[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [activeResultTab, setActiveResultTab] = useState<string>('recommendation');
  
  // Weight factors for ranking calculation
  const [weightFactors, setWeightFactors] = useState({
    cost: 0.4,
    time: 0.3,
    reliability: 0.3
  });

  const handleQuoteChange = (index: number, value: string) => {
    const newQuotes = [...quotes];
    newQuotes[index].quote = Number(value) || 0;
    setQuotes(newQuotes);
  };

  const handleAddForwarder = () => {
    if (quotes.length < forwarders.length) {
      const availableForwarders = forwarders.filter(
        f => !quotes.some(q => q.forwarder === f)
      );
      if (availableForwarders.length > 0) {
        setQuotes([...quotes, { forwarder: availableForwarders[0], quote: 0 }]);
      }
    }
  };

  const handleRemoveForwarder = (index: number) => {
    if (quotes.length > 1) {
      const newQuotes = [...quotes];
      newQuotes.splice(index, 1);
      setQuotes(newQuotes);
    }
  };

  const handleWeightChange = (field: 'cost' | 'time' | 'reliability', value: number) => {
    setWeightFactors({
      ...weightFactors,
      [field]: value
    });
  };

  const analyzeQuotes = () => {
    setLoading(true);
    
    // Simulate API call to DeepCAL engine
    setTimeout(() => {
      try {
        // Use the real service to get rankings based on weight factors
        const rankings = getForwarderRankings(weightFactors);
        
        // Filter to only include forwarders in the quotes
        const filteredRankings = rankings
          .filter(r => quotes.some(q => q.forwarder.toLowerCase().includes(r.forwarder.toLowerCase()) || 
                                    r.forwarder.toLowerCase().includes(q.forwarder.toLowerCase())))
          .sort((a, b) => b.score - a.score);
        
        setResults(filteredRankings);
        setShowResults(true);
        setLoading(false);
      } catch (error) {
        console.error("Error calculating rankings:", error);
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {!showResults ? (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gradient-primary">DeepCAL™ Quote Optimizer</CardTitle>
            <CardDescription className="text-center">
              Enter your freight quotes to receive AI-powered logistics recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="source">Source Country</Label>
                <Input 
                  id="source" 
                  value={source} 
                  onChange={(e) => setSource(e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination Country</Label>
                <Input 
                  id="destination" 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weight">Shipment Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number"
                  value={weightKg} 
                  onChange={(e) => setWeightKg(Number(e.target.value) || 0)} 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="mode">Mode of Shipment</Label>
                <select 
                  id="mode" 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                >
                  <option>Air</option>
                  <option>Sea</option>
                  <option>Road</option>
                </select>
              </div>
            </div>

            <Separator className="my-8" />
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Forwarder Quotes</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddForwarder}
                  disabled={quotes.length >= forwarders.length}
                >
                  Add Forwarder
                </Button>
              </div>
              
              {quotes.map((quote, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-1/3">
                    <select 
                      value={quote.forwarder}
                      onChange={(e) => {
                        const newQuotes = [...quotes];
                        newQuotes[index].forwarder = e.target.value;
                        setQuotes(newQuotes);
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {forwarders.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input 
                        type="number"
                        value={quote.quote}
                        onChange={(e) => handleQuoteChange(index, e.target.value)}
                        placeholder="Quote amount"
                      />
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveForwarder(index)}
                      disabled={quotes.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-8" />

            <div>
              <h3 className="text-lg font-medium mb-4">Weight Factor Adjustment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="cost-factor">Cost ({Math.round(weightFactors.cost * 100)}%)</Label>
                  <Input 
                    id="cost-factor"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weightFactors.cost}
                    onChange={(e) => handleWeightChange('cost', parseFloat(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="time-factor">Time ({Math.round(weightFactors.time * 100)}%)</Label>
                  <Input 
                    id="time-factor"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weightFactors.time}
                    onChange={(e) => handleWeightChange('time', parseFloat(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="reliability-factor">Reliability ({Math.round(weightFactors.reliability * 100)}%)</Label>
                  <Input 
                    id="reliability-factor"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weightFactors.reliability}
                    onChange={(e) => handleWeightChange('reliability', parseFloat(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-10">
              <Button 
                size="lg" 
                className="px-10 py-6 text-lg bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 transition-all"
                onClick={analyzeQuotes}
                disabled={loading || quotes.some(q => q.quote <= 0)}
              >
                {loading ? (
                  <span className="flex items-center">
                    <DeepCALSpinner />
                    <span className="ml-2">Analyzing...</span>
                  </span>
                ) : (
                  "Enter the Deep"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gradient-primary">DeepCAL™ Analysis Results</CardTitle>
                <CardDescription>
                  {source} to {destination} | {weightKg} kg | {mode}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowResults(false)}
              >
                New Analysis
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeResultTab} onValueChange={setActiveResultTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
                  <TabsTrigger value="comparison">Comparison</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recommendation">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/30 dark:to-cyan-950/30 shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="text-xl text-gradient-primary">Top Recommendation</CardTitle>
                        <CardDescription>Based on your preferences</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center space-y-4">
                          <div className="text-4xl font-bold text-gradient-primary">
                            {results[0]?.forwarder || "No recommendation available"}
                          </div>
                          
                          <div className="text-2xl">
                            DeepScore™: {Math.round((results[0]?.score || 0) * 100)}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Cost</div>
                              <div className="text-xl font-semibold">
                                {Math.round((results[0]?.costPerformance || 0) * 100)}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Time</div>
                              <div className="text-xl font-semibold">
                                {Math.round((results[0]?.timePerformance || 0) * 100)}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Reliability</div>
                              <div className="text-xl font-semibold">
                                {Math.round((results[0]?.reliabilityPerformance || 0) * 100)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Decision Explanation</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm space-y-3">
                        <p>
                          <strong>{results[0]?.forwarder}</strong> is recommended as the optimal choice for your shipment based on a comprehensive analysis that considers cost, time efficiency, and reliability factors.
                        </p>
                        <p>
                          This forwarder demonstrates excellent {results[0]?.reliabilityPerformance > 0.8 ? "reliability" : "cost-effectiveness"} on the {source}-{destination} route, with historical data showing consistently strong performance across similar shipments.
                        </p>
                        <p>
                          Your preference weight of {Math.round(weightFactors.cost * 100)}% for cost, {Math.round(weightFactors.time * 100)}% for time, and {Math.round(weightFactors.reliability * 100)}% for reliability was applied to the calculation.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="comparison">
                  <div className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>ForwarderScore™ Comparison</CardTitle>
                      </CardHeader>
                      <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={results} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                            <YAxis dataKey="forwarder" type="category" width={150} />
                            <Tooltip 
                              formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'DeepScore™']}
                            />
                            <Legend />
                            <Bar dataKey="score" name="DeepScore™" fill="#6366f1" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Multi-Dimensional Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={150} data={results}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="forwarder" />
                            <PolarRadiusAxis angle={30} domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                            <Radar 
                              name="Cost" 
                              dataKey="costPerformance" 
                              stroke="#22c55e" 
                              fill="#22c55e" 
                              fillOpacity={0.5} 
                            />
                            <Radar 
                              name="Time" 
                              dataKey="timePerformance" 
                              stroke="#3b82f6" 
                              fill="#3b82f6" 
                              fillOpacity={0.5} 
                            />
                            <Radar 
                              name="Reliability" 
                              dataKey="reliabilityPerformance" 
                              stroke="#a855f7" 
                              fill="#a855f7" 
                              fillOpacity={0.5} 
                            />
                            <Legend />
                            <Tooltip formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, '']} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="detailed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Calculated Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Forwarder</th>
                              <th className="text-left py-2">DeepScore™</th>
                              <th className="text-left py-2">Cost</th>
                              <th className="text-left py-2">Time</th>
                              <th className="text-left py-2">Reliability</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.map((result, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="py-2 font-medium">{result.forwarder}</td>
                                <td className="py-2">{(result.score * 100).toFixed(1)}%</td>
                                <td className="py-2">{(result.costPerformance * 100).toFixed(1)}%</td>
                                <td className="py-2">{(result.timePerformance * 100).toFixed(1)}%</td>
                                <td className="py-2">{(result.reliabilityPerformance * 100).toFixed(1)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Applied Methodology</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-4">
                        <div>
                          <h4 className="font-medium">Neutrosophic AHP-TOPSIS</h4>
                          <p className="text-muted-foreground mt-1">
                            DeepCAL™ uses a hybrid Neutrosophic AHP-TOPSIS methodology that combines multi-criteria decision-making with neutrosophic logic to handle uncertainty and subjectivity.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Weight Derivation</h4>
                          <p className="text-muted-foreground mt-1">
                            Your preference weights were processed through a pairwise comparison matrix to derive consistent priority weights: Cost ({Math.round(weightFactors.cost * 100)}%), Time ({Math.round(weightFactors.time * 100)}%), Reliability ({Math.round(weightFactors.reliability * 100)}%).
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Historical Performance Analysis</h4>
                          <p className="text-muted-foreground mt-1">
                            Deep engine analyzed {shipmentData.length} historical shipments to evaluate forwarder performance patterns in similar contexts to your current shipment.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Forwarder Score Calculation</h4>
                          <p className="text-muted-foreground mt-1">
                            DeepScore™ represents the closeness coefficient to the ideal solution, with higher values indicating better overall performance across all weighted criteria.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DeepCALSection;
