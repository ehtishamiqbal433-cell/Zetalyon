import React from 'react';
import { Scale, FileText, AlertOctagon, BookOpen } from 'lucide-react';

export const LicenseView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="border-b border-gray-800 pb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
          <Scale className="mr-3 text-zeta-accent" size={32} />
          Software IP & Open-Source Governance
        </h2>
        <p className="text-gray-400 mt-2">
          Legal framework, dual-licensing strategy, and liability disclaimers for Project ZTA-BioAuth.
        </p>
      </header>

      <div className="bg-zeta-800 border border-gray-700 rounded-xl p-8 shadow-lg space-y-8">
        
        {/* Standard Corporate & Academic File Header */}
        <section>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FileText className="mr-2 text-blue-400" size={20} />
            Standard Corporate & Academic File Header
          </h3>
          <div className="bg-zeta-900 p-4 rounded-lg border border-gray-700 font-mono text-sm text-gray-300 whitespace-pre-wrap">
{`/*
 * Copyright (c) 2026 Muhammad Ehtisham Iqbal. All rights reserved.
 *
 * This software is part of the 'Project ZTA-BioAuth' academic and 
 * open-source research framework. 
 *
 * Use of this source code is governed by the dual-licensing strategy 
 * outlined in the main LICENSE file.
 */`}
          </div>
        </section>

        {/* Open-Source License Selection */}
        <section>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <BookOpen className="mr-2 text-green-400" size={20} />
            Open-Source License Selection (Dual-Licensing Strategy)
          </h3>
          <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <p>
              <strong>a) Academic & Non-Commercial Use:</strong> Governed under the Apache License 2.0. This permits researchers to fork, modify, and distribute the code freely, while granting mutual patent rights and requiring explicit attribution.
            </p>
            <p>
              <strong>b) Commercial Evaluation:</strong> Commercial deployment or integration into proprietary security products requires written authorization and a separate commercial license from the copyright holder.
            </p>
          </div>
        </section>

        {/* Academic Attribution & Citation Mandate */}
        <section>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <BookOpen className="mr-2 text-purple-400" size={20} />
            Academic Attribution & Citation Mandate
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Any academic literature, conference paper, thesis, or whitepaper that utilizes, evaluates, or builds upon this source code or its architectural design MUST explicitly cite the framework using the following standardized format:
          </p>
          <div className="bg-zeta-900 p-4 rounded-lg border border-gray-700 font-mono text-sm text-gray-300">
            Iqbal, M. E. (2026). Project ZTA-BioAuth: Next-Generation Continuous Behavioral Biometric Authentication Framework. [Source code].
          </div>
        </section>

        {/* Liability & "As-Is" Disclaimer */}
        <section>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertOctagon className="mr-2 text-zeta-alert" size={20} />
            Liability & "As-Is" Disclaimer
          </h3>
          <div className="bg-zeta-alert/10 border border-zeta-alert/50 p-6 rounded-lg text-zeta-alert text-sm font-bold uppercase leading-relaxed">
            THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. BECAUSE THIS FRAMEWORK HANDLES BIOMETRIC TELEMETRY AND CONTINUOUS AUTHENTICATION INTERFACES, THE AUTHOR (MUHAMMAD EHTISHAM IQBAL) IS NOT LIABLE FOR ANY SECURITY BYPASSES, DATA CENTER COMPROMISES, SERVERLESS CLOUD COSTS, OR REGULATORY COMPLIANCE FAILURES (SUCH AS GDPR, NIS2, OR HIPAA) INCURRED BY THIRD-PARTY DEPLOYMENTS.
          </div>
        </section>

      </div>
    </div>
  );
};
