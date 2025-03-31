
import React from 'react';
import { TrendingUp, TrendingDown, Clock, Package, AlertTriangle, Truck, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
}

const KPICard: React.FC<KPIProps> = ({ title, value, change, icon, color = 'bg-primary/10' }) => {
  return (
    <div className={cn(
      "p-4 rounded-lg transition-all duration-300 backdrop-blur-sm border border-border/30 hover:border-border/50 group",
      color
    )}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</h3>
        <div className="h-8 w-8 rounded-full bg-background/80 flex items-center justify-center transform group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {change !== undefined && (
          <span className={cn(
            "text-xs flex items-center transition-colors",
            change >= 0 ? 'text-green-600' : 'text-red-600'
          )}>
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
  className?: string;
}

const KPIPanel: React.FC<KPIPanelProps> = ({ kpis, isLoading = false, className }) => {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", className)}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  const transportModes = [
    { mode: 'Air', percentage: kpis.modeSplit.air, icon: <FileText className="h-4 w-4 text-blue-400" /> },
    { mode: 'Road', percentage: kpis.modeSplit.road, icon: <Truck className="h-4 w-4 text-emerald-400" /> },
    { mode: 'Sea', percentage: kpis.modeSplit.sea, icon: <FileText className="h-4 w-4 text-cyan-400" /> }
  ];

  const dominantMode = transportModes.reduce((prev, current) => 
    (prev.percentage > current.percentage) ? prev : current
  );

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", className)}>
      <KPICard
        title="Total Shipments"
        value={kpis.totalShipments}
        icon={<Package className="h-4 w-4 text-primary" />}
        color="bg-primary/5"
      />
      <KPICard
        title="Avg. Cost (per kg)"
        value={`$${kpis.avgCostPerKg.toFixed(2)}`}
        change={-2.4}
        icon={<TrendingDown className="h-4 w-4 text-green-600" />}
        color="bg-green-50 dark:bg-green-950/20"
      />
      <KPICard
        title="Avg. Transit Time"
        value={`${kpis.avgTransitDays.toFixed(1)} days`}
        change={1.3}
        icon={<Clock className="h-4 w-4 text-orange-600" />}
        color="bg-orange-50 dark:bg-orange-950/20"
      />
      <KPICard
        title="Dominant Mode"
        value={dominantMode.mode}
        icon={dominantMode.icon}
        color="bg-blue-50 dark:bg-blue-950/20"
      />
    </div>
  );
};

export default KPIPanel;
