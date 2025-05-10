import { useShipmentStore } from '@/store/shipmentStore';
import { Tooltip } from '@/components/ui/tooltip';

export function InsightsConsole() {
  const { forwarderScores, ready } = useShipmentStore();
  
  if (!ready) return <div className="p-4 text-gray-500">Loading decision data...</div>;
  if (!forwarderScores?.length) return <div className="p-4 text-gray-500">No scores available</div>;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold text-lg">Decision Rationale</h3>
      
      {forwarderScores.map((score) => (
        <div key={score.forwarder} className="p-3 border rounded">
          <div className="flex justify-between">
            <span className="font-medium">{score.forwarder}</span>
            <Tooltip>
              <span className="text-blue-600">{score.score.toFixed(2)}</span>
            </Tooltip>
          </div>
          
          {score.trace && (
            <p className="text-sm mt-1 text-gray-600">
              {score.trace.commentary}
            </p>
          )}
          
          <div className="mt-2 text-xs text-gray-500">
            Based on {score.trace?.shipmentIds.length} shipments
            {score.trace?.influentialFields.length > 0 && (
              <span> • Key factors: {score.trace.influentialFields.join(', ')}</span> 
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
