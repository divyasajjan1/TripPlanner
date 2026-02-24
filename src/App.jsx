import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ScraperCard from './components/ScraperCard';
import BulkUploadCard from './components/BulkUploadCard';
import TrainingCard from './components/TrainingCard';
import UploadImage from './components/UploadImageCard';
import DistanceCostCard from './components/DistanceCostCard';
import BestDealsCard from './components/BestDealsCard';
import ChatWidget from './components/ChatWidget';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [originCoords, setOriginCoords] = useState(null);
  return (
    <div className="dashboard">
      <Header />

      <main className="content">
        <div className="card-grid">
          <ScraperCard />     {/* Card 1: URL Scraper */}
          <BulkUploadCard />  {/* Card 2: Bulk Upload */}
          <TrainingCard />    {/* Card 3: Training Control */}
          <UploadImage setPrediction={setPrediction} prediction={prediction} />    {/* Card 4: Upload an image */}
          <DistanceCostCard 
            prediction={prediction} 
            setPrediction={setPrediction} 
            origin={origin} 
            setOrigin={setOrigin} 
            setDestinationCoords={setDestinationCoords}
            setOriginCoords={setOriginCoords}
          />{/* Card 5: Distance & Cost */}
          <BestDealsCard 
            prediction={prediction} 
            origin={origin} 
            coords={destinationCoords}
            originCoords={originCoords}
          />  {/* Card 6: Best Deals */}
        </div>
      </main>
      <ChatWidget /> {/* Chat Widget */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Trip Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;