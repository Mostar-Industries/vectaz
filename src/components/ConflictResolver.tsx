import { Button } from '@/components/ui/button';

export const ConflictResolver = ({ 
  conflicts,
  onResolve
}: {
  conflicts: Array<{id: string, field: string, local: any, remote: any}>,
  onResolve: (resolution: Record<string, any>) => void
}) => {
  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-red-500">
      <h3 className="text-red-500 mb-4">Data Conflicts Detected</h3>
      
      {conflicts.map(conflict => (
        <div key={`${conflict.id}-${conflict.field}`} className="mb-4">
          <p className="text-white mb-2">{conflict.field}:</p>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => onResolve({[conflict.field]: conflict.local})}
            >
              Keep Local
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onResolve({[conflict.field]: conflict.remote})}
            >
              Use Remote
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
