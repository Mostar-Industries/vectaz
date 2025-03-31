
import React from 'react';
import { useBaseDataStore } from '@/store/baseState';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const Index = () => {
  const { isDataLoaded } = useBaseDataStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">DeepCAL</h1>
        <p className="text-lg text-muted-foreground">Cargo Augmented Logistics</p>
      </header>
      
      <div className="max-w-3xl mx-auto">
        {isDataLoaded ? (
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-6 w-6 mr-2 text-green-500" />
              <h2 className="text-xl font-semibold">System Ready</h2>
            </div>
            <p className="mb-4 text-muted-foreground">
              DeepCAL is fully operational with verified data. All features are now available.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">View Dashboard</Button>
              <Button variant="outline">Manage Data</Button>
            </div>
          </div>
        ) : (
          <div className="p-6 border rounded-lg bg-card shadow-sm text-center">
            <p className="text-muted-foreground">
              Please wait while the system completes its initialization...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
