import React from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

type Props = {
  threats: string[];
  carriers: string[];
};

export const RiskVisualizer = ({ threats, carriers }: Props) => {
  // Mock risk scores (replace with real data integration)
  const riskData = threats.map(threat => ({
    threat,
    scores: carriers.map(carrier => ({
      carrier,
      score: Math.random() * 100 // Replace with real risk scoring
    }))
  }));

  return (
    <Plot 
      data={riskData.map(data => ({
        type: 'scatterpolar',
        r: data.scores.map(s => s.score),
        theta: data.scores.map(s => s.carrier),
        fill: 'toself',
        name: data.threat
      }))}
      layout={{
        polar: {
          radialaxis: {
            visible: true,
            range: [0, 100]
          }
        },
        showlegend: true
      }}
    />
  );
};
