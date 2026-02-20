import React from 'react';
import './BestDealsCard.css';

export default function BestDealsCard() {
  const deals = [
    { name: 'Expedia', price: 450, color: '#003580', promo: 'Direct Flight' },
    { name: 'Skyscanner', price: 432, color: '#00d1ff', promo: 'Cheapest' },
    { name: 'Booking.com', price: 465, color: '#003580', promo: 'Refundable' },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="icon-container deals-icon">
          <span className="material-symbols-outlined">local_offer</span>
        </div>
        <h3>Best Flight Deals</h3>
      </div>
      <div className="card-body">
        <div className="deals-list">
          {deals.map((deal, index) => (
            <div className="deal-row" key={index}>
              <div className="deal-brand">
                <span className="brand-dot" style={{ backgroundColor: deal.color }}></span>
                <div className="brand-details">
                  <span className="brand-name">{deal.name}</span>
                  <span className="promo-tag">{deal.promo}</span>
                </div>
              </div>
              <div className="deal-price">
                <span className="currency">$</span>
                <span className="amount">{deal.price}</span>
                <button className="view-btn">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}