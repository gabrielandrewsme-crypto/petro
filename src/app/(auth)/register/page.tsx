import Link from "next/link";
import { registerAction } from "@/actions/auth";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="auth-layout">
      <section className="auth-hero">
        <span className="eyebrow">Cadastro rápido</span>
        <h1>Crie seu plano personalizado</h1>
        <p>Ao criar a conta, o sistema já monta o cronograma semanal, metas mensais e a trilha de 100 dias.</p>
      </section>

      <section className="auth-card">
        <div className="panel-heading">
          <h2>Cadastrar</h2>
          <p>Seu ambiente nasce preenchido e pronto para estudar.</p>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <form action={registerAction} className="form-grid">
          <label>
            <span>Nome</span>
            <input name="name" type="text" placeholder="Seu nome" required />
          </label>
          <label>
            <span>E-mail</span>
            <input name="email" type="email" placeholder="voce@email.com" required />
          </label>
          <label>
            <span>Senha</span>
            <input name="password" type="password" placeholder="Mínimo de 8 caracteres" required />
          </label>
          <label>
            <span>Data da prova</span>
            <input name="examDate" type="date" />
          </label>
          <button className="primary-button" type="submit">
            Criar conta
          </button>
        </form>
        <p className="auth-link">
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
