import React, { useState } from 'react';
import './TrainingCard.css';

export default function TrainingCard() {
  const [isTraining, setIsTraining] = useState(false);
  const [metrics, setMetrics] = useState(null);

  const startTraining = () => {
    setIsTraining(true);
    // Logic to call Django backend /api/train/ will go here
    setTimeout(() => {
      setMetrics({
        epochs: 10,
        accuracy: "94.2%",
        loss: "0.08",
        images: 150,
        status: "Complete"
      });
      setIsTraining(false);
    }, 3000); // Simulated delay
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="material-symbols-outlined">analytics</span>
        <h3>Model Training & Metrics</h3>
      </div>
      <div className="card-body">
        <button 
          className="primary-btn" 
          onClick={startTraining} 
          disabled={isTraining}
          style={{ backgroundColor: isTraining ? '#ffa000' : '#1976d2' }}
        >
          {isTraining ? 'Training in Progress...' : 'Start Training'}
        </button>

        <div className="metrics-display" style={{ marginTop: '15px' }}>
          {metrics ? (
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              <li><strong>Status:</strong> ✅ {metrics.status}</li>
              <li><strong>Images Processed:</strong> {metrics.images}</li>
              <li><strong>Epochs:</strong> {metrics.epochs}</li>
              <li><strong>Accuracy:</strong> {metrics.accuracy}</li>
              <li><strong>Loss:</strong> {metrics.loss}</li>
            </ul>
          ) : (
            <p className="card-description">No training data available. Click start to begin.</p>
          )}
        </div>
      </div>
    </div>
  );
}