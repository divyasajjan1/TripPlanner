import React, { useState } from 'react';
import './BestDealsCard.css';

// Formats minutes → "2h 35m"
function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$' };

export default function BestDealsCard({ prediction, origin, coords, originCoords }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!prediction?.name) {
      alert('Please identify a landmark first!');
      return;
    }
    if (!origin || origin.trim().length < 2) {
      alert('Please enter a valid departure city in the Trip Estimation card.');
      return;
    }

    // Warn early if coords are missing — backend will fall back to keyword search,
    // but the user should know GPS precision may be lost.
    if (!coords?.lat || !coords?.lon) {
      console.warn('BestDealsCard: no coords supplied, falling back to keyword search.');
    }

    setLoading(true);
    setError(null);
    setDeals([]);

    try {
      const response = await fetch('http://127.0.0.1:8080/api/flight-deals/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: prediction.name,
          origin: origin.trim(),
          lat: coords?.lat ?? null,
          lon: coords?.lon ?? null,
          origin_lat: originCoords?.lat ?? null,
          origin_lon: originCoords?.lon ?? null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      // Backend may return [{error: "..."}] or a real list
      if (Array.isArray(data) && data[0]?.error) {
        setError(data[0].error);
      } else if (data.error) {
        setError(data.error);
      } else {
        setDeals(data);
      }
    } catch (err) {
      setError('Failed to connect to the flight service.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card flight-deals-card">
      <div className="card-header">
        <div className="icon-container flight-icon">
          <span className="material-symbols-outlined">flight_takeoff</span>
        </div>
        <h3>Best Flight Deals</h3>
      </div>

      <div className="card-body">
        <button
          className="primary-btn search-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Find Best Flights'}
        </button>

        {error && <p className="error-text">{error}</p>}

        <div className="deals-list">
          {deals.length > 0 ? (
            deals.map((deal, index) => {
              const symbol = CURRENCY_SYMBOLS[deal.currency] ?? deal.currency;
              const duration = formatDuration(deal.duration_minutes);
              return (
                <div key={index} className="deal-item">
                  <div className="deal-details">
                    <span className="deal-type">{deal.type}</span>
                    <span className="deal-site-name">{deal.site}</span>
                    {duration && (
                      <span className="deal-duration"> ⏱{duration}</span>
                    )}
                  </div>
                  <div className="deal-price-section">
                    <span className="currency-symbol">{symbol}</span>
                    <span className="price-value">{parseFloat(deal.price).toFixed(2)}</span>
                    <button className="book-btn">View</button>
                  </div>
                </div>
              );
            })
          ) : (
            !loading && (
              <p className="placeholder-text">Click search to see real-time prices.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}