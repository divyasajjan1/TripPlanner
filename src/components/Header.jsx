import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-section">
          <span className="material-symbols-outlined logo-icon">map</span>
          <h1 className="brand-name">TripPlanner <span className="version-tag">v1.0</span></h1>
        </div>
        <div className="divider"></div>
        <div className="breadcrumb">
          <span>Main</span>
          <span className="material-symbols-outlined">chevron_right</span>
          <span className="current-page">Dashboard</span>
        </div>
      </div>

      <div className="header-right">
        <div className="status-indicator">
          <span className="dot online"></span>
          <span className="status-text">Backend: Connected</span>
        </div>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Guest Explorer</span>
            <span className="user-role">Public Access</span>
          </div>
          <div className="user-avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}