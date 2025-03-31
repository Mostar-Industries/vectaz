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
  return <div className="container p-4 md:p-6 animate-fade-in px-0 mx-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient-primary flex items-center">
          <BarChartIcon className="mr-2 h-8 w-8" />
          {title}
        </h1>
        
        <Button variant="outline" className="flex items-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/40" onClick={onToggleDeepTalk}>
          <Brain className="h-4 w-4" />
          {showDeepTalk ? 'Close DeepTalk' : 'Ask DeepTalk™'}
        </Button>
      </div>
      
      <KPIPanel kpis={kpis} className="mb-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-0 my-0 py-0 px-[12px]">
        <div className="py-0 my-0 mx-0 px-0">
          {children}
        </div>
        
        {showDeepTalk && <div className="lg:col-span-1">
            <DeepTalk className="h-[calc(100vh-300px)] min-h-[500px]" initialMessage="I've analyzed your logistics data. What would you like to know about your shipments, forwarders, or routes?" onQueryData={onDeepTalkQuery} />
          </div>}
      </div>
    </div>;
};
export default AnalyticsLayout;