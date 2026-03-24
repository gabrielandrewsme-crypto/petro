import { completeReviewAction, rescheduleReviewAction } from "@/actions/app";
import { Card, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/data";

export default async function RevisoesPage() {
  const user = await requireUser();
  const data = await getAppData(user.id);
  const reviewsToday = data.reviews.filter((review) => review.status === "PENDING");

  return (
    <>
      <SectionHeader title="Revisões" description="Sistema automático de 1, 7, 15 e 30 dias." />

      <Card title="Lista de revisões do dia" subtitle="Marque como revisado ou reagende quando necessário.">
        {reviewsToday.length ? (
          <div className="list">
            {reviewsToday.map((review) => (
              <div className="list-item" key={review.id}>
                <div>
                  <strong>{review.topic}</strong>
                  <p>
                    {review.subject?.name ?? "Sem disciplina"} • revisão D+{review.intervalDays} • vence em{" "}
                    {new Date(review.dueDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="cta-row">
                  <form action={completeReviewAction}>
                    <input name="reviewId" type="hidden" value={review.id} />
                    <button className="primary-button" type="submit">
                      Revisado
                    </button>
                  </form>
                  <form action={rescheduleReviewAction} className="cta-row">
                    <input name="reviewId" type="hidden" value={review.id} />
                    <input name="dueDate" type="date" required />
                    <button className="secondary-button" type="submit">
                      Reagendar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">Nenhuma revisão pendente.</div>
        )}
      </Card>
    </>
  );
}
