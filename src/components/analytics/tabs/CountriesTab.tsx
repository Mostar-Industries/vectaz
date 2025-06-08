import React from 'react';
import { GlassContainer } from '@/components/ui/glass-effects';

export default function CountriesTab({ data }) {
  // Sample country analytics data
  const countryData = [
    { country: 'United States', shipments: 142, avgTransit: 6.2, avgCost: 3.85, topForwarder: 'Skyline Logistics' },
    { country: 'China', shipments: 117, avgTransit: 12.4, avgCost: 2.95, topForwarder: 'Global Express' },
    { country: 'Germany', shipments: 86, avgTransit: 7.8, avgCost: 4.12, topForwarder: 'Quantum Shipping' },
    { country: 'Japan', shipments: 74, avgTransit: 9.3, avgCost: 5.20, topForwarder: 'Nexus Freight' },
    { country: 'United Kingdom', shipments: 68, avgTransit: 6.5, avgCost: 4.75, topForwarder: 'Alpha Transport' },
    { country: 'South Korea', shipments: 54, avgTransit: 10.1, avgCost: 4.32, topForwarder: 'Skyline Logistics' },
    { country: 'Singapore', shipments: 41, avgTransit: 8.7, avgCost: 4.88, topForwarder: 'Global Express' },
  ];

  // Calculate summary metrics
  const totalCountries = countryData.length;
  const totalShipments = countryData.reduce((sum, country) => sum + country.shipments, 0);
  const avgGlobalCost = countryData.reduce((sum, country) => sum + country.avgCost, 0) / countryData.length;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Active Countries</div>
          <div className="text-3xl font-bold text-[#00FFD1]">{totalCountries}</div>
        </div>
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Total Shipments</div>
          <div className="text-3xl font-bold text-[#00FFD1]">{totalShipments}</div>
        </div>
        <div className="bg-[#0A1A2F]/80 text-white rounded-lg p-4 shadow-md border border-[#00FFD1]/30">
          <div className="text-sm text-gray-400">Avg Global Cost/kg</div>
          <div className="text-3xl font-bold text-[#00FFD1]">${avgGlobalCost.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GlassContainer className="p-4">
          <h3 className="text-[#00FFD1] text-lg font-semibold mb-4">Country Performance</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#131C2B]/50 rounded-lg">
              <thead>
                <tr className="border-b border-[#00FFD1]/20">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Country</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Shipments</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Avg Transit Days</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Avg Cost/kg</th>
                </tr>
              </thead>
              <tbody>
                {countryData.map((country, idx) => (
                  <tr key={idx} className="border-b border-[#00FFD1]/10 hover:bg-[#00FFD1]/5">
                    <td className="py-2 px-4 text-sm">{country.country}</td>
                    <td className="py-2 px-4 text-sm">{country.shipments}</td>
                    <td className="py-2 px-4 text-sm">{country.avgTransit}</td>
                    <td className="py-2 px-4 text-sm">${country.avgCost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassContainer>

        <GlassContainer className="p-4">
          <h3 className="text-[#00FFD1] text-lg font-semibold mb-4">Country Performance Map</h3>
          <div className="w-full h-64 flex items-center justify-center">
            <div className="text-[#00FFD1]/50 text-sm">
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Interactive map visualization coming soon</span>
              </div>
            </div>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
}
