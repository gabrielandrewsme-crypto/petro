import { getAppData } from "@/lib/data";
import { getActiveWeekSchedule, getTodayLesson } from "@/lib/weekly-content";

export async function buildAssistantContext(userId: string) {
  const data = await getAppData(userId);
  const todayLesson = getTodayLesson();
  const schedule = getActiveWeekSchedule() ?? [];

  const todayBlocks = [
    todayLesson?.lesson
      ? {
          subject: todayLesson.lesson.subject,
          title: todayLesson.lesson.title,
          subtopic: todayLesson.lesson.subtopic,
          keyConcepts: todayLesson.lesson.key_concepts,
          pitfalls: todayLesson.lesson.pitfalls,
          videos: todayLesson.lesson.videos,
          questions: todayLesson.lesson.questions,
        }
      : null,
    todayLesson?.companion_lesson
      ? {
          subject: todayLesson.companion_lesson.subject,
          title: todayLesson.companion_lesson.title,
          subtopic: todayLesson.companion_lesson.subtopic,
          keyConcepts: todayLesson.companion_lesson.key_concepts,
          pitfalls: todayLesson.companion_lesson.pitfalls,
          videos: todayLesson.companion_lesson.videos,
          questions: todayLesson.companion_lesson.questions,
        }
      : null,
  ].filter(Boolean);

  return {
    userName: data.user.name,
    examDate: data.user.examDate,
    dashboard: {
      progressToday: Math.round(data.dashboard.progressToday),
      weeklyProgress: Math.round(data.dashboard.weeklyProgress),
      streak: data.dashboard.streak,
      pendingReviews: data.dashboard.reviewsPending,
      questionsToday: data.dashboard.questionsToday,
    },
    todayStudy: {
      date: todayLesson?.dateLabel ?? null,
      day: todayLesson?.calendarDayLabel ?? null,
      blocks: todayBlocks,
    },
    schedule: schedule.map((entry) => ({
      date: entry.dateLabel,
      day: entry.calendarDayLabel,
      main: `${entry.lesson.subject}: ${entry.lesson.title}`,
      companion: entry.companion_lesson ? `${entry.companion_lesson.subject}: ${entry.companion_lesson.title}` : null,
    })),
    reviews: data.reviews
      .filter((item) => item.status === "PENDING")
      .slice(0, 8)
      .map((item) => ({
        title: item.subject?.name ?? item.topic,
        dueDate: item.dueDate.toISOString(),
        topic: item.topic,
      })),
    performance: data.charts.performanceBySubject.map((item) => ({
      subject: item.subject,
      accuracy: Math.round(item.accuracy),
      total: item.total,
    })),
    recentErrors: data.charts.errorFrequency.slice(0, 5),
  };
}

export function buildAssistantInstructions(serializedContext: string) {
  return [
    "Voce e o Assistente especialista do Plano Petrobras Instrumentacao.",
    "Responda sempre em portugues do Brasil.",
    "Seu papel e explicar conteudos de Instrumentacao, Matematica e Portugues para o concurso da Petrobras, usando o contexto abaixo.",
    "Priorize explicacoes didaticas, objetivas e alinhadas ao estudo do usuario.",
    "Quando houver material do dia, use esse material como prioridade nas respostas.",
    "Se citar videoaulas, use apenas links que ja estejam no contexto.",
    "Se o usuario pedir estrategia, organize a resposta em passos praticos e curtos.",
    "Se a pergunta sair do escopo da plataforma, responda normalmente, mas deixe claro quando estiver inferindo.",
    `Contexto atual da plataforma: ${serializedContext}`,
  ].join(" ");
}
