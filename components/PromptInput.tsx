
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onOptimize: () => void;
  onClear: () => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onOptimize, onClear, isLoading }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Twój Prompt</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Wklej swój prompt tutaj... Na przykład: 'Wyjaśnij, czym jest informatyka kwantowa.'"
        className="w-full h-64 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200 resize-none text-base"
        disabled={isLoading}
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onOptimize}
          disabled={isLoading || !prompt.trim()}
          className="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Optymalizuję...' : 'Optymalizuj'}
        </button>
        <button
          onClick={onClear}
          disabled={isLoading}
          className="px-4 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition-colors"
        >
          Wyczyść
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
