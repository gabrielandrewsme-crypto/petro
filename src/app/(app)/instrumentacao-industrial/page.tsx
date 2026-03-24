import Link from "next/link";
import { updateIndustrialTopicStatusAction } from "@/actions/app";
import { Card, ProgressBar, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { TopicStatus } from "@/lib/types";

const statusLabel: Record<TopicStatus, string> = {
  NOT_STARTED: "Não iniciado",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
};

export default async function InstrumentacaoIndustrialPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);

  return (
    <>
      <SectionHeader
        title="Instrumentação Industrial – Petrobras"
        description="Módulo completo dividido em três blocos com páginas por tópico, questões e revisão automática."
      />

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total de tópicos</span>
          <strong>{data.instrumentation.totalTopics}</strong>
          <p>Mapa completo do módulo técnico.</p>
        </div>
        <div className="stat-card">
          <span>Concluídos</span>
          <strong>{data.dashboard.industrialTopicsCompleted}</strong>
          <p>Tópicos fechados com status concluído.</p>
        </div>
        <div className="stat-card">
          <span>Em andamento</span>
          <strong>{data.dashboard.industrialTopicsInProgress}</strong>
          <p>Assuntos abertos no ciclo atual.</p>
        </div>
      </section>

      {data.instrumentation.topicsByBlock.filter((block) => block.topics.length > 0).map((block) => (
        <Card
          key={block.block}
          title={block.block}
          subtitle={`Progresso do bloco: ${Math.round(block.completionRate)}%`}
        >
          <ProgressBar tone="yellow" value={block.completionRate} />
          <div className="cards-grid" style={{ marginTop: 18 }}>
            {block.topics.map((topic) => (
              <div className="panel" key={topic.id}>
                <div className="panel-heading">
                  <h2>{topic.title}</h2>
                  <p>{topic.description}</p>
                </div>
                <div className="chips" style={{ marginBottom: 12 }}>
                  <span className="chip">{statusLabel[topic.status]}</span>
                  <span className="chip">{topic.questions} questões</span>
                  <span className="chip">{topic.pendingReviews} revisões</span>
                </div>
                <div className="cta-row">
                  <Link className="primary-button" href={`/instrumentacao-industrial/${topic.slug}`}>
                    Abrir assunto
                  </Link>
                  <form action={updateIndustrialTopicStatusAction}>
                    <input name="topicId" type="hidden" value={topic.id} />
                    <select name="status" defaultValue={topic.status}>
                      <option value="NOT_STARTED">Não iniciado</option>
                      <option value="IN_PROGRESS">Em andamento</option>
                      <option value="COMPLETED">Concluído</option>
                    </select>
                    <button className="secondary-button" type="submit">
                      Salvar status
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </>
  );
}
