"use server";

import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createGoalRecord, createMaterialRecord, createMockExamRecord, createQuestionLogRecord, createReviewRecord, createStudyDayRecord, createTrapAttemptRecord, createVideoLessonRecord, mutateDb } from "@/lib/db";
import { GoalStatus, GoalType, MaterialType, ReviewStatus, TopicStatus, VideoCategory } from "@/lib/types";
import { liquidScore } from "@/lib/utils";

const studySchema = z.object({
  subjectId: z.string().min(1),
  topicId: z.string().optional(),
  topic: z.string().min(3),
  plannedHours: z.coerce.number().min(0.5),
  studiedHours: z.coerce.number().min(0),
  questionsSolved: z.coerce.number().min(0),
  notes: z.string().optional(),
});

export async function addStudySessionAction(formData: FormData) {
  const user = await requireUser();
  const parsed = studySchema.safeParse({
    subjectId: formData.get("subjectId"),
    topicId: formData.get("topicId") || undefined,
    topic: formData.get("topic"),
    plannedHours: formData.get("plannedHours"),
    studiedHours: formData.get("studiedHours"),
    questionsSolved: formData.get("questionsSolved"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    redirect("/dashboard?error=Registro inválido");
  }

  const study = createStudyDayRecord({
    userId: user.id,
    subjectId: parsed.data.subjectId,
    topicId: parsed.data.topicId || null,
    date: new Date().toISOString(),
    topic: parsed.data.topic,
    plannedHours: parsed.data.plannedHours,
    studiedHours: parsed.data.studiedHours,
    questionsSolved: parsed.data.questionsSolved,
    notes: parsed.data.notes,
  });

  await mutateDb((data) => {
    data.study_days.push(study);
    data.review_system.push(
      ...[1, 7, 15, 30].map((intervalDays) =>
        createReviewRecord({
          userId: user.id,
          subjectId: parsed.data.subjectId,
          topicId: parsed.data.topicId || null,
          topic: parsed.data.topic,
          sourceStudyDay: study.id,
          dueDate: addDays(new Date(), intervalDays).toISOString(),
          intervalDays,
          status: ReviewStatus.PENDING,
          reviewedAt: null,
        }),
      ),
    );

    if (parsed.data.topicId) {
      const topic = data.industrial_topics.find((item) => item.id === parsed.data.topicId && item.userId === user.id);
      if (topic && topic.status === TopicStatus.NOT_STARTED) {
        topic.status = TopicStatus.IN_PROGRESS;
        topic.updatedAt = new Date().toISOString();
      }
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/revisoes");
  revalidatePath("/instrumentacao-industrial");
  redirect("/dashboard");
}

export async function completeReviewAction(formData: FormData) {
  const user = await requireUser();
  const reviewId = String(formData.get("reviewId") ?? "");

  await mutateDb((data) => {
    const review = data.review_system.find((item) => item.id === reviewId && item.userId === user.id);
    if (review) {
      review.status = ReviewStatus.DONE;
      review.reviewedAt = new Date().toISOString();
      review.updatedAt = new Date().toISOString();
    }
  });

  revalidatePath("/revisoes");
}

export async function rescheduleReviewAction(formData: FormData) {
  const user = await requireUser();
  const reviewId = String(formData.get("reviewId") ?? "");
  const dueDate = String(formData.get("dueDate") ?? "");

  await mutateDb((data) => {
    const review = data.review_system.find((item) => item.id === reviewId && item.userId === user.id);
    if (review) {
      review.dueDate = new Date(dueDate).toISOString();
      review.status = ReviewStatus.RESCHEDULED;
      review.updatedAt = new Date().toISOString();
    }
  });

  revalidatePath("/revisoes");
}

const questionSchema = z.object({
  discipline: z.string().min(2),
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  topic: z.string().min(2),
  quantity: z.coerce.number().int().min(1),
  correctAnswers: z.coerce.number().int().min(0),
  wrongAnswers: z.coerce.number().int().min(0),
});

export async function addQuestionLogAction(formData: FormData) {
  const user = await requireUser();
  const parsed = questionSchema.safeParse({
    discipline: formData.get("discipline"),
    subjectId: formData.get("subjectId") || undefined,
    topicId: formData.get("topicId") || undefined,
    topic: formData.get("topic"),
    quantity: formData.get("quantity"),
    correctAnswers: formData.get("correctAnswers"),
    wrongAnswers: formData.get("wrongAnswers"),
  });

  if (!parsed.success) {
    redirect("/questoes?error=Dados inválidos");
  }

  const accuracyRate = parsed.data.quantity > 0 ? (parsed.data.correctAnswers / parsed.data.quantity) * 100 : 0;

  await mutateDb((data) => {
    data.question_logs.push(
      createQuestionLogRecord({
        userId: user.id,
        subjectId: parsed.data.subjectId || null,
        topicId: parsed.data.topicId || null,
        discipline: parsed.data.discipline,
        topic: parsed.data.topic,
        quantity: parsed.data.quantity,
        correctAnswers: parsed.data.correctAnswers,
        wrongAnswers: parsed.data.wrongAnswers,
        accuracyRate,
        liquidScore: liquidScore(parsed.data.correctAnswers, parsed.data.wrongAnswers),
      }),
    );

    if (parsed.data.topicId) {
      const topic = data.industrial_topics.find((item) => item.id === parsed.data.topicId && item.userId === user.id);
      if (topic && topic.status === TopicStatus.NOT_STARTED) {
        topic.status = TopicStatus.IN_PROGRESS;
        topic.updatedAt = new Date().toISOString();
      }
    }
  });

  revalidatePath("/questoes");
  revalidatePath("/dashboard");
  revalidatePath("/instrumentacao-industrial");
  redirect("/questoes");
}

const mockSchema = z.object({
  title: z.string().min(3),
  questionCount: z.coerce.number().int().min(1),
  durationMinutes: z.coerce.number().int().min(1),
  correctAnswers: z.coerce.number().int().min(0),
  wrongAnswers: z.coerce.number().int().min(0),
});

export async function addMockExamAction(formData: FormData) {
  const user = await requireUser();
  const parsed = mockSchema.safeParse({
    title: formData.get("title"),
    questionCount: formData.get("questionCount"),
    durationMinutes: formData.get("durationMinutes"),
    correctAnswers: formData.get("correctAnswers"),
    wrongAnswers: formData.get("wrongAnswers"),
  });

  if (!parsed.success) {
    redirect("/simulados?error=Simulado inválido");
  }

  await mutateDb((data) => {
    data.mock_exams.push(
      createMockExamRecord({
        userId: user.id,
        title: parsed.data.title,
        questionCount: parsed.data.questionCount,
        durationMinutes: parsed.data.durationMinutes,
        correctAnswers: parsed.data.correctAnswers,
        wrongAnswers: parsed.data.wrongAnswers,
        liquidScore: liquidScore(parsed.data.correctAnswers, parsed.data.wrongAnswers),
        completedAt: new Date().toISOString(),
      }),
    );
  });

  revalidatePath("/simulados");
  redirect("/simulados");
}

const videoSchema = z.object({
  title: z.string().min(3),
  url: z.url(),
  category: z.nativeEnum(VideoCategory),
  subjectId: z.string().optional(),
});

export async function addVideoLessonAction(formData: FormData) {
  const user = await requireUser();
  const parsed = videoSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    category: formData.get("category"),
    subjectId: formData.get("subjectId") || undefined,
  });

  if (!parsed.success) {
    redirect("/videoaulas?error=Videoaula inválida");
  }

  await mutateDb((data) => {
    data.video_lessons.push(
      createVideoLessonRecord({
        userId: user.id,
        subjectId: parsed.data.subjectId || null,
        title: parsed.data.title,
        url: parsed.data.url,
        category: parsed.data.category,
        watched: false,
        favorite: false,
      }),
    );
  });

  revalidatePath("/videoaulas");
  redirect("/videoaulas");
}

export async function toggleVideoStatusAction(formData: FormData) {
  const user = await requireUser();
  const videoId = String(formData.get("videoId") ?? "");
  const field = String(formData.get("field") ?? "");
  const current = String(formData.get("current") ?? "") === "true";

  await mutateDb((data) => {
    const video = data.video_lessons.find((item) => item.id === videoId && item.userId === user.id);
    if (video) {
      if (field === "favorite") {
        video.favorite = !current;
      } else {
        video.watched = !current;
      }
      video.updatedAt = new Date().toISOString();
    }
  });

  revalidatePath("/videoaulas");
}

const materialSchema = z.object({
  title: z.string().min(3),
  type: z.nativeEnum(MaterialType),
  url: z.string().optional(),
  notes: z.string().optional(),
});

export async function addMaterialAction(formData: FormData) {
  const user = await requireUser();
  const parsed = materialSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    url: formData.get("url"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    redirect("/materiais?error=Material inválido");
  }

  await mutateDb((data) => {
    data.materials.push(
      createMaterialRecord({
        userId: user.id,
        title: parsed.data.title,
        type: parsed.data.type,
        url: parsed.data.url || null,
        notes: parsed.data.notes || null,
      }),
    );
  });

  revalidatePath("/materiais");
  redirect("/materiais");
}

export async function updateExamDateAction(formData: FormData) {
  const user = await requireUser();
  const examDateRaw = String(formData.get("examDate") ?? "");
  const examDate = examDateRaw ? new Date(examDateRaw) : null;

  await mutateDb((data) => {
    const currentUser = data.users.find((item) => item.id === user.id);
    if (currentUser) {
      currentUser.examDate = examDate ? examDate.toISOString() : null;
      currentUser.updatedAt = new Date().toISOString();
    }

    data.goals
      .filter((goal) => goal.userId === user.id && goal.type === GoalType.PLAN_100)
      .forEach((goal) => {
        if (examDate) {
          goal.dueDate = addDays(examDate, (goal.dayNumber ?? 1) - 100).toISOString();
          goal.updatedAt = new Date().toISOString();
        }
      });
  });

  revalidatePath("/cronograma");
  revalidatePath("/dashboard");
  redirect("/cronograma");
}

export async function updateGoalProgressAction(formData: FormData) {
  const user = await requireUser();
  const goalId = String(formData.get("goalId") ?? "");
  const progress = Number(formData.get("progress") ?? 0);

  await mutateDb((data) => {
    const goal = data.goals.find((item) => item.id === goalId && item.userId === user.id);
    if (goal) {
      goal.progress = progress;
      goal.status = progress >= 100 ? GoalStatus.COMPLETED : progress > 0 ? GoalStatus.ACTIVE : GoalStatus.PENDING;
      goal.updatedAt = new Date().toISOString();
    }
  });

  revalidatePath("/cronograma");
}

export async function updateIndustrialTopicStatusAction(formData: FormData) {
  const user = await requireUser();
  const topicId = String(formData.get("topicId") ?? "");
  const status = String(formData.get("status") ?? "") as TopicStatus;

  await mutateDb((data) => {
    const topic = data.industrial_topics.find((item) => item.id === topicId && item.userId === user.id);
    if (topic) {
      topic.status = status;
      topic.updatedAt = new Date().toISOString();
    }
  });

  revalidatePath("/instrumentacao-industrial");
  revalidatePath("/dashboard");
}

export async function answerTrapQuestionAction(formData: FormData) {
  const user = await requireUser();
  const trapQuestionId = String(formData.get("trapQuestionId") ?? "");
  const answer = String(formData.get("answer") ?? "") === "true";

  await mutateDb((data) => {
    const question = data.trap_questions.find((item) => item.id === trapQuestionId && item.userId === user.id);
    if (!question) {
      return;
    }

    const previousAttempts = data.trap_attempts.filter((item) => item.userId === user.id && item.trapQuestionId === trapQuestionId);
    const previousStreak = previousAttempts.length ? previousAttempts[previousAttempts.length - 1]?.streak ?? 0 : 0;
    const isCorrect = question.correctAnswer === answer;
    const streak = isCorrect ? previousStreak + 1 : 0;

    data.trap_attempts.push(
      createTrapAttemptRecord({
        userId: user.id,
        trapQuestionId,
        answer,
        isCorrect,
        streak,
      }),
    );

    if (!isCorrect) {
      data.review_system.push(
        ...[1, 7, 15, 30].map((intervalDays) =>
          createReviewRecord({
            userId: user.id,
            subjectId: null,
            topicId: null,
            topic: `Pegadinha: ${question.title}`,
            sourceStudyDay: null,
            dueDate: addDays(new Date(), intervalDays).toISOString(),
            intervalDays,
            status: ReviewStatus.PENDING,
            reviewedAt: null,
          }),
        ),
      );
    }
  });

  revalidatePath("/pegadinhas-cebraspe");
  revalidatePath("/dashboard");
  revalidatePath("/revisoes");
}
