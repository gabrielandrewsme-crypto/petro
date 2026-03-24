import { addQuestionLogAction } from "@/actions/app";
import { Card, MiniBarChart, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";

export default async function QuestoesPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);

  return (
    <>
      <SectionHeader title="Questões" description="Registro de desempenho, padrão Cebraspe e análise de erros." />

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

        <Card title="Gráficos" subtitle="Leitura rápida do seu desempenho.">
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
        <Card title="Erros mais frequentes" subtitle="Assuntos que merecem revisão imediata.">
          <div className="list">
            {data.charts.errorFrequency.map((item) => (
              <div className="list-item" key={`${item.discipline}-${item.topic}`}>
                <div>
                  <strong>{item.topic}</strong>
                  <p>{item.discipline}</p>
                </div>
                <span className="badge">{item.wrongAnswers} erros</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Histórico" subtitle="Registros recentes de questões.">
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
                {data.questionLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.discipline}</td>
                    <td>{log.topic}</td>
                    <td>{log.quantity}</td>
                    <td>{log.correctAnswers}</td>
                    <td>{log.wrongAnswers}</td>
                    <td>{log.accuracyRate.toFixed(1)}%</td>
                    <td>{log.liquidScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </>
  );
}
