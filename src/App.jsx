import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ScraperCard from './components/ScraperCard';
import BulkUploadCard from './components/BulkUploadCard';
import TrainingCard from './components/TrainingCard';
import UploadSelfie from './components/UploadSelfieCard';
import DistanceCostCard from './components/DistanceCostCard';
import BestDealsCard from './components/BestDealsCard';

function App() {
  const [prediction, setPrediction] = useState(null);
  return (
    <div className="dashboard">
      <Header />

      <main className="content">
        <div className="card-grid">
          <ScraperCard />     {/* Card 1: URL Scraper */}
          <BulkUploadCard />  {/* Card 2: Bulk Upload */}
          <TrainingCard />    {/* Card 3: Training Control */}
          <UploadSelfie setPrediction={setPrediction} prediction={prediction} />    {/* Card 4: Upload a selfie */}
          <DistanceCostCard prediction={prediction} setPrediction={setPrediction} /> {/* Card 5: Distance & Cost */}
          <BestDealsCard />   {/* Card 6: Best Deals */}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Trip Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;