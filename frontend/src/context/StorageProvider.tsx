import { createContext, ReactNode, useCallback, useEffect, useRef } from "react";

export type StorageServices = "session" | "local";

export const StorageContext = createContext<{
  keys: { [s: string]: string };
  subscribe: (storage: StorageServices, update: () => void) => () => void;
  get: (storage: StorageServices, key: string) => string | null;
  write: (storage: StorageServices, key: string, value: string) => void;
  erase: (storage: StorageServices, key: string) => void;
}>({
  keys: {},
  subscribe: () => () => {},
  get: () => null,
  write: () => {},
  erase: () => {},
});

export function StorageProvider({ children }: { children: ReactNode }) {
  const session = useRef<Set<() => void>>(new Set());
  const local = useRef<Set<() => void>>(new Set());

  const storages = { session, local };

  const keys = { USER: "flowforge-user", MODE: "flowforge-mode" };

  // Notify subscibers of change
  const updater = (storage: StorageServices) => {
    for (const func of storages[storage].current) {
      func();
    }
  };

  const subscribe = useCallback((storage: StorageServices, update: () => void) => {
    storages[storage].current.add(update);

    update();

    return () => {
      storages[storage].current.delete(update);
    };
  }, []);

  const get = useCallback((storage: StorageServices, key: string) => {
    return (storage === "session" ? sessionStorage : localStorage).getItem(key);
  }, []);

  const write = useCallback((storage: StorageServices, key: string, value: any) => {
    (storage === "session" ? sessionStorage : localStorage).setItem(key, value);
    updater(storage);
  }, []);

  const erase = useCallback((storage: StorageServices, key: string) => {
    (storage === "session" ? sessionStorage : localStorage).removeItem(key);
    updater(storage);
  }, []);

  // Handles changes to local storage from other tabs
  useEffect(() => {
    const handleStorage = () => updater("local");
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return <StorageContext value={{ keys, subscribe, get, write, erase }}>{children}</StorageContext>;
}
