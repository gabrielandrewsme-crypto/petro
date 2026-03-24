import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plano Petrobras Instrumentação",
  description: "Área de membros premium para preparação em Técnico de Manutenção - Instrumentação.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
