import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { ExecutiveDashboard } from './components/ExecutiveDashboard.tsx';
import { UserPortal } from './components/UserPortal.tsx';
import { SystemTelemetry } from './components/SystemTelemetry.tsx';
import { Documentation } from './components/Documentation.tsx';
import { BiometricsView } from './components/BiometricsView.tsx';
import { ThreatMapView } from './components/ThreatMapView.tsx';
import { SystemConfigView } from './components/SystemConfigView.tsx';
import { LicenseView } from './components/LicenseView.tsx';
import { CodeHardeningView } from './components/CodeHardeningView.tsx';
import { CyberRangeSandbox } from './components/CyberRangeSandbox.tsx';
import { VertexAIPipelineView } from './components/VertexAIPipelineView.tsx';
import { ApiPlaygroundView } from './components/ApiPlaygroundView.tsx';
import { DeploymentView } from './components/DeploymentView.tsx';
import { RoutePaths } from './types.ts';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={RoutePaths.DASHBOARD} element={<Dashboard />} />
          <Route path={RoutePaths.EXECUTIVE} element={<ExecutiveDashboard />} />
          <Route path={RoutePaths.USER_PORTAL} element={<UserPortal />} />
          <Route path={RoutePaths.SYSTEM_TELEMETRY} element={<SystemTelemetry />} />
          <Route path={RoutePaths.DOCUMENTATION} element={<Documentation />} />
          <Route path={RoutePaths.BIOMETRICS} element={<BiometricsView />} />
          <Route path={RoutePaths.THREAT_MAP} element={<ThreatMapView />} />
          <Route path={RoutePaths.VERTEX_PIPELINE} element={<VertexAIPipelineView />} />
          <Route path={RoutePaths.CYBER_RANGE} element={<CyberRangeSandbox />} />
          <Route path={RoutePaths.SETTINGS} element={<SystemConfigView />} />
          <Route path={RoutePaths.CODE_HARDENING} element={<CodeHardeningView />} />
          <Route path={RoutePaths.API_PLAYGROUND} element={<ApiPlaygroundView />} />
          <Route path={RoutePaths.DEPLOYMENT} element={<DeploymentView />} />
          <Route path={RoutePaths.LICENSE} element={<LicenseView />} />
          <Route path="*" element={<Navigate to={RoutePaths.DASHBOARD} replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
