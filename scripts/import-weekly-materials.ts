import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { createMaterialRecord, createVideoLessonRecord, mutateDb } from "@/lib/db";
import { MaterialType, VideoCategory } from "@/lib/types";

type Lesson = {
  title: string;
  subject: string;
  topic: string;
  subtopic: string;
  videos: string[];
  key_concepts: string[];
  questions: number;
  question_source: string;
  prova_2023_items: number[];
  pitfalls: string[];
  review: string[];
  checklist: string[];
};

type WeekDay = {
  day: string;
  day_number: number;
  type: string;
  lesson: Lesson;
  companion_lesson?: Lesson;
};

type WeekPlan = {
  week: number;
  title: string;
  start_date: string;
  end_date: string;
  days: WeekDay[];
};

type Resource = {
  label: string;
  url: string;
};

const weekFile = path.join(process.cwd(), "creator content petro", "semana-01.json");
const outputFile = path.join(process.cwd(), "creator content petro", "output", "semana-01-materials.md");

const researchedResources: Record<string, Resource[]> = {
  "VIM - fundamentos": [
    { label: "VIM 2012 - edicao luso-brasileira do Inmetro", url: "https://www.gov.br/inmetro/pt-br/assuntos/metrologia-cientifica/documentos-tecnicos-em-metrologia/vim_2012.pdf" },
    { label: "VIM anotado - BIPM", url: "https://jcgm.bipm.org/vim/en/info.html" },
  ],
  "Compreensao e interpretacao de textos": [
    { label: "Compreensao e interpretacao de textos - Toda Materia", url: "https://www.todamateria.com.br/compreensao-e-interpretacao-de-textos/" },
    { label: "Dicas de interpretacao de texto - Toda Materia", url: "https://www.todamateria.com.br/dicas-de-interpretacao-de-texto/" },
  ],
  "Tipos de erro de medicao": [
    { label: "VIM 2012 - erros e conceitos de medicao", url: "https://www.gov.br/inmetro/pt-br/assuntos/metrologia-cientifica/documentos-tecnicos-em-metrologia/vim_2012.pdf" },
    { label: "VIM anotado - BIPM", url: "https://jcgm.bipm.org/vim/en/info.html" },
  ],
  "Teoria dos conjuntos": [
    { label: "Teoria dos conjuntos - Toda Materia", url: "https://www.todamateria.com.br/teoria-dos-conjuntos/" },
    { label: "Operacoes com conjuntos - Toda Materia", url: "https://www.todamateria.com.br/operacoes-com-conjuntos/" },
  ],
  "Incerteza de medicao": [
    { label: "Incerteza de medicao - Inmetro", url: "https://www.gov.br/inmetro/pt-br/centrais-de-conteudo/noticias/incerteza-de-medicao" },
    { label: "Palestra sobre incerteza de medicao - Inmetro", url: "https://www.gov.br/inmetro/pt-br/centrais-de-conteudo/noticias/o-que-e-incerteza-de-medicao-palestra-on-line-no-inmetro-apresenta-proposta-internacional-mais-clara-e-acessivel" },
  ],
  "Tipos textuais e ortografia": [
    { label: "Tipos de textos - Toda Materia", url: "https://www.todamateria.com.br/tipos-de-textos/" },
    { label: "Tipologia textual - Toda Materia", url: "https://www.todamateria.com.br/tipologia-textual/" },
  ],
  "Certificado de calibracao": [
    { label: "Rastreabilidade metrologica - Inmetro", url: "https://www.gov.br/inmetro/pt-br/centrais-de-conteudo/publicacoes/dicionario-linguagem-simples/de-a-a-z/r/rastreabilidade-metrologica" },
    { label: "VIM 2012 - rastreabilidade e calibracao", url: "https://www.gov.br/inmetro/pt-br/assuntos/metrologia-cientifica/documentos-tecnicos-em-metrologia/vim_2012.pdf" },
  ],
  "Funcoes e equacoes": [
    { label: "Funcao logaritmica - Toda Materia", url: "https://www.todamateria.com.br/funcao-logaritmica/" },
    { label: "Equacao do segundo grau - Toda Materia", url: "https://www.todamateria.com.br/equacao-do-segundo-grau/" },
  ],
  "Prova 2023 - itens 41-43": [
    { label: "VIM 2012 - conceitos cobrados na prova", url: "https://www.gov.br/inmetro/pt-br/assuntos/metrologia-cientifica/documentos-tecnicos-em-metrologia/vim_2012.pdf" },
    { label: "VIM anotado - BIPM", url: "https://jcgm.bipm.org/vim/en/info.html" },
  ],
  "Classes de palavras e estruturas morfossintaticas": [
    { label: "Classes de palavras - Mundo Educacao", url: "https://mundoeducacao.uol.com.br/amp/gramatica/classes-palavras.htm" },
    { label: "Concordancia verbal e nominal - busca no YouTube", url: "https://www.youtube.com/results?search_query=concordancia+verbal+nominal" },
  ],
  "Simulado semanal - Metrologia": [
    { label: "VIM 2012 - revisao geral", url: "https://www.gov.br/inmetro/pt-br/assuntos/metrologia-cientifica/documentos-tecnicos-em-metrologia/vim_2012.pdf" },
    { label: "Incerteza de medicao - Inmetro", url: "https://www.gov.br/inmetro/pt-br/centrais-de-conteudo/noticias/o-que-e-incerteza-de-medicao-palestra-on-line-no-inmetro-apresenta-proposta-internacional-mais-clara-e-acessivel" },
  ],
  "Analise combinatoria e eventos independentes": [
    { label: "Analise combinatoria - Toda Materia", url: "https://www.todamateria.com.br/analise-combinatoria/" },
    { label: "Exercicios de analise combinatoria - Toda Materia", url: "https://www.todamateria.com.br/exercicios-de-analise-combinatoria/" },
  ],
};

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toVideoCategory(subject: string) {
  if (subject === "Instrumentacao") {
    return VideoCategory.INSTRUMENTACAO;
  }
  if (subject === "Matematica") {
    return VideoCategory.MATEMATICA;
  }
  return VideoCategory.PORTUGUES;
}

function toSubjectName(subject: string, topic: string) {
  if (subject === "Instrumentacao") {
    return topic === "Metrologia" ? "Metrologia" : "Sensores";
  }
  if (subject === "Matematica") {
    return "Matemática";
  }
  return "Português";
}

function buildQuestionMethod(lesson: Lesson) {
  const itemLine = lesson.prova_2023_items.length ? `Itens para cruzar com o banco: ${lesson.prova_2023_items.join(", ")}.` : "Sem item oficial vinculado neste bloco.";
  return [
    "Como resolver questoes deste bloco:",
    "1. Leia o comando e destaque a palavra tecnica que define o conceito central.",
    "2. Compare o termo do enunciado com a definicao-base, nao com memoria vaga.",
    "3. Em CEBRASPE, procure o detalhe que invalida generalizacoes absolutas.",
    `4. ${itemLine}`,
    `5. Antes de marcar, confira estas pegadinhas: ${lesson.pitfalls.join("; ")}.`,
  ].join("\n");
}

function buildNote(day: WeekDay, lesson: Lesson, resources: Resource[], dateLabel: string) {
  return [
    `Data de estudo: ${dateLabel}`,
    `Dia da semana do cronograma: ${day.day}`,
    `Bloco: ${lesson.subject} | ${lesson.title}`,
    `Assunto: ${lesson.topic}`,
    `Subtopico: ${lesson.subtopic}`,
    "",
    "O que estudar primeiro:",
    ...lesson.key_concepts.map((item) => `- ${item}`),
    "",
    "Checklist sugerido:",
    ...lesson.checklist.map((item) => `- ${item}`),
    "",
    buildQuestionMethod(lesson),
    "",
    lesson.review.length ? `Revisao vinculada: ${lesson.review.join("; ")}` : "Revisao vinculada: iniciar revisao 1-7-15-30 apos o bloco.",
    "",
    "Fontes pesquisadas para este bloco:",
    ...resources.map((item) => `- ${item.label}: ${item.url}`),
    "",
    "Videoaulas planejadas:",
    ...lesson.videos.map((item) => `- ${item}`),
  ].join("\n");
}

async function main() {
  const week = JSON.parse(await readFile(weekFile, "utf8")) as WeekPlan;
  const markdownLines = [`# ${week.title}`, `Periodo: ${week.start_date} a ${week.end_date}`, ""];

  await mutateDb((data) => {
    for (const user of data.users) {
      const subjectMap = new Map(data.subjects.filter((item) => item.userId === user.id).map((item) => [item.name, item.id]));

      for (const [index, day] of week.days.entries()) {
        const calendarDate = new Date(new Date(`${week.start_date}T12:00:00`).getTime() + index * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);

        for (const lesson of [day.lesson, day.companion_lesson].filter(Boolean) as Lesson[]) {
          const resources = researchedResources[lesson.title] ?? [];
          const materialTitle = `[${calendarDate}] Semana ${week.week} | ${lesson.subject} | ${lesson.title}`;
          const subjectId = subjectMap.get(toSubjectName(lesson.subject, lesson.topic)) ?? null;

          const existingMaterial = data.materials.find((item) => item.userId === user.id && item.title === materialTitle);
          if (!existingMaterial) {
            data.materials.push(
              createMaterialRecord({
                userId: user.id,
                title: materialTitle,
                type: MaterialType.NOTE,
                url: null,
                notes: buildNote(day, lesson, resources, calendarDate),
              }),
            );
          } else {
            existingMaterial.notes = buildNote(day, lesson, resources, calendarDate);
            existingMaterial.updatedAt = new Date().toISOString();
          }

          const primaryResource = resources[0] ?? null;
          if (primaryResource) {
            const resourceTitle = `[${calendarDate}] Fonte | ${lesson.subject} | ${lesson.title}`;
            const existingLink = data.materials.find((item) => item.userId === user.id && item.title === resourceTitle);
            if (!existingLink) {
              data.materials.push(
                createMaterialRecord({
                  userId: user.id,
                  title: resourceTitle,
                  type: MaterialType.LINK,
                  url: primaryResource.url,
                  notes: `${primaryResource.label}. Material principal para apoiar este bloco da semana 1.`,
                }),
              );
            } else {
              existingLink.url = primaryResource.url;
              existingLink.notes = `${primaryResource.label}. Material principal para apoiar este bloco da semana 1.`;
              existingLink.updatedAt = new Date().toISOString();
            }
          }

          lesson.videos.forEach((videoUrl, videoIndex) => {
            const videoTitle = `[${calendarDate}] Semana ${week.week} | ${lesson.title} | Aula ${videoIndex + 1}`;
            const existingVideo = data.video_lessons.find((item) => item.userId === user.id && item.title === videoTitle);
            if (!existingVideo) {
              data.video_lessons.push(
                createVideoLessonRecord({
                  userId: user.id,
                  subjectId,
                  topicId: null,
                  title: videoTitle,
                  url: videoUrl,
                  category: toVideoCategory(lesson.subject),
                  watched: false,
                  favorite: false,
                }),
              );
            }
          });

          markdownLines.push(`## ${calendarDate} | ${lesson.subject} | ${lesson.title}`);
          markdownLines.push(buildNote(day, lesson, resources, calendarDate));
          markdownLines.push("");
        }
      }
    }
  });

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, markdownLines.join("\n"));
  console.log("Materiais semanais importados com sucesso.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
