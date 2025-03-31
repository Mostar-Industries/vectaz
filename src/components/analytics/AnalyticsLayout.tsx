
import React from 'react';
import { BarChartIcon, Brain } from 'lucide-react';
import KPIPanel from '@/components/KPIPanel';
import DeepTalk from '@/components/DeepTalk';
import { Button } from '@/components/ui/button';

interface AnalyticsLayoutProps {
  title: string;
  kpis: any;
  children: React.ReactNode;
  showDeepTalk: boolean;
  onToggleDeepTalk: () => void;
  onDeepTalkQuery: (query: string) => Promise<string>;
}

const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = ({
  title,
  kpis,
  children,
  showDeepTalk,
  onToggleDeepTalk,
  onDeepTalkQuery
}) => {
  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <div className="p-2 mr-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <BarChartIcon className="h-8 w-8 text-blue-400" />
          </div>
          <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-black/50 backdrop-blur-md border border-blue-500/20 text-blue-400 hover:bg-blue-500/10" 
          onClick={onToggleDeepTalk}
        >
          <Brain className="h-5 w-5" />
          {showDeepTalk ? 'Close DeepTalk' : 'Ask DeepTalk™'}
        </Button>
      </div>
      
      <KPIPanel kpis={kpis} className="mb-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {children}
        </div>
        
        {showDeepTalk && (
          <div className="lg:col-span-1 glass-panel">
            <DeepTalk 
              className="h-[calc(100vh-300px)] min-h-[500px]" 
              initialMessage="I've analyzed your logistics data. What would you like to know about your shipments, forwarders, or routes?" 
              onQueryData={onDeepTalkQuery} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsLayout;
