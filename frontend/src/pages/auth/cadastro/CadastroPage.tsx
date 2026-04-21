import { Link, useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import { AuthShell } from "@/components/shared/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_LABEL, type UserRole, useAuth } from "@/lib/auth";

export function CadastroPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(name, email, password, token, role);
      navigate({ to: "/aula" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Criar conta" subtitle="Use o token recebido pela equipe AGK Eclypse">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="role">Tipo de conta</Label>
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Selecione o tipo de conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">{ROLE_LABEL.student}</SelectItem>
              <SelectItem value="presenter">{ROLE_LABEL.presenter}</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1 text-xs text-muted-foreground">
            {role === "presenter"
              ? "Use o token de apresentador para liberar o controle da transmissão."
              : "Use o token de aluno para acessar a aula e os materiais."}
          </p>
        </div>
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            required
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            required
            maxLength={255}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@email.com"
          />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div>
          <Label htmlFor="token" className="flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-primary" />
            Token de acesso
          </Label>
          <Input
            id="token"
            required
            maxLength={40}
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Ex: AGK-2025"
            className="font-mono uppercase tracking-wider"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Disponibilizado externamente pelo Grupo AGK Eclypse.
          </p>
        </div>
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading ? "Criando..." : "Criar conta"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
