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

    // SANITIZATION: Convert "EIFFEL TOWER" back to "eiffel_tower" for the backend
    const sanitizedLandmarkName = prediction.name.trim().toLowerCase().replace(/\s/g, '_');

    try {
      const response = await fetch('http://127.0.0.1:8080/api/distance/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landmark_name: sanitizedLandmarkName, 
          origin_city: origin 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Update the SHARED state
        setPrediction({
          ...prediction,
          distance_km: data.distance_km,
          estimated_cost: data.estimated_cost
        });
      } else {
        alert(data.error || "Could not calculate distance.");
      }
    } catch (err) {
      console.error("Calculation error:", err);
      alert("Network error: Could not reach the distance service.");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="icon-container route-icon">
          <span className="material-symbols-outlined">payments</span>
        </div>
        <h3>Trip Estimation</h3>
      </div>
      <div className="card-body">
        <div className="location-input-group">
          <label className="small-label">Departure Point</label>
          <div className="input-with-action">
            <input 
              type="text" 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter city..."
            />
            <button className="icon-btn-ghost" onClick={handleAutoLocate} title="Use GPS">
              <span className={`material-symbols-outlined ${isLocating ? 'spinning' : ''}`}>
                my_location
              </span>
            </button>
            <button className="primary-btn update-btn" onClick={handleCalculate}>
              Update
            </button>
          </div>
        </div>

        <div className="route-visual">
          <span className="material-symbols-outlined source-icon">location_on</span>
          <div className="line-wrapper">
            <div className="line"></div>
            <span className="material-symbols-outlined plane-icon">flight</span>
          </div>
          <span className="material-symbols-outlined dest-icon">explore</span>
        </div>

        <div className="stats-grid">
          <div className="stat-tile">
            <label>Total Distance</label>
            <p>{prediction?.distance_km ? `${prediction.distance_km} km` : "---"}</p>
          </div>
          <div className="stat-tile highlight-amber">
            <label>
              Est. Travel Cost
              <span className="material-symbols-outlined info-trigger">info</span>
            </label>
            <p>{prediction?.estimated_cost ? `$${prediction.estimated_cost}` : "---"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}