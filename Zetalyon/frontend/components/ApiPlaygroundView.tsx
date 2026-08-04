import React, { useState, useEffect } from 'react';
import { Terminal, Code, Copy, CheckCircle, Server } from 'lucide-react';
import { simulationService } from '../services/simulationService.ts';
import { ApiEndpointSchema } from '../types.ts';

export const ApiPlaygroundView: React.FC = () => {
  const [schemas, setSchemas] = useState<ApiEndpointSchema[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setSchemas(simulationService.getApiSchemas());
  }, []);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="border-b border-gray-800 pb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
          <Terminal className="mr-3 text-zeta-accent" size={32} />
          Live API Schema & OpenAPI Playground
        </h2>
        <p className="text-gray-400 mt-2">
          Inspect structural schemas of JSON telemetry payloads and test endpoints independently.
        </p>
      </header>

      <div className="space-y-6">
        {schemas.map((schema, index) => (
          <div key={index} className="bg-zeta-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
            {/* Endpoint Header */}
            <div className="bg-zeta-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded text-xs font-bold font-mono ${
                  schema.method === 'POST' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                  schema.method === 'GET' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                  schema.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' :
                  'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}>
                  {schema.method}
                </span>
                <span className="text-lg font-mono text-white">{schema.path}</span>
              </div>
              <Server size={20} className="text-gray-500" />
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Description & Schema */}
              <div>
                <p className="text-sm text-gray-300 mb-4">{schema.description}</p>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                  <Code size={14} className="mr-2" /> Payload Schema
                </h4>
                <pre className="bg-zeta-900 p-4 rounded-lg border border-gray-700 text-xs font-mono text-green-400 overflow-x-auto">
                  {schema.payloadSchema}
                </pre>
              </div>

              {/* cURL Example */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                    <Terminal size={14} className="mr-2" /> cURL Example
                  </h4>
                  <button 
                    onClick={() => handleCopy(schema.curlExample, index)}
                    className="text-xs flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedIndex === index ? <CheckCircle size={14} className="text-zeta-safe mr-1" /> : <Copy size={14} className="mr-1" />}
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-zeta-900 p-4 rounded-lg border border-gray-700 text-xs font-mono text-blue-300 overflow-x-auto flex-1 whitespace-pre-wrap break-all">
                  {schema.curlExample}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
