
import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.9 4.8-4.8 1.9 4.8 1.9 1.9 4.8 1.9-4.8 4.8-1.9-4.8-1.9z" />
    <path d="M5 22v-5" />
    <path d="M19 22v-5" />
    <path d="m5 3-3 3" />
    <path d="m19 3 3 3" />
    <path d="M3 17h5" />
    <path d="M16 17h5" />
  </svg>
);
