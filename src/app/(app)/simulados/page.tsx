import { addMockExamAction } from "@/actions/app";
import { Card, MiniBarChart, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";

export default async function SimuladosPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);

  return (
    <>
      <SectionHeader title="Simulados" description="Controle de tempo, total de questões e evolução de nota líquida." />

      <section className="two-column-layout">
        <Card title="Novo simulado" subtitle="Registre resultados e acompanhe a curva de evolução.">
          <form action={addMockExamAction} className="form-grid two-columns">
            <label>
              <span>Título</span>
              <input name="title" placeholder="Simulado Petrobras 01" required />
            </label>
            <label>
              <span>Número de questões</span>
              <input name="questionCount" type="number" defaultValue="60" required />
            </label>
            <label>
              <span>Tempo (minutos)</span>
              <input name="durationMinutes" type="number" defaultValue="180" required />
            </label>
            <label>
              <span>Acertos</span>
              <input name="correctAnswers" type="number" defaultValue="40" required />
            </label>
            <label>
              <span>Erros</span>
              <input name="wrongAnswers" type="number" defaultValue="20" required />
            </label>
            <button className="primary-button" type="submit">
              Salvar simulado
            </button>
          </form>
        </Card>

        <Card title="Gráfico de evolução" subtitle="Nota líquida dos simulados registrados.">
          <MiniBarChart
            items={[...data.mockExams].reverse().map((exam) => ({
              label: new Date(exam.completedAt).toLocaleDateString("pt-BR"),
              value: exam.liquidScore,
            }))}
            type="number"
          />
        </Card>
      </section>

      <Card title="Histórico de simulados" subtitle="Acompanhe quantidade, tempo e desempenho.">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Título</th>
                <th>Questões</th>
                <th>Tempo</th>
                <th>Nota líquida</th>
              </tr>
            </thead>
            <tbody>
              {data.mockExams.map((exam) => (
                <tr key={exam.id}>
                  <td>{new Date(exam.completedAt).toLocaleDateString("pt-BR")}</td>
                  <td>{exam.title}</td>
                  <td>{exam.questionCount}</td>
                  <td>{exam.durationMinutes} min</td>
                  <td>{exam.liquidScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
