
import React from 'react';
import { cn } from '@/lib/utils';

type GlassVariant = 'default' | 'blue' | 'green' | 'cyan' | 'purple' | 'amber' | 'pink' | 'teal';

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
    pink: 'bg-pink-950/40 border-pink-500/20',
    teal: 'bg-[#0A1A2F]/60 border-[#00FFD1]/20'
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
  pulse?: boolean;
}

export const GlassIconContainer: React.FC<GlassIconContainerProps> = ({
  variant = 'default',
  className,
  children,
  pulse = false,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-black/60 border-white/10 text-white',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    teal: 'bg-[#00FFD1]/10 border-[#00FFD1]/20 text-[#00FFD1]'
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg backdrop-blur-sm border p-3 shadow-sm",
        variantClasses[variant],
        pulse && "animate-pulse",
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

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-[#0A1A2F] text-white hover:bg-[#0A1A2F]/80',
    primary: 'bg-[#00FFD1]/10 text-[#00FFD1] border-[#00FFD1]/30 hover:bg-[#00FFD1]/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20',
    success: 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5'
  };

  return (
    <button
      className={cn(
        "relative rounded-md border shadow-sm transition-all duration-200",
        "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300",
        "hover:after:w-full",
        variantClasses[variant],
        sizeClasses[size],
        // Neumorphic effect
        "shadow-[inset_1px_1px_0px_rgba(255,255,255,0.1),_inset_-1px_-1px_0px_rgba(0,0,0,0.1)]",
        "hover:shadow-[inset_2px_2px_3px_rgba(0,0,0,0.2),_inset_-2px_-2px_3px_rgba(255,255,255,0.05)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default { GlassContainer, GlassIconContainer, NeumorphicButton };
