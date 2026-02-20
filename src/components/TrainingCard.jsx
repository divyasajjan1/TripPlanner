import React, { useState, useEffect } from 'react';
import './TrainingCard.css';

export default function TrainingCard() {
  const [isTraining, setIsTraining] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [isHistorical, setIsHistorical] = useState(false);
  const [landmarkName, setLandmarkName] = useState('');
  const [error, setError] = useState('');

  const startTraining = async () => {
    if (!landmarkName) {
      setError('Please enter a landmark name.');
      return;
    }

    setIsTraining(true);
    setMetrics(null);
    setError('');
    setIsHistorical(false);

    const sanitizedName = landmarkName.trim().toLowerCase().replace(/\s/g, '_');

    try {
      const response = await fetch('http://127.0.0.1:8080/api/train/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landmark_name: sanitizedName }),
      });

      const data = await response.json();

      if (response.ok && data.status !== 'error') {
        setMetrics({
          epochs: data.epochs_run,
          accuracy: `${(data.final_accuracy * 100).toFixed(2)}%`,
          loss: data.final_loss.toFixed(4),
          images: data.total_images_processed,
          status: data.status 
        });
        setIsHistorical(false);
        setLandmarkName(''); 
      } else {
        setError(data.message || data.error || 'An error occurred during training.');
      }
    } catch (err) {
      setError('Network error or unable to connect to the backend.');
      console.error('Training error:', err);
    } finally {
      setIsTraining(false);
    }
  };
  
  useEffect(() => {
    const loadLastRun = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/training-history/');
        const data = await response.json();
        
        if (data && data.length > 0) {
          const latest = data[0]; 
          if (latest.status === 'success') {
            setMetrics({
              epochs: latest.epochs,
              accuracy: `${(latest.accuracy * 100).toFixed(2)}%`,
              loss: latest.loss?.toFixed(4),
              status: latest.status,
              images: latest.image_count || "N/A"
            });
            setIsHistorical(true);
          }
        }
      } catch (err) {
        console.error("Could not load previous training stats:", err);
      }
    };
    loadLastRun();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div className="icon-container training-icon">
          <span className="material-symbols-outlined">analytics</span>
        </div>
        <h3>Model Training</h3>
      </div>
      <div className="card-body">
        <p className="card-description">Fine-tune the classification model with specific landmark data.</p>
        
        <div className="input-field">
          <label>Target Landmark</label>
          <input 
            type="text" 
            placeholder="e.g., eiffel_tower" 
            value={landmarkName}
            onChange={(e) => setLandmarkName(e.target.value)}
            disabled={isTraining}
          />
        </div>

        <button 
          className={`primary-btn training-btn ${isTraining ? 'is-active' : ''}`} 
          onClick={startTraining} 
          disabled={isTraining || !landmarkName}
        >
          {isTraining ? (
            <><span className="material-symbols-outlined spinning">sync</span> Training...</>
          ) : 'Initialize Training'}
        </button>

        <div className="metrics-container">
          {metrics ? (
            <div className={`metrics-grid ${isHistorical ? 'historical' : 'fresh'}`}>
              <div className="metrics-tag">
                {isHistorical ? "🕒 Last Session" : "✨ Current Run"}
              </div>
              <div className="metric-tile">
                <span>Accuracy</span>
                <strong>{metrics.accuracy}</strong>
              </div>
              <div className="metric-tile">
                <span>Loss</span>
                <strong>{metrics.loss}</strong>
              </div>
              <div className="metric-tile">
                <span>Images</span>
                <strong>{metrics.images}</strong>
              </div>
              <div className="metric-tile">
                <span>Epochs</span>
                <strong>{metrics.epochs}</strong>
              </div>
            </div>
          ) : (
            <div className="training-placeholder">
              <span className="material-symbols-outlined">info</span>
              <p>No active training data. Ready to process.</p>
            </div>
          )}
        </div>
        {error && <div className="status-box error">{error}</div>}
      </div>
    </div>
  );
}