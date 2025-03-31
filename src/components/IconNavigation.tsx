
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
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm rounded-full shadow-lg p-3 border border-border">
      <div className="flex flex-col gap-5">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="icon"
            asChild
            className={cn(
              "rounded-full h-10 w-10 hover:bg-accent",
              location.pathname === item.path && "bg-accent text-accent-foreground"
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
          className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
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
