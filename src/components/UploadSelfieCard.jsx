import React, { useState } from 'react';
import './UploadSelfieCard.css';

export default function UploadSelfie({ prediction, setPrediction }) {
  const [fileObject, setFileObject] = useState(null); // The real file for the API
  const [previewUrl, setPreviewUrl] = useState(null); // The URL for the UI
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // If a previous preview exists, revoke it to save memory
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      
      setFileObject(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
    }
  };

  const identifyLandmark = async () => {
    if (!fileObject) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', fileObject);

    try {
      const response = await fetch('http://127.0.0.1:8080/api/predict/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Full Data Received:", data);

        setPrediction({
          name: data.name ? data.name.replace(/_/g, ' ').toUpperCase() : "UNKNOWN",
          location: `Lat: ${parseFloat(data.latitude).toFixed(2)}, Lon: ${parseFloat(data.longitude).toFixed(2)}`,
          
          // Check if confidence is in data, otherwise default to 100% or N/A
          confidence: data.confidence 
            ? `${(parseFloat(data.confidence) * 100).toFixed(1)}% confident` 
            : "Confidence N/A",
          
          // Use summary or summary_at_prediction depending on what's in the log
          summary: data.summary || data.summary_at_prediction || "No summary available."
        });
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Network error: Could not reach the backend.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card hero-card">
      <div className="card-header">
        <div className="icon-container selfie-icon">
          <span className="material-symbols-outlined">face</span>
        </div>
        <h3>Identify Landmark</h3>
      </div>
      
      <div className="card-body">
        <p className="card-description">Snapshot a landmark to get instant details and history.</p>
        
        <div className={`upload-zone ${previewUrl ? 'has-preview' : ''}`}>
          {previewUrl ? (
            <div className="preview-box">
              <img src={previewUrl} alt="Preview" className="img-preview" />
              <button 
                className="clear-btn" 
                onClick={() => {
                  URL.revokeObjectURL(previewUrl);
                  setFileObject(null);
                  setPreviewUrl(null);
                  setPrediction(null);
                }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ) : (
            <label className="upload-label">
              <div className="upload-circle">
                <span className="material-symbols-outlined">add_a_photo</span>
              </div>
              <span>Click to Upload Photo</span>
              <input type="file" onChange={handleImageChange} hidden />
            </label>
          )}
        </div>

        <button 
          className="primary-btn identify-btn" 
          onClick={identifyLandmark} 
          disabled={!fileObject || isAnalyzing}
        >
          {isAnalyzing ? "Scanning..." : "Identify Landmark"}
        </button>

        {prediction && (
          <div className="prediction-results animate-in">
            <div className="result-main">
              <p className="result-label">Landmark Identified</p>
              <h4>{prediction.name}</h4>
              <div className="result-badge-row">
                <span className="badge location">{prediction.location}</span>
                <span className="badge confidence">{prediction.confidence}</span>
              </div>
            </div>
            
            <div className="result-description">
              <p>{prediction.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}