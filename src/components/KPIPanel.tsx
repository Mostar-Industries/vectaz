
import React from 'react';
import { TrendingUp, TrendingDown, Clock, Package, AlertTriangle, InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { KPI } from '@/types/deeptrack';

interface KPICardProps {
  kpi: KPI;
  icon?: React.ReactNode;
  color?: string;
}

const KPICard: React.FC<KPICardProps> = ({ kpi, icon, color = 'bg-primary/10' }) => {
  return (
    <div className={`p-4 rounded-lg ${color} flex flex-col space-y-2 relative`}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">{kpi.label}</h3>
        <div className="h-8 w-8 rounded-full bg-background/80 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{kpi.value}</span>
        {kpi.change !== undefined && (
          <span className={`text-xs flex items-center ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {kpi.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(kpi.change)}%
          </span>
        )}
      </div>
      
      {/* Data source tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute bottom-1 right-1 opacity-50 hover:opacity-100">
              <InfoIcon className="h-3 w-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-xs">
              <p><strong>Source:</strong> {kpi.mappedFrom}</p>
              <p><strong>Fields:</strong> {kpi.source.join(', ')}</p>
              <p><strong>Validated:</strong> {kpi.validated ? 'Yes' : 'No'}</p>
              <p><strong>Last verified:</strong> {new Date(kpi.lastVerified).toLocaleString()}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

interface KPIPanelProps {
  kpis: KPI[];
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

  if (!kpis || kpis.length === 0) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-5 w-5" />
          Data unavailable – retry or revalidate base.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => {
        let icon;
        let color;
        
        // Determine icon and color based on KPI label
        if (kpi.label.includes('Shipment')) {
          icon = <Package className="h-4 w-4 text-primary" />;
          color = "bg-primary/10";
        } else if (kpi.label.includes('Cost')) {
          icon = <TrendingDown className="h-4 w-4 text-green-600" />;
          color = "bg-green-100";
        } else if (kpi.label.includes('Transit') || kpi.label.includes('Time')) {
          icon = <Clock className="h-4 w-4 text-orange-600" />;
          color = "bg-orange-100";
        } else if (kpi.label.includes('Risk') || kpi.label.includes('Index')) {
          icon = <AlertTriangle className="h-4 w-4 text-amber-600" />;
          color = "bg-amber-100";
        }
        
        return (
          <KPICard 
            key={index} 
            kpi={kpi} 
            icon={icon} 
            color={color} 
          />
        );
      })}
    </div>
  );
};

export default KPIPanel;
