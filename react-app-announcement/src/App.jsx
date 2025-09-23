import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import TopToolbar from './components/TopToolbar';
import LeftConfigPanel from './components/LeftConfigPanel';
import MainContent from './components/MainContent';
import SaveDialog from './components/SaveDialog';
import ConfirmDialog from './components/ConfirmDialog';
import BackgroundDecorations from './components/BackgroundDecorations';
import './tailwind.css';

function AppContent() {
  const { state } = useApp();
  
  useEffect(() => {
    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const backgroundStyle = {
    background: `linear-gradient(135deg, ${state.design.bgColor} 0%, ${state.design.gradientColor} 100%)`
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={backgroundStyle}>
      <TopToolbar />
      <LeftConfigPanel />
      <BackgroundDecorations />
      <MainContent />
      <SaveDialog />
      <ConfirmDialog />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
