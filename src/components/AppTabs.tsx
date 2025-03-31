
import React from 'react';
import { Map, BarChart, Cpu, Info, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabItem, AppSection } from '@/types/deeptrack';

interface AppTabsProps {
  activeTab: AppSection;
  onTabChange: (tab: AppSection) => void;
  className?: string;
}

const AppTabs: React.FC<AppTabsProps> = ({ activeTab, onTabChange, className }) => {
  const tabs: TabItem[] = [
    { id: 'map', label: 'Map View', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'deepcal', label: 'DeepCAL', icon: Cpu },
    { id: 'about', label: 'About', icon: Info },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 bg-background/80 backdrop-blur-md rounded-full shadow-lg px-3 py-1.5 border border-border/50",
      className
    )}>
      <div className="flex items-center space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center justify-center px-3 py-2 rounded-full transition-all duration-300",
              activeTab === tab.id
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <tab.icon className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppTabs;
