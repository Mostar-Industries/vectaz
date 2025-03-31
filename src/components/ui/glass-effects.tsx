
import React from 'react';
import { cn } from '@/lib/utils';

type GlassVariant = 'default' | 'blue' | 'green' | 'cyan' | 'purple' | 'amber' | 'pink';

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  className?: string;
  children: React.ReactNode;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ 
  variant = 'default', 
  className, 
  children,
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-black/60 border-white/10',
    blue: 'bg-blue-950/40 border-blue-500/20',
    green: 'bg-green-950/40 border-green-500/20',
    cyan: 'bg-cyan-950/40 border-cyan-500/20',
    purple: 'bg-purple-950/40 border-purple-500/20',
    amber: 'bg-amber-950/40 border-amber-500/20',
    pink: 'bg-pink-950/40 border-pink-500/20'
  };

  return (
    <div
      className={cn(
        "relative rounded-lg backdrop-blur-md border shadow-sm transition-all duration-200",
        variantClasses[variant],
        // Glass reflection style
        "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface GlassIconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  className?: string;
  children: React.ReactNode;
}

export const GlassIconContainer: React.FC<GlassIconContainerProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-black/60 border-white/10 text-white',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400'
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg backdrop-blur-sm border p-3 shadow-sm",
        variantClasses[variant],
        // Glass reflection style
        "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default { GlassContainer, GlassIconContainer };
