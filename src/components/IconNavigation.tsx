
import React from 'react';
import { Link } from 'react-router-dom';
import { Map, BarChart, Cpu } from 'lucide-react';

const IconNavigation = () => {
  return (
    <div className="flex items-center space-x-2 p-2 bg-black/60 backdrop-blur-md rounded-full border border-blue-500/20">
      <Link to="/" className="p-2 hover:bg-blue-500/20 rounded-full transition-colors">
        <Map className="h-5 w-5 text-blue-400" />
      </Link>
      <Link to="/analytics" className="p-2 hover:bg-blue-500/20 rounded-full transition-colors">
        <BarChart className="h-5 w-5 text-blue-400" />
      </Link>
      <button className="p-2 hover:bg-blue-500/20 rounded-full transition-colors">
        <Cpu className="h-5 w-5 text-blue-400" />
      </button>
    </div>
  );
};

export default IconNavigation;
