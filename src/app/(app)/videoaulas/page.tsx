import { addVideoLessonAction, toggleVideoStatusAction } from "@/actions/app";
import { Card, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";

export default async function VideoaulasPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);

  return (
    <>
      <SectionHeader title="Videoaulas" description="Cadastre links do YouTube, organize por categoria e marque o avanço." />

      <section className="two-column-layout">
        <Card title="Adicionar videoaula" subtitle="Categorias: Instrumentação, Matemática e Português.">
          <form action={addVideoLessonAction} className="form-grid two-columns">
            <label>
              <span>Título</span>
              <input name="title" placeholder="CLP para concursos" required />
            </label>
            <label>
              <span>Link do YouTube</span>
              <input name="url" type="url" placeholder="https://youtube.com/..." required />
            </label>
            <label>
              <span>Categoria</span>
              <select name="category" defaultValue="INSTRUMENTACAO">
                <option value="INSTRUMENTACAO">Instrumentação</option>
                <option value="MATEMATICA">Matemática</option>
                <option value="PORTUGUES">Português</option>
              </select>
            </label>
            <label>
              <span>Vincular matéria</span>
              <select name="subjectId">
                <option value="">Sem vínculo</option>
                {data.subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="primary-button" type="submit">
              Salvar videoaula
            </button>
          </form>
        </Card>

        <Card title="Categorias" subtitle="Direção rápida do acervo atual.">
          <div className="chips">
            <span className="chip">Instrumentação</span>
            <span className="chip">Matemática</span>
            <span className="chip">Português</span>
          </div>
        </Card>
      </section>

      <Card title="Biblioteca" subtitle="Assista, favorite e acompanhe o que já foi visto.">
        <div className="list">
          {data.videoLessons.map((video) => (
            <div className="list-item" key={video.id}>
              <div>
                <strong>{video.title}</strong>
                <p>
                  {video.category} {video.subject ? `• ${video.subject.name}` : ""}
                </p>
              </div>
              <div className="cta-row">
                <a className="ghost-button" href={video.url} target="_blank" rel="noreferrer">
                  Assistir
                </a>
                <form action={toggleVideoStatusAction}>
                  <input name="videoId" type="hidden" value={video.id} />
                  <input name="field" type="hidden" value="watched" />
                  <input name="current" type="hidden" value={String(video.watched)} />
                  <button className="secondary-button" type="submit">
                    {video.watched ? "Assistido" : "Marcar assistido"}
                  </button>
                </form>
                <form action={toggleVideoStatusAction}>
                  <input name="videoId" type="hidden" value={video.id} />
                  <input name="field" type="hidden" value="favorite" />
                  <input name="current" type="hidden" value={String(video.favorite)} />
                  <button className="ghost-button" type="submit">
                    {video.favorite ? "Favorito" : "Favoritar"}
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
