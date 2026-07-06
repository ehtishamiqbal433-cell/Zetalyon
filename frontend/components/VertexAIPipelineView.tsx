import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, ReferenceLine } from 'recharts';
import { Database, Network, RefreshCw, Target, Activity, ShieldAlert, Zap } from 'lucide-react';
import { simulationService } from '../services/simulationService.ts';
import { VertexClusterPoint, VertexRetrainingEvent, VertexIngestionMetric } from '../types.ts';

export const VertexAIPipelineView: React.FC = () => {
  const [clusterPoints, setClusterPoints] = useState<VertexClusterPoint[]>([]);
  const [retrainingEvents, setRetrainingEvents] = useState<VertexRetrainingEvent[]>([]);
  const [ingestionMetrics, setIngestionMetrics] = useState<VertexIngestionMetric[]>([]);

  useEffect(() => {
    setClusterPoints(simulationService.generateVertexClusterPoints(150));
    setRetrainingEvents(simulationService.generateVertexRetrainingEvents(5));
    setIngestionMetrics(simulationService.generateVertexIngestionMetrics(30));

    const interval = setInterval(() => {
      // Jitter points slightly to simulate live clustering
      setClusterPoints(prev => prev.map(p => ({
        ...p,
        x: Math.max(0, Math.min(100, p.x + (Math.random() - 0.5) * 2)),
        y: Math.max(0, Math.min(100, p.y + (Math.random() - 0.5) * 2))
      })));

      if (Math.random() > 0.7) {
        setRetrainingEvents(prev => [simulationService.generateVertexRetrainingEvents(1)[0], ...prev].slice(0, 8));
      }

      setIngestionMetrics(prev => [...prev.slice(1), simulationService.generateVertexIngestionMetrics(1)[0]]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getClusterColor = (cluster: string) => {
    switch(cluster) {
      case 'Core': return '#00ff66'; // zeta-safe
      case 'Drift': return '#eab308'; // yellow-500
      case 'Outlier': return '#ff003c'; // zeta-alert
      default: return '#6b7280';
    }
  };

  const currentLatency = ingestionMetrics.length > 0 ? ingestionMetrics[ingestionMetrics.length - 1].latencyMs : 0;
  const currentThroughput = ingestionMetrics.length > 0 ? ingestionMetrics[ingestionMetrics.length - 1].throughput : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <Database className="mr-3 text-zeta-accent" size={32} />
            Vertex AI Context Pipeline
          </h2>
          <p className="text-gray-400 mt-1">Unsupervised Anomaly Clustering & Automated Retraining.</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-zeta-800 border border-gray-700 px-4 py-2 rounded-lg flex items-center">
            <Network className="text-blue-400 mr-2" size={18} />
            <div>
              <div className="text-[10px] text-gray-500 uppercase">Pub/Sub Stream</div>
              <div className="text-sm font-mono text-white">ACTIVE</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center text-gray-400 mb-2">
            <Zap size={16} className="mr-2 text-yellow-400" />
            Ingestion Latency
          </div>
          <div className="text-3xl font-mono font-bold text-white">
            {currentLatency.toFixed(1)}<span className="text-lg text-gray-500 ml-1">ms</span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-gray-700 w-full">
            <div className={`h-full ${currentLatency > 50 ? 'bg-zeta-alert' : 'bg-zeta-safe'}`} style={{ width: `${Math.min(100, (currentLatency / 50) * 100)}%` }}></div>
          </div>
        </div>

        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col justify-center">
          <div className="flex items-center text-gray-400 mb-2">
            <Activity size={16} className="mr-2 text-blue-400" />
            Feature Store Throughput
          </div>
          <div className="text-3xl font-mono font-bold text-white">
            {(currentThroughput / 1000).toFixed(1)}<span className="text-lg text-gray-500 ml-1">k/sec</span>
          </div>
        </div>

        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col justify-center">
          <div className="flex items-center text-gray-400 mb-2">
            <Target size={16} className="mr-2 text-purple-400" />
            Active Clustering Model
          </div>
          <div className="text-xl font-bold text-white">HDBSCAN / Isolation Forest</div>
          <div className="text-xs text-zeta-safe font-mono mt-1">Serverless Pipeline Running</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unsupervised Clustering Engine */}
        <div className="lg:col-span-2 bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Target size={18} className="mr-2 text-zeta-accent" />
              Unsupervised Clustering Engine (HDBSCAN)
            </h3>
            <div className="flex space-x-3 text-xs font-mono">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-zeta-safe mr-1"></div> Core</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div> Drift</span>
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-zeta-alert mr-1"></div> Outlier</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            High-dimensional spatial-temporal inputs grouped into operational clusters. Core = Validated Human, Drift = Benign Fatigue, Outlier = High-Risk Script/Bot.
          </p>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" dataKey="x" name="Feature Dim 1" stroke="#4b5563" fontSize={12} tick={{ fill: '#9ca3af' }} />
                <YAxis type="number" dataKey="y" name="Feature Dim 2" stroke="#4b5563" fontSize={12} tick={{ fill: '#9ca3af' }} />
                <ZAxis type="number" dataKey="z" range={[20, 200]} name="Feature Dim 3" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                <Scatter name="Telemetry" data={clusterPoints} animationDuration={500}>
                  {clusterPoints.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getClusterColor(entry.cluster)} opacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Automated Real-Time Model Retraining & Drift Feedback Loop */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <RefreshCw size={18} className="mr-2 text-purple-400" />
            Model Retraining & Feedback Loop
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Automated Vertex AI Model Monitoring. Silently adjusts baselines for natural drift or tags adversarial signatures for forensics.
          </p>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {retrainingEvents.map((evt) => (
              <div key={evt.id} className={`p-3 rounded-lg border ${evt.type === 'Baseline Adjusted' ? 'bg-zeta-900 border-gray-700' : 'bg-zeta-alert/10 border-zeta-alert/50'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-mono text-gray-300">{evt.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                    evt.type === 'Baseline Adjusted' ? 'bg-zeta-safe/20 text-zeta-safe' : 'bg-zeta-alert/20 text-zeta-alert'
                  }`}>
                    {evt.type}
                  </span>
                </div>
                <div className="text-sm font-medium text-white mb-1">{evt.userId}</div>
                <div className="text-[10px] text-gray-400 leading-tight">{evt.details}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Streaming Ingestion Pipeline Latency */}
        <div className="lg:col-span-3 bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Network size={18} className="mr-2 text-blue-400" />
              Streaming Ingestion Pipeline Latency (Pub/Sub to Feature Store)
            </h3>
            <span className="px-2 py-1 bg-zeta-900 border border-gray-700 text-gray-400 text-xs font-mono rounded">
              Target: &lt;50ms
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ingestionMetrics} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#4b5563" fontSize={12} domain={[0, 100]} label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#4b5563' }} tick={{ fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                <ReferenceLine y={50} stroke="#ff003c" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '50ms SLA', fill: '#ff003c', fontSize: 10 }} />
                <Line type="monotone" dataKey="latencyMs" name="Latency (ms)" stroke="#00f0ff" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
