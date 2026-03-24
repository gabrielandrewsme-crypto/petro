import { NextResponse } from "next/server";
import { buildAssistantContext, buildAssistantInstructions } from "@/lib/assistant-context";
import { getCurrentUser } from "@/lib/auth";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function extractText(payload: Record<string, unknown>) {
  const outputText = payload.output_text;
  if (typeof outputText === "string" && outputText.trim()) {
    return outputText.trim();
  }

  const output = Array.isArray(payload.output) ? payload.output : [];
  for (const item of output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const content = Array.isArray((item as { content?: unknown[] }).content) ? (item as { content: unknown[] }).content : [];
    for (const chunk of content) {
      if (!chunk || typeof chunk !== "object") {
        continue;
      }

      if ((chunk as { type?: string }).type === "output_text" && typeof (chunk as { text?: unknown }).text === "string") {
        return (chunk as { text: string }).text.trim();
      }
    }
  }

  return "";
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY nao configurada no servidor." }, { status: 500 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  const body = (await request.json()) as { messages?: ChatMessage[] };
  const messages = Array.isArray(body.messages) ? body.messages.filter((item) => item && typeof item.content === "string") : [];
  const trimmedMessages = messages.slice(-10);

  if (!trimmedMessages.length) {
    return NextResponse.json({ error: "Nenhuma mensagem enviada." }, { status: 400 });
  }

  const context = await buildAssistantContext(user.id);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: buildAssistantInstructions(JSON.stringify(context)),
      input: trimmedMessages.map((message) => ({
        role: message.role,
        content: [{ type: "input_text", text: message.content }],
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: `Falha ao consultar a OpenAI: ${errorText}` }, { status: 500 });
  }

  const payload = (await response.json()) as Record<string, unknown>;
  const reply = extractText(payload);

  if (!reply) {
    return NextResponse.json({ error: "A resposta da OpenAI veio vazia." }, { status: 500 });
  }

  return NextResponse.json({ reply });
}
