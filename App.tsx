
import React, { useState, useCallback, useEffect } from 'react';
import { PromptHistoryItem, OptimizedSegment } from './types';
import { MAX_HISTORY_SIZE } from './constants';
import { optimizePrompt } from './services/geminiService';
import PromptInput from './components/PromptInput';
import OptimizedOutput from './components/OptimizedOutput';
import HistoryPanel from './components/HistoryPanel';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [optimizedResult, setOptimizedResult] = useState<OptimizedSegment[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const handleOptimize = useCallback(async () => {
    if (!currentPrompt.trim()) {
      setError('Prompt nie może być pusty.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOptimizedResult(null);

    try {
      const result = await optimizePrompt(currentPrompt);
      
      const newHistoryItem: PromptHistoryItem = {
        id: new Date().toISOString(),
        originalPrompt: currentPrompt,
        optimizedPrompt: result,
      };

      setHistory(prevHistory => {
        const updatedHistory = [newHistoryItem, ...prevHistory];
        return updatedHistory.slice(0, MAX_HISTORY_SIZE);
      });
      
      setOptimizedResult(result);
    } catch (e: any) {
      console.error(e);
      setError(`Nie udało się zoptymalizować promptu. Sprawdź swój klucz API i spróbuj ponownie. Błąd: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentPrompt]);

  const handleSelectHistoryItem = useCallback((item: PromptHistoryItem) => {
    setCurrentPrompt(item.originalPrompt);
    setOptimizedResult(item.optimizedPrompt);
    setError(null);
  }, []);
  
  const handleClear = () => {
    setCurrentPrompt('');
    setOptimizedResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Optymalizator Promptów AI
            </h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Przełącz tryb ciemny"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <HistoryPanel 
              history={history}
              onSelect={handleSelectHistoryItem}
            />
          </div>

          <div className="lg:col-span-9 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <PromptInput
                prompt={currentPrompt}
                setPrompt={setCurrentPrompt}
                onOptimize={handleOptimize}
                onClear={handleClear}
                isLoading={isLoading}
              />
              <OptimizedOutput
                result={optimizedResult}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
            <p>Wspierane przez Google Gemini. Twoje ostatnie {MAX_HISTORY_SIZE} promptów jest zapisywane lokalnie.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
