'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const current = theme === 'system' ? systemTheme : theme;

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-lg transition-all ${current === 'light' ? 'bg-white dark:bg-gray-700 shadow-sm text-amber-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-lg transition-all ${current === 'dark' ? 'bg-gray-700 shadow-sm text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-lg transition-all ${current === (systemTheme || 'light') && theme === 'system' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-600 dark:text-gray-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
        title="System"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
