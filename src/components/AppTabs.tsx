
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Globe, 
  BarChart3, 
  BrainCircuit, 
  InfoIcon, 
  Settings,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppSection } from '@/types/deeptrack';

interface AppTabsProps {
  activeTab: AppSection;
  onTabChange: (tab: AppSection) => void;
}

const AppTabs: React.FC<AppTabsProps> = ({ activeTab, onTabChange }) => {
  const location = useLocation();

  // Define the tabs we want to display
  const tabs = [
    { id: 'map', icon: Globe, label: 'Map', path: '/' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/' },
    { id: 'forms', icon: ClipboardList, label: 'Forms', path: '/forms' },
    { id: 'deepcal', icon: BrainCircuit, label: 'DeepCAL', path: '/' },
    { id: 'about', icon: InfoIcon, label: 'About', path: '/' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/' }
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="glass-panel px-3 py-2 rounded-full flex items-center space-x-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          // If the tab has a path, render a Link
          if (tab.path && tab.path !== '/' && tab.id === 'forms') {
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={cn(
                  "flex items-center rounded-full px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-[#00FFD1]/20 text-[#00FFD1]"
                    : "text-gray-400 hover:bg-[#00FFD1]/10 hover:text-[#00FFD1]"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Link>
            );
          } else if (tab.id !== 'forms') {
            // For other tabs on the main page
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as AppSection)}
                className={cn(
                  "flex items-center rounded-full px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-[#00FFD1]/20 text-[#00FFD1]"
                    : "text-gray-400 hover:bg-[#00FFD1]/10 hover:text-[#00FFD1]"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          } else {
            // For the forms tab when we're not on the forms page
            return (
              <Link
                key={tab.id}
                to="/forms"
                className={cn(
                  "flex items-center rounded-full px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-[#00FFD1]/20 text-[#00FFD1]"
                    : "text-gray-400 hover:bg-[#00FFD1]/10 hover:text-[#00FFD1]"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};

export default AppTabs;
