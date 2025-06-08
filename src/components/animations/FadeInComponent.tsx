import React, { useRef, useEffect } from 'react';
import anime from 'animejs/lib/anime.js';

interface FadeInComponentProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

const FadeInComponent: React.FC<FadeInComponentProps> = ({
  children,
  delay = 0,
  duration = 800,
  direction = 'up',
  className = '',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Set initial transform based on direction
    let translateValue = '20px';
    let translateProperty = '';
    
    switch (direction) {
      case 'up':
        translateProperty = 'translateY';
        break;
      case 'down':
        translateProperty = 'translateY';
        translateValue = `-${translateValue}`;
        break;
      case 'left':
        translateProperty = 'translateX';
        break;
      case 'right':
        translateProperty = 'translateX';
        translateValue = `-${translateValue}`;
        break;
      default:
        translateProperty = '';
        translateValue = '0px';
    }
    
    // Apply animation
    anime({
      targets: elementRef.current,
      opacity: [0, 1],
      ...(translateProperty ? { [translateProperty]: [translateValue, 0] } : {}),
      duration: duration,
      delay: delay,
      easing: 'easeOutExpo'
    });
  }, [delay, duration, direction]);

  return (
    <div ref={elementRef} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
};

export default FadeInComponent;
