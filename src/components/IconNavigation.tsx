
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  GlobeIcon, 
  BarChart3Icon, 
  BrainCircuitIcon, 
  InfoIcon, 
  SettingsIcon,
  ClipboardListIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const IconNavigation = () => {
  const router = useRouter();

  // Icons we'll display in the bottom navigation
  const navIcons = [
    { id: 'map', icon: GlobeIcon, label: 'Map', path: '/' },
    { id: 'analytics', icon: BarChart3Icon, label: 'Analytics', path: '/analytics' },
    { id: 'forms', icon: ClipboardListIcon, label: 'Forms', path: '/forms' },
    { id: 'deepcal', icon: BrainCircuitIcon, label: 'DeepCAL', path: '/deepcal' },
    { id: 'about', icon: InfoIcon, label: 'About', path: '/about' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="glass-panel rounded-full py-2 px-4 flex items-center justify-center space-x-1 shadow-lg border border-[#00FFD1]/30">
      {navIcons.map((item) => {
        const Icon = item.icon;
        const isActive = router.pathname === item.path;

        return (
          <Link
            key={item.id}
            href={item.path}
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
