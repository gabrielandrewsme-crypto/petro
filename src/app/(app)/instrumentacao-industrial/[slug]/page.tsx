import { notFound } from "next/navigation";
import { addQuestionLogAction, addStudySessionAction, updateIndustrialTopicStatusAction } from "@/actions/app";
import { Card, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";

export default async function IndustrialTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();
  const data = await getAppData(user.id);
  const topic = data.industrialTopics.find((item) => item.slug === slug);

  if (!topic) {
    notFound();
  }

  const subjectId = data.subjects.find((subject) => subject.category.includes("Instrument"))?.id ?? data.subjects[0]?.id ?? "";
  const topicQuestionLogs = data.questionLogs.filter((log) => log.topicId === topic.id || log.topic === topic.title);
  const topicReviews = data.reviews.filter((review) => review.topicId === topic.id);

  return (
    <>
      <SectionHeader title={topic.title} description={`${topic.block} • ${topic.description}`} />

      <section className="stats-grid">
        <div className="stat-card">
          <span>Status</span>
          <strong>{topic.status === "NOT_STARTED" ? "Não iniciado" : topic.status === "IN_PROGRESS" ? "Em andamento" : "Concluído"}</strong>
          <p>Situação atual do assunto.</p>
        </div>
        <div className="stat-card">
          <span>Questões</span>
          <strong>{topic.questions}</strong>
          <p>Acertos: {topic.correctAnswers} • Erros: {topic.wrongAnswers}</p>
        </div>
        <div className="stat-card">
          <span>Taxa de acerto</span>
          <strong>{topic.accuracyRate.toFixed(1)}%</strong>
          <p>Indicador consolidado por tópico.</p>
        </div>
        <div className="stat-card">
          <span>Revisões</span>
          <strong>{topic.pendingReviews}</strong>
          <p>Itens pendentes no sistema automático.</p>
        </div>
      </section>

      <section className="two-column-layout">
        <Card title="Status do assunto" subtitle="Marque a fase atual do estudo.">
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
              Atualizar status
            </button>
          </form>
        </Card>

        <Card title="Videoaulas" subtitle="Links reais do YouTube para aprofundamento.">
          <div className="list">
            {topic.videoLessons.map((video) => (
              <div className="list-item" key={video.id}>
                <div>
                  <strong>{video.title}</strong>
                  <p>{video.url}</p>
                </div>
                <a className="ghost-button" href={video.url} rel="noreferrer" target="_blank">
                  Assistir
                </a>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="two-column-layout">
        <Card title="Registrar estudo do tópico" subtitle="Ao salvar, o tópico entra automaticamente na fila de revisão.">
          <form action={addStudySessionAction} className="form-grid two-columns">
            <input name="subjectId" type="hidden" value={subjectId} />
            <input name="topicId" type="hidden" value={topic.id} />
            <label>
              <span>Tópico</span>
              <input name="topic" defaultValue={topic.title} required />
            </label>
            <label>
              <span>Horas planejadas</span>
              <input name="plannedHours" defaultValue="2" step="0.5" type="number" required />
            </label>
            <label>
              <span>Horas estudadas</span>
              <input name="studiedHours" defaultValue="1.5" step="0.5" type="number" required />
            </label>
            <label>
              <span>Questões resolvidas</span>
              <input name="questionsSolved" defaultValue="10" type="number" required />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              <span>Notas</span>
              <textarea name="notes" placeholder="Resumo do estudo, dúvidas e pontos de revisão." />
            </label>
            <button className="primary-button" type="submit">
              Registrar estudo
            </button>
          </form>
        </Card>

        <Card title="Sistema de questões" subtitle="Contador, acertos, erros e taxa por tópico.">
          <form action={addQuestionLogAction} className="form-grid two-columns">
            <input name="discipline" type="hidden" value="Instrumentação Industrial" />
            <input name="subjectId" type="hidden" value={subjectId} />
            <input name="topicId" type="hidden" value={topic.id} />
            <label>
              <span>Assunto</span>
              <input name="topic" defaultValue={topic.title} required />
            </label>
            <label>
              <span>Quantidade</span>
              <input name="quantity" defaultValue="10" type="number" required />
            </label>
            <label>
              <span>Acertos</span>
              <input name="correctAnswers" defaultValue="7" type="number" required />
            </label>
            <label>
              <span>Erros</span>
              <input name="wrongAnswers" defaultValue="3" type="number" required />
            </label>
            <button className="secondary-button" type="submit">
              Salvar questões
            </button>
          </form>
        </Card>
      </section>

      <section className="cards-grid">
        <Card title="Histórico de questões" subtitle="Registros lançados para este tópico.">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Quantidade</th>
                  <th>Acertos</th>
                  <th>Erros</th>
                  <th>Taxa</th>
                </tr>
              </thead>
              <tbody>
                {topicQuestionLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.createdAt.toLocaleDateString("pt-BR")}</td>
                    <td>{log.quantity}</td>
                    <td>{log.correctAnswers}</td>
                    <td>{log.wrongAnswers}</td>
                    <td>{log.accuracyRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Fila de revisão" subtitle="Toda vez que este tópico é estudado, a revisão entra em 1, 7, 15 e 30 dias.">
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
