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
        // Don't set Content-Type header; fetch sets it automatically for FormData
      });

      const data = await response.json();

      if (response.ok) {
        
        setPrediction({
          // Formatting the name here (e.g., "eiffel_tower" -> "EIFFEL TOWER")
          name: data.name.replace(/_/g, ' ').toUpperCase(),
          location: `Lat: ${parseFloat(data.latitude).toFixed(2)}, Lon: ${parseFloat(data.longitude).toFixed(2)}`,
          
          confidence: `${(parseFloat(data.confidence) * 100).toFixed(1)}% confident`,
          
          summary: data.summary || "No summary available."
        });
      } else {
        alert(data.error || "Analysis failed.");
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Network error: Could not reach the backend.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="material-symbols-outlined">face</span>
        <h3>Upload Photo</h3>
      </div>
      
      <div className="card-body">
        <p className="card-description">Upload your photo to identify the landmark.</p>
        
        <div className="upload-zone">
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
              <span className="material-symbols-outlined">add_a_photo</span>
              <span>Click to Upload</span>
              <input type="file" onChange={handleImageChange} hidden />
            </label>
          )}
        </div>

        <button 
          className="primary-btn" 
          onClick={identifyLandmark} 
          disabled={!fileObject || isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Identify Landmark"}
        </button>

        {prediction && (
          <div className="prediction-box">
            <div className="prediction-header">
              <div className="pred-info">
                <p className="pred-label">Landmark Identified</p>
                <h4>{prediction.name}</h4>
                <p className="pred-meta">{prediction.location} • {prediction.confidence}</p>
              </div>
            </div>
            
            <div className="landmark-summary">
              <span className="material-symbols-outlined">info</span>
              <p>{prediction.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}