import React, { useState, useRef, useEffect } from 'react';
import { Server, Laptop, Database, Shield, Network, Lock, Play, AlertTriangle, CheckCircle, Award, Activity, ChevronRight, ChevronLeft, Box, ShieldAlert, Crosshair, Zap, Settings, Plus, Trash2, X, RefreshCw, Download, Link as LinkIcon } from 'lucide-react';
import { SandboxNode, SandboxNodeType, SandboxConnection, SandboxLeaderboardEntry, FirewallRule, NetworkConfig, ForensicEvent, BlastRadiusNode } from '../types.ts';
import { simulationService } from '../services/simulationService.ts';

export const CyberRangeSandbox: React.FC = () => {
  const [nodes, setNodes] = useState<SandboxNode[]>([]);
  const [connections, setConnections] = useState<SandboxConnection[]>([]);
  
  // Wizard State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;
  const stepLabels = [
    "Draft Nodes", 
    "Configure Assets", 
    "Define Rules", 
    "LIVE FIRE SIMULATION", 
    "Analyze Results"
  ];
  
  // Drag & Drop State
  const [draggingNodeType, setDraggingNodeType] = useState<SandboxNodeType | null>(null);
  const [movingNodeId, setMovingNodeId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);
  
  // Configuration Panel State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Simulation State
  const [selectedAttack, setSelectedAttack] = useState<string>('SQL Injection');
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'mitigated' | 'breached'>('idle');
  const [activePath, setActivePath] = useState<string[]>([]);
  const [simulationMessage, setSimulationMessage] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Forensic Console State (Step 5)
  const [forensicEvents, setForensicEvents] = useState<ForensicEvent[]>([]);
  const [selectedForensicEventId, setSelectedForensicEventId] = useState<string | null>(null);
  const [blastRadius, setBlastRadius] = useState<{nodes: BlastRadiusNode[], edges: {from: string, to: string}[]}>({nodes: [], edges: []});

  useEffect(() => {
    setForensicEvents(simulationService.generateForensicTimeline());
    
    // Securely mount default nodes without locking UI thread
    const mountDefaults = async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Yield to main thread
      
      const defaultNetwork: NetworkConfig = {
        ipAddress: '10.0.1.0/24',
        subnetMask: '255.255.255.0',
        primaryDns: '1.1.1.1',
        secondaryDns: '8.8.8.8',
        firewallRules: []
      };

      setNodes([
        { id: 'node_1', type: 'Laptop', x: 80, y: 150, label: 'User Endpoint', trustScore: 95, config: { ...defaultNetwork, ipAddress: '10.0.1.5' } },
        { id: 'node_2', type: 'Firewall', x: 350, y: 150, label: 'Perimeter FW', trustScore: 99, config: { ...defaultNetwork, ipAddress: '10.0.1.1', firewallRules: [{ id: 'r1', action: 'ALLOW', sourceIp: 'ANY', destIp: 'ANY', port: '443', protocol: 'TCP' }] } },
        { id: 'node_3', type: 'Server', x: 620, y: 150, label: 'Web Server', trustScore: 100, config: { ...defaultNetwork, ipAddress: '192.168.1.10' } }
      ]);
      setConnections([
        { id: 'conn_1', from: 'node_1', to: 'node_2' },
        { id: 'conn_2', from: 'node_2', to: 'node_3' }
      ]);
    };
    mountDefaults();
  }, []);

  useEffect(() => {
    if (selectedForensicEventId) {
      setBlastRadius(simulationService.generateBlastRadius(selectedForensicEventId));
    } else {
      setBlastRadius({nodes: [], edges: []});
    }
  }, [selectedForensicEventId]);

  // --- Wizard Navigation ---
  const handleNextStep = () => {
    if (currentStep === 1) {
      // "Will It Work?" Verification Engine
      const validation = simulationService.validateTopology(nodes, connections);
      if (!validation.isValid) {
        setValidationError(validation.message);
        // Flash isolated nodes
        if (validation.isolatedNodes.length > 0) {
          // Visual feedback handled in render
        }
        return; // Prevent advancing
      }
      setValidationError(null);
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setSelectedNodeId(null); // Close config panel on step change
      if (currentStep === 3) {
        // Auto-trigger simulation when entering step 4
        runSimulation();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setSelectedNodeId(null);
      setValidationError(null);
      if (simulationState !== 'idle') {
        setSimulationState('idle');
        setActivePath([]);
        setSimulationMessage('');
      }
    }
  };

  // --- Canvas Interaction Handlers ---

  const handleDragStartShelf = (e: React.DragEvent, type: SandboxNodeType) => {
    if (currentStep !== 1) return; // Only allow dragging in Step 1
    setDraggingNodeType(type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingNodeType || !canvasRef.current || currentStep !== 1) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 40; // Center the 80x80 node
    const y = e.clientY - rect.top - 40;

    const newNode: SandboxNode = {
      id: `node_${Date.now()}`,
      type: draggingNodeType,
      x,
      y,
      label: `${draggingNodeType} ${nodes.length + 1}`,
      trustScore: Math.floor(80 + Math.random() * 20),
      config: {
        ipAddress: '10.0.0.0/24',
        subnetMask: '255.255.255.0',
        primaryDns: '1.1.1.1',
        secondaryDns: '8.8.8.8',
        firewallRules: []
      }
    };

    setNodes([...nodes, newNode]);
    setDraggingNodeType(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (currentStep === 1) {
      // Move Mode (Step 1)
      if (e.shiftKey) {
        // Connection Mode
        if (!connectingFrom) {
          setConnectingFrom(id);
        } else if (connectingFrom !== id) {
          // Prevent duplicate or self connections
          if (!connections.find(c => c.from === connectingFrom && c.to === id) && connectingFrom !== id) {
            setConnections([...connections, { id: `conn_${Date.now()}`, from: connectingFrom, to: id }]);
          }
          setConnectingFrom(null);
          setMousePos(null);
        }
      } else {
        setMovingNodeId(id);
      }
    } else if (currentStep === 2 || currentStep === 3) {
      // Configuration Mode (Step 2 & 3)
      setSelectedNodeId(id);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current || currentStep !== 1) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (connectingFrom) {
      setMousePos({ x, y });
    }

    if (movingNodeId) {
      setNodes(nodes.map(n => n.id === movingNodeId ? { ...n, x: x - 40, y: y - 40 } : n));
    }
  };

  const handleCanvasMouseUp = () => {
    setMovingNodeId(null);
  };

  // --- Configuration Handlers ---
  const updateNodeConfig = (nodeId: string, newConfig: Partial<NetworkConfig>) => {
    setNodes(nodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, config: { ...n.config, ...newConfig } };
      }
      return n;
    }));
  };

  const addFirewallRule = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const newRule: FirewallRule = {
      id: `rule_${Date.now()}`,
      action: 'ALLOW',
      sourceIp: 'ANY',
      destIp: 'ANY',
      port: '443',
      protocol: 'TCP'
    };

    updateNodeConfig(nodeId, { firewallRules: [...node.config.firewallRules, newRule] });
  };

  const updateFirewallRule = (nodeId: string, ruleId: string, updates: Partial<FirewallRule>) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const updatedRules = node.config.firewallRules.map(r => r.id === ruleId ? { ...r, ...updates } : r);
    updateNodeConfig(nodeId, { firewallRules: updatedRules });
  };

  const removeFirewallRule = (nodeId: string, ruleId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const updatedRules = node.config.firewallRules.filter(r => r.id !== ruleId);
    updateNodeConfig(nodeId, { firewallRules: updatedRules });
  };

  // --- Simulation Logic ---

  const runSimulation = () => {
    if (nodes.length === 0) return;
    setSimulationState('running');
    setActivePath([]);
    setSimulationMessage('Initializing deterministic packet routing...');

    // 1. Find entry point
    const entryNodes = nodes.filter(n => n.type === 'Laptop' || n.type === 'IoT');
    if (entryNodes.length === 0) {
      setTimeout(() => {
        setSimulationState('mitigated');
        setSimulationMessage('No entry point found. Attack mitigated.');
      }, 1000);
      return;
    }

    let currentPath: string[] = [entryNodes[0].id];
    
    // Use the deterministic simulation service
    const result = simulationService.validatePacketFlow(selectedAttack, nodes, connections);

    const step = (currentNodeId: string) => {
      setActivePath([...currentPath]);
      
      // If we reached the node where the simulation failed/succeeded
      if (currentNodeId === result.failedAtNodeId || currentPath.length > nodes.length) {
        setSimulationState(result.success ? 'mitigated' : 'breached');
        setSimulationMessage(result.message);
        return;
      }

      // Find next connected node
      const nextConn = connections.find(c => c.from === currentNodeId && !currentPath.includes(c.to));
      if (nextConn) {
        currentPath.push(nextConn.to);
        setTimeout(() => step(nextConn.to), 800);
      } else {
        // Dead end
        setSimulationState('mitigated');
        setSimulationMessage('Attack path exhausted. Target not reached.');
      }
    };

    setTimeout(() => step(currentPath[0]), 500);
  };

  const clearCanvas = () => {
    setNodes([]);
    setConnections([]);
    setSimulationState('idle');
    setActivePath([]);
    setConnectingFrom(null);
    setSelectedNodeId(null);
    setCurrentStep(1);
    setSimulationMessage('');
    setValidationError(null);
  };

  const downloadForensicBundle = () => {
    simulationService.exportCertifiedForensicBundle(forensicEvents, nodes, connections);
  };

  // --- Render Helpers ---

  const getNodeIcon = (type: SandboxNodeType) => {
    switch (type) {
      case 'Laptop': return <Laptop size={28} />;
      case 'Server': return <Server size={28} />;
      case 'DB': return <Database size={28} />;
      case 'IoT': return <Activity size={28} />;
      case 'Firewall': return <ShieldAlert size={28} className="text-yellow-500" />;
      case 'VPN': return <Network size={28} className="text-blue-400" />;
      case 'ZTAGateway': return <Shield size={28} className="text-zeta-safe" />;
      default: return <Box size={28} />;
    }
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedForensicEvent = forensicEvents.find(e => e.id === selectedForensicEventId);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-6 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <Crosshair className="mr-3 text-zeta-accent" size={32} />
            Network Validation Engine
          </h2>
          <p className="text-gray-400 mt-1">Text-configurable Cyber Range Sandbox for deterministic packet filtering.</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={clearCanvas} className="px-4 py-2 bg-zeta-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-zeta-700 transition-colors text-sm font-mono flex items-center">
            <RefreshCw size={16} className="mr-2" /> Reset Range
          </button>
        </div>
      </header>

      {/* Multi-Step Wizard Navigation Layout */}
      <div className="flex items-center justify-between mb-6 bg-zeta-800 p-4 rounded-xl border border-gray-800 shadow-lg flex-shrink-0">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isPast = currentStep > stepNum;
          return (
            <div key={stepNum} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                isActive ? 'bg-zeta-accent text-zeta-900 shadow-[0_0_15px_rgba(0,240,255,0.6)] scale-110' :
                isPast ? 'bg-zeta-safe text-zeta-900' :
                'bg-zeta-900 text-gray-500 border-2 border-gray-700'
              }`}>
                {isPast ? <CheckCircle size={20} /> : stepNum}
              </div>
              <div className="ml-3 hidden md:block">
                <div className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : isPast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Step {stepNum}
                </div>
                <div className={`text-[10px] font-mono ${isActive ? 'text-zeta-accent' : isPast ? 'text-zeta-safe' : 'text-gray-600'}`}>
                  {label}
                </div>
              </div>
              {index < totalSteps - 1 && (
                <div className={`flex-1 h-1 mx-4 rounded-full transition-colors duration-500 ${isPast ? 'bg-zeta-safe' : 'bg-gray-800'}`}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      {currentStep < 5 ? (
        <div className="flex-1 flex gap-6 min-h-0 relative">
          
          {/* Left Panel: Asset Shelf (Only active in Step 1) */}
          <div className={`w-72 bg-zeta-800 border border-gray-800 rounded-xl p-5 flex flex-col shadow-lg overflow-y-auto transition-all duration-300 ${currentStep === 1 ? 'opacity-100 translate-x-0' : 'opacity-50 pointer-events-none -translate-x-4 hidden'}`}>
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <Box size={16} className="mr-2 text-zeta-accent" /> Asset Shelf
              </h3>
              <span className="text-[10px] bg-zeta-900 px-2 py-1 rounded text-gray-400 font-mono">Drag to deploy</span>
            </div>
            
            <div className="space-y-3">
              {(['Laptop', 'Server', 'DB', 'IoT', 'Firewall', 'VPN', 'ZTAGateway'] as SandboxNodeType[]).map(type => (
                <div 
                  key={type}
                  draggable={currentStep === 1}
                  onDragStart={(e) => handleDragStartShelf(e, type)}
                  className="flex items-center p-3 bg-zeta-900 border border-gray-700 rounded-lg cursor-grab hover:border-zeta-accent hover:bg-zeta-800 transition-all group"
                >
                  <div className="mr-4 text-gray-400 group-hover:text-white transition-colors">{getNodeIcon(type)}</div>
                  <div>
                    <div className="text-sm font-bold text-gray-200 group-hover:text-white">{type}</div>
                    <div className="text-[10px] text-gray-500 font-mono">Cost: ${Math.floor(Math.random() * 500 + 100)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Interactive Canvas */}
          <div className="flex-1 flex flex-col min-w-0">
            {validationError && currentStep === 1 && (
              <div className="bg-zeta-alert/20 border border-zeta-alert text-zeta-alert p-3 rounded-lg mb-4 flex items-center animate-in fade-in">
                <AlertTriangle size={16} className="mr-2" />
                <span className="text-sm font-bold">{validationError}</span>
              </div>
            )}
            <div 
              ref={canvasRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleCanvasDrop}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="flex-1 bg-zeta-900 border-2 border-gray-800 rounded-xl relative overflow-hidden shadow-inner min-h-[400px]"
              style={{ 
                backgroundImage: 'radial-gradient(#374151 1px, transparent 1px), radial-gradient(#374151 1px, transparent 1px)', 
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px'
              }}
            >
              {/* SVG Layer for Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* Active drawing line */}
                {connectingFrom && mousePos && (() => {
                  const fromNode = nodes.find(n => n.id === connectingFrom);
                  if (!fromNode) return null;
                  return (
                    <line 
                      x1={fromNode.x + 40} y1={fromNode.y + 40} 
                      x2={mousePos.x} y2={mousePos.y} 
                      stroke="#00f0ff" strokeWidth="2" strokeDasharray="4,4"
                    />
                  );
                })()}

                {/* Established Connections */}
                {connections.map(conn => {
                  const fromNode = nodes.find(n => n.id === conn.from);
                  const toNode = nodes.find(n => n.id === conn.to);
                  if (!fromNode || !toNode) return null;
                  
                  const isAttackPath = activePath.includes(conn.from) && activePath.includes(conn.to);
                  
                  return (
                    <g key={conn.id}>
                      <line 
                        x1={fromNode.x + 40} y1={fromNode.y + 40} 
                        x2={toNode.x + 40} y2={toNode.y + 40} 
                        stroke={isAttackPath ? '#ff003c' : '#4b5563'} 
                        strokeWidth={isAttackPath ? 4 : 2}
                        strokeDasharray={isAttackPath ? "8,8" : "none"}
                        className={isAttackPath ? "animate-[dash_0.5s_linear_infinite]" : ""}
                      />
                      {/* Directional Arrow */}
                      <circle cx={(fromNode.x + toNode.x + 80) / 2} cy={(fromNode.y + toNode.y + 80) / 2} r="4" fill={isAttackPath ? '#ff003c' : '#4b5563'} />
                    </g>
                  );
                })}
              </svg>

              {/* Nodes Layer */}
              {nodes.map(node => {
                const isConnecting = connectingFrom === node.id;
                const isUnderAttack = activePath[activePath.length - 1] === node.id && simulationState === 'running';
                const isSelected = selectedNodeId === node.id;
                const isIsolated = validationError && !connections.some(c => c.from === node.id || c.to === node.id);
                
                return (
                  <div 
                    key={node.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    className={`absolute w-20 h-20 flex flex-col items-center justify-center bg-zeta-800 border-2 rounded-xl cursor-pointer z-10 transition-all duration-200 ${
                      isConnecting ? 'border-zeta-accent shadow-[0_0_20px_rgba(0,240,255,0.6)] scale-110' : 
                      isUnderAttack ? 'border-zeta-alert bg-zeta-alert/20 animate-pulse scale-110' :
                      isSelected ? 'border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]' :
                      isIsolated ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-pulse' :
                      'border-gray-600 hover:border-gray-400 hover:scale-105 shadow-lg'
                    }`}
                    style={{ left: node.x, top: node.y }}
                  >
                    {getNodeIcon(node.type)}
                    <div className="absolute -bottom-8 whitespace-nowrap text-[10px] font-bold text-white bg-zeta-900 px-2 py-1 rounded border border-gray-700 shadow-md">
                      {node.label}
                    </div>
                    {/* IP Badge */}
                    <div className="absolute -top-6 whitespace-nowrap text-[8px] font-mono text-gray-400 bg-zeta-900 px-1 rounded border border-gray-700">
                      {node.config.ipAddress}
                    </div>
                  </div>
                );
              })}

              {/* Simulation Overlay Effects */}
              {simulationState === 'mitigated' && (
                <div className="absolute inset-0 flex items-center justify-center bg-zeta-safe/10 z-50 pointer-events-none animate-in fade-in zoom-in duration-300">
                  <div className="bg-zeta-900 border-2 border-zeta-safe p-8 rounded-2xl text-center shadow-[0_0_100px_rgba(0,255,102,0.4)]">
                    <CheckCircle className="mx-auto text-zeta-safe mb-4" size={64} />
                    <h2 className="text-3xl font-bold text-zeta-safe font-mono tracking-widest">ATTACK MITIGATED</h2>
                    <p className="text-gray-300 mt-2 text-sm">{simulationMessage}</p>
                  </div>
                </div>
              )}
              {simulationState === 'breached' && (
                <div className="absolute inset-0 flex items-center justify-center bg-zeta-alert/10 z-50 pointer-events-none animate-in fade-in zoom-in duration-300">
                  <div className="bg-zeta-900 border-2 border-zeta-alert p-8 rounded-2xl text-center shadow-[0_0_100px_rgba(255,0,60,0.4)]">
                    <AlertTriangle className="mx-auto text-zeta-alert mb-4 animate-pulse" size={64} />
                    <h2 className="text-3xl font-bold text-zeta-alert font-mono tracking-widest">SYSTEM BREACHED</h2>
                    <p className="text-gray-300 mt-2 text-sm">{simulationMessage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard Navigation Controls */}
            <div className="flex justify-between items-center mt-6 bg-zeta-800 p-4 rounded-xl border border-gray-800 shadow-lg">
              <button 
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center px-5 py-2.5 bg-zeta-900 border border-gray-700 text-gray-300 rounded-lg hover:bg-zeta-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              >
                <ChevronLeft size={18} className="mr-2" /> Previous Phase
              </button>
              
              <div className="text-sm font-mono text-gray-400 text-center flex-1 px-4">
                {currentStep === 1 && "Drag nodes from the shelf to construct your architecture. Shift+Click to connect."}
                {currentStep === 2 && "Click a node to configure its Network Settings (IP/DNS)."}
                {currentStep === 3 && "Click a Firewall or Gateway to define ACL rules."}
                {currentStep === 4 && "Select an attack vector and execute the deterministic simulation."}
              </div>

              <button 
                onClick={handleNextStep}
                disabled={currentStep === totalSteps}
                className={`flex items-center px-5 py-2.5 rounded-lg font-bold transition-all duration-300 text-sm ${
                  currentStep === 3 
                    ? 'bg-zeta-alert text-white animate-pulse shadow-[0_0_20px_rgba(255,0,60,0.6)] hover:bg-red-600' 
                    : 'bg-zeta-accent text-zeta-900 hover:bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {currentStep === 3 ? 'INITIATE ATTACK' : 'Next Phase'} <ChevronRight size={18} className="ml-2" />
              </button>
            </div>
          </div>

          {/* Right Panel: Dynamic Content based on Step */}
          <div className="w-96 flex flex-col gap-6 overflow-y-auto">
            
            {/* Granular Asset Configuration Panel (Active in Step 2 & 3) */}
            {(currentStep === 2 || currentStep === 3) && (
              <div className="bg-zeta-800 border border-gray-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col animate-in slide-in-from-right-4">
                <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                    <Settings className="mr-2 text-blue-400" size={16} />
                    Asset Configuration
                  </h3>
                  {selectedNode && (
                    <span className="text-[10px] bg-zeta-900 px-2 py-1 rounded text-gray-400 font-mono border border-gray-700">
                      {selectedNode.type}
                    </span>
                  )}
                </div>

                {!selectedNode ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                    <Box size={48} className="mb-4 opacity-50" />
                    <p className="text-sm">Select a node on the canvas to configure its properties.</p>
                  </div>
                ) : (
                  <div className="space-y-6 overflow-y-auto pr-2">
                    {/* Network Settings (Step 2) */}
                    {currentStep === 2 && (
                      <div className="space-y-4 animate-in fade-in">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Network Settings</h4>
                        
                        <div>
                          <label className="text-[10px] text-gray-500 uppercase block mb-1">IPv4 Address / Subnet</label>
                          <input 
                            type="text" 
                            value={selectedNode.config.ipAddress}
                            onChange={(e) => updateNodeConfig(selectedNode.id, { ipAddress: e.target.value })}
                            className="w-full bg-zeta-900 border border-gray-700 text-white text-sm font-mono rounded p-2 focus:outline-none focus:border-zeta-accent"
                            placeholder="e.g., 10.0.1.5/24"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase block mb-1">Primary DNS</label>
                            <input 
                              type="text" 
                              value={selectedNode.config.primaryDns}
                              onChange={(e) => updateNodeConfig(selectedNode.id, { primaryDns: e.target.value })}
                              className="w-full bg-zeta-900 border border-gray-700 text-white text-sm font-mono rounded p-2 focus:outline-none focus:border-zeta-accent"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase block mb-1">Secondary DNS</label>
                            <input 
                              type="text" 
                              value={selectedNode.config.secondaryDns}
                              onChange={(e) => updateNodeConfig(selectedNode.id, { secondaryDns: e.target.value })}
                              className="w-full bg-zeta-900 border border-gray-700 text-white text-sm font-mono rounded p-2 focus:outline-none focus:border-zeta-accent"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Firewall Security Policies (Step 3) */}
                    {currentStep === 3 && (selectedNode.type === 'Firewall' || selectedNode.type === 'ZTAGateway') && (
                      <div className="space-y-4 animate-in fade-in">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security Policies (ACL)</h4>
                          <button 
                            onClick={() => addFirewallRule(selectedNode.id)}
                            className="p-1 bg-zeta-900 border border-gray-700 rounded hover:border-zeta-accent text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {selectedNode.config.firewallRules.length === 0 ? (
                            <div className="text-center p-4 border border-dashed border-gray-700 rounded-lg text-xs text-gray-500">
                              No rules defined. Default DENY ALL applies.
                            </div>
                          ) : (
                            selectedNode.config.firewallRules.map((rule, idx) => (
                              <div key={rule.id} className="bg-zeta-900 border border-gray-700 rounded-lg p-3 relative group">
                                <button 
                                  onClick={() => removeFirewallRule(selectedNode.id, rule.id)}
                                  className="absolute top-2 right-2 text-gray-600 hover:text-zeta-alert opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={14} />
                                </button>
                                
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-[10px] text-gray-500 font-mono">Rule {idx + 1}</span>
                                  <select 
                                    value={rule.action}
                                    onChange={(e) => updateFirewallRule(selectedNode.id, rule.id, { action: e.target.value as 'ALLOW' | 'DENY' })}
                                    className={`text-xs font-bold rounded px-1 py-0.5 appearance-none focus:outline-none ${rule.action === 'ALLOW' ? 'bg-zeta-safe/20 text-zeta-safe' : 'bg-zeta-alert/20 text-zeta-alert'}`}
                                  >
                                    <option value="ALLOW">ALLOW</option>
                                    <option value="DENY">DENY</option>
                                  </select>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <div>
                                    <label className="text-[8px] text-gray-500 uppercase">Source IP</label>
                                    <input 
                                      type="text" value={rule.sourceIp}
                                      onChange={(e) => updateFirewallRule(selectedNode.id, rule.id, { sourceIp: e.target.value })}
                                      className="w-full bg-transparent border-b border-gray-700 text-white text-xs font-mono focus:outline-none focus:border-zeta-accent pb-1"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[8px] text-gray-500 uppercase">Dest IP</label>
                                    <input 
                                      type="text" value={rule.destIp}
                                      onChange={(e) => updateFirewallRule(selectedNode.id, rule.id, { destIp: e.target.value })}
                                      className="w-full bg-transparent border-b border-gray-700 text-white text-xs font-mono focus:outline-none focus:border-zeta-accent pb-1"
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[8px] text-gray-500 uppercase">Port</label>
                                    <input 
                                      type="text" value={rule.port}
                                      onChange={(e) => updateFirewallRule(selectedNode.id, rule.id, { port: e.target.value })}
                                      className="w-full bg-transparent border-b border-gray-700 text-white text-xs font-mono focus:outline-none focus:border-zeta-accent pb-1"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[8px] text-gray-500 uppercase">Protocol</label>
                                    <select 
                                      value={rule.protocol}
                                      onChange={(e) => updateFirewallRule(selectedNode.id, rule.id, { protocol: e.target.value as any })}
                                      className="w-full bg-transparent border-b border-gray-700 text-white text-xs font-mono focus:outline-none focus:border-zeta-accent pb-1 appearance-none"
                                    >
                                      <option>TCP</option>
                                      <option>UDP</option>
                                      <option>ICMP</option>
                                      <option>ANY</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 3 && selectedNode.type !== 'Firewall' && selectedNode.type !== 'ZTAGateway' && (
                      <div className="text-center p-4 border border-dashed border-gray-700 rounded-lg text-xs text-gray-500">
                        ACL configuration is only available for Firewall and Gateway nodes.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Live Fire Attack Simulator (Active in Step 4) */}
            {currentStep === 4 && (
              <div className="bg-zeta-800 border border-gray-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col animate-in slide-in-from-right-4">
                <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                    <Zap className="mr-2 text-zeta-alert" size={16} />
                    Live Fire Simulator
                  </h3>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Select Attack Vector</label>
                    <div className="relative">
                      <select 
                        value={selectedAttack}
                        onChange={(e) => setSelectedAttack(e.target.value)}
                        disabled={simulationState === 'running'}
                        className="w-full bg-zeta-900 border border-gray-700 text-white text-sm rounded-lg p-3 appearance-none focus:outline-none focus:border-zeta-accent transition-colors"
                      >
                        <option value="SQL Injection">SQL Injection (T1190)</option>
                        <option value="Distributed Denial of Service (DDoS)">DDoS (T1498)</option>
                        <option value="Lateral Movement">Lateral Movement (TA0008)</option>
                        <option value="Credential Stuffing">Credential Stuffing (T1110)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <ChevronRight size={16} className="transform rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-zeta-900 p-4 rounded-lg border border-gray-700 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-medium">Session Risk Score</span>
                      <span className="text-yellow-500 font-mono font-bold bg-yellow-500/10 px-2 py-1 rounded">High (82%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-medium">Global Threat Context</span>
                      <span className="text-zeta-alert font-mono font-bold bg-zeta-alert/10 px-2 py-1 rounded">Elevated</span>
                    </div>
                  </div>

                  <button 
                    onClick={runSimulation}
                    disabled={simulationState === 'running' || nodes.length === 0}
                    className="w-full py-3.5 bg-zeta-alert/20 hover:bg-zeta-alert/30 border border-zeta-alert/50 text-zeta-alert font-bold rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,60,0.2)] hover:shadow-[0_0_25px_rgba(255,0,60,0.4)]"
                  >
                    {simulationState === 'running' ? (
                      <><RefreshCw size={18} className="mr-2 animate-spin" /> SIMULATING...</>
                    ) : (
                      <><Play size={18} className="mr-2" /> EXECUTE ATTACK</>
                    )}
                  </button>
                  
                  {simulationMessage && simulationState !== 'running' && (
                    <div className={`p-3 rounded border text-xs font-mono ${simulationState === 'mitigated' ? 'bg-zeta-safe/10 border-zeta-safe text-zeta-safe' : 'bg-zeta-alert/10 border-zeta-alert text-zeta-alert'}`}>
                      {simulationMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Step 5: Event Reconstruction Console */
        <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Activity className="mr-2 text-zeta-accent" size={24} />
              Event Reconstruction Console
            </h3>
            <button 
              onClick={downloadForensicBundle}
              className="flex items-center px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-mono"
            >
              <Download size={16} className="mr-2" /> Download Certified Forensic Bundle
            </button>
          </div>

          <div className="flex-1 flex gap-6 min-h-0">
            {/* Multi-Track Timeline */}
            <div className="w-2/3 flex gap-4 overflow-hidden">
              {['Biometric', 'Network', 'ThreatIntel'].map((trackName) => (
                <div key={trackName} className="flex-1 flex flex-col bg-zeta-800 border border-gray-800 rounded-xl p-4 shadow-lg">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center border-b border-gray-700 pb-2">
                    {trackName === 'ThreatIntel' ? 'Threat Intel' : trackName} Logs
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {forensicEvents.filter(e => e.track === trackName).map(event => {
                      const isSelected = selectedForensicEventId === event.id;
                      const isRelated = selectedForensicEvent && (selectedForensicEvent.relatedEventIds.includes(event.id) || event.relatedEventIds.includes(selectedForensicEvent.id));
                      
                      return (
                        <div 
                          key={event.id}
                          onClick={() => setSelectedForensicEventId(event.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                            isSelected ? 'bg-zeta-900 border-zeta-accent shadow-[0_0_15px_rgba(0,240,255,0.3)]' :
                            isRelated ? 'bg-zeta-800 border-blue-400/50 shadow-[0_0_10px_rgba(96,165,250,0.2)]' :
                            'bg-zeta-900 border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-mono text-gray-500">{event.timestamp.toLocaleTimeString()}</span>
                            {event.isCritical && <AlertTriangle size={12} className="text-zeta-alert" />}
                          </div>
                          <div className={`text-sm font-bold mb-1 ${event.isCritical ? 'text-zeta-alert' : 'text-white'}`}>{event.title}</div>
                          <div className="text-xs text-gray-400 mb-3">{event.description}</div>
                          
                          {/* CoC Hash Badge */}
                          <div className="flex items-center justify-between bg-gray-900 p-1.5 rounded border border-gray-800">
                            <div className="flex items-center text-[8px] text-zeta-safe font-mono">
                              <LinkIcon size={10} className="mr-1" /> Chain Verified
                            </div>
                            <div className="text-[8px] font-mono text-gray-500 truncate w-24" title={event.hash}>
                              {event.hash.substring(0, 12)}...
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Blast Radius Topology Map */}
            <div className="w-1/3 bg-zeta-800 border border-gray-800 rounded-xl p-4 shadow-lg flex flex-col">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center border-b border-gray-700 pb-2">
                <Crosshair className="mr-2 text-zeta-alert" size={16} />
                Blast Radius Topology
              </h4>
              
              {!selectedForensicEventId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                  <Network size={48} className="mb-4 opacity-50" />
                  <p className="text-sm">Select an event on the timeline to view its blast radius.</p>
                </div>
              ) : (
                <div className="flex-1 relative bg-zeta-900 rounded-lg border border-gray-700 overflow-hidden">
                  {/* Simple SVG for Blast Radius Edges */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {blastRadius.edges.map((edge, i) => {
                      // Mock positions for the 5 nodes
                      const posMap: Record<string, {x: number, y: number}> = {
                        'br_1': {x: 150, y: 50},
                        'br_2': {x: 150, y: 150},
                        'br_3': {x: 50, y: 100},
                        'br_4': {x: 250, y: 200},
                        'br_5': {x: 50, y: 200}
                      };
                      const p1 = posMap[edge.from];
                      const p2 = posMap[edge.to];
                      if(!p1 || !p2) return null;
                      return (
                        <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#4b5563" strokeWidth="2" strokeDasharray="4,4" />
                      );
                    })}
                  </svg>
                  
                  {/* Blast Radius Nodes */}
                  {blastRadius.nodes.map(node => {
                    const posMap: Record<string, {x: number, y: number}> = {
                      'br_1': {x: 150, y: 50},
                      'br_2': {x: 150, y: 150},
                      'br_3': {x: 50, y: 100},
                      'br_4': {x: 250, y: 200},
                      'br_5': {x: 50, y: 200}
                    };
                    const pos = posMap[node.id];
                    if(!pos) return null;

                    return (
                      <div 
                        key={node.id}
                        className={`absolute w-12 h-12 flex flex-col items-center justify-center bg-zeta-800 border-2 rounded-lg z-10 transform -translate-x-1/2 -translate-y-1/2 ${
                          node.status === 'compromised' ? 'border-zeta-alert bg-zeta-alert/20 animate-pulse shadow-[0_0_15px_rgba(255,0,60,0.5)]' :
                          node.status === 'exposed' ? 'border-yellow-500 bg-yellow-500/20' :
                          'border-zeta-safe bg-zeta-safe/10'
                        }`}
                        style={{ left: pos.x, top: pos.y }}
                      >
                        {getNodeIcon(node.type)}
                        <div className="absolute -bottom-5 whitespace-nowrap text-[8px] font-bold text-white bg-zeta-900 px-1 rounded border border-gray-700">
                          {node.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Wizard Navigation Controls (Step 5) */}
          <div className="flex justify-between items-center mt-6 bg-zeta-800 p-4 rounded-xl border border-gray-800 shadow-lg flex-shrink-0">
            <button 
              onClick={handlePrevStep}
              className="flex items-center px-5 py-2.5 bg-zeta-900 border border-gray-700 text-gray-300 rounded-lg hover:bg-zeta-700 transition-colors font-medium text-sm"
            >
              <ChevronLeft size={18} className="mr-2" /> Back to Simulation
            </button>
            <div className="text-sm font-mono text-gray-400 text-center flex-1 px-4">
              Review forensic data, verify chain of custody, and export the incident bundle.
            </div>
            <button 
              disabled
              className="flex items-center px-5 py-2.5 rounded-lg font-bold transition-all duration-300 text-sm bg-gray-800 text-gray-600 cursor-not-allowed"
            >
              Next Phase <ChevronRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
