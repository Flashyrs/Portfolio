import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('brutalist-is-dark');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme !== null ? savedTheme === 'true' : systemPrefersDark;
    
    setIsDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('brutalist-is-dark', String(nextDark));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 border-2 border-border-muted bg-bg-card text-theme-text hover:bg-accent-light hover:text-theme-text transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-brutalist-sm outline-none"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};
