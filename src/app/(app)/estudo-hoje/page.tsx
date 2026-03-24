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
  const companionQuestions = data.questionBank.questions.filter((question) => todayLesson.companion_lesson?.prova_2023_items.includes(question.itemNumber));

  return (
    <>
      <SectionHeader
        title="Estudo de Hoje"
        description={`${todayLesson.day} • ${todayLesson.dateLabel} • ${todayLesson.lesson.topic}${todayLesson.companion_lesson ? ` + ${todayLesson.companion_lesson.topic}` : ""}`}
        action={
          <Link className="primary-button" href="/questoes">
            Abrir banco de questoes
          </Link>
        }
      />

      <section className="cards-grid">
        <Card title={todayLesson.lesson.title} subtitle={`Bloco principal • ${todayLesson.lesson.subject} • ${todayLesson.lesson.estimated_time.total_min} min`}>
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
              <strong>Meta do bloco</strong>
              <p>{todayLesson.lesson.questions} questoes</p>
            </div>
          </div>
        </Card>

        {todayLesson.companion_lesson ? (
          <Card title={todayLesson.companion_lesson.title} subtitle={`Bloco complementar • ${todayLesson.companion_lesson.subject} • ${todayLesson.companion_lesson.estimated_time.total_min} min`}>
            <div className="list">
              <div>
                <strong>Subtopico</strong>
                <p>{todayLesson.companion_lesson.subtopic}</p>
              </div>
              <div>
                <strong>Fonte de questoes</strong>
                <p>{todayLesson.companion_lesson.question_source}</p>
              </div>
              <div>
                <strong>Meta do bloco</strong>
                <p>{todayLesson.companion_lesson.questions} questoes</p>
              </div>
            </div>
          </Card>
        ) : null}

        <Card title="Sequencia da semana" subtitle="A semana ativa alterna Instrumentacao com Portugues e Matematica.">
          <div className="list">
            {schedule?.map((entry) => (
              <div className="list-item" key={`${entry.day_number}-${entry.dateLabel}`}>
                <div>
                  <strong>{entry.day}</strong>
                  <p>
                    {entry.dateLabel} • {entry.lesson.title}
                    {entry.companion_lesson ? ` + ${entry.companion_lesson.title}` : ""}
                  </p>
                </div>
                <span className="badge">{entry.isToday ? "Hoje" : entry.isPast ? "Feito" : "Proximo"}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="cards-grid">
        <Card title={`Videoaulas - ${todayLesson.lesson.subject}`} subtitle="Links prontos para abrir no YouTube.">
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

        {todayLesson.companion_lesson ? (
          <Card title={`Videoaulas - ${todayLesson.companion_lesson.subject}`} subtitle="Segundo bloco do dia.">
            <div className="list">
              {todayLesson.companion_lesson.videos.map((video) => (
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
        ) : null}

        <Card title={`Conceitos-chave - ${todayLesson.lesson.subject}`} subtitle="Pontos que voce precisa fixar hoje.">
          <div className="list">
            {todayLesson.lesson.key_concepts.map((item) => (
              <div className="list-item" key={item}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </Card>

        {todayLesson.companion_lesson ? (
          <Card title={`Conceitos-chave - ${todayLesson.companion_lesson.subject}`} subtitle="Resumo do bloco complementar.">
            <div className="list">
              {todayLesson.companion_lesson.key_concepts.map((item) => (
                <div className="list-item" key={item}>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <Card title={`Checklist - ${todayLesson.lesson.subject}`} subtitle="Roteiro objetivo do bloco principal.">
          <div className="list">
            {todayLesson.lesson.checklist.map((item) => (
              <div className="list-item" key={item}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </Card>

        {todayLesson.companion_lesson ? (
          <Card title={`Checklist - ${todayLesson.companion_lesson.subject}`} subtitle="Roteiro do bloco complementar.">
            <div className="list">
              {todayLesson.companion_lesson.checklist.map((item) => (
                <div className="list-item" key={item}>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <Card title={`Pegadinhas - ${todayLesson.lesson.subject}`} subtitle="Pontos de erro classico que merecem atencao.">
          <div className="list">
            {todayLesson.lesson.pitfalls.map((item) => (
              <div className="list-item" key={item}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </Card>

        {todayLesson.companion_lesson ? (
          <Card title={`Pegadinhas - ${todayLesson.companion_lesson.subject}`} subtitle="Erros classicos do segundo bloco do dia.">
            <div className="list">
              {todayLesson.companion_lesson.pitfalls.map((item) => (
                <div className="list-item" key={item}>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <Card title={`Revisao - ${todayLesson.lesson.subject}`} subtitle="Retomadas programadas do bloco principal.">
          <div className="list">
            {todayLesson.lesson.review.length ? (
              todayLesson.lesson.review.map((item) => (
                <div className="list-item" key={item}>
                  <strong>{item}</strong>
                </div>
              ))
            ) : (
              <p>Nenhuma revisao curta cadastrada para este bloco.</p>
            )}
          </div>
        </Card>

        {todayLesson.companion_lesson ? (
          <Card title={`Revisao - ${todayLesson.companion_lesson.subject}`} subtitle="Retomadas do bloco complementar.">
            <div className="list">
              {todayLesson.companion_lesson.review.length ? (
                todayLesson.companion_lesson.review.map((item) => (
                  <div className="list-item" key={item}>
                    <strong>{item}</strong>
                  </div>
                ))
              ) : (
                <p>Nenhuma revisao curta cadastrada para este bloco.</p>
              )}
            </div>
          </Card>
        ) : null}

        <Card title={`Itens da prova - ${todayLesson.lesson.subject}`} subtitle="Questoes oficiais relacionadas ao bloco principal.">
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
              <p>Nenhum item da prova foi vinculado a este bloco.</p>
            )}
          </div>
        </Card>

        {todayLesson.companion_lesson ? (
          <Card title={`Itens da prova - ${todayLesson.companion_lesson.subject}`} subtitle="Questoes oficiais relacionadas ao bloco complementar.">
            <div className="list">
              {companionQuestions.length ? (
                companionQuestions.map((question) => (
                  <div className="list-item" key={question.id}>
                    <div>
                      <strong>Item {question.itemNumber}</strong>
                      <p>{question.statement}</p>
                    </div>
                    <span className="badge">{question.isAnnulled ? "Anulada" : question.correctAnswer ? "Certo" : "Errado"}</span>
                  </div>
                ))
              ) : (
                <p>Nenhum item da prova foi vinculado a este bloco.</p>
              )}
            </div>
            <div className="cta-row" style={{ marginTop: 16 }}>
              <Link className="primary-button" href="/questoes">
                Resolver questoes
              </Link>
            </div>
          </Card>
        ) : (
          <Card title="Banco de questoes" subtitle="Acesse o banco completo para continuar o treino do dia.">
            <div className="cta-row">
              <Link className="primary-button" href="/questoes">
                Resolver questoes
              </Link>
            </div>
          </Card>
        )}
      </section>
    </>
  );
}
