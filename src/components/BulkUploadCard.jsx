import React, { useState } from 'react';
import './BulkUploadCard.css';

export default function BulkUploadCard() {
  const [files, setFiles] = useState([]);
  const [landmarkName, setLandmarkName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setMessage('');
    setError('');
  };

  const handleBulkUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload.');
      return;
    }
    if (!landmarkName) {
      setError('Please enter a landmark name.');
      return;
    }

    setIsUploading(true);
    setMessage('');
    setError('');

    const sanitizedName = landmarkName.trim().toLowerCase().replace(/\s/g, '_');

    const formData = new FormData();
    formData.append('landmark_name', sanitizedName);
    
    files.forEach((file, index) => {
      // Your backend logic "if key.startswith('file')" will catch these
      formData.append(`file[${index}]`, file);
    });

    try {
      const response = await fetch('http://127.0.0.1:8080/api/bulk-upload/', {
        method: 'POST',
        // Note: Don't set Content-Type header manually when sending FormData, 
        // the browser needs to set the boundary automatically.
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFiles([]); 
        setLandmarkName('');
        // Optional: Reset the actual HTML input if you use a ref
      } else {
        // This will now catch the "Landmark not found in database" error
        setError(data.error || 'An error occurred during upload.');
      }
    } catch (err) {
      setError('Network error or unable to connect to the backend.');
      console.error('Bulk upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="material-symbols-outlined">upload_file</span>
        <h3>Bulk Upload Training Data</h3>
      </div>
      <div className="card-body">
        <p className="card-description">Upload images to expand the dataset.</p>
        <div className="input-group" style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="Landmark Name (e.g., eiffel_tower)" 
            value={landmarkName}
            onChange={(e) => setLandmarkName(e.target.value)}
          />
        </div>
        <div className="upload-section">
          <label className="file-input-label">
            <span className="material-symbols-outlined">add_photo_alternate</span>
            Choose Images
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange} 
              hidden 
              accept="image/*"
            />
          </label>
          <div className="file-count">
            {files.length > 0 ? `${files.length} files selected` : "No files chosen"}
          </div>
          <button 
            className="secondary-btn" 
            onClick={handleBulkUpload} 
            disabled={files.length === 0 || isUploading || !landmarkName}
          >
            {isUploading ? 'Uploading...' : 'Bulk Upload'}
          </button>
        </div>
        {error && <p className="error-message">Error: {error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
}