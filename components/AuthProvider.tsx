"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/storage";
import { getUser, setUser as persistUser } from "@/lib/storage";

interface AuthContextValue {
  user: User | null;
  login: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Lectura de localStorage diferida al cliente para evitar mismatch de hidratación SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getUser());
  }, []);

  const login = (user: User | null) => {
    setUser(user);
    persistUser(user);
  };

  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
