
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GlobeIcon, 
  BarChart3Icon, 
  BrainCircuitIcon, 
  InfoIcon, 
  SettingsIcon,
  ClipboardListIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppSection } from '@/types/deeptrack';
import { useBaseDataStore } from '@/store/baseState';

const IconNavigation = () => {
  const location = useLocation();
  const { setActiveSection } = useBaseDataStore((state) => ({ 
    setActiveSection: state.setActiveSection 
  }));
  const isIndex = location.pathname === '/';

  // Icons we'll display in the bottom navigation
  const navIcons = [
    { id: 'map', icon: GlobeIcon, label: 'Map', path: '/' },
    { id: 'analytics', icon: BarChart3Icon, label: 'Analytics', path: '/' },
    { id: 'forms', icon: ClipboardListIcon, label: 'Forms', path: '/forms' },
    { id: 'deepcal', icon: BrainCircuitIcon, label: 'DeepCAL', path: '/' },
    { id: 'about', icon: InfoIcon, label: 'About', path: '/' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings', path: '/' }
  ];

  const handleSectionChange = (section: AppSection) => {
    setActiveSection(section);
  };

  return (
    <div className="glass-panel rounded-full py-2 px-4 flex items-center justify-center space-x-1 shadow-lg border border-[#00FFD1]/30">
      {navIcons.map((item) => {
        const Icon = item.icon;
        const isActive = isIndex ? 
          location.hash === `#${item.id}` || (location.hash === '' && item.id === 'map') :
          location.pathname === item.path;

        return (
          <Link
            key={item.id}
            to={item.path === '/' ? `/#${item.id}` : item.path}
            onClick={() => {
              if (isIndex || (item.path === '/' && item.id !== 'map')) {
                handleSectionChange(item.id as AppSection);
              }
            }}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-full transition-all",
              isActive
                ? "bg-[#00FFD1]/20 text-[#00FFD1]"
                : "text-gray-400 hover:bg-[#00FFD1]/10 hover:text-[#00FFD1]"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default IconNavigation;
