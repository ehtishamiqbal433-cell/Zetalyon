import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Network, ShieldAlert, FileText, Box, Bluetooth, Lock } from 'lucide-react';
import { simulationService } from '../services/simulationService.ts';
import { SystemResource, ComplianceLog, ProximityData } from '../types.ts';

export const SystemTelemetry: React.FC = () => {
  const [resources, setResources] = useState<SystemResource>({ cpu: 0, memory: 0, disk: 0, networkTx: 0, networkRx: 0 });
  const [logs, setLogs] = useState<ComplianceLog[]>([]);
  const [proximity, setProximity] = useState<ProximityData>({ linkedDevice: 'iPhone 14 Pro', distanceMeters: 1.2, status: 'secure', connectionType: 'BLE' });
  const [isolationStatus, setIsolationStatus] = useState<'secure' | 'isolating' | 'quarantined'>('secure');

  useEffect(() => {
    setResources(simulationService.generateSystemResource());
    setLogs(simulationService.generateComplianceLogs(6));

    const interval = setInterval(() => {
      setResources(simulationService.generateSystemResource());
      setProximity(simulationService.generateProximityData());
      
      if (Math.random() > 0.7) {
        setLogs(prev => [simulationService.generateComplianceLogs(1)[0], ...prev].slice(0, 10));
      }

      // Simulate random container isolation/quarantine event
      if (Math.random() > 0.95 && isolationStatus === 'secure') {
        setIsolationStatus('isolating');
        setTimeout(() => setIsolationStatus('quarantined'), 2000);
        setTimeout(() => setIsolationStatus('secure'), 8000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isolationStatus]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <Server className="mr-3 text-zeta-accent" size={32} />
            System Telemetry & Infrastructure
          </h2>
          <p className="text-gray-400 mt-1">Hardware metrics, container isolation, and compliance logging.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResourceGauge icon={<Cpu />} label="CPU Usage" value={resources.cpu} unit="%" />
        <ResourceGauge icon={<Server />} label="Memory (RAM)" value={resources.memory} unit="%" />
        <ResourceGauge icon={<HardDrive />} label="Disk I/O" value={resources.disk} unit="%" />
        
        {/* Cross-Device Proximity Authorization */}
        <div className={`border rounded-xl p-5 shadow-lg flex flex-col justify-center transition-colors ${
          proximity.status === 'secure' ? 'bg-zeta-800 border-gray-800' :
          proximity.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/50' :
          'bg-zeta-alert/10 border-zeta-alert/50'
        }`}>
          <div className="flex items-center text-gray-400 mb-2">
            <Bluetooth size={16} className="mr-2 text-blue-400" /> 
            Proximity Auth
          </div>
          <div className="text-sm font-bold text-white truncate">{proximity.linkedDevice}</div>
          <div className="flex justify-between items-end mt-2">
            <div className="text-xs font-mono text-gray-400">{proximity.distanceMeters.toFixed(1)}m away</div>
            <div className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
              proximity.status === 'secure' ? 'bg-zeta-safe/20 text-zeta-safe' :
              proximity.status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
              'bg-zeta-alert/20 text-zeta-alert'
            }`}>
              {proximity.status}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network-Layer Decoupled Quarantining */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Box className="mr-2 text-purple-400" size={18} />
            Network-Layer Decoupled Quarantining
          </h3>
          <p className="text-xs text-gray-400 mb-6">
            If a session's continuous trust score drops to zero, a Google Cloud Function automatically isolates that user's microservice container environment into a read-only VPC segment.
          </p>
          
          <div className={`p-6 rounded-xl border-2 text-center transition-all duration-500 ${
            isolationStatus === 'secure' ? 'border-zeta-safe/50 bg-zeta-safe/5' :
            isolationStatus === 'isolating' ? 'border-yellow-500 bg-yellow-500/10 animate-pulse' :
            'border-zeta-alert bg-zeta-alert/10'
          }`}>
            {isolationStatus === 'secure' && (
              <>
                <ShieldAlert className="mx-auto text-zeta-safe mb-2" size={32} />
                <div className="text-zeta-safe font-mono font-bold">ALL CONTAINERS SECURE</div>
                <div className="text-xs text-gray-500 mt-1">Lateral movement paths open (trusted)</div>
              </>
            )}
            {isolationStatus === 'isolating' && (
              <>
                <Box className="mx-auto text-yellow-500 mb-2 animate-spin" size={32} />
                <div className="text-yellow-500 font-mono font-bold">ISOLATING COMPROMISED CONTAINER...</div>
                <div className="text-xs text-gray-500 mt-1">Executing Cloud Function hook</div>
              </>
            )}
            {isolationStatus === 'quarantined' && (
              <>
                <Lock className="mx-auto text-zeta-alert mb-2" size={32} />
                <div className="text-zeta-alert font-mono font-bold">VPC QUARANTINE ACTIVE</div>
                <div className="text-xs text-gray-500 mt-1">Session moved to read-only segment. Socket maintained.</div>
              </>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800">
            <h4 className="text-sm font-medium text-white mb-2 flex items-center">
              <Network className="mr-2 text-blue-400" size={14} />
              Local Network P2P Asset Streaming
            </h4>
            <div className="flex justify-between items-center bg-zeta-900 p-3 rounded border border-gray-700">
              <span className="text-xs text-gray-400">WebRTC Swarm Status</span>
              <span className="text-xs font-mono text-zeta-safe">ACTIVE (12 Peers)</span>
            </div>
          </div>
        </div>

        {/* Live Compliance-Mapping Logs */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FileText className="mr-2 text-green-400" size={18} />
            Live Compliance-Mapping Logs
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Firestore data telemetry automatically compiled and formatted to meet international standards (NIST SP 800-207, NIS2, ISO 27001).
          </p>
          <div className="flex-1 overflow-y-auto bg-zeta-900 rounded-lg border border-gray-700 p-2 space-y-2">
            {logs.map(log => (
              <div key={log.id} className="p-2 border-b border-gray-800 last:border-0">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-gray-500 font-mono">{log.timestamp.toLocaleTimeString()} | {log.id}</span>
                  <span className={`text-[10px] font-bold px-1.5 rounded ${log.status === 'PASS' ? 'bg-zeta-safe/20 text-zeta-safe' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {log.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-blue-400 mt-1">{log.framework} - Control {log.control}</div>
                <div className="text-xs text-gray-300 mt-0.5">{log.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourceGauge = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: number, unit: string }) => (
  <div className="bg-zeta-800 border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col justify-center relative overflow-hidden">
    <div className="flex items-center text-gray-400 mb-2">
      {React.cloneElement(icon as React.ReactElement, { size: 16, className: 'mr-2' })}
      {label}
    </div>
    <div className="text-3xl font-mono font-bold text-white">
      {value.toFixed(1)}<span className="text-lg text-gray-500 ml-1">{unit}</span>
    </div>
    <div className="absolute bottom-0 left-0 h-1 bg-gray-700 w-full">
      <div className={`h-full ${value > 80 ? 'bg-zeta-alert' : value > 60 ? 'bg-yellow-500' : 'bg-zeta-safe'}`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);
