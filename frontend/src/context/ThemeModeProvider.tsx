import { createContext, ReactNode, useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createMuiTheme } from "@/theme/theme";

export type Mode = "light" | "dark";

export const ThemeModeContext = createContext<{ mode: Mode; changeMode: (newMode: Mode) => void }>({
  mode: "light",
  changeMode: () => {},
});

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");

  // Creates the theme
  const theme = createMuiTheme(mode);

  const MODE_KEY = "mode";

  // Gets mode from local storage
  useEffect(() => {
    setMode((localStorage.getItem(MODE_KEY) || "light") as Mode);
  }, []);

  // Puts updated mode into local storage
  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
  };

  return (
    <ThemeModeContext value={{ mode, changeMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext>
  );
}
