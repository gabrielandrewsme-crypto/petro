import { readFile } from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";
import { mutateDb } from "../src/lib/db";
import { QuestionSource, TopicModule } from "../src/lib/types";

type ImportedQuestion = {
  id: string;
  source: QuestionSource;
  year: number;
  examTitle: string;
  module: TopicModule;
  discipline: string;
  topicSlug: string;
  topicTitle: string;
  itemNumber: number;
  statement: string;
  correctAnswer: boolean | null;
  isAnnulled: boolean;
};

const root = process.cwd();

const basicTopicMap = [
  { from: 1, to: 3, module: TopicModule.PORTUGUES, discipline: "Português", topicSlug: "interpretacao-de-texto", topicTitle: "Interpretação de texto" },
  { from: 4, to: 8, module: TopicModule.PORTUGUES, discipline: "Português", topicSlug: "classes-de-palavras", topicTitle: "Classes de palavras" },
  { from: 9, to: 14, module: TopicModule.PORTUGUES, discipline: "Português", topicSlug: "interpretacao-de-texto", topicTitle: "Interpretação de texto" },
  { from: 15, to: 20, module: TopicModule.PORTUGUES, discipline: "Português", topicSlug: "reescrita", topicTitle: "Reescrita" },
  { from: 21, to: 24, module: TopicModule.MATEMATICA, discipline: "Matemática", topicSlug: "pa-pg", topicTitle: "PA e PG" },
  { from: 25, to: 26, module: TopicModule.MATEMATICA, discipline: "Matemática", topicSlug: "analise-combinatoria", topicTitle: "Análise combinatória" },
  { from: 27, to: 27, module: TopicModule.MATEMATICA, discipline: "Matemática", topicSlug: "conjuntos", topicTitle: "Conjuntos" },
  { from: 28, to: 31, module: TopicModule.MATEMATICA, discipline: "Matemática", topicSlug: "funcoes", topicTitle: "Funções" },
  { from: 32, to: 33, module: TopicModule.MATEMATICA, discipline: "Matemática", topicSlug: "matrizes-e-sistemas", topicTitle: "Matrizes e sistemas" },
  { from: 34, to: 37, module: TopicModule.MATEMATICA, discipline: "Matemática", topicSlug: "geometria", topicTitle: "Geometria" },
  { from: 38, to: 39, module: TopicModule.MATEMATICA, discipline: "Matemática", topicSlug: "geometria-analitica", topicTitle: "Geometria analítica" },
  { from: 40, to: 40, module: TopicModule.MATEMATICA, discipline: "Matemática", topicSlug: "matematica-financeira", topicTitle: "Matemática financeira" },
];

const instrumentationTopicMap = [
  { from: 41, to: 43, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "metrologia", topicTitle: "Metrologia" },
  { from: 44, to: 44, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "sensores-de-pressao", topicTitle: "Sensores de pressão" },
  { from: 45, to: 48, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "sensores-de-temperatura", topicTitle: "Sensores de temperatura" },
  { from: 49, to: 50, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "sensores-de-vazao", topicTitle: "Sensores de vazão" },
  { from: 51, to: 53, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "sensores-de-nivel", topicTitle: "Sensores de nível" },
  { from: 54, to: 56, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "valvulas-de-controle", topicTitle: "Válvulas de controle" },
  { from: 57, to: 58, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "isa-5-1", topicTitle: "ISA 5.1" },
  { from: 59, to: 64, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "medicao-de-vibracao", topicTitle: "Outras medições" },
  { from: 65, to: 66, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "instrumentacao-analitica", topicTitle: "Instrumentação analítica" },
  { from: 67, to: 70, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "tipos-de-manutencao", topicTitle: "Tipos de manutenção" },
  { from: 71, to: 75, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "linguagem-ladder", topicTitle: "Ladder" },
  { from: 76, to: 80, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "pid", topicTitle: "PID" },
  { from: 81, to: 85, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "redes-industriais", topicTitle: "Redes industriais" },
  { from: 86, to: 88, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "eletronica-analogica", topicTitle: "Eletrônica analógica" },
  { from: 89, to: 91, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "eletronica-digital", topicTitle: "Eletrônica digital" },
  { from: 92, to: 94, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "circuitos-eletricos", topicTitle: "Circuitos elétricos" },
  { from: 95, to: 100, module: TopicModule.INSTRUMENTACAO, discipline: "Instrumentação", topicSlug: "pneumatica", topicTitle: "Pneumática e hidráulica" },
];

async function extractPdfText(relativeFile: string) {
  const buffer = await readFile(path.join(root, relativeFile));
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

function parseQuestions(text: string, rangeStart: number, rangeEnd: number) {
  const cleaned = text
    .replace(/\r/g, "")
    .replace(/^.*?-- (?:CONHECIMENTOS BÁSICOS|CONHECIMENTOS ESPECÍFICOS) --\s*/s, "")
    .replace(/\nEspaço livre/g, "\n")
    .replace(/\n-- \d+ of \d+ --/g, "")
    .replace(/\n\d+\S*\s+CEBRASPE[^\n]*/g, "")
    .replace(/\nTexto [^\n]+/g, "\n")
    .replace(/\nInternet:[^\n]+/g, "\n");

  const matches = [...cleaned.matchAll(/(?:^|\n)(\d{1,3})\s+([\s\S]*?)(?=(?:\n\d{1,3}\s+)|$)/g)];
  const items = new Map<number, string>();

  for (const match of matches) {
    const itemNumber = Number(match[1]);
    if (itemNumber < rangeStart || itemNumber > rangeEnd) {
      continue;
    }

    const statement = normalizeText(match[2] ?? "");
    items.set(itemNumber, statement);
  }

  return items;
}

function parseAnswerKey(text: string, firstItem: number, lastItem: number) {
  const answerLines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[CEX](?:\s+[CEX])*$/.test(line));

  const answers = answerLines.flatMap((line) => line.split(/\s+/));
  const expectedCount = lastItem - firstItem + 1;
  if (answers.length < expectedCount) {
    throw new Error(`Gabarito insuficiente para os itens ${firstItem}-${lastItem}.`);
  }

  const result = new Map<number, string>();
  for (let item = firstItem; item <= lastItem; item += 1) {
    result.set(item, answers[item - firstItem] ?? "X");
  }
  return result;
}

function normalizeText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s([,.;:!?])/g, "$1")
    .trim();
}

function buildImportedQuestions(input: {
  statements: Map<number, string>;
  answers: Map<number, string>;
  topicMap: typeof basicTopicMap;
  source: QuestionSource;
  examTitle: string;
}) {
  const timestampedQuestions: ImportedQuestion[] = [];

  for (const [itemNumber, statement] of input.statements.entries()) {
    const topic = input.topicMap.find((entry) => itemNumber >= entry.from && itemNumber <= entry.to);
    if (!topic) {
      throw new Error(`Item ${itemNumber} sem mapeamento de tópico.`);
    }

    const answer = input.answers.get(itemNumber) ?? "X";
    timestampedQuestions.push({
      id: `${input.source}-${itemNumber}`,
      source: input.source,
      year: 2023,
      examTitle: input.examTitle,
      module: topic.module,
      discipline: topic.discipline,
      topicSlug: topic.topicSlug,
      topicTitle: topic.topicTitle,
      itemNumber,
      statement,
      correctAnswer: answer === "X" ? null : answer === "C",
      isAnnulled: answer === "X",
    });
  }

  return timestampedQuestions.sort((a, b) => a.itemNumber - b.itemNumber);
}

async function main() {
  const [basicExamText, basicAnswerText, instrumentationExamText, instrumentationAnswerText] = await Promise.all([
    extractPdfText("imports/prova-portugues-matematica.pdf"),
    extractPdfText("imports/gabarito-portugues-matematica.pdf"),
    extractPdfText("imports/prova-enfase-instrumentacao.pdf"),
    extractPdfText("imports/gabarito-enfase-instrumentacao.pdf"),
  ]);

  const basicQuestions = buildImportedQuestions({
    statements: parseQuestions(basicExamText, 1, 40),
    answers: parseAnswerKey(basicAnswerText, 1, 40),
    topicMap: basicTopicMap,
    source: QuestionSource.PETROBRAS_2023_BASICO,
    examTitle: "Petrobras 2023 · Português e Matemática",
  });

  const instrumentationQuestions = buildImportedQuestions({
    statements: parseQuestions(instrumentationExamText, 41, 100),
    answers: parseAnswerKey(instrumentationAnswerText, 41, 100),
    topicMap: instrumentationTopicMap,
    source: QuestionSource.PETROBRAS_2023_INSTRUMENTACAO,
    examTitle: "Petrobras 2023 · Ênfase Instrumentação",
  });

  const imported = [...basicQuestions, ...instrumentationQuestions];
  const importIds = new Set(imported.map((item) => item.id));

  await mutateDb((data) => {
    const now = new Date().toISOString();
    const existingById = new Map(data.question_bank.map((item) => [item.id, item]));

    data.question_bank = [
      ...data.question_bank.filter((item) => !importIds.has(item.id)),
      ...imported.map((item) => {
        const existing = existingById.get(item.id);
        return {
          ...item,
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
        };
      }),
    ].sort((a, b) => a.itemNumber - b.itemNumber);
  });

  console.log(`Questões importadas: ${imported.length}`);
  console.log(`Português/Matemática: ${basicQuestions.length}`);
  console.log(`Instrumentação: ${instrumentationQuestions.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
