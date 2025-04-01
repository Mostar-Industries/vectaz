
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedRFQForm from '@/components/forms/EnhancedRFQForm';
import NewShipmentForm from '@/components/forms/NewShipmentForm';
import { GlassContainer } from '@/components/ui/glass-effects';

const FormsPage = () => {
  const demoForwarders = [
    { id: '1', name: 'Kenya Airways', reliability: 0.92 },
    { id: '2', name: 'DHL', reliability: 0.89 },
    { id: '3', name: 'Kuehne Nagel', reliability: 0.85 },
    { id: '4', name: 'FedEx', reliability: 0.91 },
    { id: '5', name: 'UPS', reliability: 0.88 }
  ];

  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <GlassContainer className="mb-6 p-4">
          <h1 className="text-2xl font-bold text-center text-[#00FFD1]">DeepCAL Operations Center</h1>
          <p className="text-sm text-center text-gray-400 mt-2">
            Manage shipments and request quotes from the advanced operations hub
          </p>
        </GlassContainer>
        
        <Tabs defaultValue="rfq" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="rfq" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">
              Request For Quotation
            </TabsTrigger>
            <TabsTrigger value="shipment" className="data-[state=active]:bg-[#00FFD1]/20 data-[state=active]:text-[#00FFD1]">
              New Shipment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rfq">
            <EnhancedRFQForm availableForwarders={demoForwarders} />
          </TabsContent>
          
          <TabsContent value="shipment">
            <NewShipmentForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FormsPage;
