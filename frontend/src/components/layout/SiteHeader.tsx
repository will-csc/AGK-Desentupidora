import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ROLE_LABEL, useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-9" />
          <span className="hidden font-display text-sm font-semibold tracking-wide text-foreground sm:block">
            GRUPO <span className="text-brand-green">AGK</span> ECLYPSE
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:block">
                Olá, {user?.name} ({user ? ROLE_LABEL[user.role] : ""})
              </span>
              <Button asChild variant="secondary" size="sm">
                <Link to="/aula">Aula</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="bg-brand-green text-brand-deep hover:bg-brand-green/90">
                <Link to="/cadastro">Criar conta</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
