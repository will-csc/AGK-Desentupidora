import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type UserRole = "student" | "presenter";
export type User = { name: string; email: string; role: UserRole };
type StoredUser = User & { password: string };
type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, token: string, role: UserRole) => Promise<void>;
  logout: () => void;
};

export const ROLE_LABEL: Record<UserRole, string> = {
  student: "Aluno",
  presenter: "Apresentador",
};

// Tokens de acesso distribuidos pela empresa fora do site
export const VALID_TOKENS: Record<UserRole, string[]> = {
  student: ["AGK-2025", "ECLYPSE-VIP", "AGK-ALUNO-01"],
  presenter: ["AGK-APRESENTADOR", "AGK-HOST-01"],
};

const Ctx = createContext<AuthCtx | null>(null);
const CURRENT_USER_KEY = "agk_mock_user";
const USERS_KEY = "agk_mock_users";

function toPublicUser(user: StoredUser): User {
  return { name: user.name, email: user.email, role: user.role };
}

function normalizeSessionUser(value: unknown): User | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<User>;
  if (!candidate.name || !candidate.email) return null;

  return {
    name: candidate.name,
    email: candidate.email,
    role: candidate.role === "presenter" ? "presenter" : "student",
  };
}

function normalizeStoredUser(value: unknown): StoredUser | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<StoredUser>;
  if (!candidate.name || !candidate.email || !candidate.password) return null;

  return {
    name: candidate.name,
    email: candidate.email,
    password: candidate.password,
    role: candidate.role === "presenter" ? "presenter" : "student",
  };
}

function readStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => normalizeStoredUser(item))
      .filter((item): item is StoredUser => item !== null);
  } catch {
    return [];
  }
}

function writeStoredUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (raw) {
        const parsed = normalizeSessionUser(JSON.parse(raw));
        if (parsed) setUser(parsed);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  };

  return (
    <Ctx.Provider
      value={{
        user,
        isAuthenticated: !!user,
        ready,
        login: async (email, password) => {
          const users = readStoredUsers();
          const account = users.find(
            (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
          );

          if (!account) {
            throw new Error("Conta não encontrada. Verifique e-mail, senha ou crie seu cadastro.");
          }

          persist(toPublicUser(account));
        },
        signup: async (name, email, password, token, role) => {
          const normalizedToken = token.trim().toUpperCase();
          if (!VALID_TOKENS[role].includes(normalizedToken)) {
            throw new Error(
              `Token inválido para ${ROLE_LABEL[role].toLowerCase()}. Solicite um token de acesso ao Grupo AGK Eclypse.`,
            );
          }

          const users = readStoredUsers();
          const normalizedEmail = email.trim().toLowerCase();

          if (users.some((item) => item.email.toLowerCase() === normalizedEmail)) {
            throw new Error("Já existe uma conta cadastrada com este e-mail.");
          }

          const account: StoredUser = {
            name: name.trim(),
            email: normalizedEmail,
            password,
            role,
          };

          writeStoredUsers([...users, account]);
          persist(toPublicUser(account));
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
