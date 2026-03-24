import bcrypt from "bcryptjs";
import { createUserRecord, mutateDb, readDb } from "../src/lib/db";
import { seedUserData } from "../src/lib/seed-user";

async function main() {
  let db = await readDb();
  const email = "demo@planopetrobras.com";
  const gabrielEmail = "gabriel@local";

  if (!db.users.some((user) => user.email === email)) {
    const passwordHash = await bcrypt.hash("demo12345", 10);
    const user = createUserRecord({
      name: "Aluno Demo",
      username: "demo",
      email,
      passwordHash,
      examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100),
    });

    await mutateDb((data) => {
      data.users.push(user);
    });

    await seedUserData(user.id, user.examDate ? new Date(user.examDate) : null);
  }

  if (!db.users.some((user) => user.email === gabrielEmail || user.username === "gabriel")) {
    const gabrielHash = await bcrypt.hash("1964", 10);
    const gabriel = createUserRecord({
      name: "Gabriel",
      username: "gabriel",
      email: gabrielEmail,
      passwordHash: gabrielHash,
      examDate: null,
    });

    await mutateDb((data) => {
      data.users.push(gabriel);
    });

    await seedUserData(gabriel.id, null);
  }

  db = await readDb();
  await Promise.all(
    db.users.map((user) => seedUserData(user.id, user.examDate ? new Date(user.examDate) : null)),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
