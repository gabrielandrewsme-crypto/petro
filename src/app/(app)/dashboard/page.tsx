import Link from "next/link";
import { addStudySessionAction } from "@/actions/app";
import { Card, MiniBarChart, ProgressBar, SectionHeader, StatCard } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { formatPercent } from "@/lib/utils";
import { getTodayLesson } from "@/lib/weekly-content";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);
  const todayPlan = data.schedules.weekly[0];
  const pendingReviews = data.reviews.filter((review) => review.status === "PENDING").slice(0, 5);
  const todayLesson = getTodayLesson();

  return (
    <>
      <SectionHeader
        title="Dashboard"
        description="Visao central do seu preparo para Tecnico de Manutencao - Instrumentacao."
        action={
          <Link className="primary-button" href="/estudo-hoje">
            Iniciar estudo
          </Link>
        }
      />

      <section className="stats-grid">
        <StatCard label="Progresso do dia" value={formatPercent(data.dashboard.progressToday)} detail="Meta diaria em andamento" />
        <StatCard
          label="Horas hoje"
          value={`${data.dashboard.hoursStudied.toFixed(1)}h / ${data.dashboard.hoursPlanned.toFixed(1)}h`}
          detail="Estudadas vs planejadas"
        />
        <StatCard label="Questoes feitas" value={`${data.dashboard.questionsToday}`} detail="Registros de hoje" />
        <StatCard label="Revisoes pendentes" value={`${data.dashboard.reviewsPending}`} detail="Sistema 1-7-15-30" />
        <StatCard label="Progresso semanal" value={formatPercent(data.dashboard.weeklyProgress)} detail="Carga da semana" />
        <StatCard label="Sequencia" value={`${data.dashboard.streak} dias`} detail="Constancia recente" />
        <StatCard label="Modulo tecnico" value={`${data.dashboard.industrialTopicsCompleted}/${data.instrumentation.totalTopics}`} detail="Topicos concluidos" />
        <StatCard label="Em andamento" value={`${data.dashboard.industrialTopicsInProgress}`} detail="Topicos ativos de Instrumentacao" />
        <StatCard label="Matematica" value={`${data.dashboard.mathTopicsCompleted}/${data.mathematics.totalTopics}`} detail="Topicos concluidos" />
        <StatCard label="Math em andamento" value={`${data.dashboard.mathTopicsInProgress}`} detail="Topicos ativos de Matematica" />
        <StatCard label="Portugues" value={`${data.dashboard.portugueseTopicsCompleted}/${data.portuguese.totalTopics}`} detail="Topicos concluidos" />
        <StatCard label="PT em andamento" value={`${data.dashboard.portugueseTopicsInProgress}`} detail="Topicos ativos de Portugues" />
        <StatCard label="Pegadinhas" value={`${data.traps.answered}/${data.traps.totalQuestions}`} detail="Itens ja treinados" />
        <StatCard label="Anti-erro" value={`${data.dashboard.trapErrorsPending}`} detail="Pegadinhas pendentes" />
      </section>

      <section className="two-column-layout">
        <Card title="Ritmo de hoje" subtitle="Atualize estudo e gere revisoes automaticas.">
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
              <span>Topico</span>
              <input name="topic" placeholder="Ex.: Sensores de vazao" required />
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
              <span>Questoes resolvidas</span>
              <input name="questionsSolved" type="number" defaultValue="10" required />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              <span>Notas rapidas</span>
              <textarea name="notes" placeholder="Pontos para reforcar na revisao." />
            </label>
            <button className="primary-button" type="submit">
              Salvar estudo
            </button>
          </form>
        </Card>

        <Card
          title={todayLesson ? "Material de hoje" : "Revisoes do dia"}
          subtitle={todayLesson ? `${todayLesson.lesson.title} • ${todayLesson.lesson.questions} questoes planejadas` : "Itens mais urgentes do seu sistema de revisao espacada."}
        >
          {todayLesson ? (
            <div className="list">
              <div className="list-item">
                <div>
                  <strong>{todayLesson.lesson.topic}</strong>
                  <p>{todayLesson.lesson.subtopic}</p>
                </div>
                <span className="badge">{todayLesson.day}</span>
              </div>
              <div className="list-item">
                <div>
                  <strong>Videoaulas</strong>
                  <p>{todayLesson.lesson.videos.length} links prontos</p>
                </div>
                <span className="badge">{todayLesson.lesson.estimated_time.video_min} min</span>
              </div>
              <div className="list-item">
                <div>
                  <strong>Revisao e checklist</strong>
                  <p>{todayLesson.lesson.review.length} revisoes curtas • {todayLesson.lesson.checklist.length} passos</p>
                </div>
                <span className="badge">{todayLesson.lesson.estimated_time.total_min} min</span>
              </div>
              <div className="cta-row" style={{ marginTop: 16 }}>
                <Link className="primary-button" href="/estudo-hoje">
                  Abrir estudo de hoje
                </Link>
              </div>
            </div>
          ) : pendingReviews.length ? (
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
            <div className="empty-state">Nenhuma revisao pendente para hoje.</div>
          )}
        </Card>
      </section>

      <section className="cards-grid">
        <Card title="Instrumentacao Industrial - Petrobras" subtitle="Acompanhe o avanco por bloco do modulo tecnico.">
          <div className="list">
            {data.instrumentation.topicsByBlock.map((block) => (
              <div className="list-item" key={block.block}>
                <div>
                  <strong>{block.block}</strong>
                  <p>{block.topics.length} topicos</p>
                </div>
                <div style={{ minWidth: 180 }}>
                  <ProgressBar tone="green" value={block.completionRate} />
                </div>
              </div>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: 16 }}>
            <Link className="primary-button" href="/instrumentacao-industrial">
              Abrir modulo completo
            </Link>
          </div>
        </Card>

        <Card title="Matematica - Petrobras" subtitle="Prioridades e avanco do modulo matematico.">
          <div className="list">
            {data.mathematics.priorityTopics.map((topic) => (
              <div className="list-item" key={topic.id}>
                <div>
                  <strong>{topic.title}</strong>
                  <p>{topic.status === "NOT_STARTED" ? "Nao iniciado" : topic.status === "IN_PROGRESS" ? "Em andamento" : "Concluido"}</p>
                </div>
                <span className="badge">{topic.accuracyRate.toFixed(0)}%</span>
              </div>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: 16 }}>
            <Link className="primary-button" href="/matematica-petrobras">
              Abrir modulo de Matematica
            </Link>
          </div>
        </Card>

        <Card title="Portugues - Petrobras" subtitle="Foco reforcado em interpretacao, pontuacao e concordancia.">
          <div className="list">
            {data.portuguese.priorityTopics.map((topic) => (
              <div className="list-item" key={topic.id}>
                <div>
                  <strong>{topic.title}</strong>
                  <p>{topic.status === "NOT_STARTED" ? "Nao iniciado" : topic.status === "IN_PROGRESS" ? "Em andamento" : "Concluido"}</p>
                </div>
                <span className="badge">{topic.accuracyRate.toFixed(0)}%</span>
              </div>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: 16 }}>
            <Link className="primary-button" href="/portugues-petrobras">
              Abrir modulo de Portugues
            </Link>
          </div>
        </Card>

        <Card title="Pegadinhas da Banca - CEBRASPE" subtitle="Reduza erros classicos e preserve a nota liquida.">
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
              Treinar so pegadinhas
            </Link>
          </div>
        </Card>

        <Card title="Desempenho por materia" subtitle="Taxa de acerto acumulada por disciplina.">
          <MiniBarChart
            items={data.charts.performanceBySubject.map((item) => ({
              label: item.subject,
              value: item.accuracy,
              color: item.color,
            }))}
          />
        </Card>

        <Card title="Evolucao semanal" subtitle="Nota liquida por dia com base nos registros de questoes.">
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
