/*
 * Copyright (c) 2026 Muhammad Ehtisham Iqbal. All rights reserved.
 *
 * This software is part of the 'Project ZTA-BioAuth' academic and 
 * open-source research framework. 
 *
 * Use of this source code is governed by the dual-licensing strategy 
 * outlined in the main LICENSE file.
 */

export interface TrustDataPoint {
  time: string;
  score: number;
  threshold: number;
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'ANALYSIS' | 'THREAT_BLOCKED' | 'ATTESTATION' | 'SYSTEM' | 'SESSION_INVALIDATED' | 'COMPLIANCE_LOG' | 'FOCUS_LOSS' | 'PERIPHERAL_SHIFT' | 'PROXIMITY_ALERT' | 'SESSION_HANDOVER';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  module: string;
}

export interface SystemStatus {
  moduleName: string;
  status: 'active' | 'learning' | 'standby' | 'healing' | 'isolated' | 'quarantined';
  uptime: string;
}

export interface TrajectoryPoint {
  time: number;
  rawX: number;
  rawY: number;
  kalmanX: number;
  kalmanY: number;
  isAnomalous: boolean;
}

export interface CadenceData {
  keyPair: string;
  dwellTime: number;
  flightTime: number;
  baselineDwell: number;
  baselineFlight: number;
}

export interface AnomalyCluster {
  x: number;
  y: number;
  z: number; // size/severity
  type: 'normal' | 'suspicious' | 'malicious';
  label: string;
}

export interface PolymorphicRoute {
  id: string;
  currentHash: string;
  nextRotation: number; // seconds
  status: 'active' | 'mutating' | 'deprecated';
  traffic: number;
}

export interface GazeDataPoint {
  time: number;
  x: number;
  y: number;
  saccadeVelocity: number;
  isAnomalous: boolean;
}

export interface TremorData {
  time: string;
  frequencyHz: number;
  amplitude: number;
  fatigueIndex: number;
}

export interface VertexPrediction {
  id: string;
  timestamp: Date;
  entityId: string;
  riskScore: number;
  latencyMs: number;
  primaryFeature: string;
}

export interface IPSwarm {
  origin: string;
  volume: number;
  status: 'bounding' | 'blocked' | 'analyzing';
  threatLevel: number;
}

export interface TTPEvent {
  id: string;
  tactic: string;
  technique: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export interface EntropyData {
  time: string;
  value: number;
}

export interface ZKPCircuit {
  id: string;
  type: string;
  status: 'proving' | 'verified' | 'failed';
  timeMs: number;
}

export interface DOMHashEvent {
  id: string;
  timestamp: Date;
  node: string;
  expectedHash: string;
  actualHash: string;
  match: boolean;
}

export interface FinancialMetric {
  month: string;
  fraudPrevented: number;
  operationalSavings: number;
}

export interface MitreTechnique {
  id: string;
  name: string;
  active: boolean;
  description: string;
}

export interface MitreTactic {
  id: string;
  name: string;
  techniques: MitreTechnique[];
}

export interface AttackTimelineEvent {
  id: string;
  timestamp: Date;
  tactic: string;
  techniqueId: string;
  techniqueName: string;
  description: string;
}

export interface LeaderboardEntry {
  rank: number;
  alias: string;
  healthScore: number;
  challengesCompleted: number;
}

export interface SystemResource {
  cpu: number;
  memory: number;
  disk: number;
  networkTx: number;
  networkRx: number;
}

export interface ComplianceLog {
  id: string;
  timestamp: Date;
  framework: 'NIST SP 800-207' | 'NIS2' | 'ISO 27001';
  control: string;
  status: 'PASS' | 'FAIL' | 'AUDIT';
  detail: string;
}

export interface PeripheralData {
  deviceType: 'Trackpad' | 'External Mouse' | 'Gaming Mouse' | 'Stylus';
  pollingRateHz: number;
  precisionDpi: number;
  isBaselineMatch: boolean;
}

export interface ProximityData {
  linkedDevice: string;
  distanceMeters: number;
  status: 'secure' | 'warning' | 'locked';
  connectionType: 'BLE' | 'Cloud Sync';
}

export interface GamificationProfile {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  streakDays: number;
  xp: number;
  achievements: string[];
}

export interface ThreatFeedIndicator {
  id: string;
  source: 'IP Reputation' | 'OWASP AST10';
  indicator: string;
  riskMultiplier: number;
  timestamp: Date;
}

export interface CompoundRiskData {
  time: string;
  biometricRisk: number; // 0.0 to 1.0
  threatMultiplier: number;
  finalRiskScore: number; // 0.0 to 1.0
  action: 'ALLOW' | 'STEP_UP' | 'HONEYPOT';
}

export interface XAIFeedback {
  mahalanobisDistance: number;
  velocityVariance: number;
  topFailedFeatures: string[];
  isBot: boolean;
}

export interface MicroPolicyConfig {
  biometricDriftTolerance: number; // 0.0 to 1.0
  threatMultiplier: number; // 1.0 to 5.0
  frictionDecayRate: number; // 1 to 60 mins
  mfaStrictness: number; // 1, 2, 3
}

export interface PolicySimulationData {
  anomalyScore: number;
  far: number; // False Acceptance Rate
  frr: number; // False Rejection Rate
}

export enum RoutePaths {
  DASHBOARD = '/',
  BIOMETRICS = '/biometrics',
  THREAT_MAP = '/threats',
  EXECUTIVE = '/executive',
  USER_PORTAL = '/user-portal',
  SYSTEM_TELEMETRY = '/system-telemetry',
  SETTINGS = '/settings',
  DOCUMENTATION = '/docs',
  LICENSE = '/license'
}
