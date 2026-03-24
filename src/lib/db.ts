import { mkdir, readFile, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { DatabaseShape, Goal, GoalStatus, GoalType, IndustrialTopic, MaterialItem, MaterialType, MockExam, QuestionLog, ReviewItem, ReviewStatus, Session, StudyDay, Subject, TopicPriority, TopicStatus, TopicModule, TrapAttempt, TrapDifficulty, TrapQuestion, TrapTheme, TrapType, User, VideoCategory, VideoLesson } from "@/lib/types";

const dbFile = path.join(process.cwd(), "data", "app-db.json");
const NEON_STATE_ID = "main";

const emptyDb: DatabaseShape = {
  users: [],
  sessions: [],
  study_days: [],
  subjects: [],
  video_lessons: [],
  question_logs: [],
  review_system: [],
  mock_exams: [],
  goals: [],
  materials: [],
  industrial_topics: [],
  trap_questions: [],
  trap_attempts: [],
};

function now() {
  return new Date().toISOString();
}

function getNeonSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || !connectionString.startsWith("postgres")) {
    return null;
  }

  return neon(connectionString);
}

async function ensureNeonSchema() {
  const sql = getNeonSql();
  if (!sql) {
    return null;
  }

  await sql.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  return sql;
}

async function ensureDb() {
  await mkdir(path.dirname(dbFile), { recursive: true });

  try {
    await readFile(dbFile, "utf8");
  } catch {
    await writeFile(dbFile, JSON.stringify(emptyDb, null, 2));
  }
}

export async function readDb() {
  const sql = await ensureNeonSchema();
  if (sql) {
    const result = await sql.query("SELECT payload FROM app_state WHERE id = $1 LIMIT 1", [NEON_STATE_ID]);
    if (!result.length) {
      await sql.query("INSERT INTO app_state (id, payload, updated_at) VALUES ($1, $2::jsonb, NOW())", [NEON_STATE_ID, JSON.stringify(emptyDb)]);
      return { ...emptyDb };
    }

    const parsed = result[0]?.payload as Partial<DatabaseShape>;
    return {
      ...emptyDb,
      ...parsed,
      industrial_topics: parsed.industrial_topics ?? [],
      trap_questions: parsed.trap_questions ?? [],
      trap_attempts: parsed.trap_attempts ?? [],
    } as DatabaseShape;
  }

  await ensureDb();
  const contents = await readFile(dbFile, "utf8");
  const parsed = JSON.parse(contents) as Partial<DatabaseShape>;
  return {
    ...emptyDb,
    ...parsed,
    industrial_topics: parsed.industrial_topics ?? [],
    trap_questions: parsed.trap_questions ?? [],
    trap_attempts: parsed.trap_attempts ?? [],
  } as DatabaseShape;
}

export async function writeDb(data: DatabaseShape) {
  const sql = await ensureNeonSchema();
  if (sql) {
    await sql.query(
      `
        INSERT INTO app_state (id, payload, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (id)
        DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
      `,
      [NEON_STATE_ID, JSON.stringify(data)],
    );
    return;
  }

  await ensureDb();
  await writeFile(dbFile, JSON.stringify(data, null, 2));
}

export async function mutateDb<T>(callback: (data: DatabaseShape) => T | Promise<T>) {
  const data = await readDb();
  const result = await callback(data);
  await writeDb(data);
  return result;
}

export function createId() {
  return randomUUID();
}

export function createUserRecord(input: { name: string; username?: string; email: string; passwordHash: string; examDate?: Date | null }) {
  const timestamp = now();
  const user: User = {
    id: createId(),
    name: input.name,
    username: input.username,
    email: input.email,
    passwordHash: input.passwordHash,
    examDate: input.examDate ? input.examDate.toISOString() : null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  return user;
}

export function createSessionRecord(input: { token: string; userId: string; expiresAt: Date }) {
  const timestamp = now();
  const session: Session = {
    id: createId(),
    token: input.token,
    userId: input.userId,
    expiresAt: input.expiresAt.toISOString(),
    createdAt: timestamp,
  };
  return session;
}

export function createSubjectRecord(input: Omit<Subject, "id" | "createdAt" | "updatedAt">): Subject {
  const timestamp = now();
  return { id: createId(), createdAt: timestamp, updatedAt: timestamp, ...input };
}

export function createStudyDayRecord(input: Omit<StudyDay, "id" | "createdAt" | "updatedAt">): StudyDay {
  const timestamp = now();
  return { id: createId(), createdAt: timestamp, updatedAt: timestamp, ...input };
}

export function createReviewRecord(input: Omit<ReviewItem, "id" | "createdAt" | "updatedAt">): ReviewItem {
  const timestamp = now();
  return { id: createId(), createdAt: timestamp, updatedAt: timestamp, ...input };
}

export function createQuestionLogRecord(input: Omit<QuestionLog, "id" | "createdAt" | "updatedAt">): QuestionLog {
  const timestamp = now();
  return { id: createId(), createdAt: timestamp, updatedAt: timestamp, ...input };
}

export function createMockExamRecord(input: Omit<MockExam, "id" | "createdAt" | "updatedAt">): MockExam {
  const timestamp = now();
  return { id: createId(), createdAt: timestamp, updatedAt: timestamp, ...input };
}

export function createGoalRecord(input: Omit<Goal, "id" | "createdAt" | "updatedAt">): Goal {
  const timestamp = now();
  return { id: createId(), createdAt: timestamp, updatedAt: timestamp, ...input };
}

export function createMaterialRecord(input: Omit<MaterialItem, "id" | "createdAt" | "updatedAt">): MaterialItem {
  const timestamp = now();
  return { id: createId(), createdAt: timestamp, updatedAt: timestamp, ...input };
}

export function createVideoLessonRecord(input: Omit<VideoLesson, "id" | "createdAt" | "updatedAt">): VideoLesson {
  const timestamp = now();
  return { id: createId(), createdAt: timestamp, updatedAt: timestamp, ...input };
}

export function createIndustrialTopicRecord(input: Omit<IndustrialTopic, "id" | "createdAt" | "updatedAt">): IndustrialTopic {
  const timestamp = now();
  return { id: createId(), createdAt: timestamp, updatedAt: timestamp, ...input };
}

export function createTrapQuestionRecord(input: Omit<TrapQuestion, "id" | "createdAt" | "updatedAt">): TrapQuestion {
  const timestamp = now();
  return { id: createId(), createdAt: timestamp, updatedAt: timestamp, ...input };
}

export function createTrapAttemptRecord(input: Omit<TrapAttempt, "id" | "createdAt">): TrapAttempt {
  return { id: createId(), createdAt: now(), ...input };
}

export { GoalStatus, GoalType, MaterialType, ReviewStatus, TopicPriority, TopicStatus, TopicModule, TrapDifficulty, TrapTheme, TrapType, VideoCategory };
