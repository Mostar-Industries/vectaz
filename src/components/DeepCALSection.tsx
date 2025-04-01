
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Database, Network, ArrowRightLeft, Zap, LineChart, ArrowRight, TrendingUp, Clock, BarChart4, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeepCALSpinner from './DeepCALSpinner';

const DeepCALSection: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [forwarders, setForwarders] = useState({
    forwarder1: { name: 'Kuehne Nagel', price: '1250' },
    forwarder2: { name: 'DHL Express', price: '1450' },
    forwarder3: { name: 'Maersk', price: '980' }
  });

  const handleForwarderChange = (id: string, field: 'name' | 'price', value: string) => {
    setForwarders(prev => ({
      ...prev,
      [id]: {
        ...prev[id as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
    }, 2000);
  };

  const resetForm = () => {
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="container mx-auto p-4 md:p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gradient-primary flex items-center">
            <Cpu className="mr-2 h-8 w-8" />
            DeepCAL Analysis
          </h1>
          <Button onClick={resetForm} variant="outline" className="bg-slate-800 border-cyan-500/30 text-white hover:bg-slate-700">
            New Analysis
          </Button>
        </div>
        
        <div className="mb-6 bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
          <h2 className="text-lg font-medium mb-2 text-cyan-400">Analysis Parameters</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-400">Cargo Weight:</span>
              <p className="font-medium">20,000 kg</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Route:</span>
              <p className="font-medium">Nairobi to Harare</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Target Delivery:</span>
              <p className="font-medium">2 weeks</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="recommendation" className="w-full">
          <TabsList className="mb-6 bg-slate-800 border-b border-slate-700">
            <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendation" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="md:col-span-2 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-emerald-400 flex items-center">
                      <Award className="mr-2 h-5 w-5" />
                      Recommended Forwarder
                    </CardTitle>
                    <span className="text-sm bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">93% Match</span>
                  </div>
                  <CardDescription>Based on your requirements and historical data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-2xl font-bold text-white">{forwarders.forwarder2.name}</h3>
                      <p className="text-gray-400 mb-2">Premium express service</p>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-cyan-400 mr-1" />
                          <span className="text-sm">3 days transit</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                          <span className="text-sm">95% on-time</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800 p-4 rounded-lg border border-emerald-500/20">
                      <p className="text-gray-400 text-sm mb-1">Quote</p>
                      <p className="text-2xl font-bold text-white">${forwarders.forwarder2.price}</p>
                      <p className="text-sm text-emerald-400">$0.0725/kg</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Speed Score</p>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">95</span>
                        <Progress value={95} className="h-2" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Cost Score</p>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">78</span>
                        <Progress value={78} className="h-2" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Reliability</p>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">95</span>
                        <Progress value={95} className="h-2" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Deep Score</p>
                      <div className="flex items-center">
                        <span className="font-bold mr-2">91</span>
                        <Progress value={91} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">Decision Rationale</CardTitle>
                  <CardDescription>Why we recommended this forwarder</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-cyan-400">Speed Priority</h4>
                    <p className="text-sm text-gray-300">Your request indicated expedited delivery is important. {forwarders.forwarder2.name} offers the fastest transit time at 3 days.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-cyan-400">Statistical Confidence</h4>
                    <p className="text-sm text-gray-300">Based on 24 similar shipments, {forwarders.forwarder2.name} has maintained a 95% on-time delivery rate.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-cyan-400">Risk Assessment</h4>
                    <p className="text-sm text-gray-300">Current route conditions show minimal disruption risk. Weather and border crossings optimal.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Alternatives Considered</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      {forwarders.forwarder1.name}
                    </CardTitle>
                    <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">87% Match</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-cyan-400 mr-1" />
                        <span className="text-sm">5 days transit</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                        <span className="text-sm">92% on-time</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${forwarders.forwarder1.price}</p>
                      <p className="text-xs text-gray-400">$0.0625/kg</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Speed</p>
                      <Progress value={88} className="h-1.5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Cost</p>
                      <Progress value={82} className="h-1.5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Reliability</p>
                      <Progress value={92} className="h-1.5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Deep Score</p>
                      <Progress value={87} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      {forwarders.forwarder3.name}
                    </CardTitle>
                    <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">83% Match</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-cyan-400 mr-1" />
                        <span className="text-sm">7 days transit</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                        <span className="text-sm">88% on-time</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${forwarders.forwarder3.price}</p>
                      <p className="text-xs text-gray-400">$0.049/kg</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Speed</p>
                      <Progress value={76} className="h-1.5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Cost</p>
                      <Progress value={90} className="h-1.5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Reliability</p>
                      <Progress value={88} className="h-1.5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Deep Score</p>
                      <Progress value={83} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Forwarder Comparison</CardTitle>
                <CardDescription>Detailed side-by-side analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 pl-2">Forwarder</th>
                        <th className="text-center py-3">Price</th>
                        <th className="text-center py-3">Transit Time</th>
                        <th className="text-center py-3">Reliability</th>
                        <th className="text-center py-3">Cost Efficiency</th>
                        <th className="text-center py-3">Deep Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-800 bg-emerald-500/5">
                        <td className="py-4 pl-2 font-medium">{forwarders.forwarder2.name} <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded ml-2">Recommended</span></td>
                        <td className="text-center py-4">${forwarders.forwarder2.price}</td>
                        <td className="text-center py-4">3 days</td>
                        <td className="text-center py-4">95%</td>
                        <td className="text-center py-4">78%</td>
                        <td className="text-center py-4 font-bold">91%</td>
                      </tr>
                      <tr className="border-b border-slate-800">
                        <td className="py-4 pl-2 font-medium">{forwarders.forwarder1.name}</td>
                        <td className="text-center py-4">${forwarders.forwarder1.price}</td>
                        <td className="text-center py-4">5 days</td>
                        <td className="text-center py-4">92%</td>
                        <td className="text-center py-4">82%</td>
                        <td className="text-center py-4 font-bold">87%</td>
                      </tr>
                      <tr>
                        <td className="py-4 pl-2 font-medium">{forwarders.forwarder3.name}</td>
                        <td className="text-center py-4">${forwarders.forwarder3.price}</td>
                        <td className="text-center py-4">7 days</td>
                        <td className="text-center py-4">88%</td>
                        <td className="text-center py-4">90%</td>
                        <td className="text-center py-4 font-bold">83%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Performance Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Transit Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{forwarders.forwarder2.name}</span>
                                <span className="text-sm font-medium">3 days</span>
                              </div>
                              <Progress value={95} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{forwarders.forwarder1.name}</span>
                                <span className="text-sm font-medium">5 days</span>
                              </div>
                              <Progress value={88} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{forwarders.forwarder3.name}</span>
                                <span className="text-sm font-medium">7 days</span>
                              </div>
                              <Progress value={76} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Price Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{forwarders.forwarder3.name}</span>
                                <span className="text-sm font-medium">${forwarders.forwarder3.price}</span>
                              </div>
                              <Progress value={90} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{forwarders.forwarder1.name}</span>
                                <span className="text-sm font-medium">${forwarders.forwarder1.price}</span>
                              </div>
                              <Progress value={82} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{forwarders.forwarder2.name}</span>
                                <span className="text-sm font-medium">${forwarders.forwarder2.price}</span>
                              </div>
                              <Progress value={78} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Reliability</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{forwarders.forwarder2.name}</span>
                                <span className="text-sm font-medium">95%</span>
                              </div>
                              <Progress value={95} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{forwarders.forwarder1.name}</span>
                                <span className="text-sm font-medium">92%</span>
                              </div>
                              <Progress value={92} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{forwarders.forwarder3.name}</span>
                                <span className="text-sm font-medium">88%</span>
                              </div>
                              <Progress value={88} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Decision Engine Analysis</CardTitle>
                  <CardDescription>Neutrosophic AHP-TOPSIS methodology</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-3">AHP Criteria Weights</h4>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Cost</span>
                            <span className="text-sm font-medium">0.35</span>
                          </div>
                          <Progress value={35} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Speed</span>
                            <span className="text-sm font-medium">0.40</span>
                          </div>
                          <Progress value={40} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Reliability</span>
                            <span className="text-sm font-medium">0.25</span>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium mb-3">TOPSIS Closeness Coefficients</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{forwarders.forwarder2.name}</span>
                              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Recommended</span>
                            </div>
                            <span className="text-sm font-medium">0.91</span>
                          </div>
                          <Progress value={91} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{forwarders.forwarder1.name}</span>
                            <span className="text-sm font-medium">0.87</span>
                          </div>
                          <Progress value={87} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{forwarders.forwarder3.name}</span>
                            <span className="text-sm font-medium">0.83</span>
                          </div>
                          <Progress value={83} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium mb-3">Decision Matrix</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left py-2 pl-2">Forwarder</th>
                              <th className="text-center py-2">Cost ($/kg)</th>
                              <th className="text-center py-2">Transit (days)</th>
                              <th className="text-center py-2">Reliability</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-800">
                              <td className="py-2 pl-2">{forwarders.forwarder1.name}</td>
                              <td className="text-center py-2">0.0625</td>
                              <td className="text-center py-2">5</td>
                              <td className="text-center py-2">0.92</td>
                            </tr>
                            <tr className="border-b border-slate-800 bg-emerald-500/5">
                              <td className="py-2 pl-2">{forwarders.forwarder2.name}</td>
                              <td className="text-center py-2">0.0725</td>
                              <td className="text-center py-2">3</td>
                              <td className="text-center py-2">0.95</td>
                            </tr>
                            <tr className="border-b border-slate-800">
                              <td className="py-2 pl-2">{forwarders.forwarder3.name}</td>
                              <td className="text-center py-2">0.049</td>
                              <td className="text-center py-2">7</td>
                              <td className="text-center py-2">0.88</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-base">Methodology</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium text-cyan-400 mb-1">Neutrosophic AHP</h5>
                      <p className="text-gray-400">Weights derived using neutrosophic analytic hierarchy process to handle uncertainty in expert judgments.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-cyan-400 mb-1">TOPSIS</h5>
                      <p className="text-gray-400">Technique for Order of Preference by Similarity to Ideal Solution ranks alternatives based on distance from ideal and negative-ideal solutions.</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-base">Data Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Historical Shipments:</span>
                      <span>105</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Forwarder Records:</span>
                      <span>24 ({forwarders.forwarder2.name})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Route Analysis:</span>
                      <span>Nairobi-Harare</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weather Data:</span>
                      <span>Current</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-base">Confidence Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end space-x-2 mb-1">
                      <span className="text-2xl font-bold">93%</span>
                      <span className="text-xs text-gray-400">confidence</span>
                    </div>
                    <Progress value={93} className="h-2 mb-3" />
                    <p className="text-xs text-gray-400">Based on data quality, quantity, and decision model consistency ratio</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gradient-primary flex items-center">
        <Cpu className="mr-2 h-8 w-8" />
        DeepCAL Core
      </h1>
      
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center space-y-6 p-8">
          <DeepCALSpinner />
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">Processing Your Request</h2>
            <p className="text-gray-400">Neural decision engine analyzing optimal freight forwarding solutions...</p>
          </div>
          <div className="w-full max-w-md space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Loading freight data</span>
                <span>Complete</span>
              </div>
              <Progress value={100} className="h-1" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Running AHP-TOPSIS algorithm</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-1" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Generating recommendations</span>
                <span>30%</span>
              </div>
              <Progress value={30} className="h-1" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2 text-cyan-400" />
                  Freight Forwarding Recommendation
                </CardTitle>
                <CardDescription>Enter your freight details to get optimal logistics solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="origin">Origin</Label>
                        <Input id="origin" value="Nairobi" readOnly className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Input id="destination" value="Harare" readOnly className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Cargo Weight (kg)</Label>
                        <Input id="weight" value="20,000" readOnly className="bg-slate-800 border-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delivery-time">Target Delivery Time</Label>
                        <Input id="delivery-time" value="2 weeks" readOnly className="bg-slate-800 border-slate-700" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Forwarder Quotes</h3>
                      <div className="space-y-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-3">
                            <Label htmlFor="forwarder1-name">Forwarder 1</Label>
                            <Input 
                              id="forwarder1-name" 
                              value={forwarders.forwarder1.name}
                              onChange={(e) => handleForwarderChange('forwarder1', 'name', e.target.value)}
                              className="bg-slate-800 border-slate-700"
                            />
                          </div>
                          <div>
                            <Label htmlFor="forwarder1-price">Price ($)</Label>
                            <Input 
                              id="forwarder1-price" 
                              value={forwarders.forwarder1.price}
                              onChange={(e) => handleForwarderChange('forwarder1', 'price', e.target.value)}
                              className="bg-slate-800 border-slate-700"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-3">
                            <Label htmlFor="forwarder2-name">Forwarder 2</Label>
                            <Input 
                              id="forwarder2-name" 
                              value={forwarders.forwarder2.name}
                              onChange={(e) => handleForwarderChange('forwarder2', 'name', e.target.value)}
                              className="bg-slate-800 border-slate-700"
                            />
                          </div>
                          <div>
                            <Label htmlFor="forwarder2-price">Price ($)</Label>
                            <Input 
                              id="forwarder2-price" 
                              value={forwarders.forwarder2.price}
                              onChange={(e) => handleForwarderChange('forwarder2', 'price', e.target.value)}
                              className="bg-slate-800 border-slate-700"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-3">
                            <Label htmlFor="forwarder3-name">Forwarder 3</Label>
                            <Input 
                              id="forwarder3-name" 
                              value={forwarders.forwarder3.name}
                              onChange={(e) => handleForwarderChange('forwarder3', 'name', e.target.value)}
                              className="bg-slate-800 border-slate-700"
                            />
                          </div>
                          <div>
                            <Label htmlFor="forwarder3-price">Price ($)</Label>
                            <Input 
                              id="forwarder3-price" 
                              value={forwarders.forwarder3.price}
                              onChange={(e) => handleForwarderChange('forwarder3', 'price', e.target.value)}
                              className="bg-slate-800 border-slate-700" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Enter the Deep
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">Data Sources</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>105 Historical Shipments</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Real-time Weather Data</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Route Performance Metrics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Forwarder Performance History</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cpu className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-lg">Decision Engine</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span>Neutrosophic AHP-TOPSIS</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span>Multi-criteria Optimization</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span>Risk Assessment Models</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                      <span>Decision Explanation System</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2 text-orange-500" />
                  How DeepCAL Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative pl-6 pb-4 border-l border-slate-700">
                  <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-orange-400"></div>
                  <h3 className="text-base font-medium mb-1">1. Data Collection</h3>
                  <p className="text-sm text-gray-400">Enter your freight details and requirements, combined with our historical database.</p>
                </div>
                <div className="relative pl-6 pb-4 border-l border-slate-700">
                  <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-purple-400"></div>
                  <h3 className="text-base font-medium mb-1">2. Criteria Analysis</h3>
                  <p className="text-sm text-gray-400">The system analyzes cost, time, reliability, and other factors using advanced weighting methods.</p>
                </div>
                <div className="relative pl-6 pb-4 border-l border-slate-700">
                  <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-blue-400"></div>
                  <h3 className="text-base font-medium mb-1">3. Multi-Criteria Decision</h3>
                  <p className="text-sm text-gray-400">Neutrosophic AHP-TOPSIS algorithm finds the optimal solution considering all variables.</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-cyan-400"></div>
                  <h3 className="text-base font-medium mb-1">4. Recommendation</h3>
                  <p className="text-sm text-gray-400">Receive a detailed comparison and clear recommendation with supporting evidence.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepCALSection;
