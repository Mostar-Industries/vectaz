import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs/lib/anime.js';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  formatFn?: (value: number) => string;
  className?: string;
  easing?: string;
  roundDecimals?: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1800,
  delay = 200,
  formatFn,
  className = '',
  easing = 'easeOutExpo',
  roundDecimals = 0,
  suffix = '',
  prefix = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState<string>('0');
  const previousValue = useRef<number>(0);
  
  useEffect(() => {
    // Skip animation on first render if value is 0
    if (value === 0 && previousValue.current === 0) {
      setDisplayValue('0');
      return;
    }

    const animateValue = anime({
      targets: { value: previousValue.current },
      value: value,
      round: roundDecimals,
      easing,
      duration,
      delay,
      update: (anim) => {
        const currentValue = anim.animations[0].currentValue;
        
        const currentValueNum = typeof currentValue === 'string' ? parseFloat(currentValue) : currentValue;
        
        let formattedValue: string;
        if (formatFn) {
          formattedValue = formatFn(currentValueNum);
        } else {
          formattedValue = Number(currentValueNum).toLocaleString('en-US', {
            maximumFractionDigits: roundDecimals
          });
        }
        
        setDisplayValue(formattedValue);
      }
    });
    
    previousValue.current = value;
    
    return () => {
      animateValue.pause();
    };
  }, [value, duration, delay, formatFn, easing, roundDecimals]);
  
  return (
    <div ref={elementRef} className={`font-mono ${className}`}>
      {prefix}{displayValue}{suffix}
    </div>
  );
};

export default AnimatedCounter;
