import React from 'react';
import './Navbar.css';

function Navbar({ currentTab, switchTab }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>📊 Grade Predictor</h1>
      </div>
      <ul className="nav-tabs">
        <li>
          <a
            href="#home"
            className={`nav-link ${currentTab === 'home' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              switchTab('home');
            }}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#prediction"
            className={`nav-link ${currentTab === 'prediction' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              switchTab('prediction');
            }}
          >
            Calculator
          </a>
        </li>
        <li>
          <a
            href="#history"
            className={`nav-link ${currentTab === 'history' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              switchTab('history');
            }}
          >
            History
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
