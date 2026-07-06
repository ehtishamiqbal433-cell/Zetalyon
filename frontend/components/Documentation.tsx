import React from 'react';
import { Book, Shield, Cpu, Network, Zap, Lock, EyeOff, Layers, Bot, Database, Activity, Fingerprint, Hash, TrendingUp, UserCircle, Server, Mouse, Keyboard, Smartphone, Cloud, Crosshair, AlertTriangle, Download, Sliders, FileCode, BrainCircuit, Terminal, Trash2, Eye, HelpCircle } from 'lucide-react';

export const Documentation: React.FC = () => {
  const features = [
    {
      icon: <Smartphone className="text-green-400" size={24} />,
      title: 'Secure Mobile Network Routing (VpnService/NetworkExtension)',
      description: 'Initializes native OS network tunneling securely, enforcing TLS 1.3 transport layer encryption and strict certificate pinning. Utilizes Android Keystore / iOS Keychain for session tokens and implements a Kill Switch to prevent cleartext leaks.',
      technical: 'Routes packets exclusively to a designated, authenticated backend gateway IP/domain. Handles unexpected disconnections or network interface switches gracefully.'
    },
    {
      icon: <Cloud className="text-blue-400" size={24} />,
      title: 'Cloud Run Deployment & Artifact Registry Pipeline',
      description: 'Resolves the 10 MiB payload limitation by separating the container build phase (Cloud Build) from the deployment phase. Uses an aggressive `.gcloudignore` manifest and externalizes massive prompt strings to Cloud Storage.',
      technical: 'Bypasses payload limits by deploying a lightweight container string pointer. Ensures strict IAM isolation for externalized buckets.'
    },
    {
      icon: <HelpCircle className="text-blue-400" size={24} />,
      title: 'Secure User Support Ingress & Feedback Drawer',
      description: 'A unified right-hand slide-out configuration panel allowing users and academic reviewers to establish a direct reachability channel. Automatically serializes the active state tree into a detached diagnostic metadata header.',
      technical: 'Serverless delivery routing pipeline via Cloud Run. Strictly scrubs and sanitizes all typed messages of raw production keys or PII before transmission.'
    },
    {
      icon: <FileCode className="text-green-400" size={24} />,
      title: 'One-Click Infrastructure as Code (IaC) Export',
      description: 'Automatically generates and compiles a downloadable ZIP package containing production-ready Terraform scripts (`main.tf`) and Cisco/Fortinet ACL configurations based on the user\'s sandbox session.',
      technical: 'Backend compilation engine in Cloud Run translates visual topology and typed rules into standard IaC formats.'
    },
    {
      icon: <Network className="text-blue-400" size={24} />,
      title: 'Automated Network Ingestion (Reverse Mapping)',
      description: 'Allows IT experts to upload standard network topology configurations (Cisco Running-Config, AWS CloudFormation JSON). The parser programmatically extracts devices and instantly paints the interactive nodes onto the canvas.',
      technical: 'Regex and JSON parsing engine maps external schemas to internal SandboxNode state arrays.'
    },
    {
      icon: <Shield className="text-purple-400" size={24} />,
      title: 'Formally Verified Security Policy Matrix',
      description: 'An automated, formal verification solver (Z3-style) that scans typed firewall rules mathematically for structural human errors, such as shadow rules or open-any configuration leaks, before a simulation runs.',
      technical: 'Evaluates ACL matrices sequentially to identify unreachable or conflicting rule definitions.'
    },
    {
      icon: <Terminal className="text-zeta-accent" size={24} />,
      title: 'Live API Schema & OpenAPI Endpoint Playground',
      description: 'Embeds a live, interactive API documentation browser directly inside the administrative panels. Allows developers to inspect JSON telemetry payload schemas and copy cURL commands.',
      technical: 'React-based OpenAPI viewer rendering structured endpoint definitions and payload examples.'
    },
    {
      icon: <Eye className="text-blue-400" size={24} />,
      title: 'Ocular Kinematics & Predictive Trajectory Analysis',
      description: 'Captures microscopic user behaviors including Spatial-Temporal Mouse Trajectories (Kalman Filtered) and Micro-Saccade & Gaze Jitter Mapping via webcam/eye-tracking ingress.',
      technical: 'Calculates Jitter Frequency, Jerk Dynamics, and Fixational Gaze Entropy. Raw frames resolve locally into abstract mathematical matrices to preserve privacy.'
    },
    {
      icon: <Crosshair className="text-purple-400" size={24} />,
      title: 'Polymorphic TTP Behavior Mutation Matrix',
      description: 'A dynamic behavioral state machine that mimics an active attacker. If an initial vector is blocked, the engine automatically executes a "Mutation Loop" to pivot to a secondary polymorphic technique.',
      technical: 'Controlled by an "Adversarial Polymorphism Entropy" slider. High entropy randomizes keystroke timings, shuffles protocol headers, and modulates C2 beaconing.'
    },
    {
      icon: <Trash2 className="text-red-400" size={24} />,
      title: 'Asset Deletion & Contextual Node Swapping',
      description: 'Supports keyboard excision (Delete/Backspace) and contextual overlay menus to swap asset types mid-design. Automatically scrubs backend state dictionaries and recalculates routing paths to prevent phantom wires.',
      technical: 'Executes strictly inside local component state handlers, maintaining zero persistent trace indicators for privacy compliance.'
    },
    {
      icon: <Download className="text-blue-400" size={24} />,
      title: 'Forensic Evidence & Report Export Engine',
      description: 'Downloads production-grade, audit-ready data packages from the Event Reconstruction Console. Includes Executable Network PCAP files, Audit-Ready PDF Summaries, and CSV Data Streams for SIEM ingestion.',
      technical: 'Packages files into a Sealed ZIP Archive with a Cryptographic Chain-of-Custody manifest (SHA-256 hashes) to prove evidence integrity.'
    },
    {
      icon: <Network className="text-zeta-accent" size={24} />,
      title: 'Network Validation Engine (Cyber Range Sandbox)',
      description: 'An interactive node drafting canvas and "Live Fire" attack simulator. Features a Granular Asset Configuration Panel for text-based ingress of IPs, DNS, and Firewall ACLs. Uses a deterministic routing simulator to validate packet flows.',
      technical: 'React-based drag-and-drop canvas with SVG connection rendering and BFS-based deterministic packet filtering simulation.'
    },
    {
      icon: <Terminal className="text-zeta-accent" size={24} />,
      title: 'Active Process Monitoring & Telemetry Hooks',
      description: 'Automatically identifies and hooks into active game/application target processes running on Desktop (Windows, macOS) or Mobile (Android, iOS) platforms.',
      technical: 'Uses native platform channels (ps_list, Usage Stats, Custom URL handlers) wrapped in asynchronous low-overhead thread workers. Strictly processes telemetry timestamps and timing deltas to preserve privacy compliance.'
    },
    {
      icon: <Database className="text-zeta-accent" size={24} />,
      title: 'Vertex AI Context Pipeline (Unsupervised Clustering)',
      description: 'Streaming ingestion pipeline to Vertex AI Feature Store (<50ms latency). Uses HDBSCAN/Isolation Forests to group telemetry into Core, Drift, and Outlier clusters. Features automated real-time model retraining and drift feedback loops.',
      technical: 'Serverless worker pipeline via Cloud Run/Dataflow. Asynchronous Pub/Sub events decouple UI from heavy ML compute cycles.'
    },
    {
      icon: <BrainCircuit className="text-zeta-accent" size={24} />,
      title: 'Adaptive Predictive Risk Engine',
      description: 'Upgrades static risk scoring with Temporal Decay (EMA Momentum), Hardware-Contextual Anchoring, and Bayesian Inference Threat-Weighting. Executes complex floating-point matrix math in <5ms.',
      technical: 'Node.js/Express backend calculates posterior probabilities dynamically based on live threat feeds and hardware baseline matches.'
    },
    {
      icon: <FileCode className="text-green-400" size={24} />,
      title: 'DevSecOps Code Hardening & Obfuscation',
      description: 'Multi-stage Dockerfile architecture utilizing distroless containers. Employs esbuild and javascript-obfuscator to mangle, minify, and encrypt source code, preventing static extraction and reverse engineering.',
      technical: 'Strict environmental variable isolation via Google Cloud Secret Manager. No hardcoded secrets.'
    },
    {
      icon: <Sliders className="text-blue-400" size={24} />,
      title: 'Granular Micro-Policy Rule Configuration',
      description: 'A dynamic multidimensional dashboard to adjust Biometric Drift Tolerance, Threat Intelligence Multipliers, and MFA Strictness. Includes a Visual Policy Boundary Simulator (Shadow Mode) to model FAR/FRR trade-offs in real-time.',
      technical: 'React state debouncing syncs asynchronously with Express.js middleware via Firestore (`/infrastructure/micro_policies`) without blocking the main UI thread.'
    },
    {
      icon: <AlertTriangle className="text-yellow-400" size={24} />,
      title: 'Live "Attack Injection" Cyber Range (Chaos Mode)',
      description: 'A dedicated Adversarial Lab Control Panel allowing researchers to toggle simulated attack modes mid-session (e.g., Cookie Replay, Headless Web-Driver) to force backend trust collapses and test defensive responses.',
      technical: 'Intentionally alters outbound telemetry streams (dropping timestamps, injecting static arrays) to trigger Vertex AI anomaly detection.'
    },
    {
      icon: <EyeOff className="text-red-400" size={24} />,
      title: 'Real-Time "Deception Morphing" Visualizer',
      description: 'When the user\'s calculated risk score crosses the 0.75 threshold, the app secretly shifts from the production environment to the Generative Honey-Pot UI, visually highlighting synthetic data tables to contain the threat.',
      technical: 'React state-driven UI morphing based on global trust score thresholds.'
    },
    {
      icon: <Activity className="text-purple-400" size={24} />,
      title: 'Explainable AI (XAI) Feature Feedback Engine',
      description: 'Expands the "Mimic the Bot" mode to return structural biometric evaluation matrices (Mahalanobis distance, velocity coefficient variance, top failed features) rather than simple booleans.',
      technical: 'Provides empirical validation of the gap between human mimicry and true software macros.'
    },
    {
      icon: <Crosshair className="text-red-400" size={24} />,
      title: 'Dynamic Compound Risk Scoring & Live Threat Feeds',
      description: 'Fuses local biometric telemetry with asynchronous external threat queries (IP Reputation, OWASP AST10). If the compound risk score exceeds 0.80, the session is instantly redirected to a synthetic honeypot.',
      technical: 'Node.js/Express middleware with in-memory caching (node-cache) and strict 500ms timeouts to maintain <20ms execution.'
    },
    {
      icon: <Cloud className="text-blue-400" size={24} />,
      title: 'Serverless Cloud Run Architecture & Edge Routing',
      description: 'Independent microservices (`zta-public-stream` and `zta-private-research`) behind a Global HTTP(S) Load Balancer. Path-based routing and native Identity-Aware Proxy (IAP) drop unauthorized traffic at the Google edge, requiring zero code-level middleware.',
      technical: 'Deployed via gcloud CLI using Serverless NEGs and URL Maps.'
    },
    {
      icon: <Cpu className="text-purple-400" size={24} />,
      title: 'Multi-Platform Unified Telemetry Engine',
      description: 'A production-grade Flutter/Dart engine wrapper handles real-time continuous biometric telemetry across iOS, Android, Windows, macOS, and Linux from a single codebase without degrading UI frames (maintains 60 FPS).',
      technical: 'Uses Dart Isolates/Workers and thread-safe local memory ring buffers.'
    },
    {
      icon: <TrendingUp className="text-green-400" size={24} />,
      title: 'High-Value Executive Analytics',
      description: 'Provides a Financial Risk Reduction Dashboard, Anonymized Team Leaderboards, Automated Framework Compliance Tracker (NIST, NIS2, ISO 27001), and a Visual MITRE ATT&CK Mapping Canvas.',
      technical: 'Aggregates telemetry into business-level metrics and compliance logs via Firestore.'
    },
    {
      icon: <UserCircle className="text-blue-400" size={24} />,
      title: 'End-User Gamification & Interactive Portal',
      description: 'Features a Live Behavioral Health Score, Gamified Micro-Challenges, and an Instant Verification Helper (drag-and-drop widget for real-time sandbox analysis).',
      technical: 'Frontend React components interfacing with Vertex AI online prediction pipelines.'
    },
    {
      icon: <Server className="text-purple-400" size={24} />,
      title: 'Network-Layer Decoupled Quarantining',
      description: 'If a session\'s continuous trust score drops to zero, a Google Cloud Function automatically isolates that user\'s microservice container environment into a read-only VPC segment without dropping the active socket.',
      technical: 'Event-driven architecture triggering Kubernetes/Istio network policies.'
    },
    {
      icon: <Lock className="text-zeta-safe" size={24} />,
      title: 'Post-Quantum Session Key Rotation',
      description: 'Secures the session token architecture to sign and secure JWTs and identity headers using post-quantum lattice-based algorithms (ML-DSA or Falcon). Keys rotate dynamically every 5 minutes.',
      technical: 'Replaces standard RSA/ECC with NIST-approved PQC algorithms for session integrity.'
    },
    {
      icon: <Activity className="text-yellow-400" size={24} />,
      title: 'Continuous Step-Up Micro-Challenges',
      description: 'If the backend biometric telemetry engine registers a minor drift in typical keyboard behavior, the app seamlessly triggers an inline, frictionless check (e.g., FIDO2 handshake) without interrupting the workspace.',
      technical: 'WebAuthn API integration triggered by real-time Kalman filter deviations.'
    },
    {
      icon: <Bot className="text-red-400" size={24} />,
      title: 'Invisible LLM Scraper Traps & Shadow AI Discovery',
      description: 'Deploys AI Prompts Canaries to detect unauthorized LLM scraping and identifies Shadow AI integrations attempting to exfiltrate data.',
      technical: 'Injects zero-width cryptographic watermarks into text payloads.'
    },
    {
      icon: <Smartphone className="text-blue-400" size={24} />,
      title: 'Cross-Device Proximity Authorization',
      description: 'Links the user\'s active desktop application session with their verified mobile phone via BLE or Cloud Sync. If the phone moves out of range, the desktop session locks down.',
      technical: 'Cross-references mobile authenticator state with desktop biometric telemetry.'
    },
    {
      icon: <Mouse className="text-indigo-400" size={24} />,
      title: 'Peripheral Interface Analysis',
      description: 'Monitors specific mechanical hardware changes, such as switching from a built-in laptop trackpad to an external gaming mouse, updating the baseline model instantly to prevent false positives.',
      technical: 'Analyzes polling rates (Hz) and precision (DPI) from raw input event streams.'
    },
    {
      icon: <Keyboard className="text-pink-400" size={24} />,
      title: 'Keystroke Flight-Time Matrix Modeling',
      description: 'Expands keystroke tracking to map not just key-down duration, but flight-time (the split-second transition delay between typing specific pairs of letters).',
      technical: 'Builds a unique physical typing profile that software macros cannot recreate.'
    },
    {
      icon: <EyeOff className="text-gray-400" size={24} />,
      title: 'Focus Loss & Clipboard Exfiltration Guardian',
      description: 'Monitors when the application window loses focus or when large amounts of data are pasted. If focus switches to a known unauthorized background app, the session trust score drops immediately.',
      technical: 'Hooks into window lifecycle events and clipboard API with heuristic analysis.'
    },
    {
      icon: <Hash className="text-zeta-accent" size={24} />,
      title: 'Privacy-Preserving Local Data Hashing',
      description: 'Hashes and normalizes all raw coordinate and acceleration arrays locally on the device using light cryptographic operations before streaming them over the network.',
      technical: 'Ensures no raw user muscle or input history is exposed in plain text.'
    },
    {
      icon: <Layers className="text-green-400" size={24} />,
      title: 'Behavioral Identity Roaming Profiles & Zero-Trust Handover',
      description: 'Allows the machine learning baseline model to sync securely across platforms. Enables seamless session transfers between devices by validating the user\'s behavioral identity signature continuously during the handover.',
      technical: 'Firestore-backed profile synchronization with cross-platform normalization.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="border-b border-gray-800 pb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
          <Book className="mr-3 text-zeta-accent" size={32} />
          Zetalyon Architecture Documentation
        </h2>
        <p className="text-gray-400 mt-2 max-w-3xl">
          Zetalyon is a perfect shield application. It employs a zero-trust, continuous authentication model powered by Vertex AI. Below are the advanced defensive modules that make exploitation mathematically improbable.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-zeta-800 border border-gray-700 rounded-xl p-6 hover:border-zeta-accent/50 transition-colors group">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-zeta-900 rounded-lg border border-gray-700 group-hover:border-gray-500 transition-colors">
                {feature.icon}
              </div>
              <h3 className="ml-4 text-lg font-semibold text-white leading-tight pt-1">
                {feature.title}
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {feature.description}
            </p>
            <div className="bg-zeta-900 p-3 rounded border border-gray-800">
              <span className="text-xs font-mono text-gray-500 uppercase block mb-1">Technical Implementation</span>
              <p className="text-xs font-mono text-gray-400">
                {feature.technical}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-gradient-to-r from-zeta-900 to-zeta-800 border border-zeta-accent/30 rounded-xl text-center">
        <Shield className="mx-auto text-zeta-safe mb-4" size={48} />
        <h3 className="text-xl font-bold text-white mb-2">Impenetrable by Design</h3>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm">
          By combining continuous behavioral biometrics, PQC session binding, Zero-Knowledge Proofs, and Vertex AI online predictions, Zetalyon shifts the asymmetry of cyber warfare. Attackers must perfectly simulate human physiology while navigating a constantly shifting, quantum-secured topology.
        </p>
      </div>
    </div>
  );
};
