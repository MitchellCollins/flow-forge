import { createContext, ReactNode, useEffect, useState } from "react";
import { authApi, User } from "@/api/auth-api";
import { useStorage } from "@/hooks/useStorage";
import { useDialog } from "@/hooks/useDialog";

export const AuthContext = createContext<{
  user: User | null;
  signin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  onAuth: (listener: (user: User) => void) => () => void;
  onUnauth: (listener: () => void) => () => void;
}>({
  user: null,
  signin: () => Promise.resolve(),
  register: () => Promise.resolve(),
  signout: () => Promise.resolve(),
  onAuth: () => () => {},
  onUnauth: () => () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authListeners, setAuthListeners] = useState<Set<(user: User) => void>>(new Set());
  const [unauthListeners, setUnauthListeners] = useState<Set<() => void>>(new Set());

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
      for (const listener of unauthListeners) {
        listener();
      }
      return;
    }

    storage.write("session", storage.keys.USER, user.id.toString());
    // Notify components of user auth event
    for (const listener of authListeners) {
      listener(user);
    }
  }, [user]);

  const signin = async (email: string, password: string) => {
    return await authApi.signin(email, password).then((user) => setUser(user));
  };

  const register = async (email: string, password: string) => {
    return await authApi.register(email, password).then((user) => setUser(user));
  };

  const signout = async () => {
    const answer = await confirmation("Do you wish to signout?");
    if (answer) setUser(null);
  };

  const onAuth = (listener: (user: User) => void) => {
    setAuthListeners((prevListeners) => new Set(prevListeners).add(listener));

    return () =>
      setAuthListeners((prevListeners) => {
        prevListeners.delete(listener);
        return new Set(prevListeners);
      });
  };

  const onUnauth = (listener: () => void) => {
    setUnauthListeners((prevListeners) => new Set(prevListeners).add(listener));

    return () =>
      setUnauthListeners((prevListeners) => {
        prevListeners.delete(listener);
        return new Set(prevListeners);
      });
  };

  return (
    <AuthContext value={{ user, signin, register, signout, onAuth, onUnauth }}>
      {children}
    </AuthContext>
  );
}
