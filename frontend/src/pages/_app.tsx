import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeModeProvider } from "@/context/ThemeModeProvider";
import { NotifyProvider } from "@/context/NotifyProvider";
import { StorageProvider } from "@/context/StorageProvider";
import { DialogProvider } from "@/context/DialogProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StorageProvider>
      <ThemeModeProvider>
        <NotifyProvider>
          <DialogProvider>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </DialogProvider>
        </NotifyProvider>
      </ThemeModeProvider>
    </StorageProvider>
  );
}
