import { Tooltip } from '@/components/ui/tooltip';
import { ConfidenceIndicator } from '@/components/analytics/ConfidenceIndicator';

type TraceData = {
  sourceQuotes: string[];
  metricBasis: string[];
  sensitivity: string;
  confidence: number;
  neutrosophicStatus: 'Determinate' | 'Indeterminate' | 'Neutral';
};

export function ForwarderInsightCard({
  forwarder,
  score,
  trace,
  summary
}: {
  forwarder: string;
  score: number;
  trace: TraceData;
  summary: string;
}) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-lg">{forwarder}</h4>
        <div className="flex items-center space-x-2">
          <span className="font-bold">{score.toFixed(1)}</span>
          <ConfidenceIndicator value={trace.confidence} />
        </div>
      </div>
      
      <p className="my-2 text-gray-700">{summary}</p>
      
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex">
          <span className="text-gray-500 w-24">Sources:</span>
          <span className="text-blue-600">{trace.sourceQuotes.length} shipments</span>
        </div>
        
        <div className="flex">
          <span className="text-gray-500 w-24">Metrics:</span>
          <span>{trace.metricBasis.join(', ')}</span>
        </div>
        
        {trace.sensitivity && (
          <div className="flex">
            <span className="text-gray-500 w-24">Sensitivity:</span>
            <span className="text-yellow-600">{trace.sensitivity}</span>
          </div>
        )}
      </div>
    </div>
  );
}
