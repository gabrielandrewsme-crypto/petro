import { addDays } from "date-fns";
import { createGoalRecord, createIndustrialTopicRecord, createMaterialRecord, createMockExamRecord, createQuestionLogRecord, createReviewRecord, createStudyDayRecord, createSubjectRecord, createTrapQuestionRecord, createVideoLessonRecord, mutateDb } from "@/lib/db";
import { instrumentationBlocks, mathematicsTopics, portugueseTopics } from "@/lib/instrumentation-module";
import { trapQuestionsSeed } from "@/lib/trap-module";
import { GoalStatus, GoalType, MaterialType, ReviewStatus, TopicModule, TopicStatus, VideoCategory } from "@/lib/types";

const subjects = [
  { name: "Sensores", category: "Instrumentação", description: "Sensores de processo, transmissores e aplicações.", color: "#f2c94c" },
  { name: "Válvulas", category: "Instrumentação", description: "Válvulas de controle, atuadores e posicionadores.", color: "#2d9cdb" },
  { name: "Metrologia", category: "Instrumentação", description: "Calibração, erro, incerteza e rastreabilidade.", color: "#56ccf2" },
  { name: "CLP", category: "Instrumentação", description: "Controladores lógicos programáveis e automação.", color: "#1f6feb" },
  { name: "PID", category: "Instrumentação", description: "Malhas de controle, sintonia e estabilidade.", color: "#f2994a" },
  { name: "Matemática", category: "Base", description: "Porcentagem, razão, álgebra e interpretação de gráficos.", color: "#27ae60" },
  { name: "Português", category: "Base", description: "Gramática, interpretação e estilo Cebraspe.", color: "#9b51e0" },
];

const weeklyPlan = [
  "Sensores + Português + Questões",
  "Válvulas + Matemática + Questões",
  "Metrologia + Português + Questões",
  "CLP + Matemática + Questões",
  "PID + Revisão + Questões",
  "Simulado",
  "Revisão leve",
];

export async function seedUserData(userId: string, examDate?: Date | null) {
  await mutateDb((data) => {
    const hasSubjects = data.subjects.some((subject) => subject.userId === userId);

    let createdSubjects = data.subjects.filter((subject) => subject.userId === userId);
    if (!hasSubjects) {
      createdSubjects = subjects.map((subject) =>
        createSubjectRecord({
          userId,
          ...subject,
        }),
      );
      data.subjects.push(...createdSubjects);
    }

    const subjectMap = new Map(createdSubjects.map((subject) => [subject.name, subject.id]));

    if (!data.industrial_topics.some((topic) => topic.userId === userId && topic.module === TopicModule.INSTRUMENTACAO)) {
      const createdTopics = instrumentationBlocks.flatMap((block) =>
        block.topics.map((topic) =>
          createIndustrialTopicRecord({
            userId,
            module: TopicModule.INSTRUMENTACAO,
            block: block.name,
            slug: topic.slug,
            title: topic.title,
            description: topic.description,
            status: TopicStatus.NOT_STARTED,
            priority: topic.priority,
          }),
        ),
      );
      data.industrial_topics.push(...createdTopics);

      const instrumentacaoSubjectId = subjectMap.get("Sensores") ?? null;
      const topicMap = new Map(createdTopics.map((topic) => [topic.slug, topic.id]));

      data.video_lessons.push(
        ...instrumentationBlocks.flatMap((block) =>
          block.topics.flatMap((topic) =>
            topic.links.map((link) =>
              createVideoLessonRecord({
                userId,
                subjectId: instrumentacaoSubjectId,
                topicId: topicMap.get(topic.slug) ?? null,
                title: `${topic.title}: ${link.title}`,
                url: link.url,
                category: VideoCategory.INSTRUMENTACAO,
                watched: false,
                favorite: false,
              }),
            ),
          ),
        ),
      );
    }

    if (!data.industrial_topics.some((topic) => topic.userId === userId && topic.module === TopicModule.MATEMATICA)) {
      const matematicaSubjectId = subjectMap.get("Matemática") ?? null;
      const mathTopics = mathematicsTopics.map((topic) =>
        createIndustrialTopicRecord({
          userId,
          module: TopicModule.MATEMATICA,
          block: "BLOCO I",
          slug: topic.slug,
          title: topic.title,
          description: topic.description,
          status: TopicStatus.NOT_STARTED,
          priority: topic.priority,
        }),
      );
      data.industrial_topics.push(...mathTopics);

      const mathMap = new Map(mathTopics.map((topic) => [topic.slug, topic.id]));
      data.video_lessons.push(
        ...mathematicsTopics.flatMap((topic) =>
          topic.links.map((link) =>
            createVideoLessonRecord({
              userId,
              subjectId: matematicaSubjectId,
              topicId: mathMap.get(topic.slug) ?? null,
              title: `${topic.title}: ${link.title}`,
              url: link.url,
              category: VideoCategory.MATEMATICA,
              watched: false,
              favorite: false,
            }),
          ),
        ),
      );
    }

    if (!data.industrial_topics.some((topic) => topic.userId === userId && topic.module === TopicModule.PORTUGUES)) {
      const portuguesSubjectId = subjectMap.get("Português") ?? null;
      const ptTopics = portugueseTopics.map((topic) =>
        createIndustrialTopicRecord({
          userId,
          module: TopicModule.PORTUGUES,
          block: "BLOCO I",
          slug: topic.slug,
          title: topic.title,
          description: topic.description,
          status: TopicStatus.NOT_STARTED,
          priority: topic.priority,
        }),
      );
      data.industrial_topics.push(...ptTopics);

      const ptMap = new Map(ptTopics.map((topic) => [topic.slug, topic.id]));
      data.video_lessons.push(
        ...portugueseTopics.flatMap((topic) =>
          topic.links.map((link) =>
            createVideoLessonRecord({
              userId,
              subjectId: portuguesSubjectId,
              topicId: ptMap.get(topic.slug) ?? null,
              title: `${topic.title}: ${link.title}`,
              url: link.url,
              category: VideoCategory.PORTUGUES,
              watched: false,
              favorite: false,
            }),
          ),
        ),
      );
    }

    if (!data.trap_questions.some((item) => item.userId === userId)) {
      data.trap_questions.push(
        ...trapQuestionsSeed.map((trap) =>
          createTrapQuestionRecord({
            userId,
            ...trap,
          }),
        ),
      );
    }

    if (hasSubjects) {
      return;
    }

    data.goals.push(
      ...weeklyPlan.map((description, index) =>
        createGoalRecord({
          userId,
          title: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"][index],
          description,
          type: GoalType.WEEKLY,
          weekLabel: "Cronograma semanal",
          status: index === 0 ? GoalStatus.ACTIVE : GoalStatus.PENDING,
          progress: 0,
          targetValue: 100,
          dueDate: null,
        }),
      ),
    );

    data.goals.push(
      ...Array.from({ length: 4 }, (_, index) =>
        createGoalRecord({
          userId,
          title: `Semana ${index + 1}`,
          description: [
            "Fundamentos de sensores, pressão, temperatura, interpretação textual e frações.",
            "Válvulas, atuadores, porcentagem, concordância e Cebraspe.",
            "Metrologia, equações, análise sintática e revisão 1-7-15.",
            "CLP, PID, simulados e fechamento do mês.",
          ][index],
          type: GoalType.MONTHLY,
          weekLabel: `Semana ${index + 1}`,
          progress: index === 0 ? 25 : 0,
          targetValue: 100,
          status: index === 0 ? GoalStatus.ACTIVE : GoalStatus.PENDING,
          dueDate: null,
        }),
      ),
    );

    const baseDate = new Date();
    data.goals.push(
      ...Array.from({ length: 100 }, (_, index) => {
        const dayNumber = index + 1;
        const block = dayNumber <= 45 ? "Instrumentação" : dayNumber <= 75 ? "Matemática" : "Português";
        return createGoalRecord({
          userId,
          title: `Dia ${dayNumber}`,
          description: `${block}: teoria, revisão espaçada e bateria de questões.`,
          type: GoalType.PLAN_100,
          dayNumber,
          dueDate: (examDate ? addDays(examDate, dayNumber - 100) : addDays(baseDate, index)).toISOString(),
          progress: dayNumber <= 3 ? 100 : 0,
          targetValue: 100,
          status: dayNumber <= 3 ? GoalStatus.COMPLETED : dayNumber === 4 ? GoalStatus.ACTIVE : GoalStatus.PENDING,
        });
      }),
    );

    data.study_days.push(
      createStudyDayRecord({
        userId,
        subjectId: subjectMap.get("Sensores") ?? null,
        date: new Date().toISOString(),
        topic: "Sensores de pressão e temperatura",
        plannedHours: 3,
        studiedHours: 1.5,
        questionsSolved: 12,
        notes: "Faltou revisar RTD e termopar.",
      }),
      createStudyDayRecord({
        userId,
        subjectId: subjectMap.get("Português") ?? null,
        date: addDays(new Date(), -1).toISOString(),
        topic: "Interpretação textual e inferência",
        plannedHours: 2,
        studiedHours: 2,
        questionsSolved: 10,
        notes: "Bom desempenho nas questões de autoria.",
      }),
    );

    data.review_system.push(
      ...[1, 7, 15, 30].map((intervalDays) =>
        createReviewRecord({
          userId,
          subjectId: subjectMap.get("Sensores") ?? null,
          topic: "Sensores de pressão e temperatura",
          dueDate: addDays(new Date(), intervalDays).toISOString(),
          intervalDays,
          sourceStudyDay: null,
          status: ReviewStatus.PENDING,
          reviewedAt: null,
        }),
      ),
    );

    data.question_logs.push(
      createQuestionLogRecord({
        userId,
        subjectId: subjectMap.get("Sensores") ?? null,
        discipline: "Instrumentação",
        topic: "Sensores",
        quantity: 15,
        correctAnswers: 11,
        wrongAnswers: 4,
        accuracyRate: 73.33,
        liquidScore: 7,
      }),
      createQuestionLogRecord({
        userId,
        subjectId: subjectMap.get("Português") ?? null,
        discipline: "Português",
        topic: "Interpretação",
        quantity: 10,
        correctAnswers: 8,
        wrongAnswers: 2,
        accuracyRate: 80,
        liquidScore: 6,
      }),
    );

    data.mock_exams.push(
      createMockExamRecord({
        userId,
        title: "Simulado de largada",
        questionCount: 50,
        durationMinutes: 150,
        correctAnswers: 32,
        wrongAnswers: 18,
        liquidScore: 14,
        completedAt: addDays(new Date(), -3).toISOString(),
      }),
    );

    data.video_lessons.push(
      createVideoLessonRecord({
        userId,
        subjectId: subjectMap.get("Sensores") ?? null,
        title: "Sensores industriais para Petrobras",
        url: "https://www.youtube.com/watch?v=7ehJ7gM4Z34",
        category: VideoCategory.INSTRUMENTACAO,
        watched: false,
        favorite: false,
      }),
      createVideoLessonRecord({
        userId,
        subjectId: subjectMap.get("Matemática") ?? null,
        title: "Matemática de concurso em questões",
        url: "https://www.youtube.com/watch?v=pM8A0B_8X68",
        category: VideoCategory.MATEMATICA,
        watched: false,
        favorite: false,
      }),
      createVideoLessonRecord({
        userId,
        subjectId: subjectMap.get("Português") ?? null,
        title: "Português Cebraspe sem enrolação",
        url: "https://www.youtube.com/watch?v=FMBLQfL3Hxo",
        category: VideoCategory.PORTUGUES,
        watched: false,
        favorite: false,
      }),
    );

    data.materials.push(
      createMaterialRecord({
        userId,
        title: "Resumo PDF de metrologia",
        type: MaterialType.PDF,
        url: "https://example.com/metrologia.pdf",
        notes: "Usar na revisão 7 e 15.",
      }),
      createMaterialRecord({
        userId,
        title: "Portal Petrobras",
        type: MaterialType.LINK,
        url: "https://www.petrobras.com.br",
        notes: "Acompanhar editais e comunicados.",
      }),
      createMaterialRecord({
        userId,
        title: "Anotações de revisão",
        type: MaterialType.NOTE,
        url: null,
        notes: "Foco em sensores, válvulas e interpretação.",
      }),
    );
  });
}
