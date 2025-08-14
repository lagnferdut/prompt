
import React from 'react';

export const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spinner {
        animation: spin 1s linear infinite;
        transform-origin: center;
      }
    `}</style>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" className="spinner"></path>
  </svg>
);
