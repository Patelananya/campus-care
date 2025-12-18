import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStudentClick = () => {
    navigate('/register'); // Student goes to register page
  };

  const handleManagerClick = () => {
    navigate('/login'); // Manager goes to login page
  };

  const handleAdminClick = () => {
    navigate('/login'); // Admin goes to login page
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="welcome-title"><b>Welcome to SRITW CampusCare</b></h1>
        <p className="landing-description">
          Your comprehensive campus management system for students, managers, and administrators.
        </p>
        
        <div className="portal-cards">
          {/* Student Portal Card */}
          <div className="portal-card student-card">
            <div className="card-icon student-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>Student Portal</h3>
            <p className="card-description">Submit complaints, track status, and communicate with department managers.</p>
            <button className="card-button student-button" onClick={handleStudentClick}>
              Enter Student Portal
            </button>
          </div>
          
          {/* Manager Portal Card */}
          <div className="portal-card manager-card">
            <div className="card-icon manager-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Manager Portal</h3>
            <p className="card-description">Manage department complaints, respond to students, and track resolution progress.</p>
            <button className="card-button manager-button" onClick={handleManagerClick}>
              Enter Manager Portal
            </button>
          </div>
          
          {/* Admin Portal Card */}
          <div className="portal-card admin-card">
            <div className="card-icon admin-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <h3>Admin Portal</h3>
            <p className="card-description">Oversee all departments, manage users, and view campus-wide analytics.</p>
            <button className="card-button admin-button" onClick={handleAdminClick}>
              Enter Admin Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;