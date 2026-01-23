import React from 'react';

export default function BestDealsCard() {
  const deals = [
    { site: "Skyscanner", price: "$1,120", tag: "Cheapest", color: "#00d7f3" },
    { site: "Wego", price: "$1,145", tag: "Fastest", color: "#ffc107" }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <span className="material-symbols-outlined">local_offer</span>
        <h3>Best Deals for Your Trip</h3>
      </div>
      <div className="card-body">
        <p className="card-description">Compare prices from top travel engines.</p>
        
        <div className="deals-list">
          {deals.map((deal, index) => (
            <div key={index} className="deal-item" style={{ borderLeftColor: deal.color }}>
              <div className="brand-info">
                <strong>{deal.site}</strong>
                <span className="promo-badge">{deal.tag}</span>
              </div>
              <div className="price-action">
                <span className="deal-amount">{deal.price}</span>
                <button className="view-deal-btn">View</button>
              </div>
            </div>
          ))}
        </div>

        <div className="update-status">
          <span className="material-symbols-outlined">sync</span>
          <p>Updated 2 minutes ago</p>
        </div>
      </div>
    </div>
  );
}