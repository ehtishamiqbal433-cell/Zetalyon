import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar, LineChart, Line, ReferenceLine, AreaChart, Area } from 'recharts';
import { ShieldAlert, Network, Globe, Crosshair, Users, Shield, Activity, Database, BrainCircuit } from 'lucide-react';
import { simulationService } from '../services/simulationService.ts';
import { AnomalyCluster, IPSwarm, TTPEvent, ThreatFeedIndicator, PredictiveRiskData } from '../types.ts';

export const ThreatMapView: React.FC = () => {
  const [clusters, setClusters] = useState<AnomalyCluster[]>([]);
  const [ipSwarms, setIpSwarms] = useState<IPSwarm[]>([]);
  const [ttpEvents, setTtpEvents] = useState<TTPEvent[]>([]);
  const [threatFeeds, setThreatFeeds] = useState<ThreatFeedIndicator[]>([]);
  const [predictiveRisk, setPredictiveRisk] = useState<PredictiveRiskData[]>([]);

  useEffect(() => {
    setClusters(simulationService.generateAnomalyClusters());
    setIpSwarms(simulationService.generateIPSwarms());
    setTtpEvents(simulationService.generateTTPEvents(4));
    setThreatFeeds(simulationService.generateThreatFeeds(4));
    setPredictiveRisk(simulationService.generatePredictiveRiskData(20));

    const interval = setInterval(() => {
      setClusters(prev => prev.map(c => ({
        ...c,
        x: Math.max(0, Math.min(100, c.x + (Math.random() - 0.5) * 2)),
        y: Math.max(0, Math.min(100, c.y + (Math.random() - 0.5) * 2))
      })));

      if (Math.random() > 0.5) setIpSwarms(simulationService.generateIPSwarms());
      if (Math.random() > 0.7) setTtpEvents(prev => [simulationService.generateTTPEvents(1)[0], ...prev].slice(0, 6));
      if (Math.random() > 0.6) setThreatFeeds(prev => [simulationService.generateThreatFeeds(1)[0], ...prev].slice(0, 5));
      
      setPredictiveRisk(prev => [...prev.slice(1), simulationService.generatePredictiveRiskData(1)[0]]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getClusterColor = (type: string) => {
    switch(type) {
      case 'normal': return '#00f0ff';
      case 'suspicious': return '#eab308';
      case 'malicious': return '#ff003c';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <Globe className="mr-3 text-zeta-alert" size={32} />
            Advanced Global Threat Intelligence
          </h2>
          <p className="text-gray-400 mt-1">Decentralized multi-tenant risk orchestration and polymorphic TTP mapping.</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-zeta-800 border border-gray-700 px-4 py-2 rounded-lg flex items-center">
            <Users className="text-blue-400 mr-2" size={18} />
            <div>
              <div className="text-[10px] text-gray-500 uppercase">Cross-Tenant Sync</div>
              <div className="text-sm font-mono text-white">ACTIVE (14ms lag)</div>
            </div>
          </div>
          <div className="bg-zeta-800 border border-gray-700 px-4 py-2 rounded-lg flex items-center">
            <Shield className="text-zeta-safe mr-2" size={18} />
            <div>
              <div className="text-[10px] text-gray-500 uppercase">Token-Theft Invalidation</div>
              <div className="text-sm font-mono text-white">ENFORCING</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adaptive Predictive Risk Engine */}
        <div className="lg:col-span-2 bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <BrainCircuit size={18} className="mr-2 text-zeta-accent" />
              Adaptive Predictive Risk Engine (EMA & Bayesian Inference)
            </h3>
            <div className="flex space-x-3 text-xs font-mono">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div> Raw Anomaly</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-purple-400 mr-1"></div> EMA Momentum</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-zeta-alert mr-1"></div> Final Predictive Risk</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Calculates risk using Temporal Decay (EMA), Hardware-Contextual Anchoring, and Bayesian Inference Threat-Weighting. Executes in &lt;5ms.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictiveRisk} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tick={false} />
                <YAxis stroke="#4b5563" fontSize={12} domain={[0, 1.0]} tickFormatter={(val) => val.toFixed(1)} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                <ReferenceLine y={0.8} stroke="#ff003c" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Honeypot Threshold (0.80)', fill: '#ff003c', fontSize: 10 }} />
                
                <Line type="monotone" dataKey="rawAnomaly" name="Raw Anomaly" stroke="#60a5fa" strokeWidth={1} dot={false} isAnimationActive={false} opacity={0.5} />
                <Line type="monotone" dataKey="emaMomentum" name="EMA Momentum" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="finalPredictiveRisk" name="Final Predictive Risk" stroke="#ff003c" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live External Threat Feeds */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Database size={18} className="mr-2 text-yellow-400" />
            Live External Threat Feeds
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Asynchronous queries to IP Reputation and OWASP AST10 endpoints. Cached locally for 5 minutes to maintain &lt;20ms execution times.
          </p>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {threatFeeds.map((feed) => (
              <div key={feed.id} className="p-3 rounded-lg border bg-zeta-900 border-gray-700">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">{feed.source}</span>
                  <span className="text-[10px] font-mono text-zeta-alert">+{((feed.riskMultiplier - 1) * 100).toFixed(0)}% RISK</span>
                </div>
                <div className="text-sm font-medium text-white truncate">{feed.indicator}</div>
                <div className="text-[10px] text-gray-500 mt-1">ID: {feed.id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertex AI Clusters */}
        <div className="lg:col-span-2 bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ShieldAlert size={18} className="mr-2 text-zeta-alert" />
              Vertex AI Context Pipeline - Anomaly Clusters
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" dataKey="x" name="Behavioral Variance" stroke="#4b5563" fontSize={12} tick={false} />
                <YAxis type="number" dataKey="y" name="Network Anomaly Score" stroke="#4b5563" fontSize={12} tick={false} />
                <ZAxis type="number" dataKey="z" range={[20, 400]} name="Threat Severity" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                <Scatter name="Sessions" data={clusters} animationDuration={500}>
                  {clusters.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getClusterColor(entry.type)} opacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Polymorphic TTP Mapping */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Crosshair size={18} className="mr-2 text-purple-400" />
            Polymorphic TTP Mapping
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Real-time mapping of shifting attacker Tactics, Techniques, and Procedures across the decentralized tenant network.
          </p>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {ttpEvents.map((ttp) => (
              <div key={ttp.id} className="p-3 rounded-lg border bg-zeta-900 border-gray-700">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-mono text-gray-300">{ttp.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                    ttp.severity === 'critical' ? 'bg-zeta-alert/20 text-zeta-alert' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {ttp.severity}
                  </span>
                </div>
                <div className="text-sm font-medium text-white">{ttp.technique}</div>
                <div className="text-[10px] text-gray-500 mt-1">Tactic: {ttp.tactic}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Autonomous IP-Swarms Bounding */}
        <div className="lg:col-span-3 bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Network size={18} className="mr-2 text-blue-400" />
            Autonomous IP-Swarms Bounding
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Dynamic isolation of coordinated distributed attacks. Swarms are bounded and routed to Generative AI Honey-Pots.
          </p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ipSwarms} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" stroke="#4b5563" fontSize={12} />
                <YAxis dataKey="origin" type="category" stroke="#4b5563" fontSize={12} width={120} />
                <Tooltip cursor={{ fill: '#1f2937' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                <Bar dataKey="volume" name="Request Volume" fill="#00f0ff" radius={[0, 4, 4, 0]}>
                  {ipSwarms.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'blocked' ? '#ff003c' : '#00f0ff'} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
