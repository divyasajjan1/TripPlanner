import React, { useState } from 'react';

export default function ScraperCard() {
  const [url, setUrl] = useState('');

  return (
    <div className="card">
      <div className="card-header">
        <span className="material-symbols-outlined">language</span>
        <h3>Scrape Landmark Data</h3>
      </div>
      <div className="card-body">
        <p className="card-description">Enter a URL to extract landmark coordinates.</p>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="https://..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="primary-btn" onClick={() => alert(`Scraping: ${url}`)}>
            Scrape URL Data
          </button>
        </div>
      </div>
    </div>
  );
}