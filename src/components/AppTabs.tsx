
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, BarChart, Cpu, Info, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabItem, AppSection } from '@/types/deeptrack';

interface AppTabsProps {
  className?: string;
}

const AppTabs: React.FC<AppTabsProps> = ({ className }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Map paths to tab IDs
  const getActiveTab = (): AppSection => {
    if (currentPath === '/analytics') return 'analytics';
    if (currentPath === '/deepcal') return 'deepcal';
    if (currentPath === '/about') return 'about';
    if (currentPath === '/settings') return 'settings';
    return 'map';
  };
  
  const activeTab = getActiveTab();
  
  const tabs: TabItem[] = [
    { id: 'map', label: 'Map View', icon: Map, path: '/' },
    { id: 'analytics', label: 'Analytics', icon: BarChart, path: '/analytics' },
    { id: 'deepcal', label: 'DeepCAL', icon: Cpu, path: '/deepcal' },
    { id: 'about', label: 'About', icon: Info, path: '/about' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className={cn(
      "fixed top-8 left-1/2 transform -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(0,149,255,0.15)] overflow-hidden border border-cyan-500/30",
      className
    )}>
      <div className="flex items-center space-x-1 px-1">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            className={cn(
              "relative flex items-center justify-center px-3 py-2 rounded-full transition-all duration-300",
              activeTab === tab.id
                ? "text-white bg-gradient-to-r from-cyan-500/30 to-blue-500/30 shadow-inner shadow-white/10"
                : "text-cyan-300/60 hover:text-cyan-300/90 hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute inset-0 rounded-full animate-pulse opacity-20 bg-cyan-400/20"></span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AppTabs;
