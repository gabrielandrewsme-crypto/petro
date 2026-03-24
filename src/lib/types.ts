export enum GoalType {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  PLAN_100 = "PLAN_100",
}

export enum GoalStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}

export enum MaterialType {
  PDF = "PDF",
  LINK = "LINK",
  NOTE = "NOTE",
}

export enum ReviewStatus {
  PENDING = "PENDING",
  DONE = "DONE",
  RESCHEDULED = "RESCHEDULED",
}

export enum VideoCategory {
  INSTRUMENTACAO = "INSTRUMENTACAO",
  MATEMATICA = "MATEMATICA",
  PORTUGUES = "PORTUGUES",
}

export enum TopicStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum TopicModule {
  INSTRUMENTACAO = "INSTRUMENTACAO",
  MATEMATICA = "MATEMATICA",
  PORTUGUES = "PORTUGUES",
}

export enum TopicPriority {
  NORMAL = "NORMAL",
  HIGH = "HIGH",
}

export enum TrapDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum TrapTheme {
  SENSORES = "SENSORES",
  VALVULAS = "VALVULAS",
  METROLOGIA = "METROLOGIA",
  ISA = "ISA",
  CLP = "CLP",
  PID = "PID",
  REDES = "REDES",
  ELETRONICA = "ELETRONICA",
}

export enum TrapType {
  INVERSAO = "INVERSAO",
  GENERALIZACAO = "GENERALIZACAO",
  UNIDADE = "UNIDADE",
  GRAFICO = "GRAFICO",
  MANUAL_AUTOMATICO = "MANUAL_AUTOMATICO",
  ISA_SIMBOLOGIA = "ISA_SIMBOLOGIA",
  VALVULA_ATUADOR = "VALVULA_ATUADOR",
}

export type User = {
  id: string;
  name: string;
  username?: string;
  email: string;
  passwordHash: string;
  examDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
};

export type Subject = {
  id: string;
  userId: string;
  name: string;
  category: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
};

export type StudyDay = {
  id: string;
  userId: string;
  subjectId: string | null;
  topicId?: string | null;
  date: string;
  topic: string;
  plannedHours: number;
  studiedHours: number;
  notes?: string;
  questionsSolved: number;
  createdAt: string;
  updatedAt: string;
};

export type VideoLesson = {
  id: string;
  userId: string;
  subjectId: string | null;
  topicId?: string | null;
  title: string;
  url: string;
  category: VideoCategory;
  watched: boolean;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type QuestionLog = {
  id: string;
  userId: string;
  subjectId: string | null;
  topicId?: string | null;
  discipline: string;
  topic: string;
  quantity: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracyRate: number;
  liquidScore: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewItem = {
  id: string;
  userId: string;
  subjectId: string | null;
  topicId?: string | null;
  topic: string;
  sourceStudyDay: string | null;
  dueDate: string;
  intervalDays: number;
  status: ReviewStatus;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MockExam = {
  id: string;
  userId: string;
  title: string;
  questionCount: number;
  durationMinutes: number;
  correctAnswers: number;
  wrongAnswers: number;
  liquidScore: number;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Goal = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: GoalType;
  weekLabel?: string;
  dayNumber?: number;
  status: GoalStatus;
  progress: number;
  targetValue: number;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MaterialItem = {
  id: string;
  userId: string;
  title: string;
  type: MaterialType;
  url?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IndustrialTopic = {
  id: string;
  userId: string;
  module: TopicModule;
  block: "BLOCO I" | "BLOCO II" | "BLOCO III";
  slug: string;
  title: string;
  description: string;
  status: TopicStatus;
  priority: TopicPriority;
  createdAt: string;
  updatedAt: string;
};

export type TrapQuestion = {
  id: string;
  userId: string;
  slug: string;
  theme: TrapTheme;
  topic: string;
  title: string;
  difficulty: TrapDifficulty;
  frequencyScore: number;
  errorRateSeed: number;
  trapType: TrapType;
  statement: string;
  correctAnswer: boolean;
  explanation: string;
  trapReason: string;
  whereStudentFails: string;
  avoidError: string;
  createdAt: string;
  updatedAt: string;
};

export type TrapAttempt = {
  id: string;
  userId: string;
  trapQuestionId: string;
  answer: boolean;
  isCorrect: boolean;
  streak: number;
  createdAt: string;
};

export type DatabaseShape = {
  users: User[];
  sessions: Session[];
  study_days: StudyDay[];
  subjects: Subject[];
  video_lessons: VideoLesson[];
  question_logs: QuestionLog[];
  review_system: ReviewItem[];
  mock_exams: MockExam[];
  goals: Goal[];
  materials: MaterialItem[];
  industrial_topics: IndustrialTopic[];
  trap_questions: TrapQuestion[];
  trap_attempts: TrapAttempt[];
};
