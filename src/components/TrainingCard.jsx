import React, { useState } from 'react';
import './TrainingCard.css';

export default function TrainingCard() {
  const [isTraining, setIsTraining] = useState(false);
  const [metrics, setMetrics] = useState(null);
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

    try {
      const response = await fetch('http://127.0.0.1:8080/api/train/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ landmark_name: landmarkName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMetrics({
          epochs: data.epochs_run,
          accuracy: `${(data.final_accuracy * 100).toFixed(2)}%`,
          loss: data.final_loss.toFixed(4),
          images: data.total_images_processed,
          status: data.status
        });
        setLandmarkName(''); // Clear landmark name on success
      } else {
        setError(data.error || 'An error occurred during training.');
      }
    } catch (err) {
      setError('Network error or unable to connect to the backend.');
      console.error('Training error:', err);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="material-symbols-outlined">analytics</span>
        <h3>Model Training & Metrics</h3>
      </div>
      <div className="card-body">
        <p className="card-description">Train the image classification model on specific landmark data.</p>
        <div className="input-group" style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="Landmark Name (e.g., eiffel_tower)" 
            value={landmarkName}
            onChange={(e) => setLandmarkName(e.target.value)}
            disabled={isTraining}
          />
        </div>
        <button 
          className="primary-btn" 
          onClick={startTraining} 
          disabled={isTraining || !landmarkName}
          style={{ backgroundColor: isTraining ? '#ffa000' : '#1976d2' }}
        >
          {isTraining ? 'Training in Progress...' : 'Start Training'}
        </button>
        {error && <p className="error-message">Error: {error}</p>}

        <div className="metrics-display" style={{ marginTop: '15px' }}>
          {metrics ? (
            /* 1. Show metrics if training is finished */
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              <li><strong>Status:</strong> ✅ {metrics.status}</li>
              <li><strong>Images Processed:</strong> {metrics.images}</li>
              <li><strong>Epochs:</strong> {metrics.epochs}</li>
              <li><strong>Accuracy:</strong> {metrics.accuracy}</li>
              <li><strong>Loss:</strong> {metrics.loss}</li>
            </ul>
          ) : isTraining ? (
            /* 2. Show the specific note ONLY while training is active */
            <div className="training-note">
              <span className="material-symbols-outlined spinning-icon">sync</span>
              <p style={{ color: '#e67e22', fontWeight: '500', fontSize: '0.85rem' }}>
                Note: Retraining will include all landmark data to maintain model accuracy.
              </p>
            </div>
          ) : (
            /* 3. Default message when idle */
            <p className="card-description">
              No training data available. Enter a landmark name and click start to begin.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}