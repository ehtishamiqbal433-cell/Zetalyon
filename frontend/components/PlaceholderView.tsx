import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in">
      <div className="bg-zeta-800 p-8 rounded-2xl border border-gray-800 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zeta-accent to-transparent opacity-50"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-zeta-accent/5 rounded-full blur-3xl"></div>
        
        <AlertCircle className="mx-auto text-gray-500 mb-6" size={48} />
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 text-sm mb-6">
          This module is currently operating in stealth mode or requires elevated clearance to view detailed telemetry.
        </p>
        
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-zeta-900 border border-gray-700 text-xs font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
          Module Active - UI Restricted
        </div>
      </div>
    </div>
  );
};
