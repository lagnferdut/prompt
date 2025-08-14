
import React, { useState } from 'react';
import { OptimizedSegment } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface OptimizedOutputProps {
  result: OptimizedSegment[] | null;
  isLoading: boolean;
  error: string | null;
}

const highlightColors = [
  'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200',
  'bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200',
  'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-200',
  'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200',
  'bg-pink-100 dark:bg-pink-900/60 text-pink-800 dark:text-pink-200',
];


const OptimizedOutput: React.FC<OptimizedOutputProps> = ({ result, isLoading, error }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopy = () => {
    if (!result) return;
    const fullPrompt = result.map(s => s.segment).join('');
    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <SpinnerIcon className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">Gemini myśli...</p>
          <p className="text-sm">Optymalizujemy Twój prompt, by był doskonały.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      );
    }
    
    if (!result) {
        return (
            <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <p>Twój zoptymalizowany prompt pojawi się tutaj.</p>
            </div>
        );
    }
    
    // Check for the "already optimal" case
    const isAlreadyOptimal = result.length === 1 && !result[0].isChanged && result[0].reason;
    if (isAlreadyOptimal) {
      return (
         <div className="flex flex-col items-center justify-center h-full text-center text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">✅ Świetny prompt!</h3>
          <p className="text-sm">{result[0].reason}</p>
        </div>
      )
    }

    let changedSegmentCounter = 0;

    return (
        <p className="text-base leading-relaxed whitespace-pre-wrap">
            {result.map((item, index) => {
              if (item.isChanged) {
                const colorClass = highlightColors[changedSegmentCounter % highlightColors.length];
                changedSegmentCounter++;
                return (
                  <span key={index} className="relative group cursor-help">
                    <span className={`${colorClass} rounded-md px-1.5 py-0.5 mx-[1px] my-0.5 inline-block transition-colors duration-300`}>
                      {item.segment}
                    </span>
                    <span
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-sm text-white bg-gray-800 dark:bg-gray-950 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                      role="tooltip"
                    >
                      {item.reason}
                      <svg className="absolute text-gray-800 dark:text-gray-950 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                    </span>
                  </span>
                );
              }
              return <span key={index}>{item.segment}</span>;
            })}
        </p>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Zoptymalizowany Prompt</h2>
        {result && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <CopyIcon className="w-4 h-4" />
            {copyStatus === 'idle' ? 'Kopiuj' : 'Skopiowano!'}
          </button>
        )}
      </div>
      <div className="w-full h-64 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default OptimizedOutput;
