
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SystemStatusCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`system-status-card ${className}`}>
      <h2 className="system-status-header">{title}</h2>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

interface ActivityFeedProps {
  children: React.ReactNode;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ children }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center px-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">REAL-TIME INTEL</h3>
        <div className="live-indicator">
          <div className="live-dot"></div>
          <span>LIVE</span>
        </div>
      </div>
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
};

interface ActivityItemProps {
  icon: LucideIcon;
  color: 'magenta' | 'cyan' | 'green';
  title: string;
  time: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  icon: Icon,
  color,
  title,
  time,
}) => {
  const colorClass = {
    magenta: 'activity-icon-magenta',
    cyan: 'activity-icon-cyan',
    green: 'activity-icon-green',
  }[color];

  return (
    <div className="activity-item">
      <div className={`activity-icon ${colorClass}`}>
        <Icon size={16} />
      </div>
      <div className="activity-content">
        <div className="activity-title">{title}</div>
        <div className="activity-time">{time}</div>
      </div>
    </div>
  );
};

export default SystemStatusCard;
