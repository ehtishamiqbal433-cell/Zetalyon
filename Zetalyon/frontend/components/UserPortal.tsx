import React, { useState, useEffect, useRef } from 'react';
import { UserCircle, Shield, UploadCloud, CheckCircle, AlertTriangle, Zap, Bot, Keyboard, Award, Star, Download, Activity } from 'lucide-react';
import { simulationService } from '../services/simulationService.ts';
import { GamificationProfile, XAIFeedback } from '../types.ts';

export const UserPortal: React.FC = () => {
  const [healthScore, setHealthScore] = useState(99.8);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<'idle' | 'analyzing' | 'safe' | 'malicious'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [botChallengeText, setBotChallengeText] = useState('');
  const [botChallengeStatus, setBotChallengeStatus] = useState<'idle' | 'evaluating' | 'success' | 'failed'>('idle');
  const [noiseLevel, setNoiseLevel] = useState(50);
  const [xaiFeedback, setXaiFeedback] = useState<XAIFeedback | null>(null);
  
  const [calibratorActive, setCalibratorActive] = useState(false);
  const [calibratorProgress, setCalibratorProgress] = useState(0);

  useEffect(() => {
    setProfile(simulationService.generateGamificationProfile());
    const interval = setInterval(() => {
      setHealthScore(prev => Math.max(90, Math.min(100, prev + (Math.random() - 0.4) * 0.5)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = () => {
    setAnalysisResult('analyzing');
    setTimeout(() => {
      setAnalysisResult(Math.random() > 0.3 ? 'safe' : 'malicious');
      setTimeout(() => setAnalysisResult('idle'), 5000);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile();
    } else if (e.dataTransfer.getData('text')) {
      processFile();
    }
  };

  const handleClick = () => {
    if (analysisResult === 'idle') {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile();
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleBotChallengeSubmit = () => {
    setBotChallengeStatus('evaluating');
    setXaiFeedback(null);
    setTimeout(() => {
      // Simulate backend ML evaluation with XAI feedback
      const feedback = simulationService.generateXAIFeedback(noiseLevel);
      setXaiFeedback(feedback);
      setBotChallengeStatus(feedback.isBot ? 'success' : 'failed');
      
      if (feedback.isBot && profile) {
        setProfile({ ...profile, xp: profile.xp + 100 });
      }
    }, 1500);
  };

  const resetBotChallenge = () => {
    setBotChallengeStatus('idle');
    setBotChallengeText('');
    setXaiFeedback(null);
  };

  const exportBenchmark = () => {
    if (!xaiFeedback) return;
    const csvContent = simulationService.exportBenchmarkCSV(noiseLevel, xaiFeedback);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `xai_benchmark_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startCalibrator = () => {
    setCalibratorActive(true);
    setCalibratorProgress(0);
    const interval = setInterval(() => {
      setCalibratorProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCalibratorActive(false);
          return 100;
        }
        return prev + 10; // 10 seconds total
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <UserCircle className="mr-3 text-zeta-accent" size={32} />
            End-User Security Portal
          </h2>
          <p className="text-gray-400 mt-1">Gamified security, live health scores, and instant verification.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progressive Trust Score & Streak Engine */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg md:col-span-3 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="relative">
              <Award className="text-purple-400" size={48} />
              <div className="absolute -bottom-2 -right-2 bg-zeta-900 rounded-full p-1 border border-gray-700">
                <Star className="text-yellow-400" size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{profile?.tier} Tier</h3>
              <p className="text-sm text-gray-400">Progressive Trust Score Engine</p>
            </div>
          </div>
          <div className="flex space-x-8">
            <div className="text-center">
              <div className="text-2xl font-mono text-zeta-safe">{profile?.streakDays}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-zeta-accent">{profile?.xp.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Total XP</div>
            </div>
          </div>
        </div>

        {/* Live Behavioral Health Score */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold text-white mb-6 w-full text-left flex items-center">
            <Shield className="mr-2 text-zeta-safe" size={18} />
            Live Behavioral Health Score
          </h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="#1f2937" strokeWidth="12" fill="none" />
              <circle 
                cx="96" cy="96" r="88" 
                stroke="#00ff66" strokeWidth="12" fill="none" 
                strokeDasharray="552" 
                strokeDashoffset={552 - (552 * healthScore) / 100} 
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="text-center">
              <div className="text-4xl font-bold text-white font-mono">{healthScore.toFixed(1)}</div>
              <div className="text-xs text-gray-400 uppercase mt-1">Excellent</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Your interaction patterns match your baseline perfectly. No step-up authentication required.
          </p>
        </div>

        {/* "Mimic the Bot" Adversarial Mode with XAI */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg md:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Bot className="mr-2 text-red-400" size={18} />
              "Mimic the Bot" Adversarial Mode (Red Team)
            </h3>
            {xaiFeedback && (
              <button onClick={exportBenchmark} className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors">
                <Download size={14} className="mr-1" /> Export CSV
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Try to trick the Vertex AI backend by typing the phrase below with perfectly uniform, robotic keystroke flight-times. Adjust the Gaussian Noise vector to simulate empirical gaps.
          </p>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 font-mono mb-1">
              <span>Robotic (0% Noise)</span>
              <span>Human (100% Noise)</span>
            </div>
            <input 
              type="range" min="0" max="100" value={noiseLevel} 
              onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
              disabled={botChallengeStatus !== 'idle'}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          <div className="bg-zeta-900 p-3 rounded border border-gray-700 mb-4 text-center font-mono text-sm text-gray-300 select-none relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]"></div>
            the quick brown fox jumps over the lazy dog
          </div>
          
          <textarea 
            value={botChallengeText}
            onChange={(e) => setBotChallengeText(e.target.value)}
            disabled={botChallengeStatus !== 'idle'}
            placeholder="Type here like a robot..."
            className="w-full bg-zeta-900 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-zeta-accent resize-none h-20 mb-4"
          />

          {/* XAI Feedback Panel */}
          {xaiFeedback && (
            <div className="bg-zeta-900 border border-gray-700 rounded-lg p-4 mb-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-gray-300 uppercase mb-2 flex items-center">
                <Activity size={14} className="mr-1 text-purple-400" /> Explainable AI (XAI) Feedback
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <div className="text-[10px] text-gray-500">Mahalanobis Distance</div>
                  <div className="text-sm font-mono text-white">{xaiFeedback.mahalanobisDistance.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">Velocity Variance</div>
                  <div className="text-sm font-mono text-white">{xaiFeedback.velocityVariance.toFixed(4)}</div>
                </div>
              </div>
              {xaiFeedback.topFailedFeatures.length > 0 && (
                <div>
                  <div className="text-[10px] text-gray-500 mb-1">Top Failed Features (Human Traits Detected):</div>
                  <div className="flex flex-wrap gap-2">
                    {xaiFeedback.topFailedFeatures.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 bg-zeta-alert/20 text-zeta-alert text-[10px] rounded border border-zeta-alert/30">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-auto">
            <div className="text-xs font-mono">
              {botChallengeStatus === 'evaluating' && <span className="text-yellow-500 animate-pulse">Analyzing telemetry stream...</span>}
              {botChallengeStatus === 'success' && <span className="text-zeta-safe">Success! +100 Red Team Points</span>}
              {botChallengeStatus === 'failed' && <span className="text-zeta-alert">Failed. Human cadence detected.</span>}
            </div>
            {botChallengeStatus === 'idle' ? (
              <button 
                onClick={handleBotChallengeSubmit}
                disabled={botChallengeText.length < 10}
                className="px-4 py-2 bg-zeta-700 hover:bg-zeta-600 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors"
              >
                Submit Telemetry
              </button>
            ) : (
              <button 
                onClick={resetBotChallenge}
                className="px-4 py-2 border border-gray-600 hover:bg-gray-800 text-white rounded text-sm font-medium transition-colors"
              >
                Reset Challenge
              </button>
            )}
          </div>
        </div>

        {/* Biometric Daily Calibrator */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg md:col-span-1 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
            <Keyboard className="mr-2 text-blue-400" size={18} />
            Biometric Daily Calibrator
          </h3>
          <p className="text-xs text-gray-400 mb-6">
            Complete a 10-second rhythm speed-test to silently update your biometric profile and eliminate natural behavioral drift.
          </p>
          <div className="mt-auto text-center">
            {calibratorActive ? (
              <div className="space-y-4">
                <div className="text-2xl font-mono text-zeta-accent animate-pulse">Type freely...</div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-zeta-accent h-2 rounded-full transition-all duration-1000" style={{ width: `${calibratorProgress}%` }}></div>
                </div>
              </div>
            ) : (
              <button 
                onClick={startCalibrator}
                className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400 rounded-lg text-sm font-medium transition-colors"
              >
                Start 10s Calibration
              </button>
            )}
          </div>
        </div>

        {/* Instant Verification Helper */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <UploadCloud className="mr-2 text-zeta-accent" size={18} />
            Instant Verification Helper (Sandbox Analysis)
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Drag and drop suspicious files, URLs, or text snippets here. Our backend Vertex AI models will analyze them in a secure sandbox instantly.
          </p>
          
          <div 
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              analysisResult === 'idle' ? 'cursor-pointer' : 'cursor-default'
            } ${
              isDragging ? 'border-zeta-accent bg-zeta-accent/10' : 
              analysisResult === 'safe' ? 'border-zeta-safe bg-zeta-safe/10' :
              analysisResult === 'malicious' ? 'border-zeta-alert bg-zeta-alert/10' :
              'border-gray-600 hover:border-gray-500 bg-zeta-900'
            }`}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            
            {analysisResult === 'idle' && (
              <>
                <UploadCloud className="mx-auto text-gray-500 mb-2" size={32} />
                <p className="text-gray-300 font-medium text-sm">Drag & Drop items here or click to browse</p>
              </>
            )}
            {analysisResult === 'analyzing' && (
              <div className="animate-pulse">
                <Zap className="mx-auto text-yellow-500 mb-2 animate-bounce" size={32} />
                <p className="text-yellow-500 font-mono text-sm">Vertex AI Sandbox Analysis in progress...</p>
              </div>
            )}
            {analysisResult === 'safe' && (
              <>
                <CheckCircle className="mx-auto text-zeta-safe mb-2" size={32} />
                <p className="text-zeta-safe font-mono text-sm">Item Verified Safe</p>
              </>
            )}
            {analysisResult === 'malicious' && (
              <>
                <AlertTriangle className="mx-auto text-zeta-alert mb-2" size={32} />
                <p className="text-zeta-alert font-mono text-sm">Malicious Payload Detected & Quarantined</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
