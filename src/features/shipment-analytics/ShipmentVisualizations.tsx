import { Tabs, Tab } from '../../components/ui/tabs';
import { Chart } from '../../components/charts';

export const ShipmentVisualizations = ({ view, data }) => (
  <Tabs value={view}>
    <Tab value="resilience" label="Resilience">
      <Chart data={data.resilienceChart} type="radar" />
    </Tab>
    <Tab value="performance" label="Performance">
      <Chart data={data.performanceChart} type="bar" />
    </Tab>
    <Tab value="geo" label="Geography">
      <Chart data={data.geoChart} type="map" />
    </Tab>
  </Tabs>
);
