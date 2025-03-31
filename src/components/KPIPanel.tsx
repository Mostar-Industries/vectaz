
import React from 'react';
import { TrendingUp, TrendingDown, Clock, Package, AlertTriangle, Truck, FileText, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'cyan' | 'magenta' | 'green'; 
}

const KPICard: React.FC<KPIProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  color = 'blue'
}) => {
  // Map the color to the appropriate class
  const colorClasses = {
    blue: 'glass-card-blue',
    cyan: 'glass-card-cyan',
    magenta: 'glass-card-magenta',
    green: 'glass-card-green'
  };
  
  const cardClass = colorClasses[color];
  
  // Icon color classes
  const iconColors = {
    blue: 'text-blue-400',
    cyan: 'text-cyan-400',
    magenta: 'text-pink-500',
    green: 'text-green-400'
  };
  
  return (
    <div className={`p-4 rounded-lg transition-all duration-300 backdrop-blur-md ${cardClass}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <div className={`h-10 w-10 rounded-full bg-black/40 flex items-center justify-center transform transition-transform ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        {change !== undefined && (
          <span className={cn(
            "text-xs flex items-center",
            change >= 0 ? 'text-green-400' : 'text-red-400'
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
          <div key={i} className="h-24 bg-mostar-darkest/50 animate-pulse rounded-lg border border-mostar-light-blue/10"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", className)}>
      <KPICard
        title="Total Shipments"
        value={kpis.totalShipments}
        icon={<Package className="h-6 w-6" />}
        color="blue"
      />
      <KPICard
        title="Avg Transit Time"
        value={`${kpis.avgTransitDays.toFixed(1)} days`}
        icon={<Clock className="h-6 w-6" />}
        color="cyan"
      />
      <KPICard
        title="Disruption Score"
        value={`${(kpis.avgTransitDays / 2).toFixed(1)}`}
        icon={<AlertTriangle className="h-6 w-6" />}
        color="magenta"
      />
      <KPICard
        title="Resilience Score"
        value={`${(50).toFixed(1)}`}
        icon={<Shield className="h-6 w-6" />}
        color="green"
      />
    </div>
  );
};

export default KPIPanel;
