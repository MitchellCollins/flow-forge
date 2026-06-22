import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeModeProvider } from "@/context/ThemeModeProvider";
import { NotifyProvider } from "@/context/NotifyProvider";
import { StorageProvider } from "@/context/StorageProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotifyProvider>
      <StorageProvider>
        <AuthProvider>
          <ThemeModeProvider>
            <Component {...pageProps} />
          </ThemeModeProvider>
        </AuthProvider>
      </StorageProvider>
    </NotifyProvider>
  );
}
