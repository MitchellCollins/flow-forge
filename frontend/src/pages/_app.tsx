import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeModeProvider } from "@/context/ThemeModeProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeModeProvider>
        <Component {...pageProps} />
      </ThemeModeProvider>
    </AuthProvider>
  );
}
