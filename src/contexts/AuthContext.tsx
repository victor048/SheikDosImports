import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type AuthUser = {
  email: string;
  name?: string;
  isAdmin: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (params: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

// Implementação simples apenas em memória, para demo/admin local.
// Regra: usuários com email "admin@Lacerda Express.com" são administradores.
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: !!user?.isAdmin,
      async login({ email }: { email: string; password: string }) {
        // Aqui você pode futuramente integrar com Supabase Auth.
        const isAdmin = email.toLowerCase() === "admin@Lacerda Express.com";

        setUser({
          email,
          name: isAdmin ? "Administrador" : "Cliente",
          isAdmin,
        });
      },
      logout() {
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}

