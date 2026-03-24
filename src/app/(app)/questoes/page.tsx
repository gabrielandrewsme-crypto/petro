import { addQuestionLogAction, answerQuestionBankAction } from "@/actions/app";
import { Card, MiniBarChart, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function QuestoesPage({ searchParams }: { searchParams?: SearchParams }) {
  const user = await requireUser();
  const data = await getAppData(user.id);
  const params = (await searchParams) ?? {};
  const moduleFilter = readParam(params.module);
  const topicFilter = readParam(params.topic);
  const statusFilter = readParam(params.status);

  const importedQuestions = data.questionBank.questions.filter((question) => {
    if (moduleFilter && question.module !== moduleFilter) {
      return false;
    }
    if (topicFilter && question.topicSlug !== topicFilter) {
      return false;
    }
    if (statusFilter === "pending" && question.answered) {
      return false;
    }
    if (statusFilter === "wrong" && question.wrong === 0) {
      return false;
    }
    if (statusFilter === "correct" && (!question.lastAttempt || !question.lastAttempt.isCorrect)) {
      return false;
    }
    return true;
  });

  const topicOptions = [...new Map(data.questionBank.questions.map((question) => [question.topicSlug, question.topicTitle])).entries()];

  return (
    <>
      <SectionHeader title="Questões" description="Registro manual, banco real das provas e treino certo/errado no padrão Cebraspe." />

      <section className="two-column-layout">
        <Card title="Registrar bateria" subtitle="A nota líquida é calculada como acertos menos erros.">
          <form action={addQuestionLogAction} className="form-grid two-columns">
            <label>
              <span>Disciplina</span>
              <input name="discipline" placeholder="Instrumentação" required />
            </label>
            <label>
              <span>Assunto</span>
              <input name="topic" placeholder="Válvulas de controle" required />
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
            <label>
              <span>Quantidade</span>
              <input name="quantity" type="number" defaultValue="20" required />
            </label>
            <label>
              <span>Acertos</span>
              <input name="correctAnswers" type="number" defaultValue="14" required />
            </label>
            <label>
              <span>Erros</span>
              <input name="wrongAnswers" type="number" defaultValue="6" required />
            </label>
            <button className="primary-button" type="submit">
              Salvar desempenho
            </button>
          </form>
        </Card>

        <Card title="Gráficos" subtitle="Leitura rápida do seu desempenho geral.">
          <div className="list">
            <div>
              <strong>Desempenho por matéria</strong>
              <MiniBarChart
                items={data.charts.performanceBySubject.map((item) => ({
                  label: item.subject,
                  value: item.accuracy,
                  color: item.color,
                }))}
              />
            </div>
            <div>
              <strong>Evolução semanal</strong>
              <MiniBarChart
                items={data.charts.weeklyEvolution.map((item) => ({
                  label: item.label,
                  value: item.liquidScore,
                }))}
                type="number"
              />
            </div>
          </div>
        </Card>
      </section>

      <section className="cards-grid">
        <Card title="Banco importado" subtitle="Questões extraídas das provas enviadas e integradas ao app.">
          <div className="list">
            <div className="list-item">
              <div>
                <strong>Total disponível</strong>
                <p>Português, Matemática e Instrumentação</p>
              </div>
              <span className="badge">{data.questionBank.stats.total}</span>
            </div>
            <div className="list-item">
              <div>
                <strong>Respondidas</strong>
                <p>Itens já marcados por você</p>
              </div>
              <span className="badge">{data.questionBank.stats.answered}</span>
            </div>
            <div className="list-item">
              <div>
                <strong>Taxa atual</strong>
                <p>Acertos no banco importado</p>
              </div>
              <span className="badge">
                {data.questionBank.stats.answered > 0
                  ? `${((data.questionBank.stats.correct / data.questionBank.stats.answered) * 100).toFixed(0)}%`
                  : "0%"}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Desempenho por prova" subtitle="Distribuição dos itens importados e sua taxa por disciplina.">
          <MiniBarChart
            items={data.questionBank.stats.byDiscipline.map((item) => ({
              label: `${item.label} (${item.total})`,
              value: item.accuracyRate,
            }))}
          />
        </Card>

        <Card title="Tópicos com mais erro" subtitle="Baseado apenas nas questões do banco importado.">
          <div className="list">
            {data.questionBank.stats.topTopics.length ? (
              data.questionBank.stats.topTopics.map((item) => (
                <div className="list-item" key={item.topic}>
                  <div>
                    <strong>{item.topic}</strong>
                    <p>{moduleLabel(item.module)}</p>
                  </div>
                  <span className="badge">{item.wrong} erros</span>
                </div>
              ))
            ) : (
              <p>Nenhum erro registrado ainda.</p>
            )}
          </div>
        </Card>
      </section>

      <section className="cards-grid">
        <Card title="Erros mais frequentes" subtitle="Assuntos que merecem revisão imediata.">
          <div className="list">
            {data.charts.errorFrequency.length ? (
              data.charts.errorFrequency.map((item) => (
                <div className="list-item" key={`${item.discipline}-${item.topic}`}>
                  <div>
                    <strong>{item.topic}</strong>
                    <p>{item.discipline}</p>
                  </div>
                  <span className="badge">{item.wrongAnswers} erros</span>
                </div>
              ))
            ) : (
              <p>Nenhum registro manual ainda.</p>
            )}
          </div>
        </Card>

        <Card title="Histórico manual" subtitle="Registros recentes de baterias de questões.">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Disciplina</th>
                  <th>Assunto</th>
                  <th>Qtd</th>
                  <th>Acertos</th>
                  <th>Erros</th>
                  <th>Taxa</th>
                  <th>Nota líquida</th>
                </tr>
              </thead>
              <tbody>
                {data.questionLogs.length ? (
                  data.questionLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.discipline}</td>
                      <td>{log.topic}</td>
                      <td>{log.quantity}</td>
                      <td>{log.correctAnswers}</td>
                      <td>{log.wrongAnswers}</td>
                      <td>{log.accuracyRate.toFixed(1)}%</td>
                      <td>{log.liquidScore}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>Nenhuma bateria manual registrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <Card title="Questões das provas" subtitle="Treine diretamente com os itens importados do Cebraspe e alimente a revisão automática ao errar.">
        <form className="form-grid four-columns">
          <label>
            <span>Disciplina</span>
            <select name="module" defaultValue={moduleFilter}>
              <option value="">Todas</option>
              <option value="PORTUGUES">Português</option>
              <option value="MATEMATICA">Matemática</option>
              <option value="INSTRUMENTACAO">Instrumentação</option>
            </select>
          </label>
          <label>
            <span>Tópico</span>
            <select name="topic" defaultValue={topicFilter}>
              <option value="">Todos</option>
              {topicOptions.map(([slug, title]) => (
                <option key={slug} value={slug}>
                  {title}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select name="status" defaultValue={statusFilter}>
              <option value="">Todos</option>
              <option value="pending">Não respondidas</option>
              <option value="wrong">Com erro</option>
              <option value="correct">Última correta</option>
            </select>
          </label>
          <button className="primary-button" type="submit">
            Filtrar
          </button>
        </form>

        <div className="list" style={{ marginTop: 24 }}>
          {importedQuestions.slice(0, 30).map((question) => (
            <div className="panel" key={question.id}>
              <div className="chip-row">
                <span className="chip">Item {question.itemNumber}</span>
                <span className="chip">{moduleLabel(question.module)}</span>
                <span className="chip">{question.topicTitle}</span>
                <span className="chip">{question.examTitle}</span>
                <span className="chip">
                  {question.isAnnulled ? "Anulada" : `Gabarito: ${question.correctAnswer ? "Certo" : "Errado"}`}
                </span>
              </div>
              <p style={{ marginTop: 12 }}>{question.statement}</p>
              {question.lastAttempt ? (
                <p style={{ marginTop: 12 }}>
                  <strong>Última resposta:</strong> {question.lastAttempt.answer ? "Certo" : "Errado"} ·{" "}
                  {question.lastAttempt.isCorrect ? "acertou" : "errou"} · taxa {question.accuracyRate.toFixed(0)}%
                </p>
              ) : (
                <p style={{ marginTop: 12 }}>Ainda não respondida.</p>
              )}

              {!question.isAnnulled ? (
                <div className="action-row" style={{ marginTop: 16 }}>
                  <form action={answerQuestionBankAction}>
                    <input type="hidden" name="questionId" value={question.id} />
                    <input type="hidden" name="answer" value="true" />
                    <button className="primary-button" type="submit">
                      Marcar certo
                    </button>
                  </form>
                  <form action={answerQuestionBankAction}>
                    <input type="hidden" name="questionId" value={question.id} />
                    <input type="hidden" name="answer" value="false" />
                    <button className="secondary-button" type="submit">
                      Marcar errado
                    </button>
                  </form>
                </div>
              ) : (
                <p style={{ marginTop: 16 }}>Item anulado. Não entra no treino nem na revisão.</p>
              )}
            </div>
          ))}

          {!importedQuestions.length ? <p>Nenhuma questão encontrada com esse filtro.</p> : null}
        </div>
      </Card>
    </>
  );
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function moduleLabel(module: string) {
  if (module === "INSTRUMENTACAO") {
    return "Instrumentação";
  }
  if (module === "MATEMATICA") {
    return "Matemática";
  }
  return "Português";
}
