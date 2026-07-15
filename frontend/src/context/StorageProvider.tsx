import { createContext, ReactNode, useCallback, useEffect, useRef } from "react";

export type StorageServices = "session" | "local";
export type StorageKeys = keyof typeof keys;

const keys = { USER: "flowforge-user", MODE: "flowforge-mode" };

export const StorageContext = createContext<{
  subscribe: (
    storage: StorageServices,
    key: StorageKeys,
    update: (newValue: string | null) => void,
  ) => () => void;
  get: (storage: StorageServices, key: StorageKeys) => string | null;
  write: (storage: StorageServices, key: StorageKeys, value: string) => void;
  erase: (storage: StorageServices, key: StorageKeys) => void;
}>({
  subscribe: () => () => {},
  get: () => null,
  write: () => {},
  erase: () => {},
});

export function StorageProvider({ children }: { children: ReactNode }) {
  const session = useRef<Map<StorageKeys, Set<(newValue: string | null) => void>>>(new Map());
  const local = useRef<Map<StorageKeys, Set<(newValue: string | null) => void>>>(new Map());

  const storages = { session, local };

  // Notify subscibers of change
  const updater = (storage: StorageServices, key?: StorageKeys) => {
    if (!key) {
      for (const [key, listeners] of storages[storage].current.entries()) {
        if (!listeners) continue;

        const newValue = get(storage, key);
        listeners.forEach((listener) => listener(newValue));
      }
      return;
    }

    const listeners = storages[storage].current.get(key);
    if (!listeners) return;

    const newValue = get(storage, key);
    listeners.forEach((listener) => listener(newValue));
  };

  const subscribe = useCallback(
    (storage: StorageServices, key: StorageKeys, update: (newValue: string | null) => void) => {
      storages[storage].current.set(key, new Set(storages[storage].current.get(key)).add(update));

      update(get(storage, key));

      return () => {
        const newSet = new Set(storages[storage].current.get(key));
        newSet.delete(update);
        storages[storage].current.set(key, newSet);
      };
    },
    [],
  );

  const get = useCallback((storage: StorageServices, key: StorageKeys) => {
    return (storage === "session" ? sessionStorage : localStorage).getItem(keys[key]);
  }, []);

  const write = useCallback((storage: StorageServices, key: StorageKeys, value: any) => {
    (storage === "session" ? sessionStorage : localStorage).setItem(keys[key], value);
    updater(storage, key);
  }, []);

  const erase = useCallback((storage: StorageServices, key: StorageKeys) => {
    (storage === "session" ? sessionStorage : localStorage).removeItem(keys[key]);
    updater(storage, key);
  }, []);

  // Handles changes to local storage from other tabs
  useEffect(() => {
    const handleStorage = () => updater("local");
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return <StorageContext value={{ subscribe, get, write, erase }}>{children}</StorageContext>;
}
