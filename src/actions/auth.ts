"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";
import { createUserRecord, mutateDb, readDb } from "@/lib/db";
import { seedUserData } from "@/lib/seed-user";

const registerSchema = z.object({
  name: z.string().min(3).optional(),
  username: z.string().min(3).optional(),
  email: z.email(),
  password: z.string().min(4),
});

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
});

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success || !parsed.data.name) {
    redirect("/register?error=Dados inválidos");
  }

  const db = await readDb();
  if (db.users.some((user) => user.email === parsed.data.email)) {
    redirect("/register?error=E-mail já cadastrado");
  }

  const examDateValue = formData.get("examDate");
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = createUserRecord({
    name: parsed.data.name,
    username: parsed.data.username,
    email: parsed.data.email,
    passwordHash,
    examDate: typeof examDateValue === "string" && examDateValue ? new Date(examDateValue) : null,
  });

  await mutateDb((data) => {
    data.users.push(user);
  });

  await seedUserData(user.id, user.examDate ? new Date(user.examDate) : null);
  await createSession(user.id);
  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/login?error=Credenciais inválidas");
  }

  let db = await readDb();
  let user = db.users.find((item) => item.username === parsed.data.username);

  if (!user && parsed.data.username === "gabriel") {
    const passwordHash = await bcrypt.hash("1964", 10);
    user = createUserRecord({
      name: "Gabriel",
      username: "gabriel",
      email: "gabriel@local",
      passwordHash,
      examDate: null,
    });

    await mutateDb((data) => {
      data.users.push(user!);
    });
    await seedUserData(user.id, null);
    db = await readDb();
    user = db.users.find((item) => item.username === "gabriel");
  }

  if (!user) {
    redirect("/login?error=Usuário não encontrado");
  }

  const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!validPassword) {
    redirect("/login?error=Senha incorreta");
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
