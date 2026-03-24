import Link from "next/link";
import { Card, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { getActiveWeekSchedule, getTodayLesson } from "@/lib/weekly-content";

export default async function EstudoHojePage() {
  const user = await requireUser();
  const data = await getAppData(user.id);
  const todayLesson = getTodayLesson();
  const schedule = getActiveWeekSchedule();

  if (!todayLesson) {
    return (
      <>
        <SectionHeader title="Estudo de Hoje" description="Nenhuma semana ativa foi configurada para a data atual." />
        <Card title="Sem conteudo ativo" subtitle="Assim que uma semana for ativada, o material do dia aparece aqui.">
          <p>O botao de iniciar estudo passara a abrir automaticamente o pacote do dia.</p>
        </Card>
      </>
    );
  }

  const linkedQuestions = data.questionBank.questions.filter((question) => todayLesson.lesson.prova_2023_items.includes(question.itemNumber));

  return (
    <>
      <SectionHeader
        title="Estudo de Hoje"
        description={`${todayLesson.day} • ${todayLesson.dateLabel} • ${todayLesson.lesson.topic}`}
        action={
          <Link className="primary-button" href="/questoes">
            Abrir banco de questoes
          </Link>
        }
      />

      <section className="two-column-layout">
        <Card title={todayLesson.lesson.title} subtitle={`${todayLesson.type} • ${todayLesson.lesson.estimated_time.total_min} min planejados`}>
          <div className="list">
            <div>
              <strong>Subtopico</strong>
              <p>{todayLesson.lesson.subtopic}</p>
            </div>
            <div>
              <strong>Fonte de questoes</strong>
              <p>{todayLesson.lesson.question_source}</p>
            </div>
            <div>
              <strong>Meta do dia</strong>
              <p>{todayLesson.lesson.questions} questoes</p>
            </div>
          </div>
        </Card>

        <Card title="Sequencia da semana" subtitle="A semana 1 esta ativa entre 24/03/2026 e 29/03/2026.">
          <div className="list">
            {schedule?.map((entry) => (
              <div className="list-item" key={`${entry.day_number}-${entry.dateLabel}`}>
                <div>
                  <strong>{entry.day}</strong>
                  <p>
                    {entry.dateLabel} • {entry.lesson.title}
                  </p>
                </div>
                <span className="badge">{entry.isToday ? "Hoje" : entry.isPast ? "Feito" : "Proximo"}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="cards-grid">
        <Card title="Videoaulas" subtitle="Links prontos para abrir no YouTube.">
          <div className="list">
            {todayLesson.lesson.videos.map((video) => (
              <a className="list-item" href={video} key={video} target="_blank" rel="noreferrer">
                <div>
                  <strong>Abrir aula</strong>
                  <p>{video}</p>
                </div>
                <span className="badge">YouTube</span>
              </a>
            ))}
          </div>
        </Card>

        <Card title="Conceitos-chave" subtitle="Pontos que voce precisa fixar hoje.">
          <div className="list">
            {todayLesson.lesson.key_concepts.map((item) => (
              <div className="list-item" key={item}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Checklist" subtitle="Roteiro objetivo para executar o estudo do dia.">
          <div className="list">
            {todayLesson.lesson.checklist.map((item) => (
              <div className="list-item" key={item}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Pegadinhas" subtitle="Pontos de erro classico que merecem atencao.">
          <div className="list">
            {todayLesson.lesson.pitfalls.map((item) => (
              <div className="list-item" key={item}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Revisao do dia" subtitle="Retomadas programadas dentro da semana ativa.">
          <div className="list">
            {todayLesson.lesson.review.length ? (
              todayLesson.lesson.review.map((item) => (
                <div className="list-item" key={item}>
                  <strong>{item}</strong>
                </div>
              ))
            ) : (
              <p>Nenhuma revisao curta cadastrada para hoje.</p>
            )}
          </div>
        </Card>

        <Card title="Itens da prova vinculados" subtitle="Questoes oficiais relacionadas ao estudo de hoje.">
          <div className="list">
            {linkedQuestions.length ? (
              linkedQuestions.map((question) => (
                <div className="list-item" key={question.id}>
                  <div>
                    <strong>Item {question.itemNumber}</strong>
                    <p>{question.statement}</p>
                  </div>
                  <span className="badge">{question.isAnnulled ? "Anulada" : question.correctAnswer ? "Certo" : "Errado"}</span>
                </div>
              ))
            ) : (
              <p>Nenhum item da prova foi vinculado ao estudo de hoje.</p>
            )}
          </div>
          <div className="cta-row" style={{ marginTop: 16 }}>
            <Link className="primary-button" href="/questoes">
              Resolver questoes
            </Link>
          </div>
        </Card>
      </section>
    </>
  );
}
