import { addDays, differenceInCalendarDays, eachDayOfInterval, endOfWeek, format, isSameDay, startOfDay, startOfWeek, subDays } from "date-fns";
import { readDb } from "@/lib/db";
import { GoalType, ReviewStatus, TopicModule, TopicPriority, TopicStatus, TrapDifficulty, TrapTheme, TrapType } from "@/lib/types";

export async function getAppData(userId: string) {
  const db = await readDb();
  const user = db.users.find((item) => item.id === userId);

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const subjects = db.subjects.filter((item) => item.userId === userId);
  const studyDays = db.study_days
    .filter((item) => item.userId === userId)
    .map((item) => ({ ...item, date: new Date(item.date), subject: subjects.find((subject) => subject.id === item.subjectId) ?? null }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  const questionLogs = db.question_logs
    .filter((item) => item.userId === userId)
    .map((item) => ({ ...item, createdAt: new Date(item.createdAt), updatedAt: new Date(item.updatedAt) }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const reviews = db.review_system
    .filter((item) => item.userId === userId)
    .map((item) => ({ ...item, dueDate: new Date(item.dueDate), subject: subjects.find((subject) => subject.id === item.subjectId) ?? null }))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const mockExams = db.mock_exams
    .filter((item) => item.userId === userId)
    .map((item) => ({ ...item, completedAt: new Date(item.completedAt) }))
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  const goals = db.goals
    .filter((item) => item.userId === userId)
    .map((item) => ({ ...item, dueDate: item.dueDate ? new Date(item.dueDate) : null }))
    .sort((a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0));
  const videoLessons = db.video_lessons
    .filter((item) => item.userId === userId)
    .map((item) => ({ ...item, subject: subjects.find((subject) => subject.id === item.subjectId) ?? null }));
  const materials = db.materials
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const industrialTopics = db.industrial_topics.filter((item) => item.userId === userId);
  const trapQuestions = db.trap_questions.filter((item) => item.userId === userId);
  const trapAttempts = db.trap_attempts.filter((item) => item.userId === userId).map((item) => ({ ...item, createdAt: new Date(item.createdAt) }));
  const questionBank = db.question_bank
    .map((item) => ({ ...item, createdAt: new Date(item.createdAt), updatedAt: new Date(item.updatedAt) }))
    .sort((a, b) => a.itemNumber - b.itemNumber);
  const questionBankAttempts = db.question_bank_attempts
    .filter((item) => item.userId === userId)
    .map((item) => ({ ...item, createdAt: new Date(item.createdAt) }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const today = startOfDay(new Date());
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const dailyLogs = studyDays.filter((item) => isSameDay(item.date, today));
  const weeklyLogs = studyDays.filter((item) => item.date >= weekStart && item.date <= weekEnd);
  const reviewsToday = reviews.filter((item) => item.status === ReviewStatus.PENDING && item.dueDate <= addDays(today, 1));
  const questionsToday = questionLogs.filter((item) => isSameDay(item.createdAt, today));
  const questionBankAttemptsToday = questionBankAttempts.filter((item) => isSameDay(item.createdAt, today));
  const hoursPlanned = dailyLogs.reduce((sum, item) => sum + item.plannedHours, 0);
  const hoursStudied = dailyLogs.reduce((sum, item) => sum + item.studiedHours, 0);
  const progressToday = hoursPlanned > 0 ? Math.min((hoursStudied / hoursPlanned) * 100, 100) : 0;
  const streak = calculateStreak(studyDays.map((item) => item.date));
  const weeklyHours = weeklyLogs.reduce((sum, item) => sum + item.studiedHours, 0);
  const weeklyPlanned = weeklyLogs.reduce((sum, item) => sum + item.plannedHours, 0);
  const weeklyProgress = weeklyPlanned > 0 ? Math.min((weeklyHours / weeklyPlanned) * 100, 100) : 0;
  const plan100 = goals.filter((goal) => goal.type === GoalType.PLAN_100);
  const weeklySchedule = goals.filter((goal) => goal.type === GoalType.WEEKLY);
  const monthlyGoals = goals.filter((goal) => goal.type === GoalType.MONTHLY);
  const remainingDays = user.examDate ? Math.max(differenceInCalendarDays(new Date(user.examDate), today), 0) : plan100.length;

  const performanceBySubject = subjects.map((subject) => {
    const logs = questionLogs.filter((log) => log.subjectId === subject.id);
    const total = logs.reduce((sum, log) => sum + log.quantity, 0);
    const correct = logs.reduce((sum, log) => sum + log.correctAnswers, 0);
    return {
      subject: subject.name,
      accuracy: total > 0 ? (correct / total) * 100 : 0,
      total,
      color: subject.color ?? "#1f6feb",
    };
  });

  const weeklyEvolution = eachDayOfInterval({ start: weekStart, end: weekEnd }).map((date) => {
    const logs = questionLogs.filter((item) => isSameDay(item.createdAt, date));
    const attempts = questionBankAttempts.filter((item) => isSameDay(item.createdAt, date));
    return {
      label: format(date, "EEE"),
      liquidScore: logs.reduce((sum, item) => sum + item.liquidScore, 0) + attempts.reduce((sum, item) => sum + (item.isCorrect ? 1 : -1), 0),
      solved: logs.reduce((sum, item) => sum + item.quantity, 0) + attempts.length,
    };
  });

  const errorFrequency = [...questionLogs]
    .sort((a, b) => b.wrongAnswers - a.wrongAnswers)
    .slice(0, 5)
    .map((item) => ({
      topic: item.topic,
      wrongAnswers: item.wrongAnswers,
      discipline: item.discipline,
    }));

  const industrialTopicSummaries = industrialTopics
    .map((topic) => {
      const topicQuestions = questionLogs.filter((log) => log.topicId === topic.id || log.topic === topic.title);
      const topicReviews = reviews.filter((review) => review.topicId === topic.id);
      const topicVideos = videoLessons.filter((video) => video.topicId === topic.id);
      const studied = studyDays.some((study) => study.topicId === topic.id || study.topic === topic.title);
      const questions = topicQuestions.reduce((sum, item) => sum + item.quantity, 0);
      const correctAnswers = topicQuestions.reduce((sum, item) => sum + item.correctAnswers, 0);
      const wrongAnswers = topicQuestions.reduce((sum, item) => sum + item.wrongAnswers, 0);

      return {
        ...topic,
        questions,
        correctAnswers,
        wrongAnswers,
        accuracyRate: questions > 0 ? (correctAnswers / questions) * 100 : 0,
        pendingReviews: topicReviews.filter((review) => review.status === ReviewStatus.PENDING).length,
        videoLessons: topicVideos,
        studied,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  const buildTopicsByBlock = (module: TopicModule, blocks: string[]) =>
    blocks.map((block) => {
      const topics = industrialTopicSummaries.filter((topic) => topic.module === module && topic.block === block);
      const completed = topics.filter((topic) => topic.status === TopicStatus.COMPLETED).length;
      return {
        block,
        topics,
        completionRate: topics.length ? (completed / topics.length) * 100 : 0,
      };
    });

  const instrumentationTopicsByBlock = buildTopicsByBlock(TopicModule.INSTRUMENTACAO, ["BLOCO I", "BLOCO II", "BLOCO III"]);
  const mathematicsTopicsByBlock = buildTopicsByBlock(TopicModule.MATEMATICA, ["BLOCO I"]);
  const mathematicsTopics = industrialTopicSummaries.filter((topic) => topic.module === TopicModule.MATEMATICA);
  const portugueseTopics = industrialTopicSummaries.filter((topic) => topic.module === TopicModule.PORTUGUES);
  const instrumentationTopics = industrialTopicSummaries.filter((topic) => topic.module === TopicModule.INSTRUMENTACAO);
  const mathPriorityTopics = mathematicsTopics.filter((topic) => topic.priority === TopicPriority.HIGH);
  const portuguesePriorityTopics = portugueseTopics.filter((topic) => topic.priority === TopicPriority.HIGH);
  const portugueseTopicsByBlock = buildTopicsByBlock(TopicModule.PORTUGUES, ["BLOCO I"]);

  const trapSummaries = trapQuestions
    .map((question) => {
      const attempts = trapAttempts.filter((attempt) => attempt.trapQuestionId === question.id);
      const correct = attempts.filter((attempt) => attempt.isCorrect).length;
      const errors = attempts.filter((attempt) => !attempt.isCorrect).length;
      const currentStreak = attempts.length ? attempts[attempts.length - 1]?.streak ?? 0 : 0;
      const errorRate = attempts.length ? (errors / attempts.length) * 100 : 0;

      return {
        ...question,
        attempts,
        correct,
        errors,
        errorRate,
        currentStreak,
        mastered: currentStreak >= 3,
      };
    })
    .sort((a, b) => b.errorRate - a.errorRate);

  const antiErrorQuestions = trapSummaries.filter((item) => item.errors > 0 && item.currentStreak < 3);
  const errorsByType = Object.values(TrapType).map((trapType) => {
    const items = trapSummaries.filter((question) => question.trapType === trapType);
    const errors = items.reduce((sum, item) => sum + item.errors, 0);
    return { trapType, errors };
  });
  const topTrapErrors = trapSummaries.slice(0, 5).map((item) => ({
    title: item.title,
    theme: item.theme,
    errorRate: item.errorRate,
    errors: item.errors,
  })).filter((item) => item.errors > 0);
  const trapThemes = Object.values(TrapTheme).map((theme) => {
    const items = trapSummaries.filter((item) => item.theme === theme);
    const errors = items.reduce((sum, item) => sum + item.errors, 0);
    const attemptsCount = items.reduce((sum, item) => sum + item.attempts.length, 0);
    return {
      theme,
      errorRate: attemptsCount ? (errors / attemptsCount) * 100 : 0,
    };
  });

  const topicsByBlock = ["BLOCO I", "BLOCO II", "BLOCO III"].map((block) => {
    const topics = instrumentationTopics.filter((topic) => topic.block === block);
    const completed = topics.filter((topic) => topic.status === TopicStatus.COMPLETED).length;
    return {
      block,
      topics,
      completionRate: topics.length ? (completed / topics.length) * 100 : 0,
    };
  });

  const questionBankSummaries = questionBank.map((question) => {
    const attempts = questionBankAttempts.filter((attempt) => attempt.questionId === question.id);
    const correct = attempts.filter((attempt) => attempt.isCorrect).length;
    const wrong = attempts.filter((attempt) => !attempt.isCorrect).length;
    const lastAttempt = attempts[0] ?? null;
    const accuracyRate = attempts.length ? (correct / attempts.length) * 100 : 0;

    return {
      ...question,
      attempts,
      attemptsCount: attempts.length,
      correct,
      wrong,
      accuracyRate,
      answered: attempts.length > 0,
      lastAttempt,
    };
  });

  const importedQuestionStats = {
    total: questionBankSummaries.length,
    answered: questionBankSummaries.filter((item) => item.answered).length,
    correct: questionBankAttempts.filter((item) => item.isCorrect).length,
    wrong: questionBankAttempts.filter((item) => !item.isCorrect).length,
    byDiscipline: Object.values(TopicModule).map((module) => {
      const label = module === TopicModule.INSTRUMENTACAO ? "Instrumentação" : module === TopicModule.MATEMATICA ? "Matemática" : "Português";
      const items = questionBankSummaries.filter((item) => item.module === module);
      const attempts = items.flatMap((item) => item.attempts);
      const correct = attempts.filter((item) => item.isCorrect).length;
      return {
        module,
        label,
        total: items.length,
        answered: attempts.length,
        accuracyRate: attempts.length ? (correct / attempts.length) * 100 : 0,
      };
    }),
    topTopics: Array.from(
      new Map(
        questionBankSummaries.map((item) => [
          item.topicTitle,
          { topic: item.topicTitle, wrong: 0, attempts: 0, module: item.module },
        ]),
      ).values(),
    ),
  };

  questionBankSummaries.forEach((item) => {
    const topic = importedQuestionStats.topTopics.find((entry) => entry.topic === item.topicTitle);
    if (topic) {
      topic.wrong += item.wrong;
      topic.attempts += item.attemptsCount;
    }
  });

  importedQuestionStats.topTopics = importedQuestionStats.topTopics
    .filter((item) => item.attempts > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 5);

  return {
    user: { ...user, examDate: user.examDate ? new Date(user.examDate) : null },
    subjects,
    studyDays,
    questionLogs,
    reviews,
    mockExams,
    goals,
    videoLessons,
    materials,
    industrialTopics: industrialTopicSummaries,
    dashboard: {
      progressToday,
      hoursStudied,
      hoursPlanned,
      questionsToday: questionsToday.reduce((sum, item) => sum + item.quantity, 0) + questionBankAttemptsToday.length,
      reviewsPending: reviewsToday.length,
      weeklyProgress,
      streak,
      industrialTopicsCompleted: instrumentationTopics.filter((topic) => topic.status === TopicStatus.COMPLETED).length,
      industrialTopicsInProgress: instrumentationTopics.filter((topic) => topic.status === TopicStatus.IN_PROGRESS).length,
      mathTopicsCompleted: mathematicsTopics.filter((topic) => topic.status === TopicStatus.COMPLETED).length,
      mathTopicsInProgress: mathematicsTopics.filter((topic) => topic.status === TopicStatus.IN_PROGRESS).length,
      portugueseTopicsCompleted: portugueseTopics.filter((topic) => topic.status === TopicStatus.COMPLETED).length,
      portugueseTopicsInProgress: portugueseTopics.filter((topic) => topic.status === TopicStatus.IN_PROGRESS).length,
      trapErrorsPending: antiErrorQuestions.length,
    },
    schedules: {
      weekly: weeklySchedule,
      monthly: monthlyGoals,
      plan100,
      remainingDays,
    },
    charts: {
      performanceBySubject,
      weeklyEvolution,
      errorFrequency,
    },
    questionBank: {
      questions: questionBankSummaries,
      attempts: questionBankAttempts,
      stats: importedQuestionStats,
    },
    instrumentation: {
      topicsByBlock: instrumentationTopicsByBlock,
      totalTopics: instrumentationTopics.length,
    },
    mathematics: {
      topicsByBlock: mathematicsTopicsByBlock,
      topics: mathematicsTopics,
      totalTopics: mathematicsTopics.length,
      priorityTopics: mathPriorityTopics,
    },
    portuguese: {
      topicsByBlock: portugueseTopicsByBlock,
      topics: portugueseTopics,
      totalTopics: portugueseTopics.length,
      priorityTopics: portuguesePriorityTopics,
    },
    traps: {
      questions: trapSummaries,
      antiErrorQuestions,
      topTrapErrors,
      errorsByType,
      trapThemes,
      totalQuestions: trapSummaries.length,
      answered: trapSummaries.filter((item) => item.attempts.length > 0).length,
      mastered: trapSummaries.filter((item) => item.mastered).length,
    },
  };
}

function calculateStreak(dates: Date[]) {
  const uniqueDays = [...new Set(dates.map((date) => format(startOfDay(date), "yyyy-MM-dd")))];
  let streak = 0;

  for (let index = 0; index < 365; index += 1) {
    const day = format(subDays(new Date(), index), "yyyy-MM-dd");
    if (uniqueDays.includes(day)) {
      streak += 1;
    } else if (index !== 0) {
      break;
    }
  }

  return streak;
}
