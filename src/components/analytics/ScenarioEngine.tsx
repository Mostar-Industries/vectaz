import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type Scenario = {
  name: string;
  impact: string;
  mitigation: string;
};

export const ScenarioEngine = () => {
  const [activeScenario, setActiveScenario] = useState<number | null>(null);
  
  const scenarios: Scenario[] = [
    {
      name: 'Port Strike',
      impact: 'Delays +7 days, Cost +30%',
      mitigation: 'Reroute via Singapore, Air freight critical items'
    },
    {
      name: 'Fuel Surge',
      impact: 'Cost +45%, Capacity -20%',
      mitigation: 'Lock in contracts, Switch to rail where possible'
    },
    {
      name: 'Border Closure',
      impact: 'Complete shipment halt',
      mitigation: 'Pre-clear customs, Use bonded warehouses'
    }
  ];

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Scenario Simulation Engine</h2>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {scenarios.map((scenario, index) => (
          <Button 
            key={scenario.name}
            variant={activeScenario === index ? 'default' : 'outline'}
            onClick={() => setActiveScenario(index === activeScenario ? null : index)}
          >
            {scenario.name}
          </Button>
        ))}
      </div>
      
      {activeScenario !== null && (
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-bold mb-2">{scenarios[activeScenario].name} Scenario</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-red-400">Projected Impact</div>
              <p>{scenarios[activeScenario].impact}</p>
            </div>
            <div>
              <div className="text-sm text-green-400">Recommended Mitigation</div>
              <p>{scenarios[activeScenario].mitigation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
