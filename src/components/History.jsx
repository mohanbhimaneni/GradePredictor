import React, { useState, useEffect } from 'react';
import './History.css';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('gradePredictor_history') || '[]');
    setHistory(savedHistory);
  };

  const deleteHistoryItem = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('gradePredictor_history', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all history? This cannot be undone.')) {
      localStorage.removeItem('gradePredictor_history');
      setHistory([]);
    }
  };

  return (
    <div className="page active">
      <div className="history-container">
        <div className="history-header">
          <h2>Prediction History</h2>
          {history.length > 0 && (
            <button onClick={handleClearAll} className="btn btn-danger btn-small">
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="empty-message">No predictions yet. Head to the Calculator tab to get started!</p>
        ) : (
          <div className="history-grid">
            {history.map((item) => {
              const achievableGrade = item.gradeTable.find(g => g.minF !== 'N/A');
              const gaaLabel = item.subject === 'BDM' ? 'GA' : 'GAA';

              return (
                <div key={item.id} className="history-card">
                  <div className="history-card-header">
                    <span className="history-subject">{item.subject}</span>
                    <span className="history-time">{item.timestamp}</span>
                  </div>

                  <div className="history-details">
                    <div className="detail-item">
                      <label>{gaaLabel}</label>
                      <value>{item.gaaValue}</value>
                    </div>
                    <div className="detail-item">
                      <label>Qz1</label>
                      <value>{item.qz1Value}</value>
                    </div>
                    <div className="detail-item">
                      <label>Qz2</label>
                      <value>{item.qz2Value}</value>
                    </div>
                    {item.subject !== 'BDM' && (
                      <div className="detail-item">
                        <label>Bonus</label>
                        <value>{item.bonusValue}</value>
                      </div>
                    )}
                  </div>

                  <div className="history-result">
                    {achievableGrade ? (
                      <>
                        <label>Best Grade</label>
                        <value>{achievableGrade.grade} (needs F ≥ {achievableGrade.minF})</value>
                      </>
                    ) : (
                      <>
                        <label>Best Grade</label>
                        <value>Cannot achieve any grade (E)</value>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="btn btn-danger btn-small btn-delete"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
