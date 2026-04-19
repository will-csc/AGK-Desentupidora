import { Navigate } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Play,
  Radio,
  Users,
  Video,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export function AulaPage() {
  const { isAuthenticated, user, ready } = useAuth();

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              Aula ao vivo: Como montar uma desentupidora
            </h1>
            <p className="text-sm text-muted-foreground">
              Boas-vindas, <span className="text-brand-green">{user?.name}</span>! A aula começou.
            </p>
          </div>
          <Badge className="gap-1.5 bg-red-500/15 text-red-400 hover:bg-red-500/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            AO VIVO
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Card className="overflow-hidden border-border/50 bg-card/60">
            <div
              className="relative flex aspect-video items-center justify-center"
              style={{ background: "var(--gradient-hero)" }}
            >
              <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-green)" }} />
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/20 backdrop-blur">
                  <Play className="h-10 w-10 fill-brand-green text-brand-green" />
                </div>
                <p className="mt-4 font-display text-lg font-semibold">Transmissão ao vivo em andamento</p>
                <p className="text-sm text-muted-foreground">Episódio 03 - Equipamentos essenciais</p>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-background/60 px-3 py-1.5 text-xs backdrop-blur">
                <Radio className="h-3.5 w-3.5 text-brand-green" />
                <span>Transmitindo</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> 1.247 assistindo
                </span>
              </div>
            </div>
            <div className="p-5">
              <h2 className="font-display text-lg font-semibold">
                Do zero ao primeiro cliente - fundando sua desentupidora
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Apresentado por <strong className="text-foreground">Anderson G. Klein</strong> -
                fundador do Grupo AGK Eclypse.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col border-border/50 bg-card/60">
            <div className="flex items-center gap-2 border-b border-border/50 p-4">
              <BookOpen className="h-5 w-5 text-brand-green" />
              <h2 className="font-display font-semibold">Apostila do Aluno</h2>
            </div>
            <div className="max-h-[640px] space-y-5 overflow-y-auto p-5 text-sm leading-relaxed">
              <Section n="1" title="Introdução ao mercado">
                O setor de desentupimento movimenta bilhões anualmente no Brasil. Há demanda
                constante e baixa concorrência qualificada em cidades médias. O segredo está
                em entregar serviço limpo, pontual e bem precificado.
              </Section>
              <Section n="2" title="Estrutura inicial">
                Você não precisa de uma frota. Comece com 1 veículo utilitário, 1 máquina
                rotativa elétrica, 1 hidrojateadora portátil e EPIs completos. Investimento
                inicial estimado entre R$ 12 mil e R$ 25 mil.
              </Section>
              <Section n="3" title="Equipamentos essenciais">
                <ul className="mt-2 space-y-1.5">
                  {[
                    "Máquina elétrica de cabo (até 15m)",
                    "Hidrojato 2.000 PSI",
                    "Câmera de inspeção",
                    "Kit de mangueiras e bicos",
                    "EPIs (luvas, botas, máscara)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-green" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section n="4" title="Precificação">
                A média de mercado para desentupimento simples gira entre R$ 150 e R$ 350.
                Cobre deslocamento + diagnóstico + execução. Sempre apresente orçamento
                escrito antes de iniciar o serviço.
              </Section>
              <Section n="5" title="Captação de clientes">
                Google Meu Negócio é a sua principal fonte. Invista em fotos reais, peça
                avaliações de cada cliente e responda em até 5 minutos. Anúncios pagos no
                Google Ads multiplicam o resultado.
              </Section>
              <Section n="6" title="Gestão e expansão">
                A partir do 6º mês, contrate o primeiro técnico auxiliar. Padronize processos
                em checklists. A meta dos primeiros 12 meses é: 4 atendimentos/dia com
                ticket médio de R$ 280.
              </Section>
            </div>
          </Card>
        </div>

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-display text-xl font-bold sm:text-2xl">Aulas gravadas</h2>
              <p className="text-sm text-muted-foreground">Baixe e assista quando quiser.</p>
            </div>
            <Video className="h-6 w-6 text-primary" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { ep: "01", title: "Bem-vindo ao mercado de desentupimento", duration: "42 min", size: "318 MB" },
              { ep: "02", title: "Estrutura inicial e investimento", duration: "55 min", size: "412 MB" },
              { ep: "03", title: "Equipamentos essenciais", duration: "1h 08min", size: "521 MB" },
              { ep: "04", title: "Como precificar seus serviços", duration: "47 min", size: "356 MB" },
              { ep: "05", title: "Marketing local e Google Meu Negócio", duration: "1h 12min", size: "548 MB" },
              { ep: "06", title: "Gestão da equipe e expansão", duration: "59 min", size: "445 MB" },
            ].map((lesson) => (
              <Card
                key={lesson.ep}
                className="group flex flex-col overflow-hidden border-border/50 bg-card/60 transition hover:border-primary/50"
              >
                <div
                  className="relative flex aspect-video items-center justify-center"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <div className="absolute inset-0 opacity-15" style={{ background: "var(--gradient-green)" }} />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 backdrop-blur transition group-hover:scale-110">
                    <Play className="h-6 w-6 fill-primary text-primary" />
                  </div>
                  <span className="absolute right-3 top-3 rounded-md bg-background/70 px-2 py-0.5 text-xs font-medium backdrop-blur">
                    EP {lesson.ep}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display font-semibold leading-snug">{lesson.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {lesson.duration}
                    </span>
                    <span>-</span>
                    <span>{lesson.size}</span>
                  </div>
                  <Button
                    size="sm"
                    className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={(event) => event.preventDefault()}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar aula
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-green/15 font-display text-xs font-bold text-brand-green">
          {n}
        </span>
        <h3 className="font-display font-semibold">{title}</h3>
      </div>
      <div className="mt-1.5 text-muted-foreground">{children}</div>
    </div>
  );
}
