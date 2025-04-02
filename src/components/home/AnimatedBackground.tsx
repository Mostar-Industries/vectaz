
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 bg-[#0A1A2F] z-0"></div>
      <div className="tech-grid absolute inset-0 z-0"></div>
      <div className="network-lines absolute inset-0 z-0"></div>
      
      {/* Ambient particle effect */}
      <div className="absolute inset-0 z-0 opacity-30">
        {Array(20).fill(0).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-[#00FFD1] rounded-full opacity-30"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default AnimatedBackground;
