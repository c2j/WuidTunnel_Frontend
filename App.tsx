import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TestCaseManager } from './pages/TestCaseManager';
import { TestCreator } from './pages/TestCreator';
import { ExecutionCenter } from './pages/ExecutionCenter';
import { Configuration } from './pages/Configuration';
import { SystemValidation } from './pages/SystemValidation';
import { AppStateProvider } from './context/AppStateContext';

const App: React.FC = () => {
  return (
    <AppStateProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/test-cases" element={<TestCaseManager />} />
            <Route path="/create-test-case" element={<TestCreator />} />
            <Route path="/execution" element={<ExecutionCenter />} />
            <Route path="/config" element={<Configuration />} />
            <Route path="/system-check" element={<SystemValidation />} />
            <Route path="/guide" element={<div className="p-8 text-center text-gray-500">用户指南模块开发中...</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppStateProvider>
  );
};

export default App;