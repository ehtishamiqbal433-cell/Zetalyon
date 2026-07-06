import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { Settings, Hash, Binary, Cpu, ToggleRight, ToggleLeft, Fingerprint, AlertTriangle, Sliders, Lock, ShieldAlert, Download, Eye, Activity } from 'lucide-react';
import { simulationService } from '../services/simulationService.ts';
import { EntropyData, ZKPCircuit, DOMHashEvent, MicroPolicyConfig, PolicySimulationData } from '../types.ts';

export const SystemConfigView: React.FC = () => {
  const [entropyData, setEntropyData] = useState<EntropyData[]>([]);
  const [zkpCircuits, setZkpCircuits] = useState<ZKPCircuit[]>([]);
  const [domEvents, setDomEvents] = useState<DOMHashEvent[]>([]);
  const [chaosMode, setChaosMode] = useState(false);
  const [keyRotationTimer, setKeyRotationTimer] = useState(300);
  
  // Granular Micro-Policy State
  const [policyConfig, setPolicyConfig] = useState<MicroPolicyConfig>({
    biometricDriftTolerance: 0.5,
    threatMultiplier: 2.0,
    frictionDecayRate: 15,
    mfaStrictness: 2
  });
  const [simulationData, setSimulationData] = useState<PolicySimulationData[]>([]);

  // Chaos Engineering Attack States
  const [attacks, setAttacks] = useState({
    cookieReplay: false,
    headlessWebDriver: false,
    deviceTheft: false
  });

  // Deception Morphing State
  const [isHoneyPotActive, setIsHoneyPotActive] = useState(false);
  
  const [toggles, setToggles] = useState({
    pqc: true,
    zkp: true,
    honeyPot: true,
    domIntegrity: true,
    llmTraps: true,
    shadowAi: true,
    localHashing: true,
    focusGuardian: true,
    roamingProfiles: true
  });

  // Debounced simulation update to prevent UI blocking
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, this would trigger an async API call to `/api/v1/policy/update`
      // and update Firestore `/infrastructure/micro_policies`
      setSimulationData(simulationService.generatePolicySimulationData(policyConfig));
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [policyConfig]);

  useEffect(() => {
    setEntropyData(simulationService.generateEntropyData(50));
    setZkpCircuits(simulationService.generateZKPCircuits(4));
    setDomEvents(simulationService.generateDOMHashEvents(5));

    const interval = setInterval(() => {
      setEntropyData(prev => [...prev.slice(5), ...simulationService.generateEntropyData(5)]);
      if (Math.random() > 0.4) setZkpCircuits(simulationService.generateZKPCircuits(4));
      if (Math.random() > 0.6) setDomEvents(prev => [simulationService.generateDOMHashEvents(1)[0], ...prev].slice(0, 8));
      
      setKeyRotationTimer(prev => {
        if (prev <= 1) return 300;
        return prev - 1;
      });

      const activeAttackList = Object.entries(attacks).filter(([_, active]) => active).map(([k]) => k);
      simulationService.setChaosAttacks(activeAttackList);
      
      if (activeAttackList.length > 0) {
        setIsHoneyPotActive(true);
      } else {
        setIsHoneyPotActive(false);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [attacks]);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAttackToggle = (key: keyof typeof attacks) => {
    setAttacks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePolicyChange = (key: keyof MicroPolicyConfig, value: number) => {
    setPolicyConfig(prev => ({ ...prev, [key]: value }));
  };

  const exportForensicPackage = () => {
    const jsonContent = simulationService.exportForensicPackage();
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `forensic_evidence_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 transition-colors ${isHoneyPotActive ? 'ring-4 ring-zeta-alert/50 rounded-xl p-2' : ''}`}>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <Settings className="mr-3 text-zeta-accent" size={32} />
            System Configuration & Cyber Range
          </h2>
          <p className="text-gray-400 mt-1">Manage Zero-Knowledge Proofs, Quantum Entropy, and Adversarial Simulations.</p>
        </div>
        <button 
          onClick={() => {
            setChaosMode(!chaosMode);
            if (chaosMode) setAttacks({ cookieReplay: false, headlessWebDriver: false, deviceTheft: false });
          }}
          className={`px-4 py-2 rounded-lg font-mono text-sm border transition-all ${
            chaosMode ? 'bg-zeta-alert/20 border-zeta-alert text-zeta-alert animate-pulse' : 'bg-zeta-900 border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          {chaosMode ? 'CHAOS ENGINE ACTIVE' : 'Enable Chaos Engine Sandbox'}
        </button>
      </header>

      {/* Real-Time Deception Morphing Visualizer */}
      {chaosMode && (
        <div className={`border-2 rounded-xl p-6 shadow-lg flex items-center justify-between transition-all duration-1000 ${
          isHoneyPotActive ? 'bg-zeta-alert/10 border-zeta-alert' : 'bg-zeta-800 border-gray-800'
        }`}>
          <div className="flex items-center">
            {isHoneyPotActive ? (
              <Eye className="text-zeta-alert mr-4 animate-pulse" size={32} />
            ) : (
              <ShieldAlert className="text-zeta-safe mr-4" size={32} />
            )}
            <div>
              <h3 className={`text-lg font-bold font-mono ${isHoneyPotActive ? 'text-zeta-alert' : 'text-white'}`}>
                {isHoneyPotActive ? 'GENERATIVE HONEY-POT UI ACTIVE' : 'PRODUCTION ENVIRONMENT ACTIVE'}
              </h3>
              <p className="text-sm text-gray-400">Real-Time Deception Morphing Visualizer</p>
            </div>
          </div>
          {isHoneyPotActive && (
            <div className="text-right">
              <div className="text-xs text-zeta-alert font-mono uppercase animate-pulse">Synthetic Data Tables Deployed</div>
              <div className="text-xs text-gray-500 font-mono">Attacker contained in shadow DOM</div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Adversarial Lab Control Panel (Chaos Mode) */}
        {chaosMode && (
          <div className="lg:col-span-3 bg-zeta-900 border border-zeta-alert/50 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <AlertTriangle size={18} className="mr-2 text-zeta-alert" />
                Live "Attack Injection" Dashboard (Adversarial Lab)
              </h3>
              <button onClick={exportForensicPackage} className="flex items-center px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-600/30 transition-colors text-xs font-mono">
                <Download size={14} className="mr-2" /> Export Forensic Evidence Package
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">Toggle simulated attack modes mid-session to intentionally alter outbound telemetry streams and force a backend trust collapse.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AttackToggle label="Replay Session Cookie Capture" active={attacks.cookieReplay} onClick={() => handleAttackToggle('cookieReplay')} />
              <AttackToggle label="Inject Headless Web-Driver Script" active={attacks.headlessWebDriver} onClick={() => handleAttackToggle('headlessWebDriver')} />
              <AttackToggle label="Simulate Physical Device Theft" active={attacks.deviceTheft} onClick={() => handleAttackToggle('deviceTheft')} />
            </div>
          </div>
        )}

        {/* Granular Micro-Policy Rule Slider Configuration Panel */}
        <div className="lg:col-span-3 bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Sliders size={18} className="mr-2 text-blue-400" />
              Granular Micro-Policy Rule Configuration
            </h3>
            <span className="px-2 py-1 bg-zeta-900 border border-gray-700 text-gray-400 text-xs font-mono rounded">
              Synced to /infrastructure/micro_policies
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sliders */}
            <div className="space-y-6">
              <PolicySlider 
                label="Biometric Drift Tolerance" 
                value={policyConfig.biometricDriftTolerance} 
                min={0.0} max={1.0} step={0.05} 
                onChange={(v) => handlePolicyChange('biometricDriftTolerance', v)} 
                format={(v) => v.toFixed(2)}
                desc="Adjusts how much a user's typing/touch velocity vector can deviate from their baseline."
              />
              <PolicySlider 
                label="Threat Intelligence Multiplier" 
                value={policyConfig.threatMultiplier} 
                min={1.0} max={5.0} step={0.1} 
                onChange={(v) => handlePolicyChange('threatMultiplier', v)} 
                format={(v) => `${v.toFixed(1)}x`}
                desc="Multiplies the weight of incoming AlienVault OTX and MISP risk indicators."
              />
              <PolicySlider 
                label="Contextual Friction Decay Rate" 
                value={policyConfig.frictionDecayRate} 
                min={1} max={60} step={1} 
                onChange={(v) => handlePolicyChange('frictionDecayRate', v)} 
                format={(v) => `${v} mins`}
                desc="Controls how fast a trusted session score recovers after moving to a new IP or device."
              />
              
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-200 mb-1">
                  <span>Step-Up MFA Strictness</span>
                  <span className="text-zeta-accent font-mono">
                    {policyConfig.mfaStrictness === 1 ? 'Silent Re-Auth' : policyConfig.mfaStrictness === 2 ? 'Push Notification' : 'Hardware Lockout'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mb-2">Dictates the response when a trust breach occurs.</p>
                <input 
                  type="range" min="1" max="3" step="1"
                  value={policyConfig.mfaStrictness} 
                  onChange={(e) => handlePolicyChange('mfaStrictness', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-zeta-accent"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                  <span>Tier 1</span>
                  <span>Tier 2</span>
                  <span>Tier 3</span>
                </div>
              </div>
            </div>

            {/* Visual Policy Boundary Simulator (Shadow Mode) */}
            <div className="bg-zeta-900 border border-gray-700 rounded-lg p-4 flex flex-col">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                <Activity size={14} className="mr-2 text-purple-400" />
                Visual Policy Boundary Simulator (Shadow Mode)
              </h4>
              <p className="text-[10px] text-gray-400 mb-4">
                Simulates how changing sliders affects False Acceptance Rate (FAR) and False Rejection Rate (FRR) across historical logs.
              </p>
              <div className="flex-1 min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulationData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="anomalyScore" stroke="#4b5563" fontSize={10} label={{ value: 'Anomaly Score', position: 'insideBottom', offset: -5, fill: '#6b7280', fontSize: 10 }} />
                    <YAxis stroke="#4b5563" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', fontSize: '12px' }} />
                    
                    {/* Dynamic Boundary Line based on tolerance */}
                    <ReferenceLine x={policyConfig.biometricDriftTolerance * 100} stroke="#00f0ff" strokeDasharray="3 3" label={{ position: 'top', value: 'Policy Boundary', fill: '#00f0ff', fontSize: 10 }} />
                    
                    <Area type="monotone" dataKey="far" name="False Acceptance Rate (FAR)" stroke="#ff003c" fill="#ff003c" fillOpacity={0.1} strokeWidth={2} isAnimationActive={false} />
                    <Area type="monotone" dataKey="frr" name="False Rejection Rate (FRR)" stroke="#eab308" fill="#eab308" fillOpacity={0.1} strokeWidth={2} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Core Engine Toggles */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Cpu size={18} className="mr-2 text-purple-400" />
            Core Engine Subsystems
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            <ToggleRow label="PQC Session Binding (ML-DSA/Falcon)" active={toggles.pqc} onClick={() => handleToggle('pqc')} />
            <ToggleRow label="Privacy-Preserving Local Data Hashing" active={toggles.localHashing} onClick={() => handleToggle('localHashing')} />
            <ToggleRow label="Focus Loss & Clipboard Guardian" active={toggles.focusGuardian} onClick={() => handleToggle('focusGuardian')} />
            <ToggleRow label="Behavioral Identity Roaming Profiles" active={toggles.roamingProfiles} onClick={() => handleToggle('roamingProfiles')} />
            <ToggleRow label="Zero-Knowledge Proof Attestation" active={toggles.zkp} onClick={() => handleToggle('zkp')} />
            <ToggleRow label="Generative Honey-Pot Router" active={toggles.honeyPot} onClick={() => handleToggle('honeyPot')} />
            <ToggleRow label="Holographic DOM Integrity" active={toggles.domIntegrity} onClick={() => handleToggle('domIntegrity')} />
            <ToggleRow label="Invisible LLM Scraper Traps" active={toggles.llmTraps} onClick={() => handleToggle('llmTraps')} />
            <ToggleRow label="Shadow AI Integration Discovery" active={toggles.shadowAi} onClick={() => handleToggle('shadowAi')} />
          </div>
        </div>

        {/* Quantum Entropy & Key Rotation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-center items-center text-center">
              <Lock size={32} className="text-zeta-safe mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Post-Quantum Session Key Rotation</h3>
              <p className="text-xs text-gray-400 mb-4">Dynamic session key rotations negotiated via HTTP/2 using lattice algorithms.</p>
              <div className="text-3xl font-mono text-white">{formatTime(keyRotationTimer)}</div>
              <div className="text-[10px] text-gray-500 uppercase mt-1">Until Next Rotation</div>
            </div>

            <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Binary size={18} className="mr-2 text-zeta-accent" />
                  Quantum Entropy Pool
                </h3>
                <span className="px-2 py-1 bg-zeta-safe/10 text-zeta-safe text-xs font-mono rounded border border-zeta-safe/20">
                  SEED: SECURE
                </span>
              </div>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={entropyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tick={false} />
                    <YAxis stroke="#4b5563" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} labelStyle={{ display: 'none' }} />
                    <Line type="step" dataKey="value" stroke="#00f0ff" strokeWidth={1} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ZKP Attestation Circuits */}
        <div className="lg:col-span-2 bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Fingerprint size={18} className="mr-2 text-blue-400" />
            Zero-Knowledge Proof (ZKP) Attestation Circuits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zkpCircuits.map((circuit) => (
              <div key={circuit.id} className="bg-zeta-900 border border-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-gray-300">{circuit.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                    circuit.status === 'verified' ? 'bg-zeta-safe/20 text-zeta-safe' : 'bg-yellow-500/20 text-yellow-500 animate-pulse'
                  }`}>
                    {circuit.status}
                  </span>
                </div>
                <div className="text-sm font-medium text-white">{circuit.type}</div>
                <div className="text-[10px] text-gray-500 mt-1">Proof Generation: {circuit.timeMs.toFixed(1)}ms</div>
              </div>
            ))}
          </div>
        </div>

        {/* Holographic DOM Integrity */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Hash size={18} className="mr-2 text-green-400" />
            Holographic DOM Integrity
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {domEvents.map((evt) => (
              <div key={evt.id} className={`p-3 rounded-lg border ${evt.match ? 'bg-zeta-900 border-gray-700' : 'bg-zeta-alert/10 border-zeta-alert/50'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono text-gray-300">{evt.node}</span>
                  {!evt.match && <AlertTriangle size={14} className="text-zeta-alert animate-pulse" />}
                </div>
                <div className="text-[10px] font-mono text-gray-500 truncate">EXP: {evt.expectedHash}</div>
                <div className={`text-[10px] font-mono truncate ${evt.match ? 'text-zeta-safe' : 'text-zeta-alert'}`}>ACT: {evt.actualHash}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <div className="flex items-center justify-between p-3 bg-zeta-900 rounded-lg border border-gray-800/50 cursor-pointer hover:bg-zeta-800 transition-colors" onClick={onClick}>
    <span className="text-sm font-medium text-gray-200">{label}</span>
    {active ? <ToggleRight size={24} className="text-zeta-safe" /> : <ToggleLeft size={24} className="text-gray-600" />}
  </div>
);

const AttackToggle = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <div 
    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
      active ? 'bg-zeta-alert/20 border-zeta-alert text-white' : 'bg-zeta-800 border-gray-700 text-gray-400 hover:bg-zeta-700'
    }`} 
    onClick={onClick}
  >
    <span className="text-xs font-mono">{label}</span>
    {active ? <ToggleRight size={20} className="text-zeta-alert" /> : <ToggleLeft size={20} className="text-gray-600" />}
  </div>
);

const PolicySlider = ({ label, value, min, max, step, onChange, format, desc }: { label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void, format: (v: number) => string, desc: string }) => (
  <div>
    <div className="flex justify-between text-sm font-medium text-gray-200 mb-1">
      <span>{label}</span>
      <span className="text-zeta-accent font-mono">{format(value)}</span>
    </div>
    <p className="text-[10px] text-gray-500 mb-2">{desc}</p>
    <input 
      type="range" min={min} max={max} step={step}
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-zeta-accent"
    />
  </div>
);
