import { addMaterialAction } from "@/actions/app";
import { Card, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";

export default async function MateriaisPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);

  return (
    <>
      <SectionHeader title="Materiais" description="Central para PDFs, links úteis e anotações pessoais." />

      <section className="two-column-layout">
        <Card title="Adicionar material" subtitle="Use PDF, link ou nota para centralizar sua preparação.">
          <form action={addMaterialAction} className="form-grid">
            <label>
              <span>Título</span>
              <input name="title" placeholder="Resumo de válvulas" required />
            </label>
            <label>
              <span>Tipo</span>
              <select name="type" defaultValue="PDF">
                <option value="PDF">PDF</option>
                <option value="LINK">Link útil</option>
                <option value="NOTE">Anotação</option>
              </select>
            </label>
            <label>
              <span>URL</span>
              <input name="url" placeholder="https://..." />
            </label>
            <label>
              <span>Anotações</span>
              <textarea name="notes" placeholder="Observações, resumo ou contexto." />
            </label>
            <button className="primary-button" type="submit">
              Salvar material
            </button>
          </form>
        </Card>

        <Card title="Resumo da área" subtitle="Tudo reunido em um único acervo por usuário.">
          <div className="chips">
            <span className="chip">{data.materials.filter((item) => item.type === "PDF").length} PDFs</span>
            <span className="chip">{data.materials.filter((item) => item.type === "LINK").length} links</span>
            <span className="chip">{data.materials.filter((item) => item.type === "NOTE").length} anotações</span>
          </div>
        </Card>
      </section>

      <Card title="Acervo" subtitle="Itens cadastrados para consulta rápida.">
        <div className="list">
          {data.materials.map((item) => (
            <div className="list-item" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.notes || "Sem observações adicionais."}</p>
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
