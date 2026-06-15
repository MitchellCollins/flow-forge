import { deepmerge } from "@mui/utils";
import { createTheme } from "@mui/material";
import { baseOptions } from "./base-options";
import { Mode } from "@/context/ThemeModeProvider";

export const createMuiTheme = (mode: Mode) => {
  return createTheme(
    deepmerge(baseOptions, {
      colorScheme: { light: true, dark: true },
      palette: { mode },
    }),
  );
};
