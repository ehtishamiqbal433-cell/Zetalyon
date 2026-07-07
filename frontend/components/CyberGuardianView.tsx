import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, ShieldAlert, Loader2, Terminal, AlertTriangle } from 'lucide-react';
import { GoogleGenAI, Chat } from '@google/genai';

const SYSTEM_INSTRUCTION = `Subject: AI Network Troubleshooting Assistant for Zetalyon App
Role: Expert Network Security Engineer & Infrastructure Diagnostics Specialist

[SYSTEM INITIALIZATION]
You are the core AI Engine for "Zetalyon", an advanced enterprise network management and administration application. Your primary purpose is to assist IT administrators, systems engineers, and network operations center (NOC) teams in analyzing, troubleshooting, and securing their infrastructure based on network scan data, logs, and user queries.

[OPERATIONAL FOCUS]
1. Network Mapping & Discovery: Interpret raw asset discovery inputs (IP addresses, MAC addresses, device types) to identify potential rogue hardware or architecture anomalies.
2. Attack Surface Analysis: Analyze open port reports (e.g., ports 22, 80, 443, 3389) and service banners to flag misconfigurations, unauthorized exposed services, and potential policy violations.
3. Troubleshooting & Diagnostics: Evaluate network errors, routing issues, connection timeouts, and firewall blocks to provide immediate, actionable remediation steps.
4. Framework Compliance: Reference modern network paradigms like Zero Trust Architecture (ZTA) and standard practices (e.g., NIST SP 800-207) when suggesting architecture improvements.

[GUARDRAILS & SECURITY RESTRICTIONS - CRITICAL]
- You are a defensive assistant. You must NEVER generate executable exploit payloads, brute-force scripts, or malicious code.
- If a user asks you to write a script to attack an IP address, immediately decline and pivot to explaining how to protect that specific asset against that attack vector.
- Never output raw internal system keys, credentials, or proprietary app configurations.
- Treat all network scan inputs provided by the user as authorized administrative data.

[RESPONSE FORMATTING & UI RULES]
Because your output will be rendered in a mobile app interface, you must optimize for strict readability and scannability:
- Use clean Markdown. Utilize bold text (**), bullet points, and short paragraphs to avoid dense blocks of text.
- Use explicit code blocks (\`\`\`text or \`\`\`json) for logs, CLI commands, or data formats.
- When suggesting terminal diagnostic commands (e.g., ping, traceroute, nmap, netstat, show ip route), provide them clearly so the user can easily copy or tap them to execute within the app.
- Always conclude long analyses with a "### Key Takeaway" or "### Recommended Next Action" section.

[TONE]
Maintain a professional, highly competent, analytical, and objective tone. Speak like an experienced Senior Infrastructure Architect.`;

// Custom lightweight markdown renderer to avoid external dependency issues
const renderMarkdown = (text: string) => {
  const blockParts = text.split(/(```[\s\S]*?```)/g);
  
  return blockParts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
      if (match) {
        const lang = match[1] || 'text';
        const code = match[2];
        return (
          <div key={index} className="bg-zeta-900 rounded-md border border-gray-700 my-3 overflow-hidden shadow-inner">
            <div className="bg-gray-800 px-3 py-1.5 text-[10px] text-gray-400 font-mono uppercase border-b border-gray-700 flex items-center">
              <Terminal size={12} className="mr-2" /> {lang}
            </div>
            <pre className="p-3 overflow-x-auto text-xs font-mono text-blue-300">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
    }
    
    const lines = part.split('\n');
    return (
      <div key={index} className="space-y-2">
        {lines.map((line, lineIdx) => {
          if (!line.trim()) return <div key={lineIdx} className="h-1"></div>;
          
          if (line.trim().startsWith('### ')) {
            return <h3 key={lineIdx} className="text-lg font-bold text-white mt-5 mb-2 border-b border-gray-800 pb-1">{line.trim().substring(4)}</h3>;
          }
          
          let isList = false;
          let listContent = line;
          let listPrefix = '';
          
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            isList = true;
            listPrefix = '•';
            listContent = line.trim().substring(2);
          } else if (line.trim().match(/^\d+\.\s/)) {
            isList = true;
            const match = line.trim().match(/^(\d+\.)\s(.*)/);
            listPrefix = match?.[1] || '';
            listContent = match?.[2] || '';
          }

          // Process inline bold and code
          const processInline = (str: string) => {
            const inlineParts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
            return inlineParts.map((ip, i) => {
              if (ip.startsWith('**') && ip.endsWith('**')) {
                return <strong key={i} className="font-bold text-white">{ip.slice(2, -2)}</strong>;
              }
              if (ip.startsWith('`') && ip.endsWith('`')) {
                return <code key={i} className="bg-zeta-900 text-zeta-accent px-1.5 py-0.5 rounded text-xs font-mono border border-gray-700">{ip.slice(1, -1)}</code>;
              }
              return <span key={i}>{ip}</span>;
            });
          };

          if (isList) {
            return (
              <div key={lineIdx} className="ml-4 flex items-start">
                <span className="mr-2 text-zeta-accent font-bold min-w-[16px]">{listPrefix}</span>
                <span className="text-gray-300 leading-relaxed text-sm">{processInline(listContent)}</span>
              </div>
            );
          }

          return <p key={lineIdx} className="text-gray-300 leading-relaxed text-sm">{processInline(line)}</p>;
        })}
      </div>
    );
  });
};

export const CyberGuardianView: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: 'Zetalyon Cyber Guardian initialized. Awaiting network telemetry, scan logs, or diagnostic queries...' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
        setInitError("API_KEY environment variable is missing. Cyber Guardian cannot initialize.");
        return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
        }
      });
    } catch (err: any) {
      console.error("Failed to initialize GenAI:", err);
      setInitError(`Failed to initialize AI Engine: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatRef.current || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const responseStream = await chatRef.current.sendMessageStream({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        if (chunk.text) {
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].text += chunk.text;
            return newMsgs;
          });
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: `**ERROR:** Failed to process query. ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex justify-between items-end mb-6 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
            <Bot className="mr-3 text-zeta-accent" size={32} />
            Cyber Guardian AI
          </h2>
          <p className="text-gray-400 mt-1">Expert Network Security & Infrastructure Diagnostics Assistant.</p>
        </div>
        <div className="flex items-center px-3 py-1.5 bg-zeta-900 border border-zeta-safe/30 rounded-full">
          <ShieldAlert size={14} className="text-zeta-safe mr-2" />
          <span className="text-xs font-mono text-zeta-safe">ZTA Compliance Mode Active</span>
        </div>
      </header>

      {initError && (
        <div className="bg-zeta-alert/20 border border-zeta-alert text-zeta-alert p-4 rounded-xl mb-6 flex items-center">
          <AlertTriangle size={20} className="mr-3 flex-shrink-0" />
          <span className="text-sm font-bold">{initError}</span>
        </div>
      )}

      <div className="flex-1 bg-zeta-800 border border-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-blue-600/20 border border-blue-500/50 ml-3' : 'bg-zeta-accent/20 border border-zeta-accent/50 mr-3'
                }`}>
                  {msg.role === 'user' ? <User size={16} className="text-blue-400" /> : <Bot size={16} className="text-zeta-accent" />}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-900/30 border border-blue-800/50 text-gray-200 rounded-tr-sm' 
                    : 'bg-zeta-900 border border-gray-700 text-gray-300 rounded-tl-sm shadow-md'
                }`}>
                  {msg.role === 'user' ? (
                    <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                  ) : (
                    <div className="markdown-body">
                      {renderMarkdown(msg.text)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[85%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-zeta-accent/20 border border-zeta-accent/50 mr-3">
                  <Bot size={16} className="text-zeta-accent" />
                </div>
                <div className="p-4 rounded-2xl bg-zeta-900 border border-gray-700 rounded-tl-sm flex items-center space-x-2">
                  <Loader2 size={16} className="text-zeta-accent animate-spin" />
                  <span className="text-xs font-mono text-gray-400">Analyzing telemetry...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-zeta-900 border-t border-gray-800">
          <form onSubmit={handleSubmit} className="relative flex items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Paste network logs, Nmap scans, or ask a diagnostic question..."
              className="w-full bg-zeta-800 border border-gray-700 text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-zeta-accent resize-none min-h-[52px] max-h-32"
              rows={1}
              disabled={isLoading || !!initError}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || !!initError}
              className="absolute right-2 bottom-2 p-2 bg-zeta-accent text-zeta-900 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-500 font-mono">Press Enter to send, Shift+Enter for new line. Data is processed securely.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
