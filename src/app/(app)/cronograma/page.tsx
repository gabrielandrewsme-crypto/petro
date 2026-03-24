import Link from "next/link";
import { updateExamDateAction, updateGoalProgressAction } from "@/actions/app";
import { Card, ProgressBar, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";
import { getActiveWeekSchedule, getTodayLesson } from "@/lib/weekly-content";

export default async function CronogramaPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);
  const activeWeek = getActiveWeekSchedule();
  const todayLesson = getTodayLesson();

  return (
    <>
      <SectionHeader title="Cronograma" description="Semanal, mensal e plano de 100 dias com recalculo automatico pela data da prova." />

      <section className="cards-grid">
        <Card title="Semana ativa do agent" subtitle="Conteudo semanal carregado do creator content petro com datas reais.">
          {activeWeek?.length ? (
            <div className="list">
              {activeWeek.map((entry) => (
                <div className="list-item" key={`${entry.day_number}-${entry.dateLabel}`}>
                  <div>
                    <strong>
                      {entry.calendarDayLabel} • {entry.dateLabel}
                    </strong>
                    <p>
                      {entry.lesson.title}
                      {entry.companion_lesson ? ` + ${entry.companion_lesson.title}` : ""}
                    </p>
                  </div>
                  <span className="badge">{entry.isToday ? "Hoje" : entry.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Nenhuma semana ativa para a data atual.</div>
          )}
        </Card>

        <Card title="Pacote de hoje" subtitle={todayLesson ? "Checklist, videoaulas e itens da prova ja definidos." : "Aguardando ativacao de uma semana."}>
          {todayLesson ? (
            <div className="list">
              <div className="list-item">
                <div>
                  <strong>{todayLesson.lesson.subject}: {todayLesson.lesson.title}</strong>
                  <p>{todayLesson.lesson.subtopic}</p>
                </div>
                <span className="badge">{todayLesson.lesson.questions} questoes</span>
              </div>
              {todayLesson.companion_lesson ? (
                <div className="list-item">
                  <div>
                    <strong>{todayLesson.companion_lesson.subject}: {todayLesson.companion_lesson.title}</strong>
                    <p>{todayLesson.companion_lesson.subtopic}</p>
                  </div>
                  <span className="badge">{todayLesson.companion_lesson.questions} questoes</span>
                </div>
              ) : null}
              <div className="list-item">
                <div>
                  <strong>Videoaulas</strong>
                  <p>
                    {todayLesson.lesson.videos.length}
                    {todayLesson.companion_lesson ? ` + ${todayLesson.companion_lesson.videos.length}` : ""} links
                  </p>
                </div>
                <span className="badge">
                  {todayLesson.lesson.estimated_time.video_min + (todayLesson.companion_lesson?.estimated_time.video_min ?? 0)} min
                </span>
              </div>
              <div className="list-item">
                <div>
                  <strong>Itens oficiais</strong>
                  <p>
                    {[...todayLesson.lesson.prova_2023_items, ...(todayLesson.companion_lesson?.prova_2023_items ?? [])].join(", ") || "Sem itens oficiais no dia"}
                  </p>
                </div>
                <span className="badge">{todayLesson.calendarDayLabel}</span>
              </div>
              <div className="cta-row" style={{ marginTop: 16 }}>
                <Link className="primary-button" href="/estudo-hoje">
                  Abrir estudo de hoje
                </Link>
              </div>
            </div>
          ) : (
            <div className="empty-state">Nenhum material diario ativo.</div>
          )}
        </Card>

        <Card title="Plano de 100 dias" subtitle={`${data.schedules.remainingDays} dias restantes ate a prova.`}>
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

        <Card title="Cronograma semanal" subtitle="Base fixa para manter cadencia de disciplinas.">
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

      <Card title="Metas mensais" subtitle="Visao por semana com barra de progresso.">
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
