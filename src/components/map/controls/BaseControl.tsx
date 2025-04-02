
import React from 'react';
import { cn } from '@/lib/utils';

export interface BaseControlProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  children: React.ReactNode;
}

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-24 right-4',
};

const BaseControl: React.FC<BaseControlProps> = ({ 
  className, 
  position = 'top-left', 
  children 
}) => {
  return (
    <div 
      className={cn(
        'absolute glass-panel z-10',
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>
  );
};

export default BaseControl;
