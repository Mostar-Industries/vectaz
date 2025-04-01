
import React from 'react';

const LoadingFooter: React.FC = () => {
  return (
    <div className="absolute bottom-4 text-xs text-center text-blue-200/40 font-mono">
      <p>MOSTAR INDUSTRIES</p>
      <p className="mt-1 text-[10px]">© DEEPCAL ROUTEVERSE {new Date().getFullYear()}</p>
    </div>
  );
};

export default LoadingFooter;
