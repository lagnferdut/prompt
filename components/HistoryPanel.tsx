
import React from 'react';
import { PromptHistoryItem } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';

interface HistoryPanelProps {
  history: PromptHistoryItem[];
  onSelect: (item: PromptHistoryItem) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-2xl shadow-lg h-full border border-gray-200 dark:border-gray-700">
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        <HistoryIcon className="w-5 h-5" />
        Historia
      </h2>
      {history.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Twoje ostatnie prompty pojawią się tutaj.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item)}
                className="w-full text-left p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors duration-200"
              >
                <p className="font-medium text-sm truncate text-gray-800 dark:text-gray-200">
                  {item.originalPrompt}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(item.id).toLocaleString('pl-PL')}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPanel;
