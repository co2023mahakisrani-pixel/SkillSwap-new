import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const DarkModeToggle = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-md focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'
                }`}
        >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
    );
};

export default DarkModeToggle;
