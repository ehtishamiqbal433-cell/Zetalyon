/*
 * Copyright (c) 2026 Muhammad Ehtisham Iqbal. All rights reserved.
 *
 * This software is part of the 'Project ZTA-BioAuth' academic and 
 * open-source research framework. 
 *
 * Use of this source code is governed by the dual-licensing strategy 
 * outlined in the main LICENSE file.
 */

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Award, Target, DollarSign, FileCheck, Download, Clock, AlertTriangle } from 'lucide-react';
import { simulationService } from '../services/simulationService.ts';
import { FinancialMetric, LeaderboardEntry, MitreTactic, AttackTimelineEvent } from '../types.ts';

export const ExecutiveDashboard: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialMetric[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [mitreMatrix, setMitreMatrix] = useState<MitreTactic[]>([]);
  const [attackTimeline, setAttackTimeline] = useState<AttackTimelineEvent[]>([]);

  useEffect(() => {
    setFinancialData(simulationService.generateFinancialMetrics());
    setLeaderboard(simulationService.generateLeaderboard());
    setMitreMatrix(simulationService.generateMitreMatrix());
    setAttackTimeline(simulationService.generateAttackTimeline());

    const interval = setInterval(() => {
      // Poll for real-time MITRE matrix updates (simulating WebSockets)
      setMitreMatrix(simulationService.generateMitreMatrix());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const exportMitreNavigator = () => {
    const jsonContent = simulationService.exportMitreNavigatorJSON(mitreMatrix);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mitre_navigator_layer_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <TrendingUp className="mr-3 text-zeta-accent" size={32} />
            High-Value Executive Analytics
          </h2>
          <p className="text-gray-400 mt-1">Financial risk reduction, compliance tracking, and MITRE ATT&CK mapping.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Risk Reduction */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <DollarSign size={18} className="mr-2 text-green-400" />
              Financial Risk Reduction Dashboard
            </h3>
            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase">Total Saved (YTD)</div>
              <div className="text-xl font-mono text-zeta-safe">$1.24M</div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="month" stroke="#4b5563" fontSize={12} />
                <YAxis stroke="#4b5563" fontSize={12} tickFormatter={(val) => `$${valueToK(val)}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="fraudPrevented" name="Fraud Prevented" fill="#00f0ff" radius={[2, 2, 0, 0]} />
                <Bar dataKey="operationalSavings" name="Operational Savings" fill="#00ff66" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Automated Framework Compliance Tracker */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <FileCheck size={18} className="mr-2 text-blue-400" />
            Automated Framework Compliance Tracker
          </h3>
          <div className="space-y-6 flex-1">
            <ComplianceBar framework="NIST SP 800-207 (Zero Trust)" progress={100} />
            <ComplianceBar framework="NIS2 Directive" progress={98} />
            <ComplianceBar framework="ISO/IEC 27001:2022" progress={100} />
            <ComplianceBar framework="SOC 2 Type II" progress={95} />
          </div>
        </div>

        {/* Visual MITRE ATT&CK Mapping Canvas */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Target size={18} className="mr-2 text-purple-400" />
              Visual MITRE ATT&CK Mapping Canvas
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4 text-xs font-mono">
                <span className="flex items-center"><div className="w-3 h-3 bg-zeta-900 border border-gray-700 mr-1"></div> Monitored</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-zeta-alert/20 border border-zeta-alert mr-1"></div> Active Threat</span>
              </div>
              <button onClick={exportMitreNavigator} className="flex items-center px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-600/30 transition-colors text-xs font-mono">
                <Download size={14} className="mr-2" /> Export Navigator JSON
              </button>
            </div>
          </div>
          
          {/* Dynamic Matrix Highlighter */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {mitreMatrix.map((tactic) => (
              <div key={tactic.id} className="flex flex-col space-y-2">
                <div className="font-bold text-center bg-zeta-900 border border-gray-700 p-2 rounded text-xs text-gray-300 uppercase tracking-wider">
                  {tactic.name}
                </div>
                {tactic.techniques.map((tech) => (
                  <div 
                    key={tech.id} 
                    className={`p-3 rounded border text-center transition-all duration-300 flex flex-col justify-center min-h-[80px] ${
                      tech.active 
                        ? 'bg-zeta-alert/20 border-zeta-alert animate-pulse shadow-[0_0_15px_rgba(255,0,60,0.3)]' 
                        : 'bg-zeta-900 border-gray-800 hover:border-gray-600'
                    }`}
                    title={tech.description}
                  >
                    <div className={`text-[10px] font-mono mb-1 ${tech.active ? 'text-zeta-alert' : 'text-gray-500'}`}>{tech.id}</div>
                    <div className={`text-xs font-medium leading-tight ${tech.active ? 'text-white' : 'text-gray-400'}`}>{tech.name}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Forensic Timeline & Attacker Playbook */}
          <div className="border-t border-gray-800 pt-6">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center">
              <Clock size={16} className="mr-2 text-gray-400" />
              Forensic Attack Timeline
            </h4>
            <div className="space-y-4">
              {attackTimeline.map((event, index) => (
                <div key={event.id} className="flex relative">
                  {/* Timeline line */}
                  {index !== attackTimeline.length - 1 && (
                    <div className="absolute top-6 left-[11px] w-0.5 h-full bg-gray-800"></div>
                  )}
                  <div className="relative z-10 flex-shrink-0 mr-4">
                    <div className="w-6 h-6 rounded-full bg-zeta-900 border-2 border-zeta-alert flex items-center justify-center">
                      <AlertTriangle size={10} className="text-zeta-alert" />
                    </div>
                  </div>
                  <div className="bg-zeta-900 border border-gray-800 rounded-lg p-3 flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-white">{event.tactic} <span className="text-gray-500 font-normal mx-1">→</span> <span className="text-zeta-alert">{event.techniqueId}: {event.techniqueName}</span></span>
                      <span className="text-[10px] font-mono text-gray-500">{event.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-gray-400">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Anonymized Team Leaderboards */}
        <div className="bg-zeta-800 border border-gray-800 rounded-xl p-6 shadow-lg lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Award size={18} className="mr-2 text-yellow-400" />
            Anonymized Team Leaderboards (Gamification)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-zeta-900 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-mono">Rank</th>
                  <th className="px-4 py-3 font-mono">Alias</th>
                  <th className="px-4 py-3 font-mono">Health Score</th>
                  <th className="px-4 py-3 font-mono">Micro-Challenges Passed</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {leaderboard.map((entry) => (
                  <tr key={entry.rank} className="border-b border-gray-800/50 hover:bg-zeta-700/30 transition-colors">
                    <td className="px-4 py-3 text-yellow-500 font-bold">#{entry.rank}</td>
                    <td className="px-4 py-3 text-gray-300">{entry.alias}</td>
                    <td className="px-4 py-3">
                      <span className="text-zeta-safe">{entry.healthScore.toFixed(1)}%</span>
                    </td>
                    <td className="px-4 py-3 text-blue-400">{entry.challengesCompleted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const valueToK = (value: number) => {
  return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value;
};

const ComplianceBar = ({ framework, progress }: { framework: string, progress: number }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-300 font-medium">{framework}</span>
      <span className="text-zeta-safe font-mono">{progress}%</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div className="bg-zeta-safe h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);
