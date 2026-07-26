import React, { createContext, useContext } from "react";

const ThemeContext = createContext(null);

const defaultTheme = {
  bg: "#f8fafc",
  surface: "#ffffff",
  surfaceHover: "#f1f5f9",
  border: "#e2e8f0",
  borderHover: "#cbd5e1",
  textPrimary: "#0f172a",
  textSecondary: "#334155",
  textMuted: "#64748b",
  accent: "#4f46e5",
  accentSoft: "#eef2ff",
  success: "#10b981",
  successSoft: "#ecfdf5",
  successBorder: "#a7f3d0",
  avatarPalette: ["#4f46e5", "#0d9488", "#7c3aed", "#0284c7", "#4338ca"],
};

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme: defaultTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: defaultTheme };
  }
  return context;
}