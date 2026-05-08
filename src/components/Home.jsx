import React from 'react';
import './Home.css';

function Home({ switchTab }) {
  return (
    <div className="page active">
      <div className="hero-section">
        <div className="hero-content">
          <h2>Know Your Grade Before the Final Exam</h2>
          <p>Calculate exactly what score you need on your final exam to achieve your target grade. Works for MLT, BDM, and MAD2.</p>
          <button className="btn btn-primary btn-large" onClick={() => switchTab('prediction')}>
            Start Calculating
          </button>
        </div>
      </div>

      <div className="features-section">
        <h3>Why Use Grade Predictor?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h4>Accurate Predictions</h4>
            <p>Get precise calculations based on your subject's specific grading formula</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Instant Results</h4>
            <p>See all grade possibilities from S to E in real-time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h4>Track History</h4>
            <p>All predictions saved locally - no account needed</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h4>Fully Responsive</h4>
            <p>Works seamlessly on desktop, tablet, and mobile</p>
          </div>
        </div>
      </div>

      <div className="subjects-section">
        <h3>Supported Subjects</h3>
        <div className="subjects-grid">
          <div className="subject-badge">
            <span className="subject-name">MLT</span>
            <span className="subject-desc">Machine Learning</span>
          </div>
          <div className="subject-badge">
            <span className="subject-name">BDM</span>
            <span className="subject-desc">Big Data Management</span>
          </div>
          <div className="subject-badge">
            <span className="subject-name">MAD2</span>
            <span className="subject-desc">Mobile App Dev 2</span>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-box">
          <h3>Open Source & Community Driven</h3>
          <p>Help make Grade Predictor even better! Contribute code, report issues, or suggest improvements.</p>
          <a href="https://github.com/mohanbhimaneni/GradePredictor" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            View on GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
