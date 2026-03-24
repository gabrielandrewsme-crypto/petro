import { readFile } from "fs/promises";
import path from "path";
import { readDb, writeDb } from "../src/lib/db";
import type { DatabaseShape } from "../src/lib/types";

function mergeById<T extends { id: string }>(remoteItems: T[], localItems: T[]) {
  const map = new Map<string, T>();

  for (const item of remoteItems) {
    map.set(item.id, item);
  }

  for (const item of localItems) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }

  return [...map.values()];
}

async function main() {
  const localPath = path.join(process.cwd(), "data", "app-db.json");
  const localRaw = await readFile(localPath, "utf8");
  const localDb = JSON.parse(localRaw) as DatabaseShape;
  const remoteDb = await readDb();

  const merged: DatabaseShape = {
    users: mergeById(remoteDb.users, localDb.users),
    sessions: mergeById(remoteDb.sessions, localDb.sessions),
    study_days: mergeById(remoteDb.study_days, localDb.study_days),
    subjects: mergeById(remoteDb.subjects, localDb.subjects),
    video_lessons: mergeById(remoteDb.video_lessons, localDb.video_lessons),
    question_logs: mergeById(remoteDb.question_logs, localDb.question_logs),
    review_system: mergeById(remoteDb.review_system, localDb.review_system),
    mock_exams: mergeById(remoteDb.mock_exams, localDb.mock_exams),
    goals: mergeById(remoteDb.goals, localDb.goals),
    materials: mergeById(remoteDb.materials, localDb.materials),
    industrial_topics: mergeById(remoteDb.industrial_topics, localDb.industrial_topics ?? []),
    trap_questions: mergeById(remoteDb.trap_questions, localDb.trap_questions ?? []),
    trap_attempts: mergeById(remoteDb.trap_attempts, localDb.trap_attempts ?? []),
  };

  await writeDb(merged);

  const summary = {
    users: [remoteDb.users.length, merged.users.length],
    sessions: [remoteDb.sessions.length, merged.sessions.length],
    study_days: [remoteDb.study_days.length, merged.study_days.length],
    subjects: [remoteDb.subjects.length, merged.subjects.length],
    video_lessons: [remoteDb.video_lessons.length, merged.video_lessons.length],
    question_logs: [remoteDb.question_logs.length, merged.question_logs.length],
    review_system: [remoteDb.review_system.length, merged.review_system.length],
    mock_exams: [remoteDb.mock_exams.length, merged.mock_exams.length],
    goals: [remoteDb.goals.length, merged.goals.length],
    materials: [remoteDb.materials.length, merged.materials.length],
    industrial_topics: [remoteDb.industrial_topics.length, merged.industrial_topics.length],
    trap_questions: [remoteDb.trap_questions.length, merged.trap_questions.length],
    trap_attempts: [remoteDb.trap_attempts.length, merged.trap_attempts.length],
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
