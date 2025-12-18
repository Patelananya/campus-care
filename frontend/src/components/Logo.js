import React from 'react';
import '../styles/theme.css';

const Logo = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`inline-flex items-center justify-center ${sizeClasses[size]}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Building base */}
        <rect x="20" y="40" width="60" height="50" fill="var(--primary-color)" rx="2" />
        
        {/* Building windows */}
        <rect x="25" y="45" width="15" height="15" fill="var(--light-color)" rx="1" />
        <rect x="45" y="45" width="15" height="15" fill="var(--light-color)" rx="1" />
        <rect x="65" y="45" width="15" height="15" fill="var(--light-color)" rx="1" />
        
        <rect x="25" y="65" width="15" height="15" fill="var(--light-color)" rx="1" />
        <rect x="45" y="65" width="15" height="15" fill="var(--light-color)" rx="1" />
        <rect x="65" y="65" width="15" height="15" fill="var(--light-color)" rx="1" />
        
        {/* Building roof */}
        <polygon points="15,40 85,40 50,15" fill="var(--secondary-color)" />
        
        {/* Exclamation mark */}
        <rect x="48" y="30" width="4" height="15" fill="var(--accent-color)" rx="2" />
        <circle cx="50" cy="50" r="3" fill="var(--accent-color)" />
      </svg>
    </div>
  );
};

export default Logo;