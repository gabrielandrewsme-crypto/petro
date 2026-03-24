import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Calculator,
  CalendarDays,
  ChartColumnBig,
  CirclePlay,
  ClipboardCheck,
  FileStack,
  Gauge,
  Languages,
  LogOut,
  MessageSquareText,
  RadioTower,
  Search,
} from "lucide-react";
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
  { href: "/assistente-especialista", label: "Assistente", icon: MessageSquareText },
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
    <div className="shell-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-logo-wrap">
              <Image alt="Logo BR Approved" className="brand-logo" height={88} priority src="/logo-nova-br.png" width={88} />
            </span>
            <div className="brand-copy">
              <strong>Plano Petrobras</strong>
              <p>Instrumentação</p>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">{userName.slice(0, 2).toUpperCase()}</div>
            <div>
              <strong>{userName}</strong>
              <p>Área premium de estudos</p>
            </div>
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
            <p className="muted-label">Sessão</p>
            <form action={logoutAction}>
              <button className="ghost-button full-width dark" type="submit">
                <LogOut size={16} />
                Sair
              </button>
            </form>
          </div>
        </aside>

        <main className="content-panel">
          <header className="topbar">
            <label className="searchbar">
              <Search size={16} />
              <input aria-label="Buscar" placeholder="Buscar módulo, aula ou pegadinha..." type="text" />
            </label>

            <div className="topbar-actions">
              <button className="icon-button" type="button" aria-label="Notificações">
                <Bell size={16} />
              </button>
              <div className="status-pill">Black Piano UI</div>
            </div>
          </header>

          <section className="content">{children}</section>
        </main>
      </div>
    </div>
  );
}
