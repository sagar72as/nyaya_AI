
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('nyaya-theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      localStorage.setItem('nyaya-theme', initialTheme);
    }
    setIsInitialized(true);
  }, []);

  // Apply theme changes to DOM and localStorage
  useEffect(() => {
    if (!isInitialized) return;
    
    localStorage.setItem('nyaya-theme', theme);
    
    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark');
    
    // Add new theme class
    document.documentElement.classList.add(theme);
    
    console.log('Theme applied:', theme); // Debug log
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    console.log('Toggle theme called, current:', theme); // Debug log
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      console.log('New theme:', newTheme); // Debug log
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
