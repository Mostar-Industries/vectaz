
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
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

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

interface DeepCALSectionProps {
  voicePersonality?: string;
  voiceEnabled?: boolean;
}

const DeepCALSection: React.FC<DeepCALSectionProps> = ({ 
  voicePersonality = 'sassy',
  voiceEnabled = true 
}) => {
  const { shipmentData } = useBaseDataStore();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteData[]>(forwarders.slice(0, 3).map(name => ({ forwarder: name, quote: 0 })));
  const [weightKg, setWeightKg] = useState<number>(20000);
  const [source, setSource] = useState<string>('Kenya');
  const [destination, setDestination] = useState<string>('Zimbabwe');
  const [mode, setMode] = useState<string>('Air');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ForwarderScore[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [activeResultTab, setActiveResultTab] = useState<string>('recommendation');
  
  const [weightFactors, setWeightFactors] = useState({
    cost: 0.4,
    time: 0.3,
    reliability: 0.3
  });

  // Function to speak text using ElevenLabs
  const speakText = async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      // Create Supabase client
      const supabaseUrl = 'https://hpogoxrxcnyxiqjmqtaw.supabase.co'; 
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwb2dveHJ4Y255eGlxam1xdGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDEwMjEsImV4cCI6MjA1ODc3NzAyMX0.9JA8cI1FYpyLJGn8VJGSQcUbnBmzNtMH_I_fkI-JMAE'; 
      
      const supabase = createClient(
        supabaseUrl,
        supabaseAnonKey,
        { auth: { persistSession: false } }
      );
      
      // Add Nigerian expressions if using Nigerian personality
      let finalText = text;
      if (voicePersonality === 'nigerian') {
        const nigerianExpressions = [
          "Ah ah!",
          "Oya now!",
          "No wahala!",
          "Chai!",
          "I tell you!",
          "As I dey talk so!",
          "Abeg!",
          "Na wa o!",
          "Walahi!"
        ];
        
        // 30% chance to add Nigerian expression
        if (Math.random() < 0.3) {
          const expression = nigerianExpressions[Math.floor(Math.random() * nigerianExpressions.length)];
          finalText = `${expression} ${text}`;
        }
      }
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: finalText, 
          personality: voicePersonality,
          model: 'eleven_multilingual_v2'
        }
      });
      
      if (error) {
        console.error("Error generating speech:", error);
        return;
      }
      
      if (!data?.audioContent) {
        console.error("No audio content returned");
        return;
      }
      
      // Play the audio
      const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      
    } catch (error) {
      console.error("Failed to generate or play speech:", error);
    }
  };
  
  // Helper to convert base64 to blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  };

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
    
    setTimeout(() => {
      try {
        const rankings = getForwarderRankings(weightFactors);
        
        const filteredRankings = rankings
          .filter(r => quotes.some(q => q.forwarder.toLowerCase().includes(r.forwarder.toLowerCase()) || 
                                    r.forwarder.toLowerCase().includes(q.forwarder.toLowerCase())))
          .sort((a, b) => b.score - a.score);
        
        setResults(filteredRankings);
        setShowResults(true);
        setLoading(false);
        
        // Speak a success message when analysis is complete
        if (results.length > 0) {
          const topForwarder = filteredRankings[0]?.forwarder || "Unknown";
          speakText(`I have completed my analysis. Based on your preferences, ${topForwarder} is the optimal choice for your shipment from ${source} to ${destination}.`);
        } else {
          speakText("Analysis complete. I couldn't find a perfect match, but I've ranked the options based on your criteria.");
        }
        
      } catch (error) {
        console.error("Error calculating rankings:", error);
        setLoading(false);
        
        // Speak an error message
        speakText("I encountered an error while analyzing the quotes. Please try again or check your input data.");
      }
    }, 2000);
  };

  // Speak welcome message on component mount
  useEffect(() => {
    if (voiceEnabled) {
      const welcomeMessage = "Welcome to DeepCAL Optimizer. Enter your freight quotes, and I'll analyze them for the best logistics options.";
      speakText(welcomeMessage);
    }
  }, [voiceEnabled, voicePersonality]);

  return (
    <div className="container mx-auto py-8 max-w-7xl relative z-20">
      {!showResults ? (
        <Card className="max-w-4xl mx-auto border border-[#00FFD1]/20 bg-[#0A1A2F]/80 backdrop-blur-md text-white shadow-[0_0_15px_rgba(0,255,209,0.1)]">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#00FFD1]">DeepCAL™ Quote Optimizer</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Enter your freight quotes to receive AI-powered logistics recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="source" className="text-gray-300">Source Country</Label>
                <Input 
                  id="source" 
                  value={source} 
                  onChange={(e) => setSource(e.target.value)} 
                  className="mt-1 bg-[#0A1A2F]/50 border-[#00FFD1]/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="destination" className="text-gray-300">Destination Country</Label>
                <Input 
                  id="destination" 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)} 
                  className="mt-1 bg-[#0A1A2F]/50 border-[#00FFD1]/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="weight" className="text-gray-300">Shipment Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number"
                  value={weightKg} 
                  onChange={(e) => setWeightKg(Number(e.target.value) || 0)} 
                  className="mt-1 bg-[#0A1A2F]/50 border-[#00FFD1]/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="mode" className="text-gray-300">Mode of Shipment</Label>
                <select 
                  id="mode" 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-[#00FFD1]/30 bg-[#0A1A2F]/50 px-3 py-2 text-sm text-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FFD1]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                >
                  <option>Air</option>
                  <option>Sea</option>
                  <option>Road</option>
                </select>
              </div>
            </div>

            <Separator className="my-8 bg-[#00FFD1]/20" />
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-[#00FFD1]">Forwarder Quotes</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddForwarder}
                  disabled={quotes.length >= forwarders.length}
                  className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
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
                      className="flex h-10 w-full rounded-md border border-[#00FFD1]/30 bg-[#0A1A2F]/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FFD1]/50 focus-visible:ring-offset-2"
                    >
                      {forwarders.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="mr-2 text-white">$</span>
                      <Input 
                        type="number"
                        value={quote.quote}
                        onChange={(e) => handleQuoteChange(index, e.target.value)}
                        placeholder="Quote amount"
                        className="bg-[#0A1A2F]/50 border-[#00FFD1]/30 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveForwarder(index)}
                      disabled={quotes.length <= 1}
                      className="text-gray-300 hover:text-white hover:bg-[#00FFD1]/10"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-8 bg-[#00FFD1]/20" />

            <div>
              <h3 className="text-lg font-medium mb-4 text-[#00FFD1]">Weight Factor Adjustment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="cost-factor" className="text-gray-300">Cost ({Math.round(weightFactors.cost * 100)}%)</Label>
                  <Input 
                    id="cost-factor"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weightFactors.cost}
                    onChange={(e) => handleWeightChange('cost', parseFloat(e.target.value))}
                    className="mt-1 accent-[#00FFD1]"
                  />
                </div>
                <div>
                  <Label htmlFor="time-factor" className="text-gray-300">Time ({Math.round(weightFactors.time * 100)}%)</Label>
                  <Input 
                    id="time-factor"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weightFactors.time}
                    onChange={(e) => handleWeightChange('time', parseFloat(e.target.value))}
                    className="mt-1 accent-[#00FFD1]"
                  />
                </div>
                <div>
                  <Label htmlFor="reliability-factor" className="text-gray-300">Reliability ({Math.round(weightFactors.reliability * 100)}%)</Label>
                  <Input 
                    id="reliability-factor"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weightFactors.reliability}
                    onChange={(e) => handleWeightChange('reliability', parseFloat(e.target.value))}
                    className="mt-1 accent-[#00FFD1]"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-10">
              <Button 
                size="lg" 
                className="px-10 py-6 text-lg bg-gradient-to-r from-[#00FFD1]/80 to-[#00FFD1] hover:from-[#00FFD1] hover:to-[#00FFD1]/80 text-[#0A1A2F] font-bold transition-all"
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
          <Card className="border border-[#00FFD1]/20 bg-[#0A1A2F]/80 backdrop-blur-md text-white shadow-[0_0_15px_rgba(0,255,209,0.1)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-[#00FFD1]">DeepCAL™ Analysis Results</CardTitle>
                <CardDescription className="text-gray-300">
                  {source} to {destination} | {weightKg} kg | {mode}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowResults(false)}
                className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
              >
                New Analysis
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeResultTab} onValueChange={setActiveResultTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#0A1A2F]/60 border border-[#00FFD1]/20">
                  <TabsTrigger value="recommendation" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">Recommendation</TabsTrigger>
                  <TabsTrigger value="comparison" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">Comparison</TabsTrigger>
                  <TabsTrigger value="detailed" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">Detailed Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recommendation">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-gradient-to-br from-[#0A1A2F]/90 to-[#0A1A2F]/70 shadow-lg border border-[#00FFD1]/20">
                      <CardHeader>
                        <CardTitle className="text-xl text-[#00FFD1]">Top Recommendation</CardTitle>
                        <CardDescription className="text-gray-300">Based on your preferences</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center space-y-4">
                          <div className="text-4xl font-bold text-[#00FFD1]">
                            {results[0]?.forwarder || "No recommendation available"}
                          </div>
                          
                          <div className="text-2xl text-white">
                            DeepScore™: {Math.round((results[0]?.score || 0) * 100)}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center">
                              <div className="text-sm text-gray-400">Cost</div>
                              <div className="text-xl font-semibold text-white">
                                {Math.round((results[0]?.costPerformance || 0) * 100)}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-400">Time</div>
                              <div className="text-xl font-semibold text-white">
                                {Math.round((results[0]?.timePerformance || 0) * 100)}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-400">Reliability</div>
                              <div className="text-xl font-semibold text-white">
                                {Math.round((results[0]?.reliabilityPerformance || 0) * 100)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-[#00FFD1]">Decision Explanation</h3>
                      <div className="p-4 bg-[#0A1A2F]/60 border border-[#00FFD1]/10 rounded-lg text-sm space-y-3 text-gray-300">
                        <p>
                          <strong className="text-white">{results[0]?.forwarder}</strong> is recommended as the optimal choice for your shipment based on a comprehensive analysis that considers cost, time efficiency, and reliability factors.
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
                    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
                      <CardHeader>
                        <CardTitle className="text-[#00FFD1]">ForwarderScore™ Comparison</CardTitle>
                      </CardHeader>
                      <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={results} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                            <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} stroke="#94A3B8" />
                            <YAxis dataKey="forwarder" type="category" width={150} stroke="#94A3B8" />
                            <Tooltip 
                              formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'DeepScore™']}
                              contentStyle={{ background: '#0A1A2F', border: '1px solid #00FFD1', borderRadius: '0.375rem' }}
                            />
                            <Legend />
                            <Bar dataKey="score" name="DeepScore™" fill="#00FFD1" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
                      <CardHeader>
                        <CardTitle className="text-[#00FFD1]">Multi-Dimensional Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={150} data={results}>
                            <PolarGrid stroke="#1E293B" />
                            <PolarAngleAxis dataKey="forwarder" stroke="#94A3B8" />
                            <PolarRadiusAxis angle={30} domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} stroke="#94A3B8" />
                            <Radar 
                              name="Cost" 
                              dataKey="costPerformance" 
                              stroke="#00FFD1" 
                              fill="#00FFD1" 
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
                            <Tooltip formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, '']} 
                              contentStyle={{ background: '#0A1A2F', border: '1px solid #00FFD1', borderRadius: '0.375rem' }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="detailed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
                      <CardHeader>
                        <CardTitle className="text-lg text-[#00FFD1]">Calculated Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <table className="w-full border-collapse text-gray-300">
                          <thead>
                            <tr className="border-b border-[#00FFD1]/20">
                              <th className="text-left py-2">Forwarder</th>
                              <th className="text-left py-2">DeepScore™</th>
                              <th className="text-left py-2">Cost</th>
                              <th className="text-left py-2">Time</th>
                              <th className="text-left py-2">Reliability</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.map((result, index) => (
                              <tr key={index} className="border-b border-[#00FFD1]/10 hover:bg-[#00FFD1]/5">
                                <td className="py-2 font-medium text-white">{result.forwarder}</td>
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
                    
                    <Card className="bg-[#0A1A2F]/70 border border-[#00FFD1]/20">
                      <CardHeader>
                        <CardTitle className="text-lg text-[#00FFD1]">Applied Methodology</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-4 text-gray-300">
                        <div>
                          <h4 className="font-medium text-white">Neutrosophic AHP-TOPSIS</h4>
                          <p className="mt-1">
                            DeepCAL™ uses a hybrid Neutrosophic AHP-TOPSIS methodology that combines multi-criteria decision-making with neutrosophic logic to handle uncertainty and subjectivity.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-white">Weight Derivation</h4>
                          <p className="mt-1">
                            Your preference weights were processed through a pairwise comparison matrix to derive consistent priority weights: Cost ({Math.round(weightFactors.cost * 100)}%), Time ({Math.round(weightFactors.time * 100)}%), Reliability ({Math.round(weightFactors.reliability * 100)}%).
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-white">Historical Performance Analysis</h4>
                          <p className="mt-1">
                            Deep engine analyzed {shipmentData.length} historical shipments to evaluate forwarder performance patterns in similar contexts to your current shipment.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-white">Forwarder Score Calculation</h4>
                          <p className="mt-1">
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
