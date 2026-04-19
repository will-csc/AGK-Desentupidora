import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/common/Logo";
import { Card } from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        className="absolute -left-32 top-1/4 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-green)" }}
      />
      <Card className="relative w-full max-w-md border-border/50 bg-card/70 p-8 backdrop-blur">
        <Link to="/" className="mb-6 flex justify-center">
          <Logo className="h-16" />
        </Link>
        <h1 className="text-center font-display text-2xl font-bold">{title}</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">{subtitle}</p>
        {children}
      </Card>
    </div>
  );
}
