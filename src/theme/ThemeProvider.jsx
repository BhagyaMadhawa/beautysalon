// tailwind.config.js
import { createContext, useContext, useState } from 'react'

// Create a theme context
const ThemeContext = createContext()

// Theme configuration with all the core design tokens
const themeConfig = {
  colors: {
    primary: {
      main: '#007bff', // Primary blue color from navbar
      light: '#e6f0ff',
      dark: '#0056b3',
    },
    secondary: {
      main: '#ff4081', // Pink accent color for signup buttons
      light: '#ff80ab',
      dark: '#c60055',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
      card: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6c757d',
      disabled: '#adb5bd',
    },
    border: {
      light: '#e5e7eb',
      main: '#d1d5db',
      dark: '#9ca3af',
    },
    success: {
      main: '#28a745',
      light: '#d4edda',
      dark: '#1e7e34',
    },
    error: {
      main: '#dc3545',
      light: '#f8d7da',
      dark: '#bd2130',
    },
  },
  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    md: '1rem',      // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500, 
    semibold: 600,
    bold: 700,
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  // Component-specific theme settings
  components: {
    navbar: {
      height: '4rem',
      background: '#ffffff',
      textColor: '#1a1a1a',
      logoSize: '1.5rem',
    },
    card: {
      background: '#ffffff',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    button: {
      borderRadius: '9999px', // Rounded buttons
      paddingX: '1.5rem',
      paddingY: '0.5rem',
      fontWeight: 500,
    },
    searchInput: {
      borderRadius: '9999px',
      padding: '0.75rem 1rem',
      background: '#f8f9fa',
      borderColor: '#e5e7eb',
    },
    talentCard: {
      borderRadius: '0.5rem',
      background: '#ffffff',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    hero: {
      borderRadius: '0.75rem',
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      padding: '2rem',
    }
  }
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    ...themeConfig,
    // You could add theme switching functionality here
    isDarkMode: false,
    toggleDarkMode: () => {
      setTheme(prevTheme => ({
        ...prevTheme,
        isDarkMode: !prevTheme.isDarkMode
      }))
    }
  })

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}