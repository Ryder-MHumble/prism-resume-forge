import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'deep-space' | 'stardust-warmth';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isWarmTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('deep-space');

  const toggleTheme = () => {
    setTheme(prev => prev === 'deep-space' ? 'stardust-warmth' : 'deep-space');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'stardust-warmth') {
      root.classList.add('theme-warm');
    } else {
      root.classList.remove('theme-warm');
    }
  }, [theme]);

  const isWarmTheme = theme === 'stardust-warmth';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isWarmTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};