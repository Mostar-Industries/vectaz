import { useShipmentStore } from '@/store/shipmentStore';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function DriftRadar({ forwarderId }: { forwarderId: string }) {
  const { forwarderDriftLogs } = useShipmentStore();
  
  const driftData = forwarderDriftLogs
    ?.filter(log => log.forwarder === forwarderId)
    ?.slice(-5)
    ?.map(log => ({
      magnitude: log.driftMagnitude,
      time: new Date().toLocaleTimeString()
    })) || [];

  const avgDrift = driftData.reduce((sum, point) => sum + (Number(point.magnitude) || 0), 0) / (driftData.length || 1);
  const statusColor = avgDrift > 0.5 ? 'red' : avgDrift > 0.2 ? 'yellow' : 'green';
  
  return (
    <div className="flex items-center space-x-2">
      <div className="w-20 h-10">
        <ResponsiveContainer>
          <LineChart data={driftData}>
            <Line 
              type="monotone" 
              dataKey="magnitude" 
              stroke={statusColor} 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <span className={`text-xs px-2 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-800`}>
        {avgDrift > 0.5 ? 'Volatile' : avgDrift > 0.2 ? 'Learning' : 'Stable'}
      </span>
    </div>
  );
}
