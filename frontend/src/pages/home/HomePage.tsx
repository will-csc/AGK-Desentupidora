import { Link } from "@tanstack/react-router";
import {
  Clock,
  Droplets,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div
          className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-green)" }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green">
              <Sparkles className="h-3.5 w-3.5" /> Desde 2015 cuidando do seu lar
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Desentupimento e <span className="text-brand-green">serviços</span> para sua casa, sem dor de cabeça.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              O Grupo AGK Eclypse atua há mais de 10 anos com soluções rápidas, limpas e
              garantidas em desentupimento, hidráulica, elétrica e manutenção residencial.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-brand-green text-brand-deep hover:bg-brand-green/90">
                <Link to="/cadastro">Criar conta</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-green" /> Atendimento 24h
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-green" /> Serviço garantido
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 -z-10 rounded-3xl blur-2xl"
              style={{ background: "var(--gradient-green)", opacity: 0.25 }}
            />
            <Card className="overflow-hidden border-border/50 bg-card/60 p-6 backdrop-blur">
              <Logo className="mx-auto h-56 sm:h-72" />
              <div className="mt-4 text-center">
                <p className="font-display text-xl font-semibold">Grupo AGK Eclypse</p>
                <p className="text-sm text-muted-foreground">Especialistas em soluções residenciais</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            O que <span className="text-brand-green">fazemos</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Equipe treinada, equipamentos modernos e atendimento humanizado.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Droplets,
              title: "Desentupimento",
              desc: "Pias, ralos, vasos, caixas de gordura e esgoto com equipamento de alta pressão.",
            },
            {
              icon: Wrench,
              title: "Hidráulica & Elétrica",
              desc: "Vazamentos, instalações, reparos e manutenção preventiva para o seu lar.",
            },
            {
              icon: ShieldCheck,
              title: "Serviços Gerais",
              desc: "Pequenos reparos, montagens e manutenções com garantia escrita.",
            },
          ].map((service) => (
            <Card
              key={service.title}
              className="border-border/50 bg-card/60 p-6 transition hover:border-brand-green/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/15 text-brand-green">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{service.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Sobre a empresa</h2>
            <p className="mt-4 text-muted-foreground">
              Fundada em <strong className="text-foreground">2015</strong>, a Grupo AGK Eclypse
              nasceu da vontade de oferecer um serviço de desentupimento sério, limpo e
              profissional. Desde então, expandimos nossa atuação para reparos hidráulicos,
              elétricos e manutenções residenciais em geral.
            </p>
            <p className="mt-3 text-muted-foreground">
              Hoje somos referência em <strong className="text-brand-green">qualidade</strong>,
              <strong className="text-brand-green"> pontualidade</strong> e
              <strong className="text-brand-green"> transparência</strong> no orçamento.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { n: "+10", l: "anos de mercado" },
                { n: "+5k", l: "atendimentos" },
                { n: "24h", l: "disponibilidade" },
              ].map((stat) => (
                <div
                  key={stat.l}
                  className="rounded-xl border border-border/50 bg-background/60 p-4 text-center"
                >
                  <div className="font-display text-2xl font-bold text-brand-green">{stat.n}</div>
                  <div className="text-xs text-muted-foreground">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>

          <Card id="contato" className="border-border/50 bg-background/60 p-6">
            <h3 className="font-display text-2xl font-semibold">Contato</h3>
            <p className="mt-1 text-sm text-muted-foreground">Estamos prontos para te atender.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/15 text-brand-green">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-muted-foreground">Telefone / WhatsApp</div>
                  <div className="font-medium">(11) 99999-0000</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/15 text-brand-green">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-muted-foreground">E-mail</div>
                  <div className="font-medium">contato@agkeclypse.com.br</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/15 text-brand-green">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-muted-foreground">Endereço</div>
                  <div className="font-medium">São Paulo - SP</div>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Grupo AGK Eclypse. Todos os direitos reservados.
      </footer>
    </div>
  );
}
