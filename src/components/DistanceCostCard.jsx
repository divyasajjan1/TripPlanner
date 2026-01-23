import React, { useState } from 'react';

export default function DistanceCostCard() {
  const [origin, setOrigin] = useState("New York, USA");
  const [isLocating, setIsLocating] = useState(false);

  // Function to get real browser coordinates
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you'd use Reverse Geocoding (Google/OpenStreetMap API)
        // to turn these coordinates into a city name.
        const { latitude, longitude } = position.coords;
        setOrigin(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
        setIsLocating(false);
      },
      () => {
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="material-symbols-outlined">payments</span>
        <h3>Distance & Cost</h3>
      </div>
      <div className="card-body">
        <div className="location-input-group">
          <label className="small-label">Your Departure City</label>
          <div className="input-with-action">
            <input 
              type="text" 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter city..."
            />
            <button 
              className="icon-btn" 
              onClick={handleAutoLocate} 
              title="Use current location"
            >
              <span className={`material-symbols-outlined ${isLocating ? 'spinning' : ''}`}>
                my_location
              </span>
            </button>
          </div>
        </div>

        <div className="route-visual">
          <div className="dot"></div>
          <div className="line"></div>
          <div className="dot destination"></div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <label>Distance</label>
            <p>6,892 km</p>
          </div>
          <div className="stat-item highlight">
            <label>Est. Cost</label>
            <p>$1,150</p>
          </div>
        </div>
      </div>
    </div>
  );
}