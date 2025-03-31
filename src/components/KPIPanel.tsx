
import React from 'react';
import { TrendingUp, TrendingDown, Clock, Package, AlertTriangle, Truck, FileText, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
  glowColor?: string;
}

const KPICard: React.FC<KPIProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'from-mostar-light-blue/10 to-mostar-blue/5', 
  glowColor = 'shadow-neon-blue'
}) => {
  return (
    <div className={cn(
      "p-4 rounded-md transition-all duration-300 backdrop-blur-md border border-mostar-light-blue/20 hover:border-mostar-light-blue/40 group",
      "bg-black/60", color,
      glowColor
    )}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</h3>
        <div className="h-10 w-10 rounded-full bg-mostar-darkest/60 flex items-center justify-center transform group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-3xl font-bold tracking-tight group-hover:text-cyber-blue transition-colors">{value}</span>
        {change !== undefined && (
          <span className={cn(
            "text-xs flex items-center transition-colors",
            change >= 0 ? 'text-mostar-green text-glow-green' : 'text-red-500'
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
          <div key={i} className="h-24 bg-mostar-darkest/50 animate-pulse rounded-md border border-mostar-light-blue/10"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", className)}>
      <KPICard
        title="Total Shipments"
        value={kpis.totalShipments}
        icon={<Package className="h-6 w-6 text-mostar-light-blue" />}
        color="from-mostar-light-blue/10 to-mostar-blue/5"
      />
      <KPICard
        title="Avg Transit Time"
        value={`${kpis.avgTransitDays.toFixed(1)} days`}
        icon={<Clock className="h-6 w-6 text-mostar-cyan" />}
        color="from-mostar-cyan/10 to-mostar-cyan/5"
        glowColor="shadow-neon-cyan"
      />
      <KPICard
        title="Disruption Score"
        value={`${(kpis.avgTransitDays / 2).toFixed(1)}`}
        icon={<AlertTriangle className="h-6 w-6 text-mostar-magenta" />}
        color="from-mostar-magenta/10 to-mostar-magenta/5"
        glowColor="shadow-neon-magenta"
      />
      <KPICard
        title="Resilience Score"
        value={`${(50).toFixed(1)}`}
        icon={<Shield className="h-6 w-6 text-mostar-green" />}
        color="from-mostar-green/10 to-mostar-green/5"
        glowColor="shadow-neon-green"
      />
    </div>
  );
};

export default KPIPanel;
