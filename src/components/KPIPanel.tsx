
import React from 'react';

interface KPIPanelProps {
  kpis: Array<{
    label: string;
    value: string | number;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    iconName?: string;
    color?: string;
  }>;
  className?: string;
}

const KPIPanel = ({ kpis, className }: KPIPanelProps) => (
  <div className={`flex space-x-4 p-2 overflow-x-auto ${className}`}>
    {kpis.map((kpi, index) => (
      <div key={index} className="flex-shrink-0 bg-gray-900/50 p-3 rounded-lg border border-gray-700 min-w-[180px] glass-panel">
        <div className="text-sm text-gray-400">{kpi.label}</div>
        <div className="text-2xl font-bold my-1">{kpi.value}</div>
        {kpi.trend && (
          <div className={`text-xs flex items-center ${
            kpi.trendDirection === 'up' ? 'text-green-400' : 
            kpi.trendDirection === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {kpi.trend}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default KPIPanel;
