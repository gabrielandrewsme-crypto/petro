import Link from "next/link";
import { loginAction } from "@/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="auth-layout">
      <section className="auth-hero">
        <span className="eyebrow">Área premium de estudos</span>
        <h1>Plano Petrobras Instrumentação</h1>
        <p>
          Dashboard, cronograma, revisão espaçada, questões, simulados, materiais e videoaulas em um só lugar.
        </p>
        <ul className="hero-list">
          <li>Controle de horas estudadas e progresso semanal</li>
          <li>Plano semanal, mensal e trilha de 100 dias</li>
          <li>Cálculo de nota líquida no padrão Cebraspe</li>
        </ul>
      </section>

      <section className="auth-card">
        <div className="panel-heading">
          <h2>Entrar</h2>
          <p>Use seu username e senha para acessar a área de estudos.</p>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <form action={loginAction} className="form-grid">
          <label>
            <span>Username</span>
            <input name="username" type="text" placeholder="gabriel" required />
          </label>
          <label>
            <span>Senha</span>
            <input name="password" type="password" placeholder="1964" required />
          </label>
          <button className="primary-button" type="submit">
            Acessar plataforma
          </button>
        </form>
        <div className="helper-box">
          <strong>Acesso configurado</strong>
          <p>gabriel / 1964</p>
        </div>
        <p className="auth-link">Se quiser, o cadastro tradicional continua disponível em <Link href="/register">Criar cadastro</Link>.</p>
      </section>
    </main>
  );
}
