import { createFileRoute } from "@tanstack/react-router";
import { CadastroPage } from "@/pages/auth/cadastro/CadastroPage";

export const Route = createFileRoute("/cadastro")({
  component: CadastroPage,
});
