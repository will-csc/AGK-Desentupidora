import { createFileRoute } from "@tanstack/react-router";
import { AulaPage } from "@/pages/aula/AulaPage";

export const Route = createFileRoute("/aula")({
  component: AulaPage,
});
