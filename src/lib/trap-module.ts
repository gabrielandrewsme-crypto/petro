import { TrapDifficulty, TrapTheme, TrapType } from "@/lib/types";

type TrapSeed = {
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
};

const baseTraps: TrapSeed[] = [
  {
    slug: "precisao-exatidao-1",
    theme: TrapTheme.METROLOGIA,
    topic: "Metrologia",
    title: "Precisão x exatidão",
    difficulty: TrapDifficulty.EASY,
    frequencyScore: 9,
    errorRateSeed: 72,
    trapType: TrapType.INVERSAO,
    statement: "Um instrumento preciso necessariamente apresenta pequeno erro sistemático e, por isso, mede com exatidão elevada.",
    correctAnswer: false,
    explanation: "Precisão indica repetibilidade; exatidão indica proximidade do valor verdadeiro. Um instrumento pode ser preciso e inexato se repetir o mesmo viés.",
    trapReason: "A banca troca propriedades metrológicas que costumam aparecer juntas em textos introdutórios.",
    whereStudentFails: "O aluno associa repetibilidade a acerto absoluto sem testar a existência de viés.",
    avoidError: "Separe mentalmente dispersão de tendência. Primeiro pense em espalhamento; depois em proximidade do valor real.",
  },
  {
    slug: "erro-absoluto-relativo-1",
    theme: TrapTheme.METROLOGIA,
    topic: "Metrologia",
    title: "Erro absoluto x relativo",
    difficulty: TrapDifficulty.EASY,
    frequencyScore: 8,
    errorRateSeed: 66,
    trapType: TrapType.UNIDADE,
    statement: "Erro relativo é a diferença algébrica entre o valor medido e o valor verdadeiro, expressa na mesma unidade da medição.",
    correctAnswer: false,
    explanation: "A definição dada é de erro absoluto. Erro relativo é a razão entre erro absoluto e valor de referência, usualmente em fração ou porcentagem.",
    trapReason: "A banca troca a fórmula mantendo linguagem técnica convincente.",
    whereStudentFails: "O estudante lembra da palavra erro, mas ignora o papel da normalização pelo valor de referência.",
    avoidError: "Quando aparecer relativo, procure divisão ou porcentagem. Se estiver na mesma unidade, desconfie.",
  },
  {
    slug: "fail-open-fail-close-1",
    theme: TrapTheme.VALVULAS,
    topic: "Válvulas de controle",
    title: "Fail open x fail close",
    difficulty: TrapDifficulty.MEDIUM,
    frequencyScore: 8,
    errorRateSeed: 64,
    trapType: TrapType.VALVULA_ATUADOR,
    statement: "Uma válvula fail close é aquela que, na perda do sinal pneumático, assume a posição totalmente aberta para garantir vazão mínima no processo.",
    correctAnswer: false,
    explanation: "Fail close significa falha para fechada. Na perda da energia de atuação, a válvula vai para a posição fechada.",
    trapReason: "A expressão em inglês induz leitura apressada e a banca inverte o efeito final.",
    whereStudentFails: "O aluno foca na justificativa operacional e esquece o significado literal do fail.",
    avoidError: "Leia o termo de segurança primeiro: fail open abre na falha; fail close fecha na falha.",
  },
  {
    slug: "atuacao-pneumatica-eletrica-1",
    theme: TrapTheme.VALVULAS,
    topic: "Válvulas de controle",
    title: "Atuação pneumática x elétrica",
    difficulty: TrapDifficulty.MEDIUM,
    frequencyScore: 7,
    errorRateSeed: 58,
    trapType: TrapType.GENERALIZACAO,
    statement: "Todo atuador pneumático opera sem necessidade de posicionador, pois a pressão do ar garante posição proporcional exata da haste.",
    correctAnswer: false,
    explanation: "Atuadores pneumáticos frequentemente usam posicionadores para melhorar precisão, compensar forças e garantir correspondência entre sinal e posição.",
    trapReason: "A banca generaliza uma condição simplificada para todos os casos.",
    whereStudentFails: "O aluno lembra do acionamento por ar, mas não da malha de posicionamento.",
    avoidError: "Palavras como todo, sempre e nunca devem acender alerta em instrumentação.",
  },
  {
    slug: "rtd-termopar-1",
    theme: TrapTheme.SENSORES,
    topic: "Sensores de temperatura",
    title: "RTD x termopar",
    difficulty: TrapDifficulty.MEDIUM,
    frequencyScore: 9,
    errorRateSeed: 71,
    trapType: TrapType.INVERSAO,
    statement: "Termopares medem temperatura pela variação ôhmica de um metal puro, enquanto RTDs operam pelo efeito Seebeck em junções metálicas.",
    correctAnswer: false,
    explanation: "A afirmação inverte os princípios. RTDs usam variação da resistência elétrica; termopares usam efeito Seebeck.",
    trapReason: "Conceitos clássicos são trocados mantendo a terminologia correta.",
    whereStudentFails: "O estudante reconhece os nomes, mas confunde o princípio físico.",
    avoidError: "Associe RTD a resistência e termopar a tensão gerada por junções metálicas.",
  },
  {
    slug: "nivel-indireto-1",
    theme: TrapTheme.SENSORES,
    topic: "Sensores de nível",
    title: "Medição indireta de nível",
    difficulty: TrapDifficulty.MEDIUM,
    frequencyScore: 8,
    errorRateSeed: 62,
    trapType: TrapType.GENERALIZACAO,
    statement: "Toda medição de nível por pressão diferencial independe da densidade do fluido, pois a altura da coluna é a única variável relevante.",
    correctAnswer: false,
    explanation: "A pressão hidrostática depende de altura, gravidade e densidade. Mudanças na densidade alteram a leitura inferida de nível.",
    trapReason: "A banca elimina uma variável da equação para simplificar falsamente o raciocínio.",
    whereStudentFails: "O aluno lembra da coluna hidrostática, mas esquece o fator densidade.",
    avoidError: "Sempre recite p = rho g h ao pensar em nível por diferencial de pressão.",
  },
  {
    slug: "acao-pid-1",
    theme: TrapTheme.PID,
    topic: "PID",
    title: "Ação integral",
    difficulty: TrapDifficulty.MEDIUM,
    frequencyScore: 9,
    errorRateSeed: 69,
    trapType: TrapType.INVERSAO,
    statement: "A ação integral aumenta a rapidez inicial da resposta sem alterar o erro em regime permanente.",
    correctAnswer: false,
    explanation: "A ação integral atua principalmente na eliminação do erro em regime permanente; pode inclusive piorar transitórios se exagerada.",
    trapReason: "A banca atribui à integral um papel típico da ação proporcional.",
    whereStudentFails: "O aluno decora que integral melhora controle, mas não associa ao erro estacionário.",
    avoidError: "Memorize a função dominante: P reage ao erro atual, I elimina offset, D antecipa tendência.",
  },
  {
    slug: "estabilidade-rapidez-1",
    theme: TrapTheme.PID,
    topic: "PID",
    title: "Estabilidade x rapidez",
    difficulty: TrapDifficulty.HARD,
    frequencyScore: 7,
    errorRateSeed: 61,
    trapType: TrapType.GRAFICO,
    statement: "Em uma malha estável, a redução do tempo de acomodação sempre implica aumento de estabilidade e diminuição do sobresinal.",
    correctAnswer: false,
    explanation: "Rapidez e estabilidade são objetivos relacionados, mas há trade-offs. Ajustes para resposta mais rápida podem elevar sobresinal e reduzir margens de estabilidade.",
    trapReason: "A banca mistura conceitos de desempenho como se andassem sempre juntos.",
    whereStudentFails: "O estudante associa melhoria em um índice à melhora universal da malha.",
    avoidError: "Pense em compromisso de sintonia: acelerar demais costuma cobrar preço em overshoot ou robustez.",
  },
  {
    slug: "ladder-basico-1",
    theme: TrapTheme.CLP,
    topic: "CLP",
    title: "Lógica Ladder básica",
    difficulty: TrapDifficulty.EASY,
    frequencyScore: 8,
    errorRateSeed: 57,
    trapType: TrapType.GENERALIZACAO,
    statement: "Em Ladder, dois contatos normalmente abertos em paralelo implementam uma condição lógica E entre as entradas correspondentes.",
    correctAnswer: false,
    explanation: "Contatos em paralelo representam condição OU. Para condição E, usam-se contatos em série.",
    trapReason: "A banca troca o mapeamento visual entre série/paralelo e lógica booleana.",
    whereStudentFails: "O aluno transporta regra de circuitos físicos sem revisar a lógica Ladder.",
    avoidError: "Leia a continuidade da corrente: série exige ambos fechados; paralelo aceita qualquer ramo.",
  },
  {
    slug: "isa-identificacao-1",
    theme: TrapTheme.ISA,
    topic: "ISA 5.1",
    title: "Identificação de instrumentos",
    difficulty: TrapDifficulty.MEDIUM,
    frequencyScore: 8,
    errorRateSeed: 65,
    trapType: TrapType.ISA_SIMBOLOGIA,
    statement: "Na norma ISA 5.1, a primeira letra do tag identifica a função do instrumento, ao passo que a segunda letra identifica a variável medida.",
    correctAnswer: false,
    explanation: "Na ISA 5.1, a primeira letra costuma indicar a variável medida ou iniciadora. As letras seguintes indicam função, como indicação, transmissão ou controle.",
    trapReason: "A banca inverte a lógica do tag sem mexer no restante da frase.",
    whereStudentFails: "O aluno lembra que as letras têm papéis distintos, mas troca a ordem.",
    avoidError: "Pense no tag começando pelo que está sendo medido e depois pelo que o instrumento faz.",
  },
];

const expansions = [
  { theme: TrapTheme.METROLOGIA, topic: "Metrologia", prefix: "Precisão x exatidão", trapType: TrapType.INVERSAO, difficulty: TrapDifficulty.EASY },
  { theme: TrapTheme.VALVULAS, topic: "Válvulas de controle", prefix: "Válvulas e atuadores", trapType: TrapType.VALVULA_ATUADOR, difficulty: TrapDifficulty.MEDIUM },
  { theme: TrapTheme.SENSORES, topic: "Sensores", prefix: "Sensores industriais", trapType: TrapType.UNIDADE, difficulty: TrapDifficulty.MEDIUM },
  { theme: TrapTheme.PID, topic: "PID", prefix: "Controle PID", trapType: TrapType.GRAFICO, difficulty: TrapDifficulty.HARD },
  { theme: TrapTheme.CLP, topic: "CLP", prefix: "Lógica Ladder", trapType: TrapType.GENERALIZACAO, difficulty: TrapDifficulty.EASY },
  { theme: TrapTheme.ISA, topic: "ISA 5.1", prefix: "Simbologia ISA", trapType: TrapType.ISA_SIMBOLOGIA, difficulty: TrapDifficulty.MEDIUM },
  { theme: TrapTheme.REDES, topic: "Redes industriais", prefix: "Comunicação industrial", trapType: TrapType.GENERALIZACAO, difficulty: TrapDifficulty.MEDIUM },
  { theme: TrapTheme.ELETRONICA, topic: "Eletrônica", prefix: "Eletrônica industrial", trapType: TrapType.INVERSAO, difficulty: TrapDifficulty.HARD },
];

export const trapQuestionsSeed: TrapSeed[] = (() => {
  const items = [...baseTraps];
  let index = 1;
  while (items.length < 50) {
    const pattern = expansions[index % expansions.length];
    const count = items.filter((item) => item.theme === pattern.theme).length + 1;
    items.push({
      slug: `${pattern.prefix.toLowerCase().replace(/\s+/g, "-")}-${count}`,
      theme: pattern.theme,
      topic: pattern.topic,
      title: `${pattern.prefix} ${count}`,
      difficulty: pattern.difficulty,
      frequencyScore: 5 + (index % 5),
      errorRateSeed: 45 + ((index * 7) % 35),
      trapType: pattern.trapType,
      statement: `No contexto de ${pattern.topic.toLowerCase()}, é correto afirmar que a interpretação mais intuitiva do conceito sempre se mantém válida em qualquer condição operacional.`,
      correctAnswer: false,
      explanation: `A assertiva generaliza ou inverte um conceito de ${pattern.topic.toLowerCase()}. Em provas CEBRASPE, a redação induz leitura rápida, mas a validade depende do contexto técnico específico.`,
      trapReason: `A pegadinha explora ${pattern.trapType.toLowerCase().replace("_", " ")} e usa linguagem absoluta para parecer correta.`,
      whereStudentFails: "O candidato reconhece o assunto, mas não testa exceções, condições de operação ou definições normativas.",
      avoidError: "Procure termos absolutos, compare com a definição técnica e confirme se a frase vale para todos os casos.",
    });
    index += 1;
  }
  return items.slice(0, 50);
})();
