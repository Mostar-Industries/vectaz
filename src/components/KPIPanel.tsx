
import React from 'react';
import { TrendingUp, TrendingDown, Clock, Package, AlertTriangle } from 'lucide-react';

interface KPIProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
}

const KPICard: React.FC<KPIProps> = ({ title, value, change, icon, color = 'bg-primary/10' }) => {
  return (
    <div className={`p-4 rounded-lg ${color} flex flex-col space-y-2`}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="h-8 w-8 rounded-full bg-background/80 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {change !== undefined && (
          <span className={`text-xs flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
};

interface KPIPanelProps {
  kpis: {
    totalShipments: number;
    totalWeight: number;
    totalVolume: number;
    avgCostPerKg: number;
    avgTransitDays: number;
    modeSplit: {
      air: number;
      road: number;
      sea: number;
    };
  };
  isLoading?: boolean;
}

const KPIPanel: React.FC<KPIPanelProps> = ({ kpis, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard
        title="Total Shipments"
        value={kpis.totalShipments}
        icon={<Package className="h-4 w-4 text-primary" />}
        color="bg-primary/10"
      />
      <KPICard
        title="Avg. Cost (per kg)"
        value={`$${kpis.avgCostPerKg.toFixed(2)}`}
        change={-2.4} // Example change
        icon={<TrendingDown className="h-4 w-4 text-green-600" />}
        color="bg-green-100"
      />
      <KPICard
        title="Avg. Transit Time"
        value={`${kpis.avgTransitDays.toFixed(1)} days`}
        change={1.3} // Example change
        icon={<Clock className="h-4 w-4 text-orange-600" />}
        color="bg-orange-100"
      />
      <KPICard
        title="Risk Index"
        value="Medium"
        icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
        color="bg-amber-100"
      />
    </div>
  );
};

export default KPIPanel;
