import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { ShieldCheck, Activity, Lock, Zap, Cpu, Database, Bot, ServerCrash, Eye } from 'lucide-react';
import { simulationService } from '../services/simulationService.ts';
import { TrustDataPoint, SecurityEvent, SystemStatus, VertexPrediction } from '../types.ts';

export const Dashboard: React.FC = () => {
  const [trustData, setTrustData] = useState<TrustDataPoint[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [predictions, setPredictions] = useState<VertexPrediction[]>([]);
  const [currentScore, setCurrentScore] = useState(98.5);
  const [isHoneyPotActive, setIsHoneyPotActive] = useState(false);

  useEffect(() => {
    setTrustData(simulationService.generateTrustData(20));
    setEvents(Array.from({ length: 5 }, () => simulationService.generateRandomEvent()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    setPredictions(simulationService.generateVertexPredictions(6));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrustData(prev => {
        const newData = simulationService.generateTrustData(1)[0];
        setCurrentScore(newData.score);
        
        // Trigger Honey-Pot UI if score drops below 25 (Risk > 0.75)
        if (newData.score < 25) {
          setIsHoneyPotActive(true);
        } else {
          setIsHoneyPotActive(false);
        }

        return [...prev.slice(1), newData];
      });

      if (Math.random() > 0.6) {
        setEvents(prev => [simulationService.generateRandomEvent(), ...prev].slice(0, 50));
      }

      // High-frequency Vertex AI prediction updates
      setPredictions(prev => [simulationService.generateVertexPredictions(1)[0], ...prev].slice(0, 8));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const systemModules: SystemStatus[] = [
    { moduleName: 'Vertex AI Online Prediction', status: 'active', uptime: '99.99%' },
    { moduleName: 'PQC Session Binding', status: 'active', uptime: '100%' },
    { moduleName: 'Generative AI Canary (Bot Trap)', status: 'active', uptime: '99.98%' },
    { moduleName: 'Self-Healing Segment Isolation', status: 'healing', uptime: '99.95%' },
    { moduleName: 'Polymorphic Route Mutator', status: 'active', uptime: '100%' },
  ];

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 transition-colors ${isHoneyPotActive ? 'ring-4 ring-zeta-alert/50 rounded-xl p-2' : ''}`}>
      
      {isHoneyPotActive && (
        <div className="bg-zeta-alert/20 border border-zeta-alert p-4 rounded-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center">
            <Eye className="text-zeta-alert mr-3" size={24} />
            <div>
              <h3 className="text-zeta-alert font-bold font-mono">GENERATIVE HONEY-POT UI ACTIVE</h3>
              <p className="text-xs text-gray-300">Critical trust collapse detected. Session routed to synthetic deception environment.</p>
            </div>
          </div>
        </div>
      )}

      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Command Center</h2>
          <p className="text-gray-400 mt-1">Real-time behavioral telemetry and Vertex AI threat mitigation.</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center px-3 py-1.5 bg-zeta-900 border border-zeta-safe/30 rounded-full">
            <Lock size={14} className="text-zeta-safe mr-2" />
            <span className="text-xs font-mono text-zeta-safe">PQC Binding Active</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 uppercase tracking-wider">Global Trust Score</div>
            <div className={`text-3xl font-mono font-bold ${currentScore > 90 ? 'text-zeta-safe' : currentScore > 50 ? 'text-yellow-500' : 'text-zeta-alert'}`}>
              {currentScore.toFixed(1)}%
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<ShieldCheck className="text-zeta-safe" />} title="Threats Blocked (24h)" value="14,205" trend="+12%" />
        <StatCard icon={<Database className="text-zeta-accent" />} title="Vertex Inferences/sec" value="8,492" trend="14ms avg latency" />
        <StatCard icon={<Bot className="text-purple-400" />} title="Canary Traps Sprung" value="892" trend="+5/min" />
        <StatCard icon={<ServerCrash className="text-blue-400" />} title="Segments Isolated" value="3" trend="Self-Healing" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Activity size={18} className="mr-2 text-zeta-accent" />
              Continuous Trust Evaluation
            </h3>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="flex items-center"><div className="w-2 h-2 bg-zeta-accent rounded-full mr-1"></div> Score</span>
              <span className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div> Threshold</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trustData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isHoneyPotActive ? '#ff003c' : '#00f0ff'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isHoneyPotActive ? '#ff003c' : '#00f0ff'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tickMargin={10} />
                <YAxis domain={[0, 100]} stroke="#4b5563" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} itemStyle={{ color: isHoneyPotActive ? '#ff003c' : '#00f0ff' }} />
                <ReferenceLine y={85} stroke="#ff003c" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Step-Up Threshold', fill: '#ff003c', fontSize: 10 }} />
                <Area type="monotone" dataKey="score" stroke={isHoneyPotActive ? '#ff003c' : '#00f0ff'} strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Cpu size={18} className="mr-2 text-gray-400" />
            Engine Modules
          </h3>
          <div className="space-y-3 flex-1">
            {systemModules.map((mod, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-zeta-900 rounded-lg border border-gray-800/50">
                <div>
                  <div className="text-sm font-medium text-gray-200">{mod.moduleName}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">Uptime: {mod.uptime}</div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider ${
                  mod.status === 'active' ? 'bg-zeta-safe/10 text-zeta-safe border border-zeta-safe/20' : 
                  mod.status === 'healing' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse' :
                  'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                }`}>
                  {mod.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertex AI Online Prediction Feed */}
      <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Database size={18} className="mr-2 text-zeta-accent" />
            Vertex AI Online Prediction Pipeline
          </h3>
          <span className="text-xs font-mono text-gray-400 flex items-center">
            <span className="w-2 h-2 bg-zeta-safe rounded-full mr-2 animate-pulse"></span>
            Live Inference Stream
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-zeta-900 border-b border-gray-800">
              <tr>
                <th className="px-4 py-3 font-mono">Prediction ID</th>
                <th className="px-4 py-3 font-mono">Entity ID</th>
                <th className="px-4 py-3 font-mono">Primary Feature</th>
                <th className="px-4 py-3 font-mono">Latency</th>
                <th className="px-4 py-3 font-mono">Risk Score</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {predictions.map((pred) => (
                <tr key={pred.id} className="border-b border-gray-800/50 hover:bg-zeta-700/30 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{pred.id}</td>
                  <td className="px-4 py-3 text-gray-400">{pred.entityId}</td>
                  <td className="px-4 py-3 text-blue-400">{pred.primaryFeature}</td>
                  <td className="px-4 py-3 text-gray-400">{pred.latencyMs.toFixed(1)}ms</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] ${
                      pred.riskScore > 85 ? 'bg-zeta-alert/20 text-zeta-alert' : 'bg-zeta-safe/20 text-zeta-safe'
                    }`}>
                      {pred.riskScore.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, trend }: { icon: React.ReactNode, title: string, value: string, trend: string }) => (
  <div className="bg-zeta-800 border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:bg-zeta-accent/10 transition-all"></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="p-2 bg-zeta-900 rounded-lg border border-gray-700">{icon}</div>
      <span className={`text-xs font-mono ${trend.includes('+') || trend.includes('Optimal') || trend.includes('Self') ? 'text-zeta-safe' : 'text-gray-400'}`}>
        {trend}
      </span>
    </div>
    <div className="relative z-10">
      <h4 className="text-gray-400 text-sm font-medium mb-1">{title}</h4>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
    </div>
  </div>
);
