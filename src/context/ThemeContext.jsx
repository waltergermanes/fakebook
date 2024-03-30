import { ThemeProvider, createTheme } from '@mui/material';
import React, { createContext, useState } from 'react'

const ThemeContext = createContext({})

export const ThemingProvider = ({ children })=> {
    const [dark, setDark] = useState(false);
  
    const handleToggleDark = () => {
      setDark((prev) => !prev);
    };

    const darkTheme = createTheme({
      palette: {
        mode: dark ? "dark" : "light",
      },
    });
    
return (
      <ThemeContext.Provider value={{ dark, toggleDark: handleToggleDark }}>
        <ThemeProvider theme={darkTheme}>
          {children}
        </ThemeProvider>
      </ThemeContext.Provider>
    );
  }
export default ThemeContext