import React, { useState } from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const FreightCalculatorPage = () => {
  const [freights, setFreights] = useState([
    { weight: '', volume: '', origin: '', destination: '', mode: 'Air' },
    { weight: '', volume: '', origin: '', destination: '', mode: 'Air' },
    { weight: '', volume: '', origin: '', destination: '', mode: 'Air' }
  ]);

  const handleInputChange = (index, field, value) => {
    const updated = [...freights];
    updated[index][field] = value;
    setFreights(updated);
  };

  return (
    <div className="h-screen w-full overflow-x-hidden relative tech-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-blue-950 z-0" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] z-0" />
      
      <div className="relative z-10 h-full flex flex-col p-6">
        <Card className="flex-1 overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-[#00FFD1]">Freight Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {freights.map((freight, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg border-[#00FFD1]/20">
                <h3 className="text-[#00FFD1] font-medium">Freight #{index + 1}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Weight (kg)</Label>
                    <Input 
                      value={freight.weight}
                      onChange={(e) => handleInputChange(index, 'weight', e.target.value)}
                      className="bg-slate-900 border-[#00FFD1]/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Volume (cbm)</Label>
                    <Input 
                      value={freight.volume}
                      onChange={(e) => handleInputChange(index, 'volume', e.target.value)}
                      className="bg-slate-900 border-[#00FFD1]/30"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Origin</Label>
                    <Input 
                      value={freight.origin}
                      onChange={(e) => handleInputChange(index, 'origin', e.target.value)}
                      className="bg-slate-900 border-[#00FFD1]/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Destination</Label>
                    <Input 
                      value={freight.destination}
                      onChange={(e) => handleInputChange(index, 'destination', e.target.value)}
                      className="bg-slate-900 border-[#00FFD1]/30"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Transport Mode</Label>
                  <Select 
                    value={freight.mode}
                    onValueChange={(value) => handleInputChange(index, 'mode', value)}
                  >
                    <SelectTrigger className="bg-slate-900 border-[#00FFD1]/30">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-[#00FFD1]/30">
                      <SelectItem value="Air">Air</SelectItem>
                      <SelectItem value="Sea">Sea</SelectItem>
                      <SelectItem value="Road">Road</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end pt-4">
              <Button className="bg-[#00FFD1] hover:bg-[#00FFD1]/80 text-slate-900">
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightCalculatorPage;
