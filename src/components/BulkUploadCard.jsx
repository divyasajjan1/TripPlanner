import React, { useState } from 'react';
import './BulkUploadCard.css';

export default function BulkUploadCard() {
  const [files, setFiles] = useState([]);

  return (
    <div className="card">
      <div className="card-header">
        <span className="material-symbols-outlined">upload_file</span>
        <h3>Model Training Data</h3>
      </div>
      <div className="card-body">
        <p className="card-description">Upload images to expand the dataset.</p>
        <div className="upload-section">
          <label className="file-input-label">
            <span className="material-symbols-outlined">add_photo_alternate</span>
            Choose Images
            <input 
              type="file" 
              multiple 
              onChange={(e) => setFiles([...e.target.files])} 
              hidden 
            />
          </label>
          <div className="file-count">
            {files.length > 0 ? `${files.length} files selected` : "No files chosen"}
          </div>
          <button className="secondary-btn" disabled={files.length === 0}>
            Bulk Upload
          </button>
        </div>
      </div>
    </div>
  );
}