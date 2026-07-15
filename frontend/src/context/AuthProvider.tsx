import { createContext, ReactNode, useCallback, useEffect, useRef } from "react";
import { authApi, User } from "@/api/auth-api";
import { useStorage } from "@/hooks/useStorage";
import { useDialog } from "@/hooks/useDialog";
import { useStateEffect } from "@/hooks/useStateEffect";

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
  const [user, setUser, updateUser] = useStateEffect<User | null>(null, (newUser) => {
    // Erases user session and triggers unauth listeners
    if (!newUser) {
      storage.erase("session", "USER");
      for (const listener of unauthListeners.current) {
        listener();
      }
      return;
    }

    // Creates user session and triggers auth listeners
    storage.write("session", "USER", newUser.id.toString());
    for (const listener of authListeners.current) {
      listener(newUser);
    }
  });
  const authListeners = useRef<Set<(user: User) => void>>(new Set());
  const unauthListeners = useRef<Set<() => void>>(new Set());

  const storage = useStorage();
  const { confirmation } = useDialog();

  useEffect(() => {
    const unsubscribe = storage.subscribe("session", "USER", (newId) => {
      if (newId) setUser(authApi.findById(parseInt(newId)) || null);
    });

    return unsubscribe;
  }, []);

  const signin = useCallback((email: string, password: string) => {
    return authApi.signin(email, password).then(updateUser);
  }, []);

  const register = useCallback((email: string, password: string) => {
    return authApi.register(email, password).then(updateUser);
  }, []);

  const signout = useCallback(() => {
    confirmation("Do you wish to signout?").then((answer) => {
      if (answer) updateUser(null);
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
