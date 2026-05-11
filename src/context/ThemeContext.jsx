import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("rt-theme") || "red";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("rt-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "red" ? "soft" : "red"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
