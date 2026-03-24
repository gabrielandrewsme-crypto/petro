import Link from "next/link";
import { answerTrapQuestionAction } from "@/actions/app";
import { Card, MiniBarChart, ProgressBar, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { TrapDifficulty, TrapTheme } from "@/lib/types";

const difficultyLabel: Record<TrapDifficulty, string> = {
  EASY: "Fácil",
  MEDIUM: "Média",
  HARD: "Alta",
};

export default async function PegadinhasPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string; difficulty?: string; minError?: string; minFrequency?: string; antiError?: string }>;
}) {
  const user = await requireUser();
  const data = await getAppData(user.id);
  const params = await searchParams;
  const minError = Number(params.minError ?? 0);
  const minFrequency = Number(params.minFrequency ?? 0);

  const questions = data.traps.questions.filter((question) => {
    if (params.theme && question.theme !== params.theme) {
      return false;
    }
    if (params.difficulty && question.difficulty !== params.difficulty) {
      return false;
    }
    if (question.errorRate < minError) {
      return false;
    }
    if (question.frequencyScore < minFrequency) {
      return false;
    }
    if (params.antiError === "1" && !(question.errors > 0 && question.currentStreak < 3)) {
      return false;
    }
    return true;
  });

  return (
    <>
      <SectionHeader
        title="Pegadinhas da Banca – Instrumentação (CEBRASPE)"
        description="Treino avançado para evitar erros clássicos e proteger a nota líquida."
        action={
          <Link className="primary-button" href="/pegadinhas-cebraspe?antiError=1">
            Treinar só pegadinhas
          </Link>
        }
      />

      <section className="stats-grid">
        <div className="stat-card">
          <span>Questões iniciais</span>
          <strong>{data.traps.totalQuestions}</strong>
          <p>Banco inicial em formato certo ou errado.</p>
        </div>
        <div className="stat-card">
          <span>Respondidas</span>
          <strong>{data.traps.answered}</strong>
          <p>Itens já enfrentados pelo usuário.</p>
        </div>
        <div className="stat-card">
          <span>Anti-erro</span>
          <strong>{data.dashboard.trapErrorsPending}</strong>
          <p>Questões para repetir até 3 acertos seguidos.</p>
        </div>
        <div className="stat-card">
          <span>Dominadas</span>
          <strong>{data.traps.mastered}</strong>
          <p>Pegadinhas já controladas.</p>
        </div>
      </section>

      <section className="two-column-layout">
        <Card title="Filtros" subtitle="Refine por assunto, dificuldade, taxa de erro e frequência.">
          <form className="form-grid two-columns">
            <label>
              <span>Assunto</span>
              <select defaultValue={params.theme ?? ""} name="theme">
                <option value="">Todos</option>
                {Object.values(TrapTheme).map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Dificuldade</span>
              <select defaultValue={params.difficulty ?? ""} name="difficulty">
                <option value="">Todas</option>
                {Object.entries(difficultyLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Taxa mínima de erro</span>
              <input defaultValue={params.minError ?? "0"} min="0" name="minError" type="number" />
            </label>
            <label>
              <span>Frequência mínima em prova</span>
              <input defaultValue={params.minFrequency ?? "0"} min="0" name="minFrequency" type="number" />
            </label>
            <label>
              <span>Modo anti-erro</span>
              <select defaultValue={params.antiError ?? "0"} name="antiError">
                <option value="0">Desligado</option>
                <option value="1">Só erradas</option>
              </select>
            </label>
            <button className="secondary-button" type="submit">
              Aplicar filtros
            </button>
          </form>
        </Card>

        <Card title="Ranking de erros" subtitle="Tipos e temas com maior taxa de erro acumulada.">
          <div className="list">
            <div>
              <strong>Erros por tipo de pegadinha</strong>
              <MiniBarChart items={data.traps.errorsByType.map((item) => ({ label: item.trapType, value: item.errors }))} type="number" />
            </div>
            <div>
              <strong>Tópicos com maior taxa de erro</strong>
              <MiniBarChart items={data.traps.trapThemes.map((item) => ({ label: item.theme, value: item.errorRate }))} />
            </div>
          </div>
        </Card>
      </section>

      <section className="cards-grid">
        <Card title="Top erros do usuário" subtitle="Itens que mais custaram pontos até agora.">
          {data.traps.topTrapErrors.length ? (
            <div className="list">
              {data.traps.topTrapErrors.map((item) => (
                <div className="list-item" key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.theme}</p>
                  </div>
                  <span className="badge">{item.errorRate.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Você ainda não respondeu nenhuma pegadinha.</div>
          )}
        </Card>

        <Card title="Modo anti-erro" subtitle="Repita apenas o que você errou até acertar 3 vezes seguidas.">
          {data.traps.antiErrorQuestions.length ? (
            <div className="list">
              {data.traps.antiErrorQuestions.slice(0, 5).map((question) => (
                <div className="list-item" key={question.id}>
                  <div>
                    <strong>{question.title}</strong>
                    <p>{question.currentStreak}/3 acertos seguidos</p>
                  </div>
                  <Link className="ghost-button" href="/pegadinhas-cebraspe?antiError=1">
                    Treinar
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Nenhum erro acumulado no modo anti-erro.</div>
          )}
        </Card>
      </section>

      <Card title="Banco de pegadinhas" subtitle="Cada erro alimenta o sistema de revisão automática em 1, 7, 15 e 30 dias.">
        <div className="list">
          {questions.map((question) => {
            const tone = question.errorRate >= 70 ? "#eb5757" : question.errorRate >= 40 ? "#f2c94c" : "#27ae60";
            return (
              <div className="panel" key={question.id} style={{ borderLeft: `6px solid ${tone}` }}>
                <div className="panel-heading">
                  <h2>{question.title}</h2>
                  <p>
                    {question.topic} • {difficultyLabel[question.difficulty]} • frequência {question.frequencyScore}/10
                  </p>
                </div>
                <div className="chips" style={{ marginBottom: 12 }}>
                  <span className="chip">{question.theme}</span>
                  <span className="chip">{question.trapType}</span>
                  <span className="chip">Taxa de erro {question.errorRate.toFixed(0)}%</span>
                </div>
                <p><strong>Enunciado estilo CEBRASPE:</strong> {question.statement}</p>
                <p><strong>Resposta correta:</strong> {question.correctAnswer ? "Certo" : "Errado"}</p>
                <p><strong>Explicação detalhada:</strong> {question.explanation}</p>
                <p><strong>Motivo da pegadinha:</strong> {question.trapReason}</p>
                <p><strong>Onde o aluno erra:</strong> {question.whereStudentFails}</p>
                <p><strong>Como evitar:</strong> {question.avoidError}</p>
                <div className="cta-row">
                  <form action={answerTrapQuestionAction}>
                    <input name="trapQuestionId" type="hidden" value={question.id} />
                    <input name="answer" type="hidden" value="true" />
                    <button className="primary-button" type="submit">
                      Marcar Certo
                    </button>
                  </form>
                  <form action={answerTrapQuestionAction}>
                    <input name="trapQuestionId" type="hidden" value={question.id} />
                    <input name="answer" type="hidden" value="false" />
                    <button className="secondary-button" type="submit">
                      Marcar Errado
                    </button>
                  </form>
                </div>
                <div style={{ marginTop: 12 }}>
                  <ProgressBar value={Math.min(question.currentStreak * 33.34, 100)} tone="green" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
