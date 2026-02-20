import React, { useState } from 'react';
import './ScraperCard.css';

export default function ScraperCard() {
  const [url, setUrl] = useState('');
  const [landmarkName, setLandmarkName] = useState('');
  const [isScraping, setIsScraping] = useState(false); // NEW: Loading state
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleScrape = async () => {
    setError('');
    setMessage('');
    setIsScraping(true); // Start loading

    if (!landmarkName) {
      setError('Please enter a landmark name.');
      setIsScraping(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/api/scrape/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We send the name as is, or lowercase. 
        // TIP: Ensure this matches a 'name' already in your Landmark table!
        body: JSON.stringify({ 
          landmark_name: landmarkName.trim().toLowerCase().replace(/\s/g, '_'), 
          search_query: url 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        // If the landmark doesn't exist in DB, the backend will return 404
        setError(data.error || 'An error occurred during scraping.');
      }
    } catch (err) {
      setError('Network error or unable to connect to the backend.');
    } finally {
      setIsScraping(false); // Stop loading regardless of success/fail
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="icon-container">
          <span className="material-symbols-outlined">language</span>
        </div>
        <h3>Scrape Landmark Data</h3>
      </div>
      <div className="card-body">
        <p className="card-description">Target a landmark already in your database to fetch training images.</p>
        
        <div className="input-field">
          <label>Landmark Identity</label>
          <input 
            type="text" 
            placeholder="e.g., eiffel_tower" 
            value={landmarkName}
            onChange={(e) => setLandmarkName(e.target.value)}
            disabled={isScraping}
          />
        </div>

        <div className="input-field">
          <label>Source Query</label>
          <input 
            type="text" 
            placeholder="Optional: Specific URL or Search Query" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScraping}
          />
        </div>
        <button 
          className="primary-btn action-btn" 
          onClick={handleScrape}
          disabled={isScraping}
        >
          {isScraping ? (
            <><span className="spinner"></span> Scraping...</>
          ) : 'Start Extraction'}
        </button>

        {error && <div className="status-box error">{error}</div>}
        {message && <div className="status-box success">{message}</div>}
      </div>
    </div>
  );
}