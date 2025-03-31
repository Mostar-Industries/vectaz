
import { cn } from "@/lib/utils";
import React from "react";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'blue' | 'cyan' | 'magenta' | 'green';
  children: React.ReactNode;
}

export const GlassContainer = React.forwardRef<
  HTMLDivElement,
  GlassContainerProps
>(({ className, variant = 'default', children, ...props }, ref) => {
  const variantClasses = {
    default: 'glass-card',
    blue: 'glass-card-blue',
    cyan: 'glass-card-cyan',
    magenta: 'glass-card-magenta',
    green: 'glass-card-green',
  };

  return (
    <div
      ref={ref}
      className={cn(variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
});
GlassContainer.displayName = "GlassContainer";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export const GlassPanel = React.forwardRef<
  HTMLDivElement,
  GlassPanelProps
>(({ className, title, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("system-status-card", className)}
      {...props}
    >
      {title && <h2 className="system-status-header">{title}</h2>}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
});
GlassPanel.displayName = "GlassPanel";

interface GlassStatusDotProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'online' | 'warning' | 'error' | 'neutral';
}

export const GlassStatusDot = React.forwardRef<
  HTMLDivElement,
  GlassStatusDotProps
>(({ className, status, ...props }, ref) => {
  const statusClasses = {
    online: 'bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.6)]',
    warning: 'bg-yellow-500 shadow-[0_0_8px_rgba(250,204,21,0.6)]',
    error: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
    neutral: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]',
  };

  return (
    <div
      ref={ref}
      className={cn(
        "w-2 h-2 rounded-full animate-pulse",
        statusClasses[status],
        className
      )}
      {...props}
    />
  );
});
GlassStatusDot.displayName = "GlassStatusDot";

interface GlassIconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  color: 'blue' | 'cyan' | 'magenta' | 'green' | 'yellow' | 'red';
  children: React.ReactNode;
}

export const GlassIconContainer = React.forwardRef<
  HTMLDivElement,
  GlassIconContainerProps
>(({ className, color, children, ...props }, ref) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    magenta: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-lg p-2 border",
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
GlassIconContainer.displayName = "GlassIconContainer";
