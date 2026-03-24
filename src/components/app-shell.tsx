import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, BookOpen, Calculator, CalendarDays, ChartColumnBig, CirclePlay, ClipboardCheck, FileStack, Gauge, Languages, LogOut, RadioTower } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/instrumentacao-industrial", label: "Instrumentação", icon: RadioTower },
  { href: "/matematica-petrobras", label: "Matemática", icon: Calculator },
  { href: "/portugues-petrobras", label: "Português", icon: Languages },
  { href: "/pegadinhas-cebraspe", label: "Pegadinhas", icon: AlertTriangle },
  { href: "/cronograma", label: "Cronograma", icon: CalendarDays },
  { href: "/revisoes", label: "Revisões", icon: ClipboardCheck },
  { href: "/questoes", label: "Questões", icon: ChartColumnBig },
  { href: "/simulados", label: "Simulados", icon: BookOpen },
  { href: "/videoaulas", label: "Videoaulas", icon: CirclePlay },
  { href: "/materiais", label: "Materiais", icon: FileStack },
];

export function AppShell({
  children,
  pathname,
  userName,
}: {
  children: React.ReactNode;
  pathname: string;
  userName: string;
}) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-logo-wrap">
            <Image alt="Logo BR Approved" className="brand-logo" height={84} priority src="/logo-br.png" width={84} />
          </span>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} className={cn("nav-item", pathname.startsWith(item.href) && "active")} href={item.href}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p className="muted-label">Aluno ativo</p>
          <strong>{userName}</strong>
          <form action={logoutAction}>
            <button className="ghost-button full-width" type="submit">
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
