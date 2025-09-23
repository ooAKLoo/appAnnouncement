import React, { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import TopToolbar from './components/TopToolbar';
import LeftConfigPanel from './components/LeftConfigPanel';
import MainContent from './components/MainContent';
import SaveDialog from './components/SaveDialog';
import ConfirmDialog from './components/ConfirmDialog';
import BackgroundDecorations from './components/BackgroundDecorations';
import './styles.css';

function AppContent() {
  useEffect(() => {
    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <div className="App">
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
