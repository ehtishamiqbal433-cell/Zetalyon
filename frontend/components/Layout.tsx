import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, ShieldAlert, BookOpen, Settings, Cpu, TrendingUp, UserCircle, Server, Scale, FileCode, Network, Database, Terminal, HelpCircle, X, CheckCircle, Cloud } from 'lucide-react';
import { RoutePaths, SupportTicket } from '../types.ts';
import { simulationService } from '../services/simulationService.ts';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Feature Request');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const navItems = [
    { path: RoutePaths.DASHBOARD, icon: <Activity size={20} />, label: 'Command Center' },
    { path: RoutePaths.EXECUTIVE, icon: <TrendingUp size={20} />, label: 'Executive Analytics' },
    { path: RoutePaths.USER_PORTAL, icon: <UserCircle size={20} />, label: 'User Portal' },
    { path: RoutePaths.BIOMETRICS, icon: <Cpu size={20} />, label: 'Biometric Engine' },
    { path: RoutePaths.THREAT_MAP, icon: <ShieldAlert size={20} />, label: 'Threat Intelligence' },
    { path: RoutePaths.VERTEX_PIPELINE, icon: <Database size={20} />, label: 'Vertex AI Pipeline' },
    { path: RoutePaths.CYBER_RANGE, icon: <Network size={20} />, label: 'Cyber Range Sandbox' },
    { path: RoutePaths.SYSTEM_TELEMETRY, icon: <Server size={20} />, label: 'System Telemetry' },
    { path: RoutePaths.SETTINGS, icon: <Settings size={20} />, label: 'System Config' },
    { path: RoutePaths.CODE_HARDENING, icon: <FileCode size={20} />, label: 'Code Hardening' },
    { path: RoutePaths.API_PLAYGROUND, icon: <Terminal size={20} />, label: 'API Playground' },
    { path: RoutePaths.DEPLOYMENT, icon: <Cloud size={20} />, label: 'Deployment Pipeline' },
    { path: RoutePaths.DOCUMENTATION, icon: <BookOpen size={20} />, label: 'Documentation' },
    { path: RoutePaths.LICENSE, icon: <Scale size={20} />, label: 'Software IP & License' },
  ];

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }
    setEmailError('');
    setTicketStatus('submitting');

    const ticket: SupportTicket = {
      fullName,
      affiliation,
      email,
      category,
      message,
      diagnosticMetadata: {
        currentRoute: location.pathname,
        timestamp: new Date().toISOString(),
        recentErrors: [] // Mocked
      }
    };

    const success = await simulationService.submitSupportTicket(ticket);
    if (success) {
      setTicketStatus('success');
      setTimeout(() => {
        setIsSupportOpen(false);
        setTicketStatus('idle');
        setFullName('');
        setAffiliation('');
        setEmail('');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="flex h-screen bg-zeta-900 text-gray-300 overflow-hidden font-sans relative">
      {/* Sidebar */}
      <aside className="w-64 bg-zeta-800 border-r border-gray-800 flex flex-col z-10">
        <div className="p-6 flex items-center space-x-3">
          <div className="relative">
            <Shield className="text-zeta-accent" size={32} />
            <div className="absolute inset-0 bg-zeta-accent blur-md opacity-30 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider">ZETALYON</h1>
            <p className="text-xs text-zeta-accent font-mono">ZERO-TRUST CORE</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-zeta-700 text-zeta-accent border-l-2 border-zeta-accent' 
                    : 'hover:bg-zeta-700/50 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="bg-zeta-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">System Status</span>
              <div className="h-2 w-2 rounded-full bg-zeta-safe animate-pulse"></div>
            </div>
            <div className="text-sm font-mono text-zeta-safe">PERFECT SHIELD ACTIVE</div>
            <div className="text-xs text-gray-500 mt-1">v2.5.0-quantum</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-0">
        {/* Top decorative bar & Support Icon */}
        <div className="h-1 w-full bg-gradient-to-r from-zeta-900 via-zeta-accent to-zeta-900 opacity-50 absolute top-0 left-0 z-20"></div>
        
        <div className="absolute top-4 right-6 z-20">
          <button 
            onClick={() => setIsSupportOpen(true)}
            className="p-2 bg-zeta-800 border border-gray-700 rounded-full hover:bg-zeta-700 hover:text-white transition-colors shadow-lg group relative"
          >
            <HelpCircle size={20} className="text-gray-400 group-hover:text-zeta-accent transition-colors" />
            <span className="absolute -bottom-8 right-0 bg-zeta-900 text-xs px-2 py-1 rounded border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Support & Feedback
            </span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 pt-12">
          {children}
        </div>
      </main>

      {/* Support & Feedback Drawer */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-zeta-800 border-l border-gray-700 shadow-2xl transform transition-transform duration-500 ease-in-out z-50 flex flex-col ${isSupportOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-zeta-900">
          <h2 className="text-lg font-bold text-white flex items-center">
            <HelpCircle className="mr-2 text-zeta-accent" size={20} />
            Support & Feedback
          </h2>
          <button onClick={() => setIsSupportOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {ticketStatus === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <CheckCircle size={64} className="text-zeta-safe mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Message Transmitted Securely</h3>
              <p className="text-sm text-gray-400">The system engineering team will review your diagnostic profile shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" required
                  value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full bg-zeta-900 border border-gray-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-zeta-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Organization / Affiliation</label>
                <input 
                  type="text" required
                  value={affiliation} onChange={e => setAffiliation(e.target.value)}
                  className="w-full bg-zeta-900 border border-gray-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-zeta-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" required
                  value={email} onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                  className={`w-full bg-zeta-900 border rounded p-2.5 text-sm text-white focus:outline-none transition-colors ${emailError ? 'border-zeta-alert focus:border-zeta-alert' : 'border-gray-700 focus:border-zeta-accent'}`}
                />
                {emailError && <p className="text-xs text-zeta-alert mt-1">{emailError}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                <select 
                  value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full bg-zeta-900 border border-gray-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-zeta-accent transition-colors appearance-none"
                >
                  <option>Feature Request</option>
                  <option>Report Canvas Drag Bug</option>
                  <option>Academic Collaboration Inquiry</option>
                  <option>General Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Message (Markdown Supported)</label>
                <textarea 
                  required rows={6}
                  value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full bg-zeta-900 border border-gray-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-zeta-accent transition-colors resize-none"
                  placeholder="Describe your inquiry or feedback..."
                />
              </div>

              <div className="bg-zeta-900 p-3 rounded border border-gray-700">
                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center">
                  <Activity size={12} className="mr-1" /> Automated Diagnostic Metadata
                </div>
                <p className="text-[10px] text-gray-400">
                  Your active workspace state tree, route (<span className="font-mono text-zeta-accent">{location.pathname}</span>), and recent error logs will be securely serialized and attached to this ticket.
                </p>
              </div>

              <button 
                type="submit"
                disabled={ticketStatus === 'submitting'}
                className="w-full py-3 bg-zeta-accent text-zeta-900 font-bold rounded hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {ticketStatus === 'submitting' ? 'Transmitting...' : 'Submit Ticket'}
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Overlay to close drawer when clicking outside */}
      {isSupportOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSupportOpen(false)}
        />
      )}
    </div>
  );
};
