import React from 'react';
import { Database, Clock, Wallet, TrendingUp, Percent, Package, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPI {
  label: string;
  value: string | number;
  icon: React.ComponentType;
  format?: 'unit' | 'currency' | 'percentage';
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
  subValues?: { label: string; value: string | number }[];
  color?: string;
}

interface KPIPanelProps {
  kpis: KPI[];
  className?: string;
}

const KPIPanel: React.FC<KPIPanelProps> = ({ kpis, className }) => {
  const formatValue = (value: string | number, format?: 'unit' | 'currency' | 'percentage'): string => {
    if (format === 'currency') {
      return `$${Number(value).toFixed(2)}`;
    } else if (format === 'percentage') {
      return `${Number(value) * 100}%`;
    } else {
      return String(value);
    }
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    if (direction === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (direction === 'down') {
      return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    } else {
      return null;
    }
  };

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4", className)}>
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-card rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-muted">
                <div className={`h-5 w-5 ${kpi.color || 'text-primary'}`}>
                  <kpi.icon />
                </div>
              </div>
              <h3 className="ml-3 text-sm font-medium">{kpi.label}</h3>
            </div>
            {kpi.trend && (
              <div className="flex items-center text-xs text-muted-foreground">
                {getTrendIcon(kpi.trend.direction)}
                <span className="ml-1">{kpi.trend.value}</span>
              </div>
            )}
          </div>
          <p className="mt-2 text-2xl font-bold">
            {formatValue(kpi.value, kpi.format)}
          </p>
          {kpi.subValues && (
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              {kpi.subValues.map((sub, subIndex) => (
                <div key={subIndex} className="flex justify-between">
                  <span>{sub.label}</span>
                  <span>{formatValue(sub.value, kpi.format)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KPIPanel;

// Example usage (can be removed or commented out for production)
/*
const ExampleKPIPanel: React.FC = () => (
  <div className="container mx-auto p-4">
    <KPIPanel
      kpis={[
        {
          label: 'Total Shipments',
          value: 105,
          icon: Database,
          format: 'unit',
          subValues: [
            { label: 'This Month', value: 23 },
            { label: 'Last Month', value: 19 }
          ]
        },
        {
          label: 'Avg Transit Days',
          value: 4.6,
          icon: Clock,
          trend: { value: '+0.3d', direction: 'down' },
          subValues: [
            { label: 'Fastest', value: '2.1d' },
            { label: 'Slowest', value: '6.8d' }
          ]
        },
        {
          label: 'Cost/kg',
          value: 2.45,
          icon: Wallet,
          format: 'currency',
          trend: { value: '-4%', direction: 'up' },
          subValues: [
            { label: 'Air Freight', value: '$4.20' },
            { label: 'Sea Freight', value: '$1.15' }
          ]
        },
        {
          label: 'Emergency Ratio',
          value: 0.13,
          icon: TrendingUp,
          format: 'percentage',
          color: 'text-red-400',
          subValues: [
            { label: 'Priority Shipments', value: 8 },
            { label: 'Standard', value: 97 }
          ]
        },
        {
          label: 'On-Time Rate',
          value: 0.91,
          icon: Percent,
          format: 'percentage',
          trend: { value: '+2.1%', direction: 'up' },
          subValues: [
            { label: 'Last Quarter', value: '89%' },
            { label: 'YTD', value: '90.4%' }
          ]
        },
        {
          label: 'Delayed Shipments',
          value: 9,
          icon: Package,
          color: 'text-yellow-400',
          subValues: [
            { label: 'Weather', value: 3 },
            { label: 'Customs', value: 4 }
          ]
        },
        {
          label: 'Freight Score',
          value: 88.2,
          icon: Box,
          trend: { value: '+5.3', direction: 'up' },
          subValues: [
            { label: 'Carrier Avg', value: 79.4 },
            { label: 'Industry Avg', value: 82.1 }
          ]
        }
      ]}
    />
  </div>
);

export default ExampleKPIPanel;
*/

<KPIPanel
  className="grid-cols-2 lg:grid-cols-4 xl:grid-cols-7" // Override default grid
  kpis={[
    {
      label: 'Total Shipments',
      value: 105,
      icon: Database,
      format: 'unit',
      subValues: [
        { label: 'This Month', value: 23 },
        { label: 'Last Month', value: 19 }
      ]
    },
    {
      label: 'Avg Transit Days',
      value: 4.6,
      icon: Clock,
      trend: { value: '+0.3d', direction: 'down' },
      subValues: [
        { label: 'Fastest', value: '2.1d' },
        { label: 'Slowest', value: '6.8d' }
      ]
    },
    {
      label: 'Cost/kg',
      value: 2.45,
      icon: Wallet,
      format: 'currency',
      trend: { value: '-4%', direction: 'up' },
      subValues: [
        { label: 'Air Freight', value: '$4.20' },
        { label: 'Sea Freight', value: '$1.15' }
      ]
    },
    {
      label: 'Emergency Ratio',
      value: 0.13,
      icon: TrendingUp,
      format: 'percentage',
      color: 'text-red-400',
      subValues: [
        { label: 'Priority Shipments', value: 8 },
        { label: 'Standard', value: 97 }
      ]
    },
    {
      label: 'On-Time Rate',
      value: 0.91,
      icon: Percent,
      format: 'percentage',
      trend: { value: '+2.1%', direction: 'up' },
      subValues: [
        { label: 'Last Quarter', value: '89%' },
        { label: 'YTD', value: '90.4%' }
      ]
    },
    {
      label: 'Delayed Shipments',
      value: 9,
      icon: Package,
      color: 'text-yellow-400',
      subValues: [
        { label: 'Weather', value: 3 },
        { label: 'Customs', value: 4 }
      ]
    },
    {
      label: 'Freight Score',
      value: 88.2,
      icon: Box,
      trend: { value: '+5.3', direction: 'up' },
      subValues: [
        { label: 'Carrier Avg', value: 79.4 },
        { label: 'Industry Avg', value: 82.1 }
      ]
    }
  ]}
/>