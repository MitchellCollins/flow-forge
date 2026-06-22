import { createContext, ReactNode, useEffect, useState } from "react";
import { authApi, User } from "@/api/auth-api";
import { useStorage } from "@/hooks/useStorage";

export const AuthContext = createContext<{
  user: User | null;
  signin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}>({ user: null, signin: () => Promise.resolve(), register: () => Promise.resolve() });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const storage = useStorage();

  useEffect(() => {
    const unsubscribe = storage.subscribe("session", () => {
      const id = storage.get("session", storage.keys.USER);
      if (id) setUser(authApi.findById(parseInt(id)) || null);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) storage.write("session", storage.keys.USER, user.id.toString());
  }, [user]);

  const signin = async (email: string, password: string) => {
    return await authApi.signin(email, password).then((user) => setUser(user));
  };

  const register = async (email: string, password: string) => {
    return await authApi.register(email, password).then((user) => setUser(user));
  };

  return <AuthContext value={{ user, signin, register }}>{children}</AuthContext>;
}
