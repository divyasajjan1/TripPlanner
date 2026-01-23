import React, { useState } from 'react';

export default function UploadSelfie() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPrediction(null);
    }
  };

  const identifyLandmark = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setPrediction({
        name: "Colosseum",
        location: "Rome, Italy",
        confidence: "97.8%",
        summary: "An iconic amphitheatre in the centre of the city of Rome, Italy. It was the largest amphitheatre ever built at the time."
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="material-symbols-outlined">face</span>
        <h3>Upload Selfie</h3>
      </div>
      
      <div className="card-body">
        <p className="card-description">Upload your photo to identify the landmark.</p>
        
        {/* THE UPLOAD ZONE */}
        <div className="upload-zone">
          {selectedImage ? (
            <div className="preview-box">
              <img src={selectedImage} alt="Preview" className="img-preview" />
              <button 
                className="clear-btn" 
                onClick={() => {
                  setSelectedImage(null); // Removes the preview image
                  setPrediction(null);    // Hides the summary box
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

        {/* THE ACTION BUTTON */}
        <button 
          className="primary-btn" 
          onClick={identifyLandmark} 
          disabled={!selectedImage || isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Identify Landmark"}
        </button>

        {/* THE PREDICTION & SUMMARY BOX */}
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