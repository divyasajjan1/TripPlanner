import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-section">
          <span className="material-symbols-outlined logo-icon">explore</span>
          <h1 className="brand-name">TripPlanner</h1>
        </div>
      </div>

      <div className="header-right">
        {/* We removed the status-badge entirely */}
        <div className="user-profile">
          <span className="user-name">Guest Explorer</span>
          <div className="user-avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}