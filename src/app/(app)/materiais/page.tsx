import { addMaterialAction } from "@/actions/app";
import { Card, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { getActiveWeekSchedule } from "@/lib/weekly-content";

export default async function MateriaisPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);
  const schedule = getActiveWeekSchedule() ?? [];
  const weeklyMaterials = schedule.flatMap((entry) =>
    [entry.lesson, entry.companion_lesson].filter(Boolean).map((lesson) => ({
      dateLabel: entry.dateLabel,
      dayLabel: entry.calendarDayLabel,
      lesson: lesson!,
    })),
  );

  return (
    <>
      <SectionHeader title="Materiais" description="Central para PDFs, links uteis, anotacoes e pacote semanal guiado." />

      <section className="two-column-layout">
        <Card title="Adicionar material" subtitle="Use PDF, link ou nota para centralizar sua preparacao.">
          <form action={addMaterialAction} className="form-grid">
            <label>
              <span>Titulo</span>
              <input name="title" placeholder="Resumo de valvulas" required />
            </label>
            <label>
              <span>Tipo</span>
              <select name="type" defaultValue="PDF">
                <option value="PDF">PDF</option>
                <option value="LINK">Link util</option>
                <option value="NOTE">Anotacao</option>
              </select>
            </label>
            <label>
              <span>URL</span>
              <input name="url" placeholder="https://..." />
            </label>
            <label>
              <span>Anotacoes</span>
              <textarea name="notes" placeholder="Observacoes, resumo ou contexto." />
            </label>
            <button className="primary-button" type="submit">
              Salvar material
            </button>
          </form>
        </Card>

        <Card title="Resumo da area" subtitle="Tudo reunido em um unico acervo por usuario.">
          <div className="chips">
            <span className="chip">{data.materials.filter((item) => item.type === "PDF").length} PDFs</span>
            <span className="chip">{data.materials.filter((item) => item.type === "LINK").length} links</span>
            <span className="chip">{data.materials.filter((item) => item.type === "NOTE").length} anotacoes</span>
            <span className="chip">{weeklyMaterials.length} blocos da semana</span>
          </div>
        </Card>
      </section>

      <Card title="Pacote da semana" subtitle="Material do cronograma ativo, com foco no que estudar e como resolver questoes.">
        <div className="list">
          {weeklyMaterials.map((item) => (
            <div className="list-item" key={`${item.dateLabel}-${item.lesson.subject}-${item.lesson.title}`}>
              <div>
                <strong>
                  {item.dateLabel} - {item.lesson.subject} - {item.lesson.title}
                </strong>
                <p>
                  {item.dayLabel} - {item.lesson.subtopic}
                </p>
                <p>
                  Estude primeiro: {item.lesson.key_concepts.join(", ")}. Meta: {item.lesson.questions} questoes.
                </p>
                <p>Como resolver: compare o enunciado com a definicao-base, identifique a pegadinha tecnica e evite generalizacoes.</p>
              </div>
              <div className="cta-row">
                {item.lesson.videos[0] ? (
                  <a className="ghost-button" href={item.lesson.videos[0]} target="_blank" rel="noreferrer">
                    Abrir aula
                  </a>
                ) : null}
                <span className="badge">Semana ativa</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Acervo" subtitle="Itens cadastrados para consulta rapida.">
        <div className="list">
          {data.materials.map((item) => (
            <div className="list-item" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.notes || "Sem observacoes adicionais."}</p>
              </div>
              <div className="cta-row">
                <span className="badge">{item.type}</span>
                {item.url ? (
                  <a className="ghost-button" href={item.url} target="_blank" rel="noreferrer">
                    Abrir
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
