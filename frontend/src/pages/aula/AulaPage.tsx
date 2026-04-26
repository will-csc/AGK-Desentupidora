import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import {
  BookOpen,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Mic,
  Minus,
  MonitorPlay,
  PauseCircle,
  Play,
  Plus,
  Radio,
  Users,
  Video,
  Wifi,
} from "lucide-react";
import { pdfjs, Document, Page } from "react-pdf";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import logo from "@/assets/logo-agk.jpeg";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROLE_LABEL, useAuth } from "@/lib/auth";

type LiveSession = {
  isLive: boolean;
  streamUrl: string;
};

const LIVE_SESSION_KEY = "agk_live_session";
const DEFAULT_LIVE_STREAM_URL = "https://meet.jit.si/AGKDistribuidora";
const DEFAULT_LIVE_SESSION: LiveSession = {
  isLive: false,
  streamUrl: DEFAULT_LIVE_STREAM_URL,
};

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

function readLiveSession(): LiveSession {
  if (typeof window === "undefined") return DEFAULT_LIVE_SESSION;

  try {
    const raw = localStorage.getItem(LIVE_SESSION_KEY);
    if (!raw) return DEFAULT_LIVE_SESSION;

    const parsed = JSON.parse(raw) as Partial<LiveSession>;
    const storedStreamUrl =
      typeof parsed.streamUrl === "string" && parsed.streamUrl.trim().length > 0
        ? parsed.streamUrl
        : DEFAULT_LIVE_STREAM_URL;

    return {
      isLive: !!parsed.isLive,
      streamUrl: storedStreamUrl,
    };
  } catch {
    return DEFAULT_LIVE_SESSION;
  }
}

function writeLiveSession(session: LiveSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LIVE_SESSION_KEY, JSON.stringify(session));
}

function buildMeetingUrl(streamUrl: string) {
  const trimmedUrl = streamUrl.trim();
  if (!trimmedUrl) return "";

  try {
    const url = new URL(trimmedUrl);

    if (url.hostname === "meet.jit.si") {
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      hashParams.set("config.enableClosePage", "false");
      hashParams.set("config.prejoinPageEnabled", "false");
      hashParams.set("config.disableDeepLinking", "true");
      url.hash = hashParams.toString();
    }

    return url.toString();
  } catch {
    return trimmedUrl;
  }
}

export function AulaPage() {
  const { isAuthenticated, user, ready } = useAuth();
  const isPresenter = user?.role === "presenter";
  const [liveSession, setLiveSession] = useState<LiveSession>(DEFAULT_LIVE_SESSION);
  const apostilaPdfUrl = "/apostila-atual-curso-dedet.pdf";
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfFileData, setPdfFileData] = useState<ArrayBuffer | null>(null);
  const [pdfLoadError, setPdfLoadError] = useState("");
  const [pdfTotalPages, setPdfTotalPages] = useState(0);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfPageInput, setPdfPageInput] = useState("1");
  const [pdfPageSize, setPdfPageSize] = useState({ width: 0, height: 0 });
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const pdfViewportRef = useRef<HTMLDivElement | null>(null);
  const pdfDragStateRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const hasPdf = apostilaPdfUrl.trim().length > 0;
  const liveStreamUrl = liveSession.streamUrl.trim();
  const meetingUrl = useMemo(() => buildMeetingUrl(liveStreamUrl), [liveStreamUrl]);
  const hasLiveStream = liveStreamUrl.length > 0;
  const pdfDocumentFile = useMemo(() => (pdfFileData ? { data: pdfFileData } : null), [pdfFileData]);
  const openPdfInNewTab = () => {
    if (!hasPdf) return;
    window.open(apostilaPdfUrl, "_blank", "noopener,noreferrer");
  };
  const downloadPdf = () => {
    if (!hasPdf) return;
    const link = document.createElement("a");
    link.href = apostilaPdfUrl;
    link.download = "apostila-aula.pdf";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    setLiveSession(readLiveSession());

    const syncLiveSession = (event: StorageEvent) => {
      if (event.key === LIVE_SESSION_KEY) {
        setLiveSession(readLiveSession());
      }
    };

    window.addEventListener("storage", syncLiveSession);
    return () => window.removeEventListener("storage", syncLiveSession);
  }, []);

  useEffect(() => {
    if (!hasPdf) {
      setPdfFileData(null);
      setPdfLoadError("");
      setPdfTotalPages(0);
      setPdfPageSize({ width: 0, height: 0 });
      return;
    }

    let cancelled = false;

    const loadPdfFile = async () => {
      try {
        setPdfLoadError("");
        setPdfFileData(null);
        const response = await fetch(apostilaPdfUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const bytes = await response.arrayBuffer();
        if (!cancelled) {
          setPdfFileData(bytes);
        }
      } catch {
        if (!cancelled) {
          setPdfFileData(null);
          setPdfLoadError("Falhou ao carregar o PDF.");
          setPdfTotalPages(0);
          setPdfPageSize({ width: 0, height: 0 });
        }
      }
    };

    void loadPdfFile();

    return () => {
      cancelled = true;
    };
  }, [apostilaPdfUrl, hasPdf]);

  useEffect(() => {
    setPdfPageInput(String(pdfPage));
  }, [pdfPage]);

  useEffect(() => {
    const stopDragging = () => {
      pdfDragStateRef.current.active = false;
      setIsDraggingPdf(false);
    };

    window.addEventListener("mouseup", stopDragging);
    return () => window.removeEventListener("mouseup", stopDragging);
  }, []);

  const updateLiveSession = (nextSession: LiveSession) => {
    setLiveSession(nextSession);
    writeLiveSession(nextSession);
  };

  const startTransmission = () => {
    updateLiveSession({
      ...liveSession,
      isLive: true,
    });
  };

  const stopTransmission = () => {
    updateLiveSession({
      ...liveSession,
      isLive: false,
    });
  };

  const startDraggingPdf = (event: React.MouseEvent<HTMLDivElement>) => {
    const viewport = pdfViewportRef.current;
    if (!viewport || !hasPdf) return;

    pdfDragStateRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
    };
    setIsDraggingPdf(true);
  };

  const moveDraggingPdf = (event: React.MouseEvent<HTMLDivElement>) => {
    const viewport = pdfViewportRef.current;
    const drag = pdfDragStateRef.current;
    if (!viewport || !drag.active) return;

    viewport.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
    viewport.scrollTop = drag.scrollTop - (event.clientY - drag.startY);
  };

  const stopDraggingPdf = () => {
    pdfDragStateRef.current.active = false;
    setIsDraggingPdf(false);
  };

  const applyPdfPage = (value: string) => {
    if (!pdfTotalPages) {
      setPdfPageInput(String(pdfPage));
      return;
    }

    const parsedPage = Number.parseInt(value, 10);
    const nextPage = Number.isNaN(parsedPage) ? pdfPage : Math.min(Math.max(parsedPage, 1), pdfTotalPages);
    setPdfPage(nextPage);
    setPdfPageInput(String(nextPage));
  };

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
              Boas-vindas, <span className="text-brand-green">{user?.name}</span>! Conta ativa:
              {" "}
              {user ? ROLE_LABEL[user.role] : "Aluno"}.
            </p>
          </div>
          <Badge
            className={
              liveSession.isLive
                ? "gap-1.5 bg-red-500/15 text-red-400 hover:bg-red-500/20"
                : "gap-1.5 bg-amber-500/15 text-amber-400 hover:bg-amber-500/20"
            }
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${liveSession.isLive ? "animate-ping bg-red-400" : "bg-amber-400"}`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${liveSession.isLive ? "bg-red-500" : "bg-amber-500"}`}
              />
            </span>
            {liveSession.isLive ? "AO VIVO" : "AGUARDANDO"}
          </Badge>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Card className="h-full overflow-hidden border-border/50 bg-card/60">
            <div
              className="relative aspect-video overflow-hidden bg-[#050816]"
              style={{ background: "var(--gradient-hero)" }}
            >
              {hasLiveStream ? (
                <iframe
                  src={meetingUrl}
                  title="Transmissão ao vivo"
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={logo}
                    alt="Apresentador da transmissão"
                    className="absolute inset-0 h-full w-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 via-[#070b18]/55 to-[#050816]" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050816] to-transparent" />
                  <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                        {isPresenter ? "Painel do apresentador" : "Sala principal ao vivo"}
                      </div>
                      <div className="rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green backdrop-blur">
                        {isPresenter
                          ? liveSession.isLive
                            ? "Transmissao iniciada"
                            : "Pronto para iniciar"
                          : liveSession.isLive
                            ? "Transmissao sendo preparada"
                            : "Esperar a transmissao comecar"}
                      </div>
                    </div>

                    <div className="max-w-md space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 shadow-lg shadow-brand-green/10">
                          <img src={logo} alt="Grupo AGK Eclypse" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-display text-2xl font-semibold text-white">
                            {isPresenter
                              ? liveSession.isLive
                                ? "Voce esta ao vivo"
                                : "Comece a transmissao"
                              : liveSession.isLive
                                ? "Transmissao sendo conectada"
                                : "Esperar a transmissao comecar"}
                          </p>
                          <p className="text-sm text-white/70">
                            {isPresenter
                              ? "Use sua conta de apresentador para abrir a sala e liberar a transmissao para os alunos."
                              : liveSession.isLive
                                ? "O apresentador iniciou a sala. Assim que o video estiver disponivel, ele aparece aqui."
                                : "Assim que o apresentador iniciar, o video ao vivo aparecera nesta area."}
                          </p>
                        </div>
                      </div>

                      <div className={`grid gap-3 ${isPresenter ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/55">
                            <Mic className="h-3.5 w-3.5" />
                            Audio
                          </div>
                          <p className="mt-2 text-sm font-medium text-white">
                            {liveSession.isLive ? "Apresentador ativo" : "Microfone aguardando"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/55">
                            <Wifi className="h-3.5 w-3.5" />
                            Sinal
                          </div>
                          <p className="mt-2 text-sm font-medium text-white">
                            {liveSession.isLive ? "Sala liberada" : "Pronto para conectar"}
                          </p>
                        </div>
                        {isPresenter ? (
                          <Button
                            type="button"
                            className="h-auto min-h-[92px] rounded-2xl bg-brand-green text-brand-deep hover:bg-brand-green/90"
                            onClick={liveSession.isLive ? stopTransmission : startTransmission}
                          >
                            <span className="flex flex-col items-center gap-2 py-3 text-center">
                              {liveSession.isLive ? (
                                <PauseCircle className="h-5 w-5" />
                              ) : (
                                <MonitorPlay className="h-5 w-5" />
                              )}
                              <span className="text-sm font-semibold">
                                {liveSession.isLive ? "Encerrar transmissao" : "Comecar transmissao"}
                              </span>
                            </span>
                          </Button>
                        ) : (
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/55">
                              <Video className="h-3.5 w-3.5" />
                              Formato
                            </div>
                            <p className="mt-2 text-sm font-medium text-white">
                              {liveSession.isLive ? "Transmissao em preparo" : "Aguardando apresentador"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-background/60 px-3 py-1.5 text-xs backdrop-blur">
                <Radio className="h-3.5 w-3.5 text-brand-green" />
                <span>{liveSession.isLive ? "Transmitindo" : "Sala em espera"}</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {isPresenter ? "Modo apresentador" : "Modo aluno"}
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

          <Card className="flex h-full min-h-0 flex-col overflow-hidden border-border/50 bg-card/60">
            <div className="flex items-center justify-between gap-3 border-b border-border/50 p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-green" />
                <h2 className="font-display font-semibold">Apostila do Aluno</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-md border border-border/60 bg-background/70 px-2 py-1">
                  <span className="text-xs text-muted-foreground">Pagina</span>
                  <Input
                    value={pdfPageInput}
                    onChange={(event) => setPdfPageInput(event.target.value.replace(/\D/g, "").slice(0, 4))}
                    onBlur={(event) => applyPdfPage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        applyPdfPage(pdfPageInput);
                      }
                    }}
                    inputMode="numeric"
                    className="h-7 w-16 border-0 bg-transparent px-1 text-center shadow-none focus-visible:ring-0"
                    disabled={!hasPdf || !pdfTotalPages}
                    aria-label="Pagina do PDF"
                  />
                  <span className="text-xs text-muted-foreground">/ {pdfTotalPages || "--"}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPdfZoom((current) => Math.max(50, current - 10))}
                  disabled={!hasPdf}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-14 text-center text-xs text-muted-foreground">{pdfZoom}%</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPdfZoom((current) => Math.min(200, current + 10))}
                  disabled={!hasPdf}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-border/50 px-4 py-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-green" />
                <span>PDF com acompanhamento da aula</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  disabled={!hasPdf}
                  onClick={downloadPdf}
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  Baixar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  disabled={!hasPdf}
                  onClick={openPdfInNewTab}
                >
                  <ExternalLink className="mr-1.5 h-4 w-4" />
                  Abrir
                </Button>
              </div>
            </div>
            <div
              ref={pdfViewportRef}
              className={`relative flex-1 overflow-auto bg-muted/20 select-none touch-none ${hasPdf ? (isDraggingPdf ? "cursor-grabbing" : "cursor-grab") : ""}`}
              onMouseDown={startDraggingPdf}
              onMouseMove={moveDraggingPdf}
              onMouseUp={stopDraggingPdf}
              onMouseLeave={stopDraggingPdf}
              onDragStart={(event) => event.preventDefault()}
            >
              {hasPdf ? (
                <>
                  <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-background/80 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur">
                    Arraste com o mouse para mover
                  </div>
                  <div
                    className="pointer-events-none relative min-h-full min-w-full p-4"
                    style={{
                      minWidth: pdfPageSize.width ? `${pdfPageSize.width + 32}px` : undefined,
                      minHeight: pdfPageSize.height ? `${pdfPageSize.height + 32}px` : undefined,
                    }}
                  >
                    {pdfLoadError ? (
                      <div className="rounded-lg bg-white px-6 py-10 text-center text-sm text-destructive shadow-sm">
                        {pdfLoadError}
                      </div>
                    ) : !pdfDocumentFile ? (
                      <div className="rounded-lg bg-white px-6 py-10 text-center text-sm text-muted-foreground shadow-sm">
                        Carregando PDF...
                      </div>
                    ) : (
                      <Document
                        file={pdfDocumentFile}
                        loading={
                          <div className="rounded-lg bg-white px-6 py-10 text-center text-sm text-muted-foreground shadow-sm">
                            Carregando PDF...
                          </div>
                        }
                        error={
                          <div className="rounded-lg bg-white px-6 py-10 text-center text-sm text-destructive shadow-sm">
                            {pdfLoadError || "Falhou ao carregar o PDF."}
                          </div>
                        }
                        onLoadSuccess={({ numPages }) => {
                          setPdfLoadError("");
                          setPdfTotalPages(numPages);
                          setPdfPage((current) => Math.min(Math.max(current, 1), numPages));
                        }}
                        onLoadError={(error) => {
                          setPdfLoadError(error.message || "Falhou ao carregar o PDF.");
                          setPdfTotalPages(0);
                          setPdfPageSize({ width: 0, height: 0 });
                        }}
                      >
                        <Page
                          pageNumber={pdfPage}
                          scale={pdfZoom / 100}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="rounded-lg bg-white shadow-sm"
                          onLoadSuccess={(page) => {
                            const viewport = page.getViewport({ scale: pdfZoom / 100 });
                            setPdfPageSize({
                              width: viewport.width,
                              height: viewport.height,
                            });
                          }}
                          loading={null}
                        />
                      </Document>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                    <FileText className="h-8 w-8 text-brand-green" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-display text-lg font-semibold">Visualizador de PDF pronto</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      Adicione a URL do arquivo em <strong className="text-foreground">apostilaPdfUrl</strong>
                      {" "}para liberar o PDF com zoom e acompanhamento durante a aula.
                    </p>
                  </div>
                  <div className="rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-2 text-xs text-brand-green">
                    Aceita link direto de PDF
                  </div>
                </div>
              )}
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
