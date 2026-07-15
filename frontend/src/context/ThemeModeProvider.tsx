import { createContext, ReactNode, useCallback, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createMuiTheme } from "@/theme/theme";
import { useStorage } from "@/hooks/useStorage";
import { useStateEffect } from "@/hooks/useStateEffect";

export type Mode = "light" | "dark";

export const ThemeModeContext = createContext<{ mode: Mode; changeMode: (newMode: Mode) => void }>({
  mode: "light",
  changeMode: () => {},
});

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode, updateMode] = useStateEffect<Mode>("light", (newMode) => {
    storage.write("local", "MODE", newMode);
  });

  const storage = useStorage();

  // Creates the theme
  const theme = createMuiTheme(mode);

  // Gets mode from local storage
  useEffect(() => {
    const unsubscribe = storage.subscribe("local", "MODE", (newMode) => {
      setMode((newMode || "light") as Mode);
    });

    return unsubscribe;
  }, []);

  const changeMode = useCallback((newMode: Mode) => {
    updateMode(newMode);
  }, []);

  return (
    <ThemeModeContext value={{ mode, changeMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext>
  );
}
