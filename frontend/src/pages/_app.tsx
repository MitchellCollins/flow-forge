import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeModeProvider } from "@/context/ThemeModeProvider";
import { NotifyProvider } from "@/context/NotifyProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotifyProvider>
      <AuthProvider>
        <ThemeModeProvider>
          <Component {...pageProps} />
        </ThemeModeProvider>
      </AuthProvider>
    </NotifyProvider>
  );
}
