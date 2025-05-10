export function ConfidenceIndicator({ value }: { value: number }) {
  const color = 
    value > 0.8 ? 'bg-green-100 text-green-800' :
    value > 0.5 ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800';
    
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
      {Math.round(value * 100)}% confidence
    </span>
  );
}
