import React, { useRef, useEffect } from 'react';
// Import anime.js with TypeScript support
import anime from 'animejs/lib/anime.js';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedBarChartProps {
  data: BarData[];
  maxValue?: number;
  height?: number;
  className?: string;
  barClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  maxValue: customMaxValue,
  height = 240,
  className = '',
  barClassName = '',
  labelClassName = '',
  valueClassName = '',
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const maxValue = customMaxValue || Math.max(...data.map(item => item.value)) * 1.1;

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Animate bars
    anime({
      targets: '.animate-bar',
      scaleY: [0, 1],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(100),
      easing: 'easeOutElastic(1, .5)'
    });
    
    // Animate values
    anime({
      targets: '.animate-value',
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 800,
      delay: anime.stagger(120, { start: 400 }),
      easing: 'easeOutCubic'
    });
    
    // Animate labels
    anime({
      targets: '.animate-label',
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 800,
      delay: anime.stagger(120, { start: 600 }),
      easing: 'easeOutCubic'
    });
  }, [data]);

  return (
    <div 
      ref={chartRef}
      className={`flex items-end justify-between h-${height} w-full ${className}`}
    >
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        const barColor = item.color || '#00FFD1';
        
        return (
          <div key={index} className="flex flex-col items-center flex-1 px-1">
            <div className="animate-value text-sm mb-2 opacity-0">
              <span className={`text-gray-300 ${valueClassName}`}>{item.value}</span>
            </div>
            <div 
              className={`animate-bar w-full rounded-t-sm origin-bottom ${barClassName} transition-all`}
              // Height needs to be dynamic, can't use fixed Tailwind classes
              style={{ height: `${barHeight}%` }} 
            >
              {/* We use a child div with a dynamic class name based on index */}
              <div 
                className={`w-full h-full rounded-t-sm opacity-80 bar-${index}`}
                // Insert a style tag in the component to define dynamic colors
                dangerouslySetInnerHTML={{ 
                  __html: `<style>.bar-${index} { background-color: ${item.color || '#00FFD1'}; }</style>` 
                }}
              ></div>
            </div>
            <div className="animate-label text-xs mt-2 opacity-0">
              <span className={`text-gray-400 ${labelClassName}`}>{item.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnimatedBarChart;
