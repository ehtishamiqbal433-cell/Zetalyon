/*
 * Copyright (c) 2026 Muhammad Ehtisham Iqbal. All rights reserved.
 *
 * This software is part of the 'Project ZTA-BioAuth' academic and 
 * open-source research framework. 
 *
 * Use of this source code is governed by the dual-licensing strategy 
 * outlined in the main LICENSE file.
 */

import { 
  TrustDataPoint, SecurityEvent, TrajectoryPoint, CadenceData, 
  AnomalyCluster, PolymorphicRoute, GazeDataPoint, TremorData, 
  VertexPrediction, IPSwarm, TTPEvent, EntropyData, ZKPCircuit, DOMHashEvent,
  FinancialMetric, MitreTactic, AttackTimelineEvent, LeaderboardEntry, SystemResource, ComplianceLog,
  PeripheralData, ProximityData, GamificationProfile, ThreatFeedIndicator, CompoundRiskData,
  XAIFeedback, MicroPolicyConfig, PolicySimulationData, PredictiveRiskData, SandboxLeaderboardEntry,
  VertexClusterPoint, VertexRetrainingEvent, VertexIngestionMetric, ActiveProcessData,
  SandboxNode, SandboxConnection, PacketSimulationResult, FirewallRule, ForensicEvent, BlastRadiusNode,
  TopologyValidationResult
} from '../types.ts';

class SimulationService {
  private trustScore = 98.5;
  private eventIdCounter = 0;
  private predictionIdCounter = 0;
  private domEventIdCounter = 0;
  private complianceIdCounter = 0;
  private threatFeedIdCounter = 0;
  private retrainingEventIdCounter = 0;
  private activeChaosAttacks: string[] = [];
  private attackPhase = 0;
  private previousEma = 0.1;

  // Chaos Engineering Hooks
  setChaosAttacks(attacks: string[]) {
    this.activeChaosAttacks = attacks;
  }

  generateTrustData(count: number): TrustDataPoint[] {
    const data: TrustDataPoint[] = [];
    let currentScore = this.trustScore;
    const now = new Date();

    for (let i = count; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5000);
      
      // If chaos attacks are active, force a massive trust collapse
      if (this.activeChaosAttacks.length > 0) {
        currentScore = Math.max(5, currentScore - (Math.random() * 15 + 5));
      } else {
        const change = (Math.random() - 0.4) * 2; 
        currentScore = Math.max(60, Math.min(100, currentScore + change));
      }
      
      this.trustScore = currentScore; // Persist state

      data.push({
        time: time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        score: parseFloat(currentScore.toFixed(1)),
        threshold: 85.0
      });
    }
    return data;
  }

  generateRandomEvent(): SecurityEvent {
    this.eventIdCounter++;
    const types: SecurityEvent['type'][] = [
      'ANALYSIS', 'THREAT_BLOCKED', 'ATTESTATION', 'SYSTEM', 'SESSION_INVALIDATED', 
      'FOCUS_LOSS', 'PERIPHERAL_SHIFT', 'PROXIMITY_ALERT', 'SESSION_HANDOVER', 'PROCESS_HOOK'
    ];
    const modules = [
      'Vertex AI Pipeline', 'Kalman Filter', 'Polymorphic Router', 'Micro-Friction Engine',
      'FIDO2 Interceptor', 'Generative AI Canary', 'PQC Session Binder', 'Token-Theft Invalidator',
      'LLM Scraper Trap', 'Clipboard Guardian', 'BLE Proximity Sync', 'Compound Risk Engine',
      'Process Discovery Layer'
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const module = modules[Math.floor(Math.random() * modules.length)];
    let severity: SecurityEvent['severity'] = 'info';
    let message = '';

    switch (type) {
      case 'THREAT_BLOCKED':
        severity = 'critical';
        message = `Blocked anomalous trajectory pattern matching known botnet signature.`;
        break;
      case 'ATTESTATION':
        severity = 'warning';
        message = `Triggered micro-friction challenge. Cognitive response verified in 420ms.`;
        break;
      case 'ANALYSIS':
        severity = 'info';
        message = `Recalculating behavioral baseline. Confidence interval: 99.2%.`;
        break;
      case 'SYSTEM':
        severity = 'info';
        message = `Route mutation executed. Active endpoints shifted.`;
        break;
      case 'SESSION_INVALIDATED':
        severity = 'critical';
        message = `Token-theft detected via cross-tenant anomaly sync. Session terminated.`;
        break;
      case 'FOCUS_LOSS':
        severity = 'warning';
        message = `Window focus lost. Clipboard exfiltration guardian active. Trust score penalized.`;
        break;
      case 'PERIPHERAL_SHIFT':
        severity = 'info';
        message = `Hardware shift detected: Built-in Trackpad -> External Gaming Mouse (1000Hz). Baseline updated.`;
        break;
      case 'PROXIMITY_ALERT':
        severity = 'critical';
        message = `Linked mobile device out of BLE range. Desktop session locked down.`;
        break;
      case 'SESSION_HANDOVER':
        severity = 'info';
        message = `Zero-Trust Handover: Mobile -> Desktop. Behavioral identity roaming profile synced.`;
        break;
      case 'PROCESS_HOOK':
        severity = 'info';
        message = `Target process 'Discord.exe' discovered. Telemetry hook attached successfully.`;
        break;
    }

    return {
      id: `EVT-${this.eventIdCounter.toString().padStart(5, '0')}`,
      timestamp: new Date(),
      type,
      message,
      severity,
      module
    };
  }

  generateTrajectoryData(count: number): TrajectoryPoint[] {
    const data: TrajectoryPoint[] = [];
    let x = 100;
    let y = 100;
    for (let i = 0; i < count; i++) {
      x += (Math.random() - 0.5) * 20;
      y += (Math.random() - 0.5) * 20;
      
      const isAnomalous = Math.random() > 0.95 || this.activeChaosAttacks.includes('headless_webdriver');
      const rawX = isAnomalous ? x + (Math.random() > 0.5 ? 50 : -50) : x + (Math.random() - 0.5) * 5;
      const rawY = isAnomalous ? y + (Math.random() > 0.5 ? 50 : -50) : y + (Math.random() - 0.5) * 5;

      const kalmanX = x; 
      const kalmanY = y;

      data.push({ time: i, rawX, rawY, kalmanX, kalmanY, isAnomalous });
    }
    return data;
  }

  generateCadenceData(): CadenceData[] {
    const pairs = ['t-h', 'h-e', 'e-[space]', 'q-u', 'u-i', 'i-c', 'c-k'];
    return pairs.map(pair => ({
      keyPair: pair,
      dwellTime: 80 + Math.random() * 40,
      flightTime: 120 + Math.random() * 60,
      baselineDwell: 90 + Math.random() * 20,
      baselineFlight: 130 + Math.random() * 30
    }));
  }

  generateAnomalyClusters(): AnomalyCluster[] {
    const clusters: AnomalyCluster[] = [];
    for(let i=0; i<40; i++) clusters.push({ x: 20 + Math.random()*30, y: 20 + Math.random()*30, z: 10 + Math.random()*20, type: 'normal', label: 'Baseline' });
    for(let i=0; i<15; i++) clusters.push({ x: 60 + Math.random()*20, y: 60 + Math.random()*20, z: 30 + Math.random()*40, type: 'suspicious', label: 'Deviation' });
    for(let i=0; i<5; i++) clusters.push({ x: 85 + Math.random()*10, y: 10 + Math.random()*80, z: 60 + Math.random()*40, type: 'malicious', label: 'Known Threat' });
    return clusters;
  }

  generateRoutes(): PolymorphicRoute[] {
    return [
      { id: 'auth-gateway', currentHash: '0x' + Math.random().toString(16).substr(2, 8), nextRotation: 45, status: 'active', traffic: 1240 },
      { id: 'telemetry-sink', currentHash: '0x' + Math.random().toString(16).substr(2, 8), nextRotation: 12, status: 'active', traffic: 8900 },
      { id: 'vertex-pipeline', currentHash: '0x' + Math.random().toString(16).substr(2, 8), nextRotation: 2, status: 'mutating', traffic: 450 },
      { id: 'legacy-api-v1', currentHash: '0x' + Math.random().toString(16).substr(2, 8), nextRotation: 0, status: 'deprecated', traffic: 0 },
    ];
  }

  generateGazeData(count: number): GazeDataPoint[] {
    const data: GazeDataPoint[] = [];
    let x = 500; let y = 300;
    for (let i = 0; i < count; i++) {
      const isSaccade = Math.random() > 0.8;
      if (isSaccade) {
        x += (Math.random() - 0.5) * 200;
        y += (Math.random() - 0.5) * 200;
      } else {
        x += (Math.random() - 0.5) * 10; // Micro-saccade jitter
        y += (Math.random() - 0.5) * 10;
      }
      const velocity = isSaccade ? 300 + Math.random() * 200 : 10 + Math.random() * 20;
      data.push({ time: i, x, y, saccadeVelocity: velocity, isAnomalous: velocity > 450 && !isSaccade });
    }
    return data;
  }

  generateTremorData(count: number): TremorData[] {
    const data: TremorData[] = [];
    const now = new Date();
    let fatigue = 10;
    for (let i = count; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 1000);
      fatigue += (Math.random() - 0.2) * 0.5; // Slowly increasing fatigue
      data.push({
        time: time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        frequencyHz: 8 + Math.random() * 4 + (fatigue * 0.1), // 8-12Hz physiological tremor
        amplitude: 0.5 + Math.random() * 0.5 + (fatigue * 0.05),
        fatigueIndex: Math.max(0, Math.min(100, fatigue))
      });
    }
    return data;
  }

  generateVertexPredictions(count: number): VertexPrediction[] {
    const features = ['kinematic_fusion', 'gaze_jitter', 'cadence_drift', 'route_hash_fail', 'dom_tamper', 'peripheral_shift'];
    return Array.from({ length: count }, () => {
      this.predictionIdCounter++;
      return {
        id: `VPX-${this.predictionIdCounter.toString().padStart(6, '0')}`,
        timestamp: new Date(),
        entityId: `usr_${Math.random().toString(36).substr(2, 6)}`,
        riskScore: Math.random() > 0.9 ? 85 + Math.random() * 14 : 5 + Math.random() * 20,
        latencyMs: 12 + Math.random() * 25, // Ultra-low latency online prediction
        primaryFeature: features[Math.floor(Math.random() * features.length)]
      };
    });
  }

  generateIPSwarms(): IPSwarm[] {
    const regions = ['192.168.x.x (Proxy)', '10.0.x.x (VPN)', '45.33.x.x (Tor)', '185.20.x.x (Botnet)'];
    return regions.map(r => ({
      origin: r,
      volume: Math.floor(1000 + Math.random() * 5000),
      status: Math.random() > 0.5 ? 'bounding' : 'blocked',
      threatLevel: 70 + Math.random() * 30
    }));
  }

  generateTTPEvents(count: number): TTPEvent[] {
    const tactics = ['Credential Access', 'Execution', 'Defense Evasion', 'Collection'];
    const techniques = ['Token Theft', 'DOM Tampering', 'API Hooking (Frida)', 'Automated Scraping', 'Clipboard Exfiltration'];
    return Array.from({ length: count }, () => ({
      id: `TTP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      tactic: tactics[Math.floor(Math.random() * tactics.length)],
      technique: techniques[Math.floor(Math.random() * techniques.length)],
      severity: Math.random() > 0.8 ? 'critical' : 'high',
      timestamp: new Date()
    }));
  }

  generateEntropyData(count: number): EntropyData[] {
    const data: EntropyData[] = [];
    const now = new Date();
    for (let i = count; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 200); // Fast updates
      data.push({
        time: time.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit', fractionalSecondDigits: 1 }),
        value: Math.random() * 100
      });
    }
    return data;
  }

  generateZKPCircuits(count: number): ZKPCircuit[] {
    const types = ['zk-SNARK (Groth16)', 'zk-STARK', 'Bulletproofs', 'PLONK'];
    return Array.from({ length: count }, () => ({
      id: `ZKP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: Math.random() > 0.15 ? 'verified' : 'proving',
      timeMs: 45 + Math.random() * 150
    }));
  }

  generateDOMHashEvents(count: number): DOMHashEvent[] {
    const nodes = ['div#root', 'form.login-form', 'button#submit', 'input[name="password"]', 'nav.sidebar'];
    return Array.from({ length: count }, () => {
      this.domEventIdCounter++;
      const match = Math.random() > 0.05; // 5% chance of mismatch (tampering)
      const expected = '0x' + Math.random().toString(16).substr(2, 16);
      return {
        id: `DOM-${this.domEventIdCounter}`,
        timestamp: new Date(),
        node: nodes[Math.floor(Math.random() * nodes.length)],
        expectedHash: expected,
        actualHash: match ? expected : '0x' + Math.random().toString(16).substr(2, 16),
        match
      };
    });
  }

  generateFinancialMetrics(): FinancialMetric[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      month,
      fraudPrevented: 120000 + (i * 15000) + (Math.random() * 20000),
      operationalSavings: 45000 + (i * 2000) + (Math.random() * 5000)
    }));
  }

  // Telemetry-to-Technique Mapping Engine
  generateMitreMatrix(): MitreTactic[] {
    this.attackPhase = (this.attackPhase + 1) % 10; // Cycle through attack phases
    
    const isInitialAccess = this.attackPhase === 1 || this.attackPhase === 2;
    const isExecution = this.attackPhase === 3 || this.attackPhase === 4;
    const isDefenseEvasion = this.attackPhase === 5 || this.attackPhase === 6;
    const isCredentialAccess = this.attackPhase === 7 || this.attackPhase === 8;

    return [
      {
        id: 'TA0001', name: 'Initial Access',
        techniques: [
          { id: 'T1078', name: 'Valid Accounts', active: isInitialAccess, description: 'Compromised credentials used.' },
          { id: 'T1190', name: 'Exploit Public-Facing App', active: false, description: 'Exploiting a vulnerability.' },
          { id: 'T1566', name: 'Phishing', active: false, description: 'Spearphishing attachment/link.' }
        ]
      },
      {
        id: 'TA0002', name: 'Execution',
        techniques: [
          { id: 'T1059.007', name: 'JavaScript/Bot Execution', active: isExecution, description: 'High Key-Flight Time Uniformity + Web User Agent.' },
          { id: 'T1204', name: 'User Execution', active: false, description: 'User clicked malicious link.' },
          { id: 'T1047', name: 'WMI', active: false, description: 'Windows Management Instrumentation.' }
        ]
      },
      {
        id: 'TA0005', name: 'Defense Evasion',
        techniques: [
          { id: 'T1542', name: 'Subvert Trust Controls', active: isDefenseEvasion, description: 'Missing App Check Token / Dev Client.' },
          { id: 'T1562', name: 'Impair Defenses', active: false, description: 'Disabling security tools.' },
          { id: 'T1027', name: 'Obfuscated Files', active: false, description: 'Payload encryption.' }
        ]
      },
      {
        id: 'TA0006', name: 'Credential Access',
        techniques: [
          { id: 'T1539', name: 'Steal Web Session Cookie', active: isCredentialAccess, description: 'Failed IP Reputation + Valid JWT Session.' },
          { id: 'T1110', name: 'Brute Force', active: false, description: 'Password guessing.' },
          { id: 'T1003', name: 'OS Credential Dumping', active: false, description: 'LSASS memory dump.' }
        ]
      },
      {
        id: 'TA0007', name: 'Discovery',
        techniques: [
          { id: 'T1082', name: 'System Info Discovery', active: false, description: 'Querying OS details.' },
          { id: 'T1049', name: 'System Network Connections', active: false, description: 'Netstat enumeration.' },
          { id: 'T1018', name: 'Remote System Discovery', active: false, description: 'Ping sweeps.' }
        ]
      }
    ];
  }

  generateAttackTimeline(): AttackTimelineEvent[] {
    const now = new Date();
    return [
      { id: 'EV-1', timestamp: new Date(now.getTime() - 120000), tactic: 'Initial Access', techniqueId: 'T1078', techniqueName: 'Valid Accounts', description: 'Login from unknown IP using valid credentials.' },
      { id: 'EV-2', timestamp: new Date(now.getTime() - 90000), tactic: 'Execution', techniqueId: 'T1059.007', techniqueName: 'JavaScript/Bot Execution', description: 'Perfectly uniform keystroke flight-times detected.' },
      { id: 'EV-3', timestamp: new Date(now.getTime() - 45000), tactic: 'Defense Evasion', techniqueId: 'T1542', techniqueName: 'Subvert Trust Controls', description: 'X-Firebase-AppCheck header missing or invalid.' },
      { id: 'EV-4', timestamp: new Date(now.getTime() - 10000), tactic: 'Credential Access', techniqueId: 'T1539', techniqueName: 'Steal Web Session Cookie', description: 'Session hijacked. Compound risk score exceeded 0.80.' }
    ];
  }

  exportMitreNavigatorJSON(matrix: MitreTactic[]): string {
    const activeTechniques = matrix.flatMap(t => t.techniques).filter(tech => tech.active);
    
    const layer = {
      name: "ZTA-BioAuth Threat Export",
      versions: { attack: "14", navigator: "4.9.1", layer: "4.5" },
      domain: "enterprise-attack",
      description: "Exported forensic timeline from Project ZTA-BioAuth.",
      techniques: activeTechniques.map(tech => ({
        techniqueID: tech.id,
        color: "#ff003c",
        comment: `Detected via BioAuth Telemetry: ${tech.description}`,
        enabled: true,
        metadata: [],
        links: [],
        showSubtechniques: false
      })),
      gradient: { colors: ["#ff6666", "#ff003c"], minValue: 0, maxValue: 100 },
      legendItems: []
    };

    return JSON.stringify(layer, null, 2);
  }

  generateLeaderboard(): LeaderboardEntry[] {
    const names = ['Alpha_Wolf', 'Cyber_Ninja', 'ZeroTrust_Hero', 'Data_Guardian', 'Packet_Surfer'];
    return names.map((alias, i) => ({
      rank: i + 1,
      alias,
      healthScore: 99.9 - (i * 0.5) - Math.random() * 0.2,
      challengesCompleted: 150 - (i * 12)
    }));
  }

  generateSystemResource(): SystemResource {
    return {
      cpu: 25 + Math.random() * 15,
      memory: 45 + Math.random() * 10,
      disk: 60 + Math.random() * 2,
      networkTx: 150 + Math.random() * 50,
      networkRx: 300 + Math.random() * 100
    };
  }

  generateComplianceLogs(count: number): ComplianceLog[] {
    const frameworks: ComplianceLog['framework'][] = ['NIST SP 800-207', 'NIS2', 'ISO 27001'];
    const controls = ['AC-2', 'SC-8', 'AU-6', 'IA-5', 'SI-4'];
    return Array.from({ length: count }, () => {
      this.complianceIdCounter++;
      return {
        id: `AUDIT-${this.complianceIdCounter.toString().padStart(6, '0')}`,
        timestamp: new Date(),
        framework: frameworks[Math.floor(Math.random() * frameworks.length)],
        control: controls[Math.floor(Math.random() * controls.length)],
        status: Math.random() > 0.9 ? 'AUDIT' : 'PASS',
        detail: 'Continuous behavioral attestation verified.'
      };
    });
  }

  generatePeripheralData(): PeripheralData {
    const isGaming = Math.random() > 0.8;
    return {
      deviceType: isGaming ? 'Gaming Mouse' : 'Trackpad',
      pollingRateHz: isGaming ? 1000 : 125,
      precisionDpi: isGaming ? 3200 : 400,
      isBaselineMatch: !isGaming
    };
  }

  generateProximityData(): ProximityData {
    const distance = 0.5 + Math.random() * 5;
    return {
      linkedDevice: 'iPhone 14 Pro (User)',
      distanceMeters: distance,
      status: distance > 4 ? 'locked' : distance > 2 ? 'warning' : 'secure',
      connectionType: 'BLE'
    };
  }

  generateGamificationProfile(): GamificationProfile {
    return {
      tier: 'Platinum',
      streakDays: 42,
      xp: 12450,
      achievements: ['Zero-Trust Hero', 'Perfect Cadence', 'Phishing Spotter', 'Red Team Initiate']
    };
  }

  generateThreatFeeds(count: number): ThreatFeedIndicator[] {
    const sources: ('IP Reputation' | 'OWASP AST10')[] = ['IP Reputation', 'OWASP AST10'];
    const indicators = ['185.20.x.x (Tor Exit)', '45.33.x.x (Botnet)', 'AST10-Campaign-Alpha', 'AST10-Scraper-Bot'];
    return Array.from({ length: count }, () => {
      this.threatFeedIdCounter++;
      return {
        id: `IND-${this.threatFeedIdCounter.toString().padStart(5, '0')}`,
        source: sources[Math.floor(Math.random() * sources.length)],
        indicator: indicators[Math.floor(Math.random() * indicators.length)],
        riskMultiplier: 1.2 + Math.random() * 0.6, // 20% to 80% increase
        timestamp: new Date()
      };
    });
  }

  generateCompoundRiskData(count: number): CompoundRiskData[] {
    const data: CompoundRiskData[] = [];
    const now = new Date();
    for (let i = count; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2000);
      const biometricRisk = Math.random() * 0.4; // 0.0 to 0.4 normal risk
      const threatMultiplier = Math.random() > 0.8 ? 1.5 + Math.random() * 1.0 : 1.0; // Occasional threat spike
      
      let finalRiskScore = Math.min(1.0, biometricRisk * threatMultiplier);
      let action: CompoundRiskData['action'] = 'ALLOW';
      
      if (finalRiskScore > 0.8) {
        action = 'HONEYPOT';
      } else if (finalRiskScore > 0.5) {
        action = 'STEP_UP';
      }

      data.push({
        time: time.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        biometricRisk,
        threatMultiplier,
        finalRiskScore,
        action
      });
    }
    return data;
  }

  // XAI Feedback Engine for "Mimic the Bot"
  generateXAIFeedback(noiseLevel: number): XAIFeedback {
    // Higher noise = more human-like (harder to mimic a bot perfectly)
    const isBot = noiseLevel < 30 && Math.random() > 0.2; 
    
    const features = [
      'Key-Hold Duration Variance',
      'Flight-Time Asymmetry',
      'Swipe Curvature Deviation',
      'Velocity Coefficient Spike',
      'Micro-Saccade Absence'
    ];

    // Shuffle and pick top 2 failed features
    const shuffled = features.sort(() => 0.5 - Math.random());
    const topFailedFeatures = isBot ? [] : shuffled.slice(0, 2);

    return {
      mahalanobisDistance: isBot ? 1.2 + Math.random() * 2 : 15.4 + Math.random() * 20, // Low distance = close to bot baseline
      velocityVariance: isBot ? 0.01 + Math.random() * 0.05 : 0.4 + Math.random() * 0.8,
      topFailedFeatures,
      isBot
    };
  }

  // Forensic Evidence Package Exporter
  exportForensicPackage(): string {
    const bundle = {
      incident_id: `INC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      telemetry_snapshot: this.generateTrajectoryData(100),
      threat_indicators: this.generateThreatFeeds(3),
      risk_matrix: {
        mahalanobis_distance: 24.5,
        velocity_coefficient: 0.89,
        compound_risk_score: 0.92
      },
      pcap_reference: "s3://zta-forensics/pcaps/session_8923.pcap"
    };
    return JSON.stringify(bundle, null, 2);
  }

  // Automated Lab Benchmark Export
  exportBenchmarkCSV(noiseLevel: number, feedback: XAIFeedback): string {
    const headers = "timestamp,noise_level,mahalanobis_distance,velocity_variance,is_bot_classified,failed_features\n";
    const row = `${new Date().toISOString()},${noiseLevel},${feedback.mahalanobisDistance.toFixed(4)},${feedback.velocityVariance.toFixed(4)},${feedback.isBot},"${feedback.topFailedFeatures.join(';')}"\n`;
    return headers + row;
  }

  // Policy Boundary Simulator (FAR/FRR)
  generatePolicySimulationData(config: MicroPolicyConfig): PolicySimulationData[] {
    const data: PolicySimulationData[] = [];
    
    // The intersection point shifts based on tolerance and threat multiplier
    const intersectionShift = (config.biometricDriftTolerance * 100) - ((config.threatMultiplier - 1) * 10);
    
    for (let i = 0; i <= 100; i += 5) {
      // Simulate False Acceptance Rate (FAR) - decreases as anomaly score increases
      // Shifts right as tolerance increases
      let far = 100 * Math.exp(-0.05 * Math.max(0, i - intersectionShift + 20));
      
      // Simulate False Rejection Rate (FRR) - increases as anomaly score increases
      // Shifts right as tolerance increases
      let frr = 100 / (1 + Math.exp(-0.1 * (i - intersectionShift - 20)));

      data.push({
        anomalyScore: i,
        far: Math.max(0, Math.min(100, far)),
        frr: Math.max(0, Math.min(100, frr))
      });
    }
    return data;
  }

  // Adaptive Predictive Risk Engine
  generatePredictiveRiskData(count: number): PredictiveRiskData[] {
    const data: PredictiveRiskData[] = [];
    const now = new Date();
    
    for (let i = count; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2000);
      
      // 1. Raw Anomaly (0.0 to 1.0)
      const rawAnomaly = Math.random() * 0.3 + (Math.random() > 0.9 ? 0.5 : 0); // Occasional spikes
      
      // 2. Temporal Decay & Velocity Tracking (EMA)
      // Alpha = 2 / (N + 1). Let's use N=5 for fast momentum tracking.
      const alpha = 2 / (5 + 1);
      const emaMomentum = (rawAnomaly * alpha) + (this.previousEma * (1 - alpha));
      this.previousEma = emaMomentum;

      // 3. Bayesian Inference Threat-Weighting (Prior Probability)
      // Simulate a live threat feed altering the prior probability
      const bayesianPrior = Math.random() > 0.8 ? 0.6 : 0.1; // 60% prior if under attack, 10% normally

      // 4. Hardware-Contextual Baseline Weighting (Environmental Anchor)
      // 1.0 = perfect match, 0.0 = completely new hardware
      const hardwareAnchor = Math.random() > 0.9 ? 0.2 : 0.95; 

      // Final Compound Equation
      // If hardware matches (anchor ~ 1.0), reduce the impact of the raw anomaly (assume fatigue).
      // If hardware differs (anchor ~ 0.0), amplify the anomaly.
      // Then apply Bayesian prior to shift the final distribution.
      
      const hardwareAdjustedAnomaly = emaMomentum * (1 + (1 - hardwareAnchor));
      
      // Simplified Bayesian update: Posterior ~ Likelihood * Prior
      // We treat the hardwareAdjustedAnomaly as the likelihood of an attack given the telemetry.
      const finalPredictiveRisk = Math.min(1.0, hardwareAdjustedAnomaly * (1 + bayesianPrior));

      data.push({
        time: time.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        rawAnomaly,
        emaMomentum,
        bayesianPrior,
        hardwareAnchor,
        finalPredictiveRisk
      });
    }
    return data;
  }

  generateSandboxLeaderboard(): SandboxLeaderboardEntry[] {
    return [
      { rank: 1, alias: 'Arch_Mage', efficiencyScore: 98.5, cost: 1200, badge: 'Zero Trust Overlord' },
      { rank: 2, alias: 'Net_Weaver', efficiencyScore: 95.2, cost: 1450, badge: 'Perimeter Master' },
      { rank: 3, alias: 'Byte_Knight', efficiencyScore: 91.0, cost: 1100, badge: 'Cost Optimizer' },
      { rank: 4, alias: 'Sys_Admin_X', efficiencyScore: 88.4, cost: 1800, badge: 'Defense in Depth' },
      { rank: 5, alias: 'Ghost_Protocol', efficiencyScore: 85.1, cost: 1300, badge: 'Stealth Architect' },
    ];
  }

  // Vertex AI Context Pipeline Simulation
  generateVertexClusterPoints(count: number): VertexClusterPoint[] {
    const points: VertexClusterPoint[] = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      if (rand < 0.7) {
        // Core Cluster (Dense, Center)
        points.push({
          x: 40 + Math.random() * 20,
          y: 40 + Math.random() * 20,
          z: 40 + Math.random() * 20,
          cluster: 'Core'
        });
      } else if (rand < 0.9) {
        // Drift Cluster (Spread, slightly off-center)
        points.push({
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          z: 20 + Math.random() * 60,
          cluster: 'Drift'
        });
      } else {
        // Outlier Cluster (Sparse, far off)
        points.push({
          x: Math.random() > 0.5 ? Math.random() * 20 : 80 + Math.random() * 20,
          y: Math.random() > 0.5 ? Math.random() * 20 : 80 + Math.random() * 20,
          z: Math.random() > 0.5 ? Math.random() * 20 : 80 + Math.random() * 20,
          cluster: 'Outlier'
        });
      }
    }
    return points;
  }

  generateVertexRetrainingEvents(count: number): VertexRetrainingEvent[] {
    return Array.from({ length: count }, () => {
      this.retrainingEventIdCounter++;
      const isBaseline = Math.random() > 0.3;
      return {
        id: `RET-${this.retrainingEventIdCounter.toString().padStart(5, '0')}`,
        timestamp: new Date(),
        type: isBaseline ? 'Baseline Adjusted' : 'Adversarial Tagged',
        details: isBaseline 
          ? 'User shifted into Drift Cluster over 5 verified sessions. Profile updated.' 
          : 'Consistent Outlier Cluster mapping + OTX Threat Match. Exported to forensics.',
        userId: `usr_${Math.random().toString(36).substr(2, 6)}`
      };
    });
  }

  generateVertexIngestionMetrics(count: number): VertexIngestionMetric[] {
    const data: VertexIngestionMetric[] = [];
    const now = new Date();
    for (let i = count; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 1000);
      data.push({
        time: time.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        latencyMs: 15 + Math.random() * 25, // Under 50ms
        throughput: 4500 + Math.random() * 1500
      });
    }
    return data;
  }

  // Active Process Monitoring Simulation
  generateActiveProcessData(): ActiveProcessData[] {
    const processes: ActiveProcessData[] = [
      { processName: 'Discord.exe', pid: 14520, platform: 'Windows', isApprovedTarget: true, hookStatus: 'Hooked' },
      { processName: 'Steam.exe', pid: 8924, platform: 'Windows', isApprovedTarget: true, hookStatus: 'Scanning' },
      { processName: 'com.epicgames.portal', pid: 402, platform: 'Android', isApprovedTarget: true, hookStatus: 'Hooked' },
      { processName: 'Minecraft.app', pid: 1102, platform: 'macOS', isApprovedTarget: true, hookStatus: 'Detached' }
    ];
    
    // Randomly select 1 or 2 active processes
    const numActive = Math.floor(Math.random() * 2) + 1;
    const shuffled = processes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numActive);
  }

  // Deterministic Routing & Packet-Filtering Simulator
  validatePacketFlow(attackType: string, nodes: SandboxNode[], connections: SandboxConnection[]): PacketSimulationResult {
    // 1. Find entry point (Laptop or IoT)
    const entryNodes = nodes.filter(n => n.type === 'Laptop' || n.type === 'IoT');
    if (entryNodes.length === 0) {
      return { success: true, message: 'No entry point found. Attack mitigated.' };
    }

    // 2. Define attack payload characteristics based on type
    let payloadPort = '80';
    let payloadProtocol = 'TCP';
    let targetType = 'Server';

    switch (attackType) {
      case 'SQL Injection':
        payloadPort = '443';
        targetType = 'DB';
        break;
      case 'Distributed Denial of Service (DDoS)':
        payloadProtocol = 'UDP';
        targetType = 'Server';
        break;
      case 'Lateral Movement':
        payloadPort = '22'; // SSH
        targetType = 'Server';
        break;
      case 'Credential Stuffing':
        payloadPort = '443';
        targetType = 'ZTAGateway';
        break;
    }

    // 3. Traverse the graph (BFS)
    let queue: string[] = [entryNodes[0].id];
    let visited: Set<string> = new Set([entryNodes[0].id]);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentNode = nodes.find(n => n.id === currentId);
      
      if (!currentNode) continue;

      // Check if we reached the target
      if (currentNode.type === targetType) {
        return { 
          success: false, 
          message: `Breach successful. Payload reached ${targetType}.`,
          failedAtNodeId: currentId
        };
      }

      // Evaluate Firewall Rules deterministically
      if (currentNode.type === 'Firewall') {
        let packetAllowed = false;
        
        // Default deny if no rules
        if (!currentNode.config.firewallRules || currentNode.config.firewallRules.length === 0) {
           return { success: true, message: 'Firewall default deny triggered. Attack mitigated.', failedAtNodeId: currentId };
        }

        for (const rule of currentNode.config.firewallRules) {
          // Simple deterministic matching
          const portMatch = rule.port === 'ANY' || rule.port === payloadPort;
          const protocolMatch = rule.protocol === 'ANY' || rule.protocol === payloadProtocol;
          
          if (portMatch && protocolMatch) {
            if (rule.action === 'DENY') {
              return { 
                success: true, 
                message: `Firewall rule DENY matched. Attack mitigated.`,
                failedAtNodeId: currentId,
                failedRule: `${rule.action} ${rule.sourceIp} ${rule.destIp} ${rule.port} ${rule.protocol}`
              };
            } else if (rule.action === 'ALLOW') {
              packetAllowed = true;
              break; // Stop evaluating rules, packet is allowed through this node
            }
          }
        }

        if (!packetAllowed) {
           return { success: true, message: 'Implicit deny. Attack mitigated.', failedAtNodeId: currentId };
        }
      }

      // Evaluate ZTA Gateway
      if (currentNode.type === 'ZTAGateway') {
        // ZTA requires specific trust scores or biometric validation
        // For simulation, we assume ZTA blocks lateral movement (SSH) and DDoS
        if (attackType === 'Lateral Movement' || attackType === 'Distributed Denial of Service (DDoS)') {
           return { success: true, message: 'ZTA Gateway blocked unauthorized context. Attack mitigated.', failedAtNodeId: currentId };
        }
      }

      // Find neighbors
      const neighbors = connections
        .filter(c => c.from === currentId)
        .map(c => c.to);

      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);
        }
      }
    }

    return { success: true, message: 'Attack path exhausted. Target not reached.' };
  }

  // Mock SHA-256 generator for Chain of Custody
  private mockSha256(data: string): string {
    return Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
  }

  generateForensicTimeline(): ForensicEvent[] {
    const events: ForensicEvent[] = [];
    const now = new Date();
    let prevHash = "0000000000000000000000000000000000000000000000000000000000000000";

    const rawEvents = [
      { track: 'Network', title: 'New Connection Established', desc: 'Inbound TCP connection from 185.20.x.x', isCritical: false },
      { track: 'ThreatIntel', title: 'OTX Pulse Match', desc: 'IP 185.20.x.x matches known Tor Exit Node', isCritical: true },
      { track: 'Biometric', title: 'Keystroke Anomaly', desc: 'Flight-time variance dropped by 85% (Robotic)', isCritical: true },
      { track: 'Network', title: 'DNS Lookup', desc: 'Query for internal.db.local', isCritical: false },
      { track: 'Biometric', title: 'Velocity Spike', desc: 'Mouse acceleration exceeds human limits', isCritical: true },
      { track: 'Network', title: 'Firewall Drop', desc: 'DENY rule triggered on port 22', isCritical: false },
      { track: 'ThreatIntel', title: 'MISP Indicator', desc: 'Payload signature matches T1539', isCritical: true },
      { track: 'Network', title: 'Session Hijack Attempt', desc: 'Valid JWT used from new context', isCritical: true },
    ];

    rawEvents.forEach((re, i) => {
      const id = `FEV-${i}`;
      const hash = this.mockSha256(id + prevHash);
      events.push({
        id,
        timestamp: new Date(now.getTime() - (rawEvents.length - i) * 15000),
        track: re.track as any,
        title: re.title,
        description: re.desc,
        hash,
        previousHash: prevHash,
        relatedEventIds: i > 0 ? [`FEV-${i-1}`] : [],
        isCritical: re.isCritical
      });
      prevHash = hash;
    });

    // Add some cross-track relations
    events[2].relatedEventIds.push('FEV-1'); // Biometric anomaly related to OTX match
    events[6].relatedEventIds.push('FEV-4'); // MISP indicator related to velocity spike
    events[7].relatedEventIds.push('FEV-6'); // Session hijack related to MISP indicator

    return events;
  }

  generateBlastRadius(eventId: string): { nodes: BlastRadiusNode[], edges: {from: string, to: string}[] } {
    // Mock topology based on the event
    const nodes: BlastRadiusNode[] = [
      { id: 'br_1', label: 'Public Gateway', type: 'Firewall', status: 'exposed' },
      { id: 'br_2', label: 'Auth Service', type: 'ZTAGateway', status: 'safe' },
      { id: 'br_3', label: 'Web App', type: 'Server', status: 'compromised' },
      { id: 'br_4', label: 'Customer DB', type: 'DB', status: 'safe' },
      { id: 'br_5', label: 'Attacker IP', type: 'Laptop', status: 'compromised' }
    ];
    const edges = [
      { from: 'br_5', to: 'br_1' },
      { from: 'br_1', to: 'br_3' },
      { from: 'br_3', to: 'br_2' },
      { from: 'br_2', to: 'br_4' }
    ];

    // If it's a critical event, show more compromise
    if (eventId === 'FEV-7') {
      nodes.find(n => n.id === 'br_2')!.status = 'exposed';
      nodes.find(n => n.id === 'br_4')!.status = 'exposed';
    }

    return { nodes, edges };
  }

  // Topology Validation Engine
  validateTopology(nodes: SandboxNode[], connections: SandboxConnection[]): TopologyValidationResult {
    if (nodes.length === 0) {
      return { isValid: false, message: 'Canvas is empty. Please add nodes.', isolatedNodes: [] };
    }

    const entryNodes = nodes.filter(n => n.type === 'Laptop' || n.type === 'IoT');
    const targetNodes = nodes.filter(n => n.type === 'DB' || n.type === 'Server');

    if (entryNodes.length === 0) {
      return { isValid: false, message: 'Missing entry point (Laptop or IoT).', isolatedNodes: [] };
    }
    if (targetNodes.length === 0) {
      return { isValid: false, message: 'Missing target asset (DB or Server).', isolatedNodes: [] };
    }

    // Check for isolated nodes
    const connectedNodeIds = new Set<string>();
    connections.forEach(c => {
      connectedNodeIds.add(c.from);
      connectedNodeIds.add(c.to);
    });

    const isolatedNodes = nodes.filter(n => !connectedNodeIds.has(n.id)).map(n => n.id);

    if (isolatedNodes.length > 0) {
      return { 
        isValid: false, 
        message: 'Some nodes are isolated. Please connect all nodes to the network.', 
        isolatedNodes 
      };
    }

    // Simple BFS to ensure a path exists from ANY entry to ANY target
    let pathExists = false;
    for (const entry of entryNodes) {
      let queue: string[] = [entry.id];
      let visited: Set<string> = new Set([entry.id]);

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        const currentNode = nodes.find(n => n.id === currentId);
        
        if (currentNode && (currentNode.type === 'DB' || currentNode.type === 'Server')) {
          pathExists = true;
          break;
        }

        const neighbors = connections
          .filter(c => c.from === currentId)
          .map(c => c.to);

        for (const neighborId of neighbors) {
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            queue.push(neighborId);
          }
        }
      }
      if (pathExists) break;
    }

    if (!pathExists) {
      return { isValid: false, message: 'No valid path from entry point to target asset.', isolatedNodes: [] };
    }

    return { isValid: true, message: 'Topology validated successfully.', isolatedNodes: [] };
  }

  // Forensic Export Engine
  exportCertifiedForensicBundle(events: ForensicEvent[], nodes: SandboxNode[], connections: SandboxConnection[]): void {
    // 1. Generate CSV Data Stream
    const csvHeaders = "timestamp,event_id,track,title,description,hash,previous_hash,is_critical\n";
    const csvRows = events.map(e => 
      `${e.timestamp.toISOString()},${e.id},${e.track},"${e.title}","${e.description}",${e.hash},${e.previousHash},${e.isCritical}`
    ).join('\n');
    const csvContent = csvHeaders + csvRows;

    // 2. Generate Mock PCAP (JSON representation for this demo)
    const pcapContent = JSON.stringify({
      magic_number: "a1b2c3d4",
      version_major: 2,
      version_minor: 4,
      thiszone: 0,
      sigfigs: 0,
      snaplen: 65535,
      network: 1,
      packets: events.filter(e => e.track === 'Network').map(e => ({
        ts_sec: Math.floor(e.timestamp.getTime() / 1000),
        ts_usec: (e.timestamp.getTime() % 1000) * 1000,
        incl_len: 64,
        orig_len: 64,
        data: `Mock packet data for ${e.title}`
      }))
    }, null, 2);

    // 3. Generate Mock PDF Summary (HTML representation for this demo)
    const pdfContent = `
      <html>
        <head><title>ZTA-BioAuth Executive Summary</title></head>
        <body>
          <h1>Project ZTA-BioAuth: Security Assessment</h1>
          <p><strong>Session ID:</strong> ${this.mockSha256(Date.now().toString()).substring(0, 16)}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <h2>Defensive Evaluation Grade: A-</h2>
          <p>False Acceptance Rate (FAR): 0.02%</p>
          <p>False Rejection Rate (FRR): 1.5%</p>
          <h2>Compliance Mapping</h2>
          <ul>
            <li>NIST SP 800-207: PASS</li>
            <li>NIS2: PASS</li>
            <li>ISO 27001: PASS</li>
          </ul>
        </body>
      </html>
    `;

    // 4. Generate Manifest with Hashes
    const manifestContent = `
      csv_hash: ${this.mockSha256(csvContent)}
      pcap_hash: ${this.mockSha256(pcapContent)}
      pdf_hash: ${this.mockSha256(pdfContent)}
    `;

    // 5. Bundle into a mock ZIP (using a JSON structure to simulate a bundle download)
    const bundle = {
      "telemetry_stream.csv": csvContent,
      "network_capture.pcap.json": pcapContent,
      "executive_summary.html": pdfContent,
      "manifest.sha256": manifestContent
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `certified_forensic_bundle_${Date.now()}.zip.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const simulationService = new SimulationService();
