import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedRFQForm from '@/components/forms/EnhancedRFQForm';
import NewShipmentForm from '@/components/forms/NewShipmentForm';
import { GlassContainer } from '@/components/ui/glass-effects';
import Particles from '@/components/Particles';
import AnimatedBackground from '@/components/home/AnimatedBackground';
import DeepCALSection from '@/components/DeepCALSection';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import IconNavigation from '@/components/IconNavigation';

interface DeepCALSectionProps {
  voicePersonality: string;
  voiceEnabled: boolean;
}

const FormsPage = () => {
  const { toast } = useToast();
  const [activeFormTab, setActiveFormTab] = useState("rfq");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voicePersonality, setVoicePersonality] = useState('sassy');
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  
  const demoForwarders = [
    { id: '1', name: 'Kenya Airways', reliability: 0.92 },
    { id: '2', name: 'DHL', reliability: 0.89 },
    { id: '3', name: 'Kuehne Nagel', reliability: 0.85 },
    { id: '4', name: 'FedEx', reliability: 0.91 },
    { id: '5', name: 'UPS', reliability: 0.88 }
  ];

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    toast({
      title: voiceEnabled ? "Voice Disabled" : "Voice Enabled",
      description: voiceEnabled ? "DeepCAL voice has been turned off." : "DeepCAL voice has been turned on.",
      duration: 3000
    });
  };

  const toggleVoiceService = () => {
    setUseElevenLabs(!useElevenLabs);
    toast({
      title: useElevenLabs ? "Token-Saving Mode Enabled" : "Premium Voice Enabled",
      description: useElevenLabs ? 
        "Using browser's speech synthesis to save ElevenLabs tokens." : 
        "Using ElevenLabs premium voice service.",
      duration: 3000
    });
    
    // Save the setting to localStorage
    localStorage.setItem('deepcal-use-elevenlabs', String(!useElevenLabs));
  };

  const handleVoicePersonalityChange = (personality: string) => {
    setVoicePersonality(personality);
    
    let message = "";
    switch(personality) {
      case 'nigerian':
        message = "DeepCAL now speaks with a Nigerian accent. No wahala!";
        break;
      case 'sassy':
        message = "DeepCAL is now speaking with a sassy personality.";
        break;
      case 'formal':
        message = "DeepCAL is now speaking with a formal tone.";
        break;
      case 'technical':
        message = "DeepCAL is now speaking with technical precision.";
        break;
      default:
        message = `DeepCAL's voice personality has been updated to ${personality}.`;
    }
    
    toast({
      title: "Voice Updated",
      description: message,
      duration: 3000
    });
    
    // Update voice settings in localStorage for persistence
    localStorage.setItem('deepcal-voice-personality', personality);
    localStorage.setItem('deepcal-voice-enabled', String(voiceEnabled));
  };

  // Define the same particle colors as in the loading page
  const particleColors = [
    "#FF5E8F", // Pink
    "#5EFF8F", // Green
    "#5E8FFF", // Blue
    "#FF5E5E", // Red
    "#5EFFFF", // Cyan
    "#FF5EDF", // Magenta
    "#FFFF5E"  // Yellow
  ];

  // Load voice settings from localStorage on component mount
  React.useEffect(() => {
    const savedPersonality = localStorage.getItem('deepcal-voice-personality');
    const savedEnabled = localStorage.getItem('deepcal-voice-enabled');
    const savedUseElevenLabs = localStorage.getItem('deepcal-use-elevenlabs');
    
    if (savedPersonality) {
      setVoicePersonality(savedPersonality);
    }
    
    if (savedEnabled !== null) {
      setVoiceEnabled(savedEnabled === 'true');
    }
    
    if (savedUseElevenLabs !== null) {
      setUseElevenLabs(savedUseElevenLabs !== 'false');
    }
  }, []);

  return (
    <div className="h-screen w-full overflow-x-hidden relative bg-[#0A1A2F]">
      {/* Full page background color */}
      <div className="absolute inset-0 bg-[#0A1A2F] z-0"></div>
      
      {/* Animated background elements */}
      <div className="tech-grid absolute inset-0 z-0"></div>
      <div className="network-lines absolute inset-0 z-0"></div>
      
      {/* Particles background with reduced opacity */}
      <Particles
        particleColors={particleColors}
        particleCount={200}
        particleSpread={12}
        speed={0.05}
        particleBaseSize={80}
        moveParticlesOnHover={false}
        particleHoverFactor={0.5}
        alphaParticles={true}
        sizeRandomness={0.8}
        cameraDistance={25}
        disableRotation={false}
        className="opacity-40" // Reduced opacity for particles
      />
      
      {/* App name in top right */}
      <div className="app-logo absolute top-4 right-4 bg-[#0A1A2F]/80 backdrop-blur-md py-2 px-4 rounded-lg shadow-md z-10 border border-[#00FFD1]/30 shadow-[0_0_15px_rgba(0,255,209,0.2)]">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FFD1] to-blue-300">DeepCAL</h1>
      </div>
      
      {/* Voice Controls */}
      <div className="absolute top-4 right-32 z-10 flex items-center space-x-4">
          <Button 
            variant="ghost"
            size="icon"
            onClick={toggleVoice}
            className="h-10 w-10 rounded-full bg-[#0A1A2F]/80 backdrop-blur-md border border-[#00FFD1]/30 hover:bg-[#00FFD1]/10"
            title={voiceEnabled ? "Mute DeepCAL" : "Enable DeepCAL voice"}
          >
            {voiceEnabled ? <Volume2 className="h-5 w-5 text-[#00FFD1]" /> : <VolumeX className="h-5 w-5 text-gray-400" />}
          </Button>
          
          {voiceEnabled && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoiceService}
              className="h-10 w-10 rounded-full bg-[#0A1A2F]/80 backdrop-blur-md border border-[#00FFD1]/30 hover:bg-[#00FFD1]/10"
              title={useElevenLabs ? "Enable token-saving voice mode" : "Use premium ElevenLabs voice"}
            >
              <DollarSign className={`h-5 w-5 ${useElevenLabs ? "text-yellow-400" : "text-gray-400"}`} />
            </Button>
          )}
          
        </div>
          {/* Add title attribute for accessibility */}
      
      <div className="relative z-10 w-full pt-16 px-4">
        <div className="max-w-6xl mx-auto">
          <GlassContainer className="mb-6 p-4">
            <h1 className="text-2xl font-bold text-center text-[#00FFD1]">DeepCAL Operations Center</h1>
            <p className="text-sm text-center text-gray-400 mt-2">
              Manage shipments and request quotes from the advanced operations hub
            </p>
          </GlassContainer>
          
          <Tabs defaultValue={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="rfq" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">
                Request For Quotation
              </TabsTrigger>
              <TabsTrigger value="shipment" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">
                New Shipment
              </TabsTrigger>
              <TabsTrigger value="calculator" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">
                DeepCAL
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rfq">
              <EnhancedRFQForm availableForwarders={demoForwarders} />
            </TabsContent>
            
            <TabsContent value="shipment">
              <NewShipmentForm />
            </TabsContent>
            
            <TabsContent value="calculator">
            </TabsContent>
          </Tabs>
        </div>
      </div>
    
      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <IconNavigation />
      </div>
    </div>
  );
}; 

export default FormsPage; 
