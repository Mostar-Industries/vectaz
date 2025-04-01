
import React from 'react';
import { Atom, Database, Zap, Server, Cpu, RefreshCw, Shield } from 'lucide-react';

interface FloatingIconsProps {
  className?: string;
}

const FloatingIcons: React.FC<FloatingIconsProps> = ({ className }) => {
  const icons = [
    { icon: <Atom size={20} className="text-blue-400" />, delay: "0s", duration: "12s" },
    { icon: <Database size={20} className="text-blue-300" />, delay: "1.5s", duration: "15s" },
    { icon: <Zap size={20} className="text-yellow-400" />, delay: "1s", duration: "14s" },
    { icon: <Cpu size={20} className="text-blue-500" />, delay: "0.5s", duration: "13s" },
    { icon: <Server size={20} className="text-blue-200" />, delay: "2s", duration: "16s" },
    { icon: <RefreshCw size={20} className="text-emerald-400" />, delay: "2.5s", duration: "15s" },
    { icon: <Shield size={20} className="text-violet-400" />, delay: "3s", duration: "17s" }
  ];
  
  return (
    <>
      {icons.map((item, index) => (
        <div 
          key={index}
          className={`absolute animate-float opacity-70 ${className || ''}`}
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: item.delay,
            animationDuration: item.duration
          }}
        >
          {item.icon}
        </div>
      ))}
    </>
  );
};

export default FloatingIcons;
