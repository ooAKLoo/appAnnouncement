import React from 'react';
import './styles.css';

function App() {
  return (
    <div className="App">
      <div className="top-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-tab active">
            <span>测试</span>
          </button>
        </div>
      </div>
      
      <div className="container">
        <div className="content-wrapper">
          <div className="left-content">
            <h1 className="main-title">测试React应用</h1>
            <p className="subtitle">这是一个测试页面</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;