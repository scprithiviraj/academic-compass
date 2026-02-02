import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'default' | 'forest' | 'purple';
type Mode = 'light' | 'dark';

interface ThemeContextType {
    colorTheme: Theme;
    displayMode: Mode;
    setColorTheme: (theme: Theme) => void;
    setDisplayMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [colorTheme, setColorTheme] = useState<Theme>(() =>
        (localStorage.getItem('colorTheme') as Theme) || 'default'
    );
    const [displayMode, setDisplayMode] = useState<Mode>(() =>
        (localStorage.getItem('displayMode') as Mode) || 'light'
    );

    useEffect(() => {
        const root = document.documentElement;

        // Apply Display Mode
        if (displayMode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('displayMode', displayMode);

        // Apply Color Theme
        // Values match index.css and SettingsPage
        switch (colorTheme) {
            case "forest":
                root.style.setProperty("--primary", "152 69% 41%");
                root.style.setProperty("--ring", "152 69% 41%");
                root.style.setProperty("--gradient-primary", "linear-gradient(135deg, hsl(152 69% 41%) 0%, hsl(142 71% 45%) 100%)");
                break;
            case "purple":
                root.style.setProperty("--primary", "262 83% 58%");
                root.style.setProperty("--ring", "262 83% 58%");
                root.style.setProperty("--gradient-primary", "linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(280 80% 55%) 100%)");
                break;
            case "default":
            default:
                root.style.setProperty("--primary", "217 91% 60%");
                root.style.setProperty("--ring", "217 91% 60%");
                root.style.setProperty("--gradient-primary", "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(199 89% 48%) 100%)");
                break;
        }
        localStorage.setItem('colorTheme', colorTheme);

    }, [colorTheme, displayMode]);

    return (
        <ThemeContext.Provider value={{ colorTheme, displayMode, setColorTheme, setDisplayMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
