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
  XAIFeedback, MicroPolicyConfig, PolicySimulationData
} from '../types.ts';

class SimulationService {
  private trustScore = 98.5;
  private eventIdCounter = 0;
  private predictionIdCounter = 0;
  private domEventIdCounter = 0;
  private complianceIdCounter = 0;
  private threatFeedIdCounter = 0;
  private activeChaosAttacks: string[] = [];
  private attackPhase = 0;

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
      'FOCUS_LOSS', 'PERIPHERAL_SHIFT', 'PROXIMITY_ALERT', 'SESSION_HANDOVER'
    ];
    const modules = [
      'Vertex AI Pipeline', 'Kalman Filter', 'Polymorphic Router', 'Micro-Friction Engine',
      'FIDO2 Interceptor', 'Generative AI Canary', 'PQC Session Binder', 'Token-Theft Invalidator',
      'LLM Scraper Trap', 'Clipboard Guardian', 'BLE Proximity Sync', 'Compound Risk Engine'
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
}

export const simulationService = new SimulationService();
