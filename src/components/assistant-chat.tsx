"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Sou o Assistente especialista. Posso explicar o conteudo do seu dia, montar estrategia de estudo e tirar duvidas de Instrumentacao, Matematica e Portugues.",
  },
];

const suggestions = [
  "Explique o VIM de forma simples.",
  "Qual a melhor forma de estudar a aula de hoje?",
  "Resuma interpretacao de texto para concurso.",
  "Monte 5 perguntas de revisao sobre metrologia.",
];

export function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function sendMessage(content: string) {
    const text = content.trim();
    if (!text || loading) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const payload = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !payload.reply) {
        throw new Error(payload.error || "Nao foi possivel responder agora.");
      }

      setMessages((current) => [...current, { role: "assistant", content: payload.reply ?? "" }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Erro inesperado ao consultar o assistente.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <section className="assistant-layout">
      <div className="assistant-feed panel">
        <div className="panel-heading">
          <h2>Chat</h2>
          <p>Tire duvidas e aprofunde o que esta estudando hoje.</p>
        </div>

        <div className="assistant-messages">
          {messages.map((message, index) => (
            <article className={`assistant-message ${message.role}`} key={`${message.role}-${index}`}>
              <span className="assistant-role">{message.role === "assistant" ? "Assistente especialista" : "Voce"}</span>
              <p>{message.content}</p>
            </article>
          ))}
        </div>

        {error ? <p className="assistant-error">{error}</p> : null}

        <form className="assistant-form" onSubmit={handleSubmit}>
          <textarea
            name="message"
            placeholder="Pergunte sobre a aula de hoje, uma duvida de prova ou uma estrategia de revisao."
            rows={4}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <div className="assistant-form-actions">
            <span className="muted-label">{loading ? "Respondendo..." : "Usa seu contexto real da plataforma"}</span>
            <button className="primary-button" disabled={!canSubmit} type="submit">
              Enviar pergunta
            </button>
          </div>
        </form>
      </div>

      <aside className="assistant-side">
        <section className="panel">
          <div className="panel-heading">
            <h2>Perguntas rapidas</h2>
            <p>Atalhos uteis para estudar sem perder tempo.</p>
          </div>
          <div className="chips">
            {suggestions.map((suggestion) => (
              <button key={suggestion} className="chip interactive-chip" type="button" onClick={() => void sendMessage(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>O que ele faz</h2>
            <p>Escopo atual do assistente dentro da plataforma.</p>
          </div>
          <div className="list">
            <div className="list-item">
              <strong>Explica o conteudo do dia</strong>
            </div>
            <div className="list-item">
              <strong>Resume topicos por dificuldade</strong>
            </div>
            <div className="list-item">
              <strong>Ajuda com estrategia de revisao</strong>
            </div>
            <div className="list-item">
              <strong>Orienta estudo de questoes no estilo CEBRASPE</strong>
            </div>
          </div>
        </section>
      </aside>
    </section>
  );
}
