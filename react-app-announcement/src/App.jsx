import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import NewMainInterface from './components/NewMainInterface';
import StyleProvider from './components/StyleProvider';
import './tailwind.css';

function AppContent() {
  useEffect(() => {
    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <StyleProvider>
      <NewMainInterface />
    </StyleProvider>
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
