import { notFound } from "next/navigation";
import { addQuestionLogAction, addStudySessionAction, updateIndustrialTopicStatusAction } from "@/actions/app";
import { Card, MiniBarChart, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";

export default async function PortuguesTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();
  const data = await getAppData(user.id);
  const topic = data.portuguese.topics.find((item) => item.slug === slug);

  if (!topic) {
    notFound();
  }

  const subjectId = data.subjects.find((subject) => subject.name === "Português")?.id ?? "";
  const topicQuestionLogs = data.questionLogs.filter((log) => log.topicId === topic.id || log.topic === topic.title);
  const topicReviews = data.reviews.filter((review) => review.topicId === topic.id);

  return (
    <>
      <SectionHeader title={topic.title} description={topic.description} />

      <section className="stats-grid">
        <div className="stat-card">
          <span>Status</span>
          <strong>{topic.status === "NOT_STARTED" ? "Não iniciado" : topic.status === "IN_PROGRESS" ? "Em andamento" : "Concluído"}</strong>
          <p>Progresso atual do conteúdo.</p>
        </div>
        <div className="stat-card">
          <span>Questões</span>
          <strong>{topic.questions}</strong>
          <p>Acertos: {topic.correctAnswers} • Erros: {topic.wrongAnswers}</p>
        </div>
        <div className="stat-card">
          <span>Taxa</span>
          <strong>{topic.accuracyRate.toFixed(1)}%</strong>
          <p>Desempenho consolidado no tópico.</p>
        </div>
        <div className="stat-card">
          <span>Revisões</span>
          <strong>{topic.pendingReviews}</strong>
          <p>Fila integrada ao sistema geral.</p>
        </div>
      </section>

      <section className="two-column-layout">
        <Card title="Atualizar status" subtitle="Marque a fase atual do estudo.">
          <form action={updateIndustrialTopicStatusAction} className="form-grid">
            <input name="topicId" type="hidden" value={topic.id} />
            <label>
              <span>Status</span>
              <select name="status" defaultValue={topic.status}>
                <option value="NOT_STARTED">Não iniciado</option>
                <option value="IN_PROGRESS">Em andamento</option>
                <option value="COMPLETED">Concluído</option>
              </select>
            </label>
            <button className="primary-button" type="submit">
              Atualizar
            </button>
          </form>
        </Card>

        <Card title="Videoaulas" subtitle="Links reais do YouTube vinculados ao conteúdo.">
          <div className="list">
            {topic.videoLessons.map((video) => (
              <div className="list-item" key={video.id}>
                <div>
                  <strong>{video.title}</strong>
                  <p>{video.url}</p>
                </div>
                <a className="ghost-button" href={video.url} target="_blank" rel="noreferrer">
                  Assistir
                </a>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="two-column-layout">
        <Card title="Registrar estudo" subtitle="Ao estudar, o tópico entra automaticamente no fluxo de revisão.">
          <form action={addStudySessionAction} className="form-grid two-columns">
            <input name="subjectId" type="hidden" value={subjectId} />
            <input name="topicId" type="hidden" value={topic.id} />
            <label>
              <span>Tópico</span>
              <input name="topic" defaultValue={topic.title} required />
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
              <span>Notas</span>
              <textarea name="notes" placeholder="Resumo, regra ou pegadinhas para revisar depois." />
            </label>
            <button className="primary-button" type="submit">
              Registrar estudo
            </button>
          </form>
        </Card>

        <Card title="Sistema de questões" subtitle="Registre acertos, erros e taxa para este tópico.">
          <form action={addQuestionLogAction} className="form-grid two-columns">
            <input name="discipline" type="hidden" value="Português" />
            <input name="subjectId" type="hidden" value={subjectId} />
            <input name="topicId" type="hidden" value={topic.id} />
            <label>
              <span>Assunto</span>
              <input name="topic" defaultValue={topic.title} required />
            </label>
            <label>
              <span>Quantidade</span>
              <input name="quantity" type="number" defaultValue="10" required />
            </label>
            <label>
              <span>Acertos</span>
              <input name="correctAnswers" type="number" defaultValue="7" required />
            </label>
            <label>
              <span>Erros</span>
              <input name="wrongAnswers" type="number" defaultValue="3" required />
            </label>
            <button className="secondary-button" type="submit">
              Salvar desempenho
            </button>
          </form>
        </Card>
      </section>

      <section className="two-column-layout">
        <Card title="Gráfico de desempenho" subtitle="Taxa de acerto dos lançamentos feitos neste tópico.">
          <MiniBarChart
            items={topicQuestionLogs.map((log) => ({
              label: log.createdAt.toLocaleDateString("pt-BR"),
              value: log.accuracyRate,
            }))}
          />
        </Card>

        <Card title="Revisão automática" subtitle="O tópico é integrado ao sistema geral de revisão.">
          <div className="list">
            {topicReviews.length ? (
              topicReviews.map((review) => (
                <div className="list-item" key={review.id}>
                  <div>
                    <strong>{review.topic}</strong>
                    <p>D+{review.intervalDays}</p>
                  </div>
                  <span className="badge">{review.status}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">Ainda não há revisões geradas para este tópico.</div>
            )}
          </div>
        </Card>
      </section>
    </>
  );
}
