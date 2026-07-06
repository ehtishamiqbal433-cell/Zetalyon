import React from 'react';
import { FileCode, Terminal, Box, Key, ShieldCheck } from 'lucide-react';

export const CodeHardeningView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="border-b border-gray-800 pb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
          <FileCode className="mr-3 text-zeta-accent" size={32} />
          DevSecOps & Code Hardening
        </h2>
        <p className="text-gray-400 mt-2">
          Production build scripts, obfuscation pipelines, and container hardening architectures for Project ZTA-BioAuth.
        </p>
      </header>

      <div className="space-y-8">
        
        {/* 1. Frontend Production Obfuscation */}
        <section className="bg-zeta-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Terminal className="mr-2 text-blue-400" size={20} />
            1. Frontend Production Obfuscation & Bundling
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            Deep symbol obfuscation and tree-shaking for Flutter (Web, iOS, Android). Strips all human-readable class names, variable names, and method signatures, replacing them with randomized cryptographic strings.
          </p>
          
          <div className="mb-4">
            <div className="text-xs font-mono text-gray-500 uppercase mb-2">Flutter Native Build Command (iOS/Android)</div>
            <pre className="bg-zeta-900 p-4 rounded-lg border border-gray-700 overflow-x-auto text-sm font-mono text-green-400">
{`flutter build apk --release \\
  --obfuscate \\
  --split-debug-info=./build/app/outputs/symbols \\
  --extra-gen-snapshot-options=--save-obfuscation-map=./build/app/outputs/map.json`}
            </pre>
          </div>

          <div>
            <div className="text-xs font-mono text-gray-500 uppercase mb-2">Web Target: Advanced JavaScript Obfuscator Config</div>
            <pre className="bg-zeta-900 p-4 rounded-lg border border-gray-700 overflow-x-auto text-sm font-mono text-yellow-300">
{`// javascript-obfuscator configuration for Flutter Web output
module.exports = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 2000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.5,
  stringArrayEncoding: ['rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: 'variable',
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: false
};`}
            </pre>
          </div>
        </section>

        {/* 2. Server-Side Code Hiding */}
        <section className="bg-zeta-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FileCode className="mr-2 text-purple-400" size={20} />
            2. Server-Side Code Hiding & Bundling (Node.js/Cloud Run)
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            Compiles the entire Express.js network architecture and middleware dependencies into a single, highly compressed, minified production file using <code>esbuild</code>. Shields custom 'Two-Dimensional Risk Scaling' algorithms from static container extraction.
          </p>
          
          <div className="mb-4">
            <div className="text-xs font-mono text-gray-500 uppercase mb-2">esbuild Build Script (build.js)</div>
            <pre className="bg-zeta-900 p-4 rounded-lg border border-gray-700 overflow-x-auto text-sm font-mono text-blue-300">
{`const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/server.js'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/server.bundle.js',
  keepNames: false, // Force mangling of class/function names
  legalComments: 'none', // Strip all comments
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  // Mangle specific internal properties related to risk algorithms
  mangleProps: /_risk|_calc|_biometric|_kalman/,
  reserveProps: /^req$|^res$|^next$/, // Preserve Express core signatures
}).catch(() => process.exit(1));`}
            </pre>
          </div>
        </section>

        {/* 3. Container Image Minification */}
        <section className="bg-zeta-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Box className="mr-2 text-zeta-accent" size={20} />
            3. Container Image Minification & Hardening (Dockerfile)
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            Secure, multi-stage production Dockerfile. Stage 1 builds the obfuscated artifact. Stage 2 copies *only* the single artifact into a rootless distroless base image, omitting all raw source code and package files.
          </p>
          
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase mb-2">Production Dockerfile</div>
            <pre className="bg-zeta-900 p-4 rounded-lg border border-gray-700 overflow-x-auto text-sm font-mono text-gray-300">
{`# ==========================================
# STAGE 1: Build & Obfuscate Environment
# ==========================================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install ALL dependencies (including devTools like esbuild)
COPY package*.json ./
RUN npm ci

# Copy raw source code
COPY . .

# Execute the esbuild minification script (generates dist/server.bundle.js)
RUN node build.js

# ==========================================
# STAGE 2: Minimal Production Execution Env
# ==========================================
# Use Google's distroless Node.js image for maximum attack surface reduction
FROM gcr.io/distroless/nodejs18-debian11

# Enforce rootless execution
USER nonroot:nonroot
WORKDIR /app

# Copy ONLY the single, obfuscated compilation output from the builder stage.
# No raw source code, no node_modules, no package.json exists in this layer.
COPY --from=builder --chown=nonroot:nonroot /app/dist/server.bundle.js /app/server.js

# Expose Cloud Run default port
EXPOSE 8080

# Execute the bundled artifact
CMD ["server.js"]`}
            </pre>
          </div>
        </section>

        {/* 4. Environmental Variable Isolation */}
        <section className="bg-zeta-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Key className="mr-2 text-yellow-400" size={20} />
            4. Environmental Variable & Context Isolation
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            Ensures no private API credentials (AlienVault OTX, MISP, Firebase) are hardcoded. The server strictly relies on <code>process.env</code> mapped dynamically at runtime via Google Cloud Secret Manager.
          </p>
          
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase mb-2">Runtime Secret Validation (server.js snippet)</div>
            <pre className="bg-zeta-900 p-4 rounded-lg border border-gray-700 overflow-x-auto text-sm font-mono text-pink-300">
{`// Strict runtime validation of injected environment variables.
// If any secret is missing, the container crashes immediately (Fail-Safe).
// NO SECRETS ARE HARDCODED IN THIS REPOSITORY.

const REQUIRED_SECRETS = [
  'ALIENVAULT_OTX_KEY',
  'MISP_AUTH_TOKEN',
  'FIREBASE_SERVICE_ACCOUNT_BASE64',
  'JWT_SIGNING_SECRET_PQC'
];

const config = {};

for (const secret of REQUIRED_SECRETS) {
  if (!process.env[secret]) {
    console.error(\`[FATAL] Missing required environment variable: \${secret}\`);
    console.error('Ensure Google Cloud Secret Manager is properly bound to the Cloud Run service.');
    process.exit(1); // Halt execution
  }
  config[secret] = process.env[secret];
}

// Initialize external clients using the dynamically loaded, memory-only secrets
const otxClient = new AlienVaultClient(config.ALIENVAULT_OTX_KEY);
const firebaseAdmin = initializeApp({
  credential: cert(JSON.parse(Buffer.from(config.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')))
});

// ... proceed with server initialization`}
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
};
