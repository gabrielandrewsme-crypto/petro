import { updateExamDateAction, updateGoalProgressAction } from "@/actions/app";
import { Card, ProgressBar, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";

export default async function CronogramaPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);

  return (
    <>
      <SectionHeader
        title="Cronograma"
        description="Semanal, mensal e plano de 100 dias com recalculo automático pela data da prova."
      />

      <section className="cards-grid">
        <Card title="Plano de 100 dias" subtitle={`${data.schedules.remainingDays} dias restantes até a prova.`}>
          <form action={updateExamDateAction} className="form-grid two-columns">
            <label>
              <span>Data da prova</span>
              <input name="examDate" type="date" defaultValue={data.user.examDate?.toISOString().slice(0, 10) ?? ""} />
            </label>
            <div className="cta-row" style={{ alignItems: "end" }}>
              <button className="primary-button" type="submit">
                Recalcular plano
              </button>
            </div>
          </form>

          <div className="table-wrap" style={{ marginTop: 18 }}>
            <table>
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>Bloco</th>
                  <th>Prazo</th>
                  <th>Progresso</th>
                </tr>
              </thead>
              <tbody>
                {data.schedules.plan100.slice(0, 12).map((goal) => (
                  <tr key={goal.id}>
                    <td>{goal.title}</td>
                    <td>{goal.description}</td>
                    <td>{goal.dueDate ? new Date(goal.dueDate).toLocaleDateString("pt-BR") : "-"}</td>
                    <td>
                      <form action={updateGoalProgressAction} className="cta-row">
                        <input name="goalId" type="hidden" value={goal.id} />
                        <input name="progress" type="number" min="0" max="100" defaultValue={goal.progress} />
                        <button className="secondary-button" type="submit">
                          Atualizar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Cronograma semanal" subtitle="Base fixa para manter cadência de disciplinas.">
          <div className="list">
            {data.schedules.weekly.map((goal) => (
              <div className="list-item" key={goal.id}>
                <div>
                  <strong>{goal.title}</strong>
                  <p>{goal.description}</p>
                </div>
                <span className="badge">{goal.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card title="Metas mensais" subtitle="Visão por semana com barra de progresso.">
        <div className="cards-grid">
          {data.schedules.monthly.map((goal) => (
            <div className="panel" key={goal.id}>
              <div className="panel-heading">
                <h2>{goal.title}</h2>
                <p>{goal.description}</p>
              </div>
              <ProgressBar value={goal.progress} tone="green" />
              <form action={updateGoalProgressAction} className="form-grid" style={{ marginTop: 12 }}>
                <input name="goalId" type="hidden" value={goal.id} />
                <input name="progress" type="number" min="0" max="100" defaultValue={goal.progress} />
                <button className="secondary-button" type="submit">
                  Salvar progresso
                </button>
              </form>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
