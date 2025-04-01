import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Sliders, Map, Database, Cpu, Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBaseDataStore } from '@/store/baseState';

const SettingsSection: React.FC = () => {
  const { criteriaWeights, setCriteriaWeights } = useBaseDataStore();

  const handleWeightChange = (type: 'cost' | 'time' | 'reliability', value: number[]) => {
    const newWeights = { ...criteriaWeights };
    newWeights[type] = value[0] / 100;
    
    // Normalize weights to ensure they sum to 1
    const sum = Object.values(newWeights).reduce((a, b) => Number(a) + Number(b), 0);
    Object.keys(newWeights).forEach(key => {
      newWeights[key as keyof typeof newWeights] = Number(newWeights[key as keyof typeof newWeights]) / Number(sum);
    });
    
    setCriteriaWeights(newWeights);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gradient-primary flex items-center">
        <Settings className="mr-2 h-8 w-8" />
        Settings
      </h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="engine">Engine</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage application appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch id="dark-mode" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for better visibility in low-light environments.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notifications</Label>
                    <Switch id="notifications" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for important events and updates.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-refresh">Auto-Refresh Data</Label>
                    <Switch id="auto-refresh" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh data at regular intervals.
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline">Reset to Defaults</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2 text-blue-500" />
                Map Settings
              </CardTitle>
              <CardDescription>Customize map appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Map Theme</Label>
                  <RadioGroup defaultValue="dark" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="satellite" id="satellite" />
                      <Label htmlFor="satellite">Satellite</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-rotate">Auto-Rotate Globe</Label>
                    <Switch id="auto-rotate" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically rotate the globe when not interacting.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Route Line Thickness</Label>
                  <Slider 
                    defaultValue={[2]} 
                    min={1} 
                    max={5} 
                    step={0.5}
                    className="py-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engine">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="h-5 w-5 mr-2 text-purple-500" />
                Engine Settings
              </CardTitle>
              <CardDescription>Configure the DeepCAL optimization engine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Cost Weight ({Math.round(criteriaWeights.cost * 100)}%)</Label>
                  <Slider 
                    value={[Math.round(criteriaWeights.cost * 100)]} 
                    min={10} 
                    max={80} 
                    step={1}
                    onValueChange={(value) => handleWeightChange('cost', value)}
                    className="py-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Importance of cost in optimization decisions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Time Weight ({Math.round(criteriaWeights.time * 100)}%)</Label>
                  <Slider 
                    value={[Math.round(criteriaWeights.time * 100)]} 
                    min={10} 
                    max={80} 
                    step={1}
                    onValueChange={(value) => handleWeightChange('time', value)}
                    className="py-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Importance of transit time in optimization decisions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Reliability Weight ({Math.round(criteriaWeights.reliability * 100)}%)</Label>
                  <Slider 
                    value={[Math.round(criteriaWeights.reliability * 100)]} 
                    min={10} 
                    max={80} 
                    step={1}
                    onValueChange={(value) => handleWeightChange('reliability', value)}
                    className="py-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Importance of carrier reliability in optimization decisions.
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button variant="outline">Reset Weights</Button>
                    <Button>Apply Changes</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-500" />
                Account Settings
              </CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center py-12">
                <Database className="h-16 w-16 mx-auto text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">
                  Account settings are currently disabled in this version.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsSection;
