import { createContext, ReactNode, useEffect, useState } from "react";

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
  const [sessions, setSessions] = useState<Set<() => void>>(new Set());
  const [locals, setLocals] = useState<Set<() => void>>(new Set());

  const storages = {
    session: { value: sessions, set: setSessions },
    local: { value: locals, set: setLocals },
  };

  const keys = { USER: "flowforge-user", MODE: "flowforge-mode" };

  // Notify subscibers of change
  const updater = (storage: StorageServices) => {
    for (const func of storages[storage].value) {
      func();
    }
  };

  const subscribe = (storage: StorageServices, update: () => void) => {
    storages[storage].set((prevSet) => new Set(prevSet).add(update));

    update();

    return () => {
      storages[storage].set((prevSet) => {
        prevSet.delete(update);
        return new Set(prevSet);
      });
    };
  };

  const get = (storage: StorageServices, key: string) => {
    return (storage === "session" ? sessionStorage : localStorage).getItem(key);
  };

  const write = (storage: StorageServices, key: string, value: any) => {
    (storage === "session" ? sessionStorage : localStorage).setItem(key, value);
    updater(storage);
  };

  const erase = (storage: StorageServices, key: string) => {
    (storage === "session" ? sessionStorage : localStorage).removeItem(key);
    updater(storage);
  };

  // Handles changes to local storage from other tabs
  useEffect(() => {
    const handleStorage = () => updater("local");
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return <StorageContext value={{ keys, subscribe, get, write, erase }}>{children}</StorageContext>;
}
