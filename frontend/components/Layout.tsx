import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, ShieldAlert, BookOpen, Settings, Cpu, TrendingUp, UserCircle, Server, Scale, FileCode, Network, Database } from 'lucide-react';
import { RoutePaths } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: RoutePaths.DASHBOARD, icon: <Activity size={20} />, label: 'Command Center' },
    { path: RoutePaths.EXECUTIVE, icon: <TrendingUp size={20} />, label: 'Executive Analytics' },
    { path: RoutePaths.USER_PORTAL, icon: <UserCircle size={20} />, label: 'User Portal' },
    { path: RoutePaths.BIOMETRICS, icon: <Cpu size={20} />, label: 'Biometric Engine' },
    { path: RoutePaths.THREAT_MAP, icon: <ShieldAlert size={20} />, label: 'Threat Intelligence' },
    { path: RoutePaths.VERTEX_PIPELINE, icon: <Database size={20} />, label: 'Vertex AI Pipeline' },
    { path: RoutePaths.CYBER_RANGE, icon: <Network size={20} />, label: 'Cyber Range Sandbox' },
    { path: RoutePaths.SYSTEM_TELEMETRY, icon: <Server size={20} />, label: 'System Telemetry' },
    { path: RoutePaths.SETTINGS, icon: <Settings size={20} />, label: 'System Config' },
    { path: RoutePaths.CODE_HARDENING, icon: <FileCode size={20} />, label: 'Code Hardening' },
    { path: RoutePaths.DOCUMENTATION, icon: <BookOpen size={20} />, label: 'Documentation' },
    { path: RoutePaths.LICENSE, icon: <Scale size={20} />, label: 'Software IP & License' },
  ];

  return (
    <div className="flex h-screen bg-zeta-900 text-gray-300 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zeta-800 border-r border-gray-800 flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <div className="relative">
            <Shield className="text-zeta-accent" size={32} />
            <div className="absolute inset-0 bg-zeta-accent blur-md opacity-30 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider">ZETALYON</h1>
            <p className="text-xs text-zeta-accent font-mono">ZERO-TRUST CORE</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-zeta-700 text-zeta-accent border-l-2 border-zeta-accent' 
                    : 'hover:bg-zeta-700/50 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="bg-zeta-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">System Status</span>
              <div className="h-2 w-2 rounded-full bg-zeta-safe animate-pulse"></div>
            </div>
            <div className="text-sm font-mono text-zeta-safe">PERFECT SHIELD ACTIVE</div>
            <div className="text-xs text-gray-500 mt-1">v2.5.0-quantum</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top decorative bar */}
        <div className="h-1 w-full bg-gradient-to-r from-zeta-900 via-zeta-accent to-zeta-900 opacity-50"></div>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
