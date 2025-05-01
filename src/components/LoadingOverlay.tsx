import { Loader2 } from 'lucide-react';

export const LoadingOverlay = ({ message }: { message?: string }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center">
    <Loader2 className="animate-spin text-[#00FFD1] w-12 h-12 mb-4" />
    <p className="text-white">{message || 'Processing...'}</p>
  </div>
);
