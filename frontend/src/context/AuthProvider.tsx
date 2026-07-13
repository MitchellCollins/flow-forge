import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { authApi, User } from "@/api/auth-api";
import { useStorage } from "@/hooks/useStorage";
import { useDialog } from "@/hooks/useDialog";

export const AuthContext = createContext<{
  user: User | null;
  signin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signout: () => void;
  onAuth: (listener: (user: User) => void) => () => void;
  onUnauth: (listener: () => void) => () => void;
}>({
  user: null,
  signin: () => Promise.resolve(),
  register: () => Promise.resolve(),
  signout: () => {},
  onAuth: () => () => {},
  onUnauth: () => () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const authListeners = useRef<Set<(user: User) => void>>(new Set());
  const unauthListeners = useRef<Set<() => void>>(new Set());

  const storage = useStorage();
  const { confirmation } = useDialog();

  useEffect(() => {
    const unsubscribe = storage.subscribe("session", () => {
      const id = storage.get("session", storage.keys.USER);
      if (id) setUser(authApi.findById(parseInt(id)) || null);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      storage.erase("session", storage.keys.USER);
      for (const listener of unauthListeners.current) {
        listener();
      }
      return;
    }

    storage.write("session", storage.keys.USER, user.id.toString());
    // Notify components of user auth event
    for (const listener of authListeners.current) {
      listener(user);
    }
  }, [user]);

  const signin = useCallback((email: string, password: string) => {
    return authApi.signin(email, password).then((user) => setUser(user));
  }, []);

  const register = useCallback((email: string, password: string) => {
    return authApi.register(email, password).then((user) => setUser(user));
  }, []);

  const signout = useCallback(() => {
    confirmation("Do you wish to signout?").then((answer) => {
      if (answer) setUser(null);
    });
  }, []);

  const onAuth = useCallback((listener: (user: User) => void) => {
    authListeners.current.add(listener);

    return () => authListeners.current.delete(listener);
  }, []);

  const onUnauth = useCallback((listener: () => void) => {
    unauthListeners.current.add(listener);

    return () => unauthListeners.current.delete(listener);
  }, []);

  return (
    <AuthContext value={{ user, signin, register, signout, onAuth, onUnauth }}>
      {children}
    </AuthContext>
  );
}
