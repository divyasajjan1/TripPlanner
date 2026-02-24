# TripPlanner — Frontend (React)

A React dashboard that lets users identify landmarks from photos, estimate travel distance and cost, and find real-time flight deals. The interface is split into two views: an admin pipeline for training the ML model, and a user-facing dashboard for trip planning.

---

## Dashboard Overview

### Admin View (3 cards)
These cards are intended for the application administrator to build and maintain the landmark classification model.

| Card | Purpose |
|---|---|
| Scrape Landmark Data | Provide a landmark name and optional URL to scrape training images. Falls back to DuckDuckGo search if no URL is given |
| Bulk Upload Training Data | Drag and drop multiple images to add to the training dataset for a target landmark |
| Model Training | Trigger fine-tuning of the CNN model and view session metrics (accuracy, loss, image count, epochs) |

### User View (3 cards)
These cards form the core trip planning experience for end users.

| Card | Purpose |
|---|---|
| Identify Landmark | Upload a photo to classify the landmark using the trained model. Displays name, confidence score, coordinates, and an AI-generated summary |
| Trip Estimation | Enter a departure city (or use GPS) and click Update to calculate haversine distance and estimated travel cost to the identified landmark |
| Best Flight Deals | Fetches real-time Cheapest and Fastest flight options via the Amadeus API, showing airline, price, duration, and a View button that opens Google Flights |

A **Landmark Chat** widget (bottom-right) is available on the user dashboard — a Gemini-powered assistant that answers travel questions about the identified landmark.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React |
| Styling | CSS Modules (per-card stylesheets) |
| Icons | Google Material Symbols |
| HTTP | Fetch API |
| Geolocation | Browser Geolocation API |

---

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app expects the Django backend running at `http://127.0.0.1:8080`. Update the fetch URLs in each card component if your backend runs on a different port.

---

## Component Structure

```
src/
├── components/
│   ├── ScrapeLandmarkCard/
│   ├── BulkUploadCard/
│   ├── ModelTrainingCard/
│   ├── IdentifyLandmarkCard/
│   ├── DistanceCostCard/
│   └── BestDealsCard/
├── App.js          # Shared state: prediction, origin, destinationCoords, originCoords
└── index.js
```

### Shared State (App.js)

The cards communicate through shared state lifted to `App.js`:

- `prediction` — identified landmark data (name, coords, confidence, summary)
- `origin` — user's typed or GPS departure city string
- `destinationCoords` — landmark lat/lon returned from the distance API
- `originCoords` — user's origin lat/lon returned from the distance API (used for airport resolution)

---

## Notes

- **Trip Estimation must be run before flight search** — the flight card relies on `originCoords` and `destinationCoords` populated by the distance API
- The GPS button in Trip Estimation uses the browser Geolocation API and sends coordinates directly; typed city names are geocoded server-side via Nominatim
- ML model files are not included in the repository and must be trained via the admin pipeline before landmark identification works