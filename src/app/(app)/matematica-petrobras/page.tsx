import Link from "next/link";
import { updateIndustrialTopicStatusAction } from "@/actions/app";
import { Card, MiniBarChart, ProgressBar, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { TopicPriority, TopicStatus } from "@/lib/types";

const statusLabel: Record<TopicStatus, string> = {
  NOT_STARTED: "Não iniciado",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
};

export default async function MatematicaPetrobrasPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);
  const topics = data.mathematics.topics;
  const completed = topics.filter((topic) => topic.status === "COMPLETED").length;

  return (
    <>
      <SectionHeader
        title="Matemática – Petrobras"
        description="Módulo completo por tópicos do edital com revisão automática, questões e prioridades."
      />

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total de tópicos</span>
          <strong>{data.mathematics.totalTopics}</strong>
          <p>Estrutura completa do edital de matemática.</p>
        </div>
        <div className="stat-card">
          <span>Concluídos</span>
          <strong>{completed}</strong>
          <p>Assuntos com estudo fechado.</p>
        </div>
        <div className="stat-card">
          <span>Prioridade alta</span>
          <strong>{data.mathematics.priorityTopics.length}</strong>
          <p>Matemática financeira, funções e equações.</p>
        </div>
      </section>

      <Card title="Prioridades do edital" subtitle="Assuntos que merecem foco reforçado na rotina.">
        <div className="cards-grid">
          {data.mathematics.priorityTopics.map((topic) => (
            <div className="panel" key={topic.id}>
              <div className="panel-heading">
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
              </div>
              <div className="chips" style={{ marginBottom: 12 }}>
                <span className="chip">Prioridade alta</span>
                <span className="chip">{statusLabel[topic.status]}</span>
                <span className="chip">{topic.questions} questões</span>
              </div>
              <Link className="primary-button" href={`/matematica-petrobras/${topic.slug}`}>
                Abrir tópico
              </Link>
            </div>
          ))}
        </div>
      </Card>

      <section className="two-column-layout">
        <Card title="Progresso do módulo" subtitle="Acompanhe a taxa de conclusão dos tópicos.">
          <ProgressBar tone="yellow" value={topics.length ? (completed / topics.length) * 100 : 0} />
          <div style={{ marginTop: 16 }}>
            <MiniBarChart
              items={topics.map((topic) => ({
                label: topic.title,
                value: topic.accuracyRate,
              }))}
            />
          </div>
        </Card>

        <Card title="Desempenho por tópico" subtitle="Taxa de acerto consolidada nas questões registradas.">
          <MiniBarChart
            items={topics.map((topic) => ({
              label: topic.title,
              value: topic.accuracyRate,
            }))}
          />
        </Card>
      </section>

      <Card title="Tópicos do edital" subtitle="Cada tópico possui página própria com conteúdo, videoaulas, questões e revisão automática.">
        <div className="cards-grid">
          {topics.map((topic) => (
            <div className="panel" key={topic.id}>
              <div className="panel-heading">
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
              </div>
              <div className="chips" style={{ marginBottom: 12 }}>
                <span className="chip">{statusLabel[topic.status]}</span>
                {topic.priority === TopicPriority.HIGH ? <span className="chip">Prioridade alta</span> : null}
                <span className="chip">{topic.pendingReviews} revisões</span>
              </div>
              <div className="cta-row">
                <Link className="primary-button" href={`/matematica-petrobras/${topic.slug}`}>
                  Abrir conteúdo
                </Link>
                <form action={updateIndustrialTopicStatusAction}>
                  <input name="topicId" type="hidden" value={topic.id} />
                  <select name="status" defaultValue={topic.status}>
                    <option value="NOT_STARTED">Não iniciado</option>
                    <option value="IN_PROGRESS">Em andamento</option>
                    <option value="COMPLETED">Concluído</option>
                  </select>
                  <button className="secondary-button" type="submit">
                    Salvar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
