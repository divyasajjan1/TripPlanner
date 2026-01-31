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
        <span className="material-symbols-outlined">analytics</span>
        <h3>Model Training & Metrics</h3>
      </div>
      <div className="card-body">
        <p className="card-description">Train the image classification model on specific landmark data.</p>
        
        <div className="input-group mb-15">
          <input 
            type="text" 
            placeholder="Landmark Name (e.g., eiffel_tower)" 
            value={landmarkName}
            onChange={(e) => setLandmarkName(e.target.value)}
            disabled={isTraining}
          />
        </div>

        <button 
          className={`primary-btn ${isTraining ? 'training' : ''}`} 
          onClick={startTraining} 
          disabled={isTraining || !landmarkName}
        >
          {isTraining ? 'Training in Progress...' : 'Start Training'}
        </button>

        {error && <p className="error-message">Error: {error}</p>}

        <div className="metrics-display mt-15">
          {metrics ? (
            <ul className={`metrics-list ${isHistorical ? 'historical' : 'new'}`}>
              <li className="metrics-header">
                <strong>{isHistorical ? "🕒 Most Recent Training Data" : "✨ New Training Result"}</strong>
              </li>
              <li><strong>Status:</strong> ✅ {metrics.status}</li>
              <li><strong>Images Processed:</strong> {metrics.images}</li>
              <li><strong>Epochs:</strong> {metrics.epochs}</li>
              <li><strong>Accuracy:</strong> {metrics.accuracy}</li>
              <li><strong>Loss:</strong> {metrics.loss}</li>
            </ul>
          ) : isTraining ? (
            <div className="training-note">
              <span className="material-symbols-outlined spinning-icon">sync</span>
              <p className="note-text">
                Note: Retraining will include all landmark data to maintain model accuracy.
              </p>
            </div>
          ) : (
            <p className="card-description">
              No training data available. Enter a landmark name and click start to begin.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}