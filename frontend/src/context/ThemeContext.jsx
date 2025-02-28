import React, { createContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

// Create a Context for the theme
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get the theme from localStorage or default to light
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Create Material UI theme based on the current theme
  const muiTheme = createTheme({
    palette: {
      mode: theme, // Use 'light' or 'dark' as the mode
    },
  });

  // Toggle the theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Store theme in localStorage
  };

  //useEffect(() => {
  //  document.body.classList.toggle('dark-theme', theme === 'dark');
  //}, [theme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, muiTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
