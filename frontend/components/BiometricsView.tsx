import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, AreaChart, Area, ComposedChart, Bar } from 'recharts';
import { Fingerprint, MousePointer2, Eye, Waves, Activity, Key, Smartphone, Keyboard, Mouse } from 'lucide-react';
import { simulationService } from '../services/simulationService.ts';
import { TrajectoryPoint, GazeDataPoint, TremorData, CadenceData, PeripheralData } from '../types.ts';

export const BiometricsView: React.FC = () => {
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryPoint[]>([]);
  const [gazeData, setGazeData] = useState<GazeDataPoint[]>([]);
  const [tremorData, setTremorData] = useState<TremorData[]>([]);
  const [cadenceData, setCadenceData] = useState<CadenceData[]>([]);
  const [peripheral, setPeripheral] = useState<PeripheralData>({ deviceType: 'Trackpad', pollingRateHz: 125, precisionDpi: 400, isBaselineMatch: true });
  const [confidence, setConfidence] = useState(99.2);
  const [stepUpActive, setStepUpActive] = useState(false);

  useEffect(() => {
    setTrajectoryData(simulationService.generateTrajectoryData(50));
    setGazeData(simulationService.generateGazeData(40));
    setTremorData(simulationService.generateTremorData(20));
    setCadenceData(simulationService.generateCadenceData());

    const interval = setInterval(() => {
      setTrajectoryData(prev => [...prev.slice(5), ...simulationService.generateTrajectoryData(5)].map((p, i) => ({ ...p, time: i })));
      setGazeData(prev => [...prev.slice(4), ...simulationService.generateGazeData(4)].map((p, i) => ({ ...p, time: i })));
      setTremorData(prev => [...prev.slice(1), simulationService.generateTremorData(1)[0]]);
      
      if (Math.random() > 0.7) setCadenceData(simulationService.generateCadenceData());
      if (Math.random() > 0.9) setPeripheral(simulationService.generatePeripheralData());
      
      const newConf = Math.max(80, Math.min(99.9, confidence + (Math.random() - 0.4)));
      setConfidence(newConf);

      // Trigger inline step-up if confidence drops
      if (newConf < 85 && !stepUpActive) {
        setStepUpActive(true);
        setTimeout(() => {
          setStepUpActive(false);
          setConfidence(98.5); // Reset after successful challenge
        }, 4000);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [confidence, stepUpActive]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Inline Frictionless Step-Up Overlay */}
      {stepUpActive && (
        <div className="absolute top-4 right-4 z-50 bg-zeta-800 border border-zeta-accent p-4 rounded-xl shadow-2xl flex items-center space-x-4 animate-in slide-in-from-top-4">
          <div className="bg-zeta-accent/20 p-2 rounded-full">
            <Key className="text-zeta-accent animate-pulse" size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Minor Drift Detected</div>
            <div className="text-xs text-gray-400">Please tap your FIDO2 security key...</div>
          </div>
        </div>
      )}

      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <Fingerprint className="mr-3 text-zeta-accent" size={32} />
            Advanced Biometric Telemetry
          </h2>
          <p className="text-gray-400 mt-1">Multi-modal sensor fusion, mouse trajectory, and keystroke dynamics.</p>
        </div>
        <div className="text-right bg-zeta-800 p-4 rounded-xl border border-gray-800">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Identity Confidence</div>
          <div className={`text-3xl font-mono font-bold flex items-center justify-end ${confidence < 85 ? 'text-yellow-500' : 'text-zeta-safe'}`}>
            {confidence.toFixed(2)}%
            <Activity className={`ml-2 ${confidence < 85 ? 'text-yellow-500' : 'text-zeta-safe'} animate-pulse`} size={24} />
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zeta-900 border border-gray-800 p-4 rounded-lg flex flex-col justify-center">
          <span className="text-xs text-gray-400 mb-1">Kinematic Perturbation Decoy</span>
          <span className="text-sm font-mono text-zeta-safe">DEPLOYED</span>
        </div>
        <div className="bg-zeta-900 border border-gray-800 p-4 rounded-lg flex flex-col justify-center">
          <span className="text-xs text-gray-400 mb-1">Decoupled Multi-Channel Trust</span>
          <span className="text-sm font-mono text-blue-400 flex items-center"><Smartphone size={14} className="mr-1"/> VERIFIED</span>
        </div>
        <div className="bg-zeta-900 border border-gray-800 p-4 rounded-lg flex flex-col justify-center">
          <span className="text-xs text-gray-400 mb-1">Continuous Step-Up Engine</span>
          <span className="text-sm font-mono text-zeta-safe">ACTIVE (Frictionless)</span>
        </div>
        <div className="bg-zeta-900 border border-gray-800 p-4 rounded-lg flex flex-col justify-center">
          <span className="text-xs text-gray-400 mb-1">Hardware Event Dispatch</span>
          <span className="text-sm font-mono text-zeta-safe">ANTI-FRIDA SECURE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Peripheral Interface Analysis */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Mouse size={18} className="mr-2 text-green-400" />
            Peripheral Interface Analysis
          </h3>
          <p className="text-xs text-gray-400 mb-4">Monitors mechanical hardware changes to prevent false-positive flags from sudden polling rate spikes.</p>
          <div className={`flex-1 rounded-lg border p-4 flex flex-col justify-center items-center text-center transition-colors ${peripheral.isBaselineMatch ? 'bg-zeta-900 border-gray-700' : 'bg-yellow-500/10 border-yellow-500/50'}`}>
            <div className="text-sm text-gray-400 uppercase mb-2">Active Input Device</div>
            <div className={`text-xl font-bold font-mono mb-2 ${peripheral.isBaselineMatch ? 'text-white' : 'text-yellow-500'}`}>
              {peripheral.deviceType}
            </div>
            <div className="flex space-x-4 text-xs font-mono text-gray-400">
              <span>{peripheral.pollingRateHz} Hz Polling</span>
              <span>{peripheral.precisionDpi} DPI</span>
            </div>
            {!peripheral.isBaselineMatch && (
              <div className="mt-4 text-[10px] text-yellow-500 uppercase tracking-wider animate-pulse">
                Baseline Model Updating...
              </div>
            )}
          </div>
        </div>

        {/* Keystroke Flight-Time Matrix */}
        <div className="lg:col-span-2 bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Keyboard size={18} className="mr-2 text-purple-400" />
              Keystroke Flight-Time Matrix Modeling
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Maps key-down duration (Dwell) and transition delay between keys (Flight). Builds a physical profile software macros cannot recreate.
          </p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cadenceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="keyPair" stroke="#4b5563" fontSize={12} />
                <YAxis stroke="#4b5563" fontSize={12} label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#4b5563' }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                <Bar dataKey="dwellTime" name="Dwell Time" fill="#a855f7" radius={[2, 2, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="flightTime" name="Flight Time" stroke="#00f0ff" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mouse Trajectory Analysis */}
        <div className="lg:col-span-2 bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <MousePointer2 size={18} className="mr-2 text-zeta-accent" />
              Mouse Trajectory Analysis & Kalman Filter
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tick={false} />
                <YAxis stroke="#4b5563" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} labelStyle={{ display: 'none' }} />
                <Line type="monotone" dataKey="rawY" name="Raw Input (Y)" stroke="#ff003c" strokeWidth={1} dot={false} isAnimationActive={false} opacity={0.6} />
                <Line type="monotone" dataKey="kalmanY" name="Kalman Smoothed (Y)" stroke="#00f0ff" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
        </div>
        </div>

        {/* Micro-Saccade & Eye Gaze */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Eye size={18} className="mr-2 text-blue-400" />
              Micro-Saccade & Gaze Jitter Mapping
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" dataKey="x" name="Screen X" stroke="#4b5563" fontSize={12} tick={false} />
                <YAxis type="number" dataKey="y" name="Screen Y" stroke="#4b5563" fontSize={12} tick={false} />
                <ZAxis type="number" dataKey="saccadeVelocity" range={[10, 200]} name="Velocity" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                <Scatter name="Gaze Points" data={gazeData} fill="#00f0ff" opacity={0.6} animationDuration={300} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
