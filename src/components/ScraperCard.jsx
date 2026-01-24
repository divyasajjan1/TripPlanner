import React, { useState } from 'react';
import './ScraperCard.css';

export default function ScraperCard() {
  const [url, setUrl] = useState('');
  const [landmarkName, setLandmarkName] = useState('');
  const [scrapedCount, setScrapedCount] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleScrape = async () => {
    setError('');
    setMessage('');
    setScrapedCount(0);

    if (!landmarkName) {
      setError('Please enter a landmark name.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/api/scrape/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ landmark_name: landmarkName.toLowerCase().replace(/\s/g, '_'), search_query: url }),
      });

      const data = await response.json();

      if (response.ok) {
        setScrapedCount(data.scraped_count);
        setMessage(data.message);
      } else {
        setError(data.error || 'An error occurred during scraping.');
      }
    } catch (err) {
      setError('Network error or unable to connect to the backend.');
      console.error('Scraping error:', err);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="material-symbols-outlined">language</span>
        <h3>Scrape Landmark Data</h3>
      </div>
      <div className="card-body">
        <p className="card-description">Enter a landmark name and an optional search query (URL).</p>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Landmark Name (e.g., eiffel_tower)" 
            value={landmarkName}
            onChange={(e) => setLandmarkName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="URL (e.g., https://example.com) or Search Keywords (optional)" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="primary-btn" onClick={handleScrape}>
            Scrape Data
          </button>
        </div>
        {error && <p className="error-message">Error: {error}</p>}
        {message && <p className="success-message">{message}</p>}

      </div>
    </div>
  );
}
