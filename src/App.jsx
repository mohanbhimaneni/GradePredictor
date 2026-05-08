import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Calculator from './components/Calculator';
import History from './components/History';

function App() {
  const [currentTab, setCurrentTab] = useState('home');

  const switchTab = (tabName) => {
    setCurrentTab(tabName);
  };

  return (
    <div className="app-wrapper">
      <Navbar currentTab={currentTab} switchTab={switchTab} />
      
      <div className="page-container">
        {currentTab === 'home' && <Home switchTab={switchTab} />}
        {currentTab === 'prediction' && <Calculator switchTab={switchTab} />}
        {currentTab === 'history' && <History />}
      </div>
    </div>
  );
}

export default App;
