import React, { useState } from 'react';
import { GradePredictor, FORMULAS } from '../utils/GradePredictor';
import './Calculator.css';

function Calculator({ switchTab }) {
  const [subject, setSubject] = useState('');
  const [gaaValue, setGaaValue] = useState('');
  const [qz1Value, setQz1Value] = useState('');
  const [qz2Value, setQz2Value] = useState('');
  const [bonusValue, setBonusValue] = useState('');
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [showFormula, setShowFormula] = useState(false);

  const handleSubjectChange = (e) => {
    const newSubject = e.target.value;
    setSubject(newSubject);
    setShowFormula(!!newSubject);
    setResults(null);
    setErrors({});
    setGlobalError('');
    setGaaValue('');
    setQz1Value('');
    setQz2Value('');
    setBonusValue('');
  };

  const validateInput = (value, name) => {
    if (value === '') {
      return { valid: false, error: 'This field is required' };
    }
    const num = parseInt(value);
    if (isNaN(num) || num < 0 || num > 100) {
      return { valid: false, error: 'Must be between 0 and 100' };
    }
    return { valid: true, error: '' };
  };

  const handleCalculate = () => {
    const newErrors = {};
    setGlobalError('');

    // Validate inputs
    const gaaValidation = validateInput(gaaValue, 'gaa');
    const qz1Validation = validateInput(qz1Value, 'qz1');
    const qz2Validation = validateInput(qz2Value, 'qz2');

    if (!gaaValidation.valid) newErrors.gaa = gaaValidation.error;
    if (!qz1Validation.valid) newErrors.qz1 = qz1Validation.error;
    if (!qz2Validation.valid) newErrors.qz2 = qz2Validation.error;

    if (subject !== 'BDM') {
      const bonusValidation = validateInput(bonusValue, 'bonus');
      if (!bonusValidation.valid) newErrors.bonus = bonusValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const predictor = new GradePredictor(subject);
      if (subject === 'BDM') {
        predictor.ga = parseInt(gaaValue);
      } else {
        predictor.gaa = parseInt(gaaValue);
      }
      predictor.qI = parseInt(qz1Value);
      predictor.qII = parseInt(qz2Value);
      predictor.bonus = subject !== 'BDM' ? parseInt(bonusValue) : 0;

      const predictions = predictor.getPredictions();
      const gradeTable = predictor.getGradeTable(predictions);

      setResults(gradeTable);
      setErrors({});

      // Save to history
      saveToHistory(subject, parseInt(gaaValue), parseInt(qz1Value), parseInt(qz2Value), parseInt(bonusValue), gradeTable);
    } catch (error) {
      setGlobalError(error.message);
    }
  };

  const saveToHistory = (subj, gaa, qz1, qz2, bonus, gradeTable) => {
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      subject: subj,
      gaaValue: gaa,
      qz1Value: qz1,
      qz2Value: qz2,
      bonusValue: bonus,
      gradeTable
    };

    const history = JSON.parse(localStorage.getItem('gradePredictor_history') || '[]');
    history.unshift(historyItem);
    localStorage.setItem('gradePredictor_history', JSON.stringify(history));
  };

  const handleReset = () => {
    setSubject('');
    setGaaValue('');
    setQz1Value('');
    setQz2Value('');
    setBonusValue('');
    setResults(null);
    setErrors({});
    setGlobalError('');
    setShowFormula(false);
  };

  return (
    <div className="page active">
      <div className="calculator-container">
        <h2>Grade Calculator</h2>

        <div className="form-section">
          <div className="subject-selector">
            <label htmlFor="subject">Select Your Subject:</label>
            <select id="subject" value={subject} onChange={handleSubjectChange}>
              <option value="">Choose a subject...</option>
              <option value="MLT">MLT - Machine Learning</option>
              <option value="BDM">BDM - Big Data Management</option>
              <option value="MAD2">MAD2 - Mobile App Dev 2</option>
            </select>
          </div>

          {showFormula && subject && (
            <div className="formula-box">
              <strong>Formula:</strong>
              <code>{FORMULAS[subject]}</code>
            </div>
          )}

          {subject && (
            <div className="inputs-container">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="gaa">{subject === 'BDM' ? 'Enter GA:' : 'Enter GAA:'}</label>
                  <input
                    type="number"
                    id="gaa"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={gaaValue}
                    onChange={(e) => {
                      setGaaValue(e.target.value);
                      if (errors.gaa) setErrors({ ...errors, gaa: '' });
                    }}
                  />
                  {errors.gaa && <span className="error-message">{errors.gaa}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="qz1">Quiz 1 Score:</label>
                  <input
                    type="number"
                    id="qz1"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={qz1Value}
                    onChange={(e) => {
                      setQz1Value(e.target.value);
                      if (errors.qz1) setErrors({ ...errors, qz1: '' });
                    }}
                  />
                  {errors.qz1 && <span className="error-message">{errors.qz1}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="qz2">Quiz 2 Score:</label>
                  <input
                    type="number"
                    id="qz2"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={qz2Value}
                    onChange={(e) => {
                      setQz2Value(e.target.value);
                      if (errors.qz2) setErrors({ ...errors, qz2: '' });
                    }}
                  />
                  {errors.qz2 && <span className="error-message">{errors.qz2}</span>}
                </div>

                {subject !== 'BDM' && (
                  <div className="form-group">
                    <label htmlFor="bonus">Bonus Points:</label>
                    <input
                      type="number"
                      id="bonus"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={bonusValue}
                      onChange={(e) => {
                        setBonusValue(e.target.value);
                        if (errors.bonus) setErrors({ ...errors, bonus: '' });
                      }}
                    />
                    {errors.bonus && <span className="error-message">{errors.bonus}</span>}
                  </div>
                )}
              </div>

              {globalError && <div className="error-box"><p>{globalError}</p></div>}

              <button onClick={handleCalculate} className="btn btn-primary btn-block">
                Calculate My Grade
              </button>
            </div>
          )}
        </div>

        {results && (
          <div className="results-section">
            <h3>Your Grade Predictions</h3>
            <div className="results-table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Target Grade</th>
                    <th>Minimum Final Exam Score</th>
                    <th>Your Total</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.grade}>
                      <td className={`grade-cell grade-${result.grade}`}>{result.grade}</td>
                      <td>{result.minF}</td>
                      <td>{result.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={handleReset} className="btn btn-secondary">
              Try Another Subject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;
