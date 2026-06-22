import { createContext, ReactNode, useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createMuiTheme } from "@/theme/theme";
import { useStorage } from "@/hooks/useStorage";

export type Mode = "light" | "dark";

export const ThemeModeContext = createContext<{ mode: Mode; changeMode: (newMode: Mode) => void }>({
  mode: "light",
  changeMode: () => {},
});

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");

  const storage = useStorage();

  // Creates the theme
  const theme = createMuiTheme(mode);

  // Gets mode from local storage
  useEffect(() => {
    const unsubscribe = storage.subscribe("local", () => {
      setMode((storage.get("local", storage.keys.MODE) || "light") as Mode);
    });

    return unsubscribe;
  }, []);

  // Puts updated mode into local storage
  useEffect(() => {
    storage.write("local", storage.keys.MODE, mode);
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
