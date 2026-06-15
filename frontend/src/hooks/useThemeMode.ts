import { useContext } from "react";
import { ThemeModeContext } from "@/context/ThemeModeProvider";

export const useThemeMode = () => useContext(ThemeModeContext);
