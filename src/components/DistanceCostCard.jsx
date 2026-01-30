import React, { useState } from 'react';
import './DistanceCostCard.css';

export default function DistanceCostCard({ prediction, setPrediction }) {
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

  const handleCalculate = async () => {
  // If no landmark has been identified in Card 4 yet, we can't calculate distance
    if (!prediction || !prediction.name) {
      alert("Please upload a photo in 'Upload Selfie' section first!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/api/distance/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landmark_name: prediction.name, // From shared state
          origin_city: origin // From local input state
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // 3. Update the SHARED state so both cards see the new distance/cost
        setPrediction({
          ...prediction,
          distance_km: data.distance_km,
          estimated_cost: data.estimated_cost
        });
      }
    } catch (err) {
      console.error("Calculation error:", err);
    }
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
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()} 
              placeholder="Enter city, country..."
            />
            
            {/* Button 1: The Auto-Locate Icon */}
            <button 
              className="icon-btn" 
              onClick={handleAutoLocate} 
              title="Use current location"
            >
              <span className={`material-symbols-outlined ${isLocating ? 'spinning' : ''}`}>
                my_location
              </span>
            </button>

            {/* Button 2: The Update Route Text Button */}
            <button className="calculate-btn" onClick={handleCalculate}>
              Update
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
            <div className="stat-header">
              <span className="material-symbols-outlined">straighten</span>
              <label>Distance</label>
            </div>
            <p className="stat-value">
              {prediction?.distance_km ? `${prediction.distance_km} km` : "---"}
            </p>
            {/* Sub-label to clarify the origin */}
            <span className="stat-meta">From your current location</span>
          </div>
          <div className="stat-item highlight">
            <label>
              Est. Travel Cost
              <div className="tooltip-container">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
                <span className="tooltip-text">
                  Estimated 2026 airfare based on a global average of $0.15/km. Includes base taxes and fees.
                </span>
              </div>
            </label>
            <p>${prediction?.estimated_cost || "---"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}