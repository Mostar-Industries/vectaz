
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Map, BarChart, Settings, Package, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

const IconNavigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Map, path: '/routes', label: 'Routes' },
    { icon: BarChart, path: '/analytics', label: 'Analytics' },
    { icon: Package, path: '/shipments', label: 'Shipments' },
    { icon: Settings, path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="bg-mostar-darkest/60 backdrop-blur-md rounded-full shadow-lg px-3 py-2 border border-mostar-light-blue/20">
      <div className="flex flex-row items-center gap-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="icon"
            asChild
            className={cn(
              "rounded-full h-10 w-10 hover:bg-mostar-light-blue/10 hover:text-cyber-blue transition-all duration-300",
              location.pathname === item.path && "bg-mostar-light-blue/20 text-cyber-blue shadow-neon-blue"
            )}
            title={item.label}
          >
            <Link to={item.path}>
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.label}</span>
            </Link>
          </Button>
        ))}
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-10 w-10 bg-mostar-light-blue hover:bg-mostar-light-blue/90 text-primary-foreground ml-1 shadow-neon-blue transition-all duration-300"
          title="Add New"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add New</span>
        </Button>
      </div>
    </div>
  );
};

export default IconNavigation;
