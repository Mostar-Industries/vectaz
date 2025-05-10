import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { ForwarderPerformance } from '@/types/deeptrack';

type Props = {
  forwarders: ForwarderPerformance[];
};

export const QuantumOptimizationMatrix = ({ forwarders }: Props) => {
  const data = forwarders.map(f => ({
    x: f.avgCostPerKg,
    y: f.avgTransitDays,
    z: f.reliabilityScore,
    name: f.name,
    color: f.quoteWinRate * 100
  }));

  const Plot = createPlotlyComponent(Plotly);
  return <Plot
      data={[{
        type: 'scatter3d',
        mode: 'markers',
        x: data.map(d => d.x),
        y: data.map(d => d.y),
        z: data.map(d => d.z),
        text: data.map(d => d.name),
        marker: {
          size: 8,
          color: data.map(d => d.color),
          colorscale: 'Viridis',
          opacity: 0.8
        }
      }]}
      layout={{
        title: 'Cost-Time-Reliability Tradeoff Space',
        scene: {
          xaxis: { title: 'Cost/kg ($)' },
          yaxis: { title: 'Transit Days' },
          zaxis: { title: 'Reliability Score' }
        },
        margin: { t: 30, b: 20, l: 0, r: 0 }
      }}
    />
  ;
};
