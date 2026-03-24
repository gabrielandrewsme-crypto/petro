import Link from "next/link";
import { addStudySessionAction } from "@/actions/app";
import { Card, MiniBarChart, ProgressBar, SectionHeader, StatCard } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);
  const todayPlan = data.schedules.weekly[0];
  const pendingReviews = data.reviews.filter((review) => review.status === "PENDING").slice(0, 5);

  return (
    <>
      <SectionHeader
        title="Dashboard"
        description="Visão central do seu preparo para Técnico de Manutenção - Instrumentação."
        action={
          <Link className="primary-button" href="/cronograma">
            Iniciar estudo
          </Link>
        }
      />

      <section className="stats-grid">
        <StatCard label="Progresso do dia" value={formatPercent(data.dashboard.progressToday)} detail="Meta diária em andamento" />
        <StatCard
          label="Horas hoje"
          value={`${data.dashboard.hoursStudied.toFixed(1)}h / ${data.dashboard.hoursPlanned.toFixed(1)}h`}
          detail="Estudadas vs planejadas"
        />
        <StatCard label="Questões feitas" value={`${data.dashboard.questionsToday}`} detail="Registros de hoje" />
        <StatCard label="Revisões pendentes" value={`${data.dashboard.reviewsPending}`} detail="Sistema 1-7-15-30" />
        <StatCard label="Progresso semanal" value={formatPercent(data.dashboard.weeklyProgress)} detail="Carga da semana" />
        <StatCard label="Sequência" value={`${data.dashboard.streak} dias`} detail="Constância recente" />
        <StatCard label="Módulo técnico" value={`${data.dashboard.industrialTopicsCompleted}/${data.instrumentation.totalTopics}`} detail="Tópicos concluídos" />
        <StatCard label="Em andamento" value={`${data.dashboard.industrialTopicsInProgress}`} detail="Tópicos ativos de Instrumentação" />
        <StatCard label="Matemática" value={`${data.dashboard.mathTopicsCompleted}/${data.mathematics.totalTopics}`} detail="Tópicos concluídos" />
        <StatCard label="Math em andamento" value={`${data.dashboard.mathTopicsInProgress}`} detail="Tópicos ativos de Matemática" />
        <StatCard label="Português" value={`${data.dashboard.portugueseTopicsCompleted}/${data.portuguese.totalTopics}`} detail="Tópicos concluídos" />
        <StatCard label="PT em andamento" value={`${data.dashboard.portugueseTopicsInProgress}`} detail="Tópicos ativos de Português" />
        <StatCard label="Pegadinhas" value={`${data.traps.answered}/${data.traps.totalQuestions}`} detail="Itens já treinados" />
        <StatCard label="Anti-erro" value={`${data.dashboard.trapErrorsPending}`} detail="Pegadinhas pendentes" />
      </section>

      <section className="two-column-layout">
        <Card title="Ritmo de hoje" subtitle="Atualize estudo e gere revisões automáticas.">
          <div className="list">
            <div>
              <div className="inline-actions">
                <span className="badge">Hoje: {todayPlan?.description ?? "Organize o dia"}</span>
              </div>
              <p>O progresso abaixo considera horas estudadas versus planejadas.</p>
            </div>
            <ProgressBar value={data.dashboard.progressToday} tone="yellow" />
          </div>

          <form action={addStudySessionAction} className="form-grid two-columns" style={{ marginTop: 18 }}>
            <label>
              <span>Disciplina</span>
              <select name="subjectId" required>
                {data.subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Tópico</span>
              <input name="topic" placeholder="Ex.: Sensores de vazão" required />
            </label>
            <label>
              <span>Horas planejadas</span>
              <input name="plannedHours" type="number" step="0.5" defaultValue="2" required />
            </label>
            <label>
              <span>Horas estudadas</span>
              <input name="studiedHours" type="number" step="0.5" defaultValue="1.5" required />
            </label>
            <label>
              <span>Questões resolvidas</span>
              <input name="questionsSolved" type="number" defaultValue="10" required />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              <span>Notas rápidas</span>
              <textarea name="notes" placeholder="Pontos para reforçar na revisão." />
            </label>
            <button className="primary-button" type="submit">
              Salvar estudo
            </button>
          </form>
        </Card>

        <Card title="Revisões do dia" subtitle="Itens mais urgentes do seu sistema de revisão espaçada.">
          {pendingReviews.length ? (
            <div className="list">
              {pendingReviews.map((review) => (
                <div className="list-item" key={review.id}>
                  <div>
                    <strong>{review.topic}</strong>
                    <p>
                      {review.subject?.name ?? "Sem disciplina"} • D+{review.intervalDays}
                    </p>
                  </div>
                  <span className="badge">{new Date(review.dueDate).toLocaleDateString("pt-BR")}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Nenhuma revisão pendente para hoje.</div>
          )}
        </Card>
      </section>

      <section className="cards-grid">
        <Card title="Instrumentação Industrial – Petrobras" subtitle="Acompanhe o avanço por bloco do módulo técnico.">
          <div className="list">
            {data.instrumentation.topicsByBlock.map((block) => (
              <div className="list-item" key={block.block}>
                <div>
                  <strong>{block.block}</strong>
                  <p>{block.topics.length} tópicos</p>
                </div>
                <div style={{ minWidth: 180 }}>
                  <ProgressBar tone="green" value={block.completionRate} />
                </div>
              </div>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: 16 }}>
            <Link className="primary-button" href="/instrumentacao-industrial">
              Abrir módulo completo
            </Link>
          </div>
        </Card>

        <Card title="Matemática – Petrobras" subtitle="Prioridades e avanço do módulo matemático.">
          <div className="list">
            {data.mathematics.priorityTopics.map((topic) => (
              <div className="list-item" key={topic.id}>
                <div>
                  <strong>{topic.title}</strong>
                  <p>{topic.status === "NOT_STARTED" ? "Não iniciado" : topic.status === "IN_PROGRESS" ? "Em andamento" : "Concluído"}</p>
                </div>
                <span className="badge">{topic.accuracyRate.toFixed(0)}%</span>
              </div>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: 16 }}>
            <Link className="primary-button" href="/matematica-petrobras">
              Abrir módulo de Matemática
            </Link>
          </div>
        </Card>

        <Card title="Português – Petrobras" subtitle="Foco reforçado em interpretação, pontuação e concordância.">
          <div className="list">
            {data.portuguese.priorityTopics.map((topic) => (
              <div className="list-item" key={topic.id}>
                <div>
                  <strong>{topic.title}</strong>
                  <p>{topic.status === "NOT_STARTED" ? "Não iniciado" : topic.status === "IN_PROGRESS" ? "Em andamento" : "Concluído"}</p>
                </div>
                <span className="badge">{topic.accuracyRate.toFixed(0)}%</span>
              </div>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: 16 }}>
            <Link className="primary-button" href="/portugues-petrobras">
              Abrir módulo de Português
            </Link>
          </div>
        </Card>

        <Card title="Pegadinhas da Banca – CEBRASPE" subtitle="Reduza erros clássicos e preserve a nota líquida.">
          {data.traps.topTrapErrors.length ? (
            <div className="list">
              {data.traps.topTrapErrors.slice(0, 3).map((item) => (
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
            <div className="empty-state">Nenhuma pegadinha respondida ainda.</div>
          )}
          <div className="cta-row" style={{ marginTop: 16 }}>
            <Link className="primary-button" href="/pegadinhas-cebraspe">
              Treinar só pegadinhas
            </Link>
          </div>
        </Card>

        <Card title="Desempenho por matéria" subtitle="Taxa de acerto acumulada por disciplina.">
          <MiniBarChart
            items={data.charts.performanceBySubject.map((item) => ({
              label: item.subject,
              value: item.accuracy,
              color: item.color,
            }))}
          />
        </Card>

        <Card title="Evolução semanal" subtitle="Nota líquida por dia com base nos registros de questões.">
          <MiniBarChart
            items={data.charts.weeklyEvolution.map((item) => ({
              label: item.label,
              value: item.liquidScore,
            }))}
            type="number"
          />
        </Card>
      </section>
    </>
  );
}
