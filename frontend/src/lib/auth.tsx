import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = { name: string; email: string };
type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, token: string) => Promise<void>;
  logout: () => void;
};

// Tokens de acesso distribuídos pela empresa fora do site
export const VALID_TOKENS = ["AGK-2025", "ECLYPSE-VIP", "AGK-ALUNO-01"];

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "agk_mock_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem(KEY, JSON.stringify(u));
      else localStorage.removeItem(KEY);
    }
  };

  return (
    <Ctx.Provider
      value={{
        user,
        isAuthenticated: !!user,
        ready,
        login: async (email) => persist({ name: email.split("@")[0], email }),
        signup: async (name, email, _password, token) => {
          if (!VALID_TOKENS.includes(token.trim().toUpperCase())) {
            throw new Error("Token inválido. Solicite um token de acesso ao Grupo AGK Eclypse.");
          }
          persist({ name, email });
        },
        logout: () => persist(null),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
};
