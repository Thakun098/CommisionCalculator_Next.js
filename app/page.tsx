'use client';

import { useState, useEffect } from 'react';

interface Entry {
  id: number;
  name: string;
  locks: number;
  stocks: number;
  barrels: number;
  sales: number;
  commission: number;
  isValid: boolean;
  errors: string[];
}

export default function Home() {
  const [name, setName] = useState('');
  const [locks, setLocks] = useState('');
  const [stocks, setStocks] = useState('');
  const [barrels, setBarrels] = useState('');
  const [entries, setEntries] = useState<Entry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('commissionEntries');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [entryCount, setEntryCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('commissionEntryCount');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });

  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState<{
    name: string;
    locks: string;
    stocks: string;
    barrels: string;
  }>({ name: '', locks: '', stocks: '', barrels: '' });

  // Save entries to localStorage when they change
  useEffect(() => {
    localStorage.setItem('commissionEntries', JSON.stringify(entries));
    localStorage.setItem('commissionEntryCount', entryCount.toString());
  }, [entries, entryCount]);

  // Calculate sales: $45 * locks + $30 * stocks + $25 * barrels
  const calculateSales = (l: number, s: number, b: number): number => {
    return 45 * l + 30 * s + 25 * b;
  };

  // Calculate commission with tiered rates:
  // 10% on first $1,000
  // 15% on next $800 ($1,001 to $1,800)
  // 20% on everything above $1,800
  const calculateCommission = (sales: number): number => {
    let commission = 0;
    
    if (sales <= 1000) {
      commission = sales * 0.10;
    } else if (sales <= 1800) {
      commission = 1000 * 0.10 + (sales - 1000) * 0.15;
    } else {
      commission = 1000 * 0.10 + 800 * 0.15 + (sales - 1800) * 0.20;
    }
    
    return commission;
  };

  // Validate inputs
  const validateInputs = (l: number, s: number, b: number): string[] => {
    const errors: string[] = [];
    
    if (isNaN(l) || l < 1 || l > 70) {
      errors.push('Locks must be between 1 and 70');
    }
    if (isNaN(s) || s < 1 || s > 80) {
      errors.push('Stocks must be between 1 and 80');
    }
    if (isNaN(b) || b < 1 || b > 90) {
      errors.push('Barrels must be between 1 and 90');
    }
    
    return errors;
  };

  const handleCalculate = () => {
    // Check for empty fields first
    const newFieldErrors = {
      name: name.trim() === '' ? 'Please enter Employee Name' : '',
      locks: locks.trim() === '' ? 'Please enter Locks' : '',
      stocks: stocks.trim() === '' ? 'Please enter Stocks' : '',
      barrels: barrels.trim() === '' ? 'Please enter Barrels' : ''
    };
    setFieldErrors(newFieldErrors);

    // If any field is empty, don't proceed
    if (Object.values(newFieldErrors).some(error => error !== '')) {
      return;
    }

    const l = parseInt(locks);
    const s = parseInt(stocks);
    const b = parseInt(barrels);
    
    const errors = validateInputs(l, s, b);
    const isValid = errors.length === 0;
    
    let sales = 0;
    let commission = 0;
    
    if (isValid) {
      sales = calculateSales(l, s, b);
      commission = calculateCommission(sales);
    }
    
    const newEntry: Entry = {
      id: entryCount + 1,
      name: name || 'Employee',
      locks: isNaN(l) ? 0 : l,
      stocks: isNaN(s) ? 0 : s,
      barrels: isNaN(b) ? 0 : b,
      sales,
      commission,
      isValid,
      errors
    };
    
    setEntries([...entries, newEntry]);
    setEntryCount(entryCount + 1);
  };

  const handleReset = () => {
    setName('');
    setLocks('');
    setStocks('');
    setBarrels('');
    setFieldErrors({ name: '', locks: '', stocks: '', barrels: '' });
  };

  const handleClearHistory = () => {
    setEntries([]);
    setEntryCount(0);
    localStorage.removeItem('commissionEntries');
    localStorage.removeItem('commissionEntryCount');
  };

  // Calculate totals from valid entries only
  const validEntries = entries.filter(e => e.isValid);
  const totalSales = validEntries.reduce((sum, e) => sum + e.sales, 0);
  const totalCommission = validEntries.reduce((sum, e) => sum + e.commission, 0);

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Commission Calculator</h1>
      
      {/* Input Form */}
      <div className="form-group">
        <label className="form-label">Employee Name</label>
        <input
          type="text"
          className={`form-input ${fieldErrors.name ? 'input-error' : ''}`}
          placeholder="Enter name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
          }}
        />
        {fieldErrors.name && <div className="field-error-message">{fieldErrors.name}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label">Locks (1-70)</label>
        <input
          type="number"
          className={`form-input ${fieldErrors.locks ? 'input-error' : ''}`}
          placeholder="Enter locks sales"
          value={locks}
          onChange={(e) => {
            setLocks(e.target.value);
            if (fieldErrors.locks) setFieldErrors(prev => ({ ...prev, locks: '' }));
          }}
          min="1"
          max="70"
        />
        {fieldErrors.locks && <div className="field-error-message">{fieldErrors.locks}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label">Stocks (1-80)</label>
        <input
          type="number"
          className={`form-input ${fieldErrors.stocks ? 'input-error' : ''}`}
          placeholder="Enter stocks sales"
          value={stocks}
          onChange={(e) => {
            setStocks(e.target.value);
            if (fieldErrors.stocks) setFieldErrors(prev => ({ ...prev, stocks: '' }));
          }}
          min="1"
          max="80"
        />
        {fieldErrors.stocks && <div className="field-error-message">{fieldErrors.stocks}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label">Barrels (1-90)</label>
        <input
          type="number"
          className={`form-input ${fieldErrors.barrels ? 'input-error' : ''}`}
          placeholder="Enter barrels sales"
          value={barrels}
          onChange={(e) => {
            setBarrels(e.target.value);
            if (fieldErrors.barrels) setFieldErrors(prev => ({ ...prev, barrels: '' }));
          }}
          min="1"
          max="90"
        />
        {fieldErrors.barrels && <div className="field-error-message">{fieldErrors.barrels}</div>}
      </div>
      
      {/* Buttons */}
      <div className="button-group">
        <button className="btn btn-calculate" onClick={handleCalculate}>
          Calculate
        </button>
        <button className="btn btn-reset" onClick={handleReset}>
          Reset
        </button>
      </div>
      
      {entries.length > 0 && (
        <div className="button-group">
          <button className="btn btn-clear-history" onClick={handleClearHistory}>
            Clear History
          </button>
        </div>
      )}
      
      {/* Results Table */}
      {entries.length > 0 && (
        <>
          <div className="table-scroll-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Sales</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {validEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>No.{entry.id}</td>
                    <td>{entry.sales}</td>
                    <td>{entry.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary Table */}
          <table className="summary-table">
            <thead>
              <tr>
                <th>Total Sales</th>
                <th>Total Commission</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totalSales}</td>
                <td>{totalCommission}</td>
              </tr>
            </tbody>
          </table>
          
          {/* Detailed Info Box */}
          <div className="info-box">
            {entries.map((entry) => (
              <div key={entry.id} className="entry">
                <div className="entry-header">Number #{entry.id}</div>
                <div className="entry-name">Name: {entry.name}</div>
                <div className="entry-details">
                  <span className={!entry.isValid && entry.errors.some(e => e.includes('Locks')) ? 'error-text' : ''}>
                    Locks: {entry.locks}
                  </span>
                  <span className={!entry.isValid && entry.errors.some(e => e.includes('Stocks')) ? 'error-text' : ''}>
                    Stocks: {entry.stocks}
                  </span>
                  <span className={!entry.isValid && entry.errors.some(e => e.includes('Barrels')) ? 'error-text' : ''}>
                    Barrels: {entry.barrels}
                  </span>
                </div>
                {entry.isValid ? (
                  <>
                    <div className="entry-sales">Sales: ${entry.sales}</div>
                    <div className="entry-commission">Commission: ${entry.commission}</div>
                  </>
                ) : (
                  <div className="error-text">Invalid Input</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
