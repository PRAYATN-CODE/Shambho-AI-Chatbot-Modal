import React, { createContext, useContext, useEffect, useState } from 'react';

const colorTheme = (mode) => {
    const themes = {
        dark: {
            backgroundPrimary: "#E9ECEF", // Ash Grey
            backgroundSecondary: "#ffffff", // Earthly Sand
            backgroundBody: "#f7fafc",
            buttonPrimary: "#373A6D",
            buttonSimple: '#171717', 
            buttonGradient: "linear-gradient(90deg, #373A6D, #6f42c1)", // Gradient
            textPrimary: "#222222", // Soft Black
            accent: "#FFC300", // Bright Yellow
            tabBackgroundColor: "#9fd2cd",
            sidebarColor: '#4ecdc4',
            tabactiveColor: '#e9ecef',
        },
        light: {
            backgroundPrimary: "#E9ECEF", // Ash Grey
            backgroundSecondary: "#ffffff", // Earthly Sand
            backgroundBody: "#f7fafc",
            buttonPrimary: "#373A6D",
            buttonSimple: '#171717', 
            buttonGradient: "linear-gradient(90deg, #373A6D, #6f42c1)", // Gradient
            textPrimary: "#222222", // Soft Black
            accent: "#FFC300", // Bright Yellow
            tabBackgroundColor: "#9fd2cd",
            sidebarColor: '#4ecdc4',
            tabactiveColor: '#e9ecef',
        }
    };

    return themes[mode] || themes.light; // Default to 'light' theme
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // Default theme
    const [colors, setColors] = useState({}); // Store theme colors dynamically

    useEffect(() => {
        setColors(colorTheme(theme));
    }, [theme]);

    useEffect(() => {
        const detectSystemTheme = () => {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        };

        detectSystemTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', detectSystemTheme);

        return () => {
            mediaQuery.removeEventListener('change', detectSystemTheme);
        };
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ setTheme, theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
