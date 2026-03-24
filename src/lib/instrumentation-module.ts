import { TopicModule, TopicPriority } from "@/lib/types";

export const instrumentationBlocks = [
  {
    name: "BLOCO I" as const,
    topics: [
      { slug: "metrologia", title: "Metrologia", description: "VIM, conceitos metrológicos, calibração, rastreabilidade e incerteza de medição.", priority: TopicPriority.NORMAL, links: [{ title: "Metrologia industrial e calibração", url: "https://www.youtube.com/results?search_query=metrologia+industrial+calibracao" }] },
      { slug: "valvulas-de-controle", title: "Válvulas de controle", description: "Características, atuadores, posicionadores, falhas e aplicações em malhas industriais.", priority: TopicPriority.NORMAL, links: [{ title: "Válvula de controle instrumentação", url: "https://www.youtube.com/results?search_query=valvula+de+controle+instrumentacao" }] },
      { slug: "isa-5-1", title: "ISA 5.1", description: "Simbologia, identificação funcional e leitura de diagramas de instrumentação.", priority: TopicPriority.NORMAL, links: [{ title: "ISA 5.1 instrumentação industrial", url: "https://www.youtube.com/results?search_query=isa+5.1+instrumentacao+industrial" }] },
      { slug: "sensores-de-pressao", title: "Sensores de pressão", description: "Princípios de medição, transmissores, selos, ranges e aplicações em processo.", priority: TopicPriority.NORMAL, links: [{ title: "Sensor de pressão instrumentação", url: "https://www.youtube.com/results?search_query=sensor+de+pressao+instrumentacao" }, { title: "Transmissor de pressão industrial", url: "https://www.youtube.com/results?search_query=transmissor+de+pressao+industrial" }] },
      { slug: "sensores-de-temperatura", title: "Sensores de temperatura", description: "Termopares, RTDs, termistores, transmissores e cuidados de instalação.", priority: TopicPriority.NORMAL, links: [{ title: "Sensor de temperatura industrial", url: "https://www.youtube.com/results?search_query=sensor+de+temperatura+industrial" }] },
      { slug: "sensores-de-nivel", title: "Sensores de nível", description: "Boia, pressão diferencial, ultrassom, radar e interfaces líquido-gás.", priority: TopicPriority.NORMAL, links: [{ title: "Sensor de nível instrumentação", url: "https://www.youtube.com/results?search_query=sensor+de+nivel+instrumentacao" }] },
      { slug: "sensores-de-vazao", title: "Sensores de vazão", description: "Placa de orifício, vortex, magnético, Coriolis e medição volumétrica ou mássica.", priority: TopicPriority.NORMAL, links: [{ title: "Sensor de vazão industrial", url: "https://www.youtube.com/results?search_query=sensor+de+vazao+industrial" }] },
      { slug: "medicao-de-vibracao", title: "Medição de vibração", description: "Grandezas vibratórias, acelerômetros, monitoração e análise preditiva.", priority: TopicPriority.NORMAL, links: [{ title: "Medição de vibração industrial", url: "https://www.youtube.com/results?search_query=medicao+de+vibracao+industrial" }] },
      { slug: "medicao-de-torque", title: "Medição de torque", description: "Torquímetros, sensores, princípios de deformação e aplicações mecânicas.", priority: TopicPriority.NORMAL, links: [{ title: "Medição de torque industrial", url: "https://www.youtube.com/results?search_query=medicao+de+torque+industrial" }] },
      { slug: "medicao-de-densidade", title: "Medição de densidade", description: "Densímetros, compensação e aplicação em processos líquidos e polpas.", priority: TopicPriority.NORMAL, links: [{ title: "Medição de densidade industrial", url: "https://www.youtube.com/results?search_query=medicao+de+densidade+industrial" }] },
      { slug: "instrumentacao-analitica", title: "Instrumentação analítica", description: "Medições de pH, condutividade, gases, composição química e analisadores de processo.", priority: TopicPriority.NORMAL, links: [{ title: "Instrumentação analítica industrial", url: "https://www.youtube.com/results?search_query=instrumentacao+analitica+industrial" }] },
      { slug: "tipos-de-manutencao", title: "Tipos de manutenção", description: "Corretiva, preventiva, preditiva e detectiva aplicadas ao contexto industrial.", priority: TopicPriority.NORMAL, links: [{ title: "Tipos de manutenção industrial", url: "https://www.youtube.com/results?search_query=tipos+de+manutencao+industrial" }] },
    ],
  },
  {
    name: "BLOCO II" as const,
    topics: [
      { slug: "clp", title: "CLP", description: "Arquitetura, módulos, entradas e saídas, scans e lógica de automação.", priority: TopicPriority.NORMAL, links: [{ title: "CLP ladder iniciante", url: "https://www.youtube.com/results?search_query=clp+ladder+iniciante" }] },
      { slug: "linguagem-ladder", title: "Ladder", description: "Contatos, bobinas, temporizadores, contadores e intertravamentos em Ladder.", priority: TopicPriority.NORMAL, links: [{ title: "Ladder para iniciantes", url: "https://www.youtube.com/results?search_query=linguagem+ladder+clp" }] },
      { slug: "blocos-funcionais", title: "Blocos funcionais", description: "Programação FBD, encadeamento lógico e representação por blocos.", priority: TopicPriority.NORMAL, links: [{ title: "CLP blocos funcionais", url: "https://www.youtube.com/results?search_query=clp+blocos+funcionais" }] },
      { slug: "texto-estruturado", title: "Texto estruturado", description: "Sintaxe IEC 61131-3, estruturas condicionais, laços e variáveis.", priority: TopicPriority.NORMAL, links: [{ title: "Texto estruturado CLP", url: "https://www.youtube.com/results?search_query=texto+estruturado+clp" }] },
      { slug: "pid", title: "PID", description: "Ações proporcional, integral e derivativa, sintonia e comportamento de malhas.", priority: TopicPriority.NORMAL, links: [{ title: "Controle PID industrial", url: "https://www.youtube.com/results?search_query=controle+PID+industrial" }] },
      { slug: "redes-industriais", title: "Redes industriais", description: "Profibus, Foundation Fieldbus, Modbus, Ethernet/IP e comunicação em automação.", priority: TopicPriority.NORMAL, links: [{ title: "Redes industriais automação", url: "https://www.youtube.com/results?search_query=redes+industriais+automacao" }] },
    ],
  },
  {
    name: "BLOCO III" as const,
    topics: [
      { slug: "eletronica-analogica", title: "Eletrônica analógica", description: "Amplificadores, filtros, sinais contínuos e instrumentação de condicionamento.", priority: TopicPriority.NORMAL, links: [{ title: "Eletrônica analógica industrial", url: "https://www.youtube.com/results?search_query=eletronica+analogica+industrial" }] },
      { slug: "eletronica-digital", title: "Eletrônica digital", description: "Portas lógicas, álgebra booleana, flip-flops, registradores e sinais discretos.", priority: TopicPriority.NORMAL, links: [{ title: "Eletrônica digital básica", url: "https://www.youtube.com/results?search_query=eletronica+digital+basica" }] },
      { slug: "circuitos-eletricos", title: "Circuitos elétricos", description: "Lei de Ohm, associações, potência, medições e análise básica de circuitos.", priority: TopicPriority.NORMAL, links: [{ title: "Circuitos elétricos para concursos", url: "https://www.youtube.com/results?search_query=circuitos+eletricos+para+concursos" }] },
      { slug: "pneumatica", title: "Pneumática", description: "Ar comprimido, atuadores, válvulas, preparação de ar e comandos pneumáticos.", priority: TopicPriority.NORMAL, links: [{ title: "Pneumática industrial", url: "https://www.youtube.com/results?search_query=pneumatica+industrial" }] },
      { slug: "hidraulica", title: "Hidráulica", description: "Bombas, atuadores, comandos, fluidos e circuitos hidráulicos.", priority: TopicPriority.NORMAL, links: [{ title: "Hidráulica industrial", url: "https://www.youtube.com/results?search_query=hidraulica+industrial" }] },
    ],
  },
];

export const mathematicsTopics = [
  { slug: "conjuntos", title: "Conjuntos", description: "Operações, representação, inclusão, pertinência e conjuntos numéricos.", priority: TopicPriority.NORMAL, links: [{ title: "Conjuntos matemática", url: "https://www.youtube.com/results?search_query=conjuntos+matematica" }] },
  { slug: "funcoes", title: "Funções", description: "Funções exponenciais, logarítmicas e trigonométricas aplicadas ao edital.", priority: TopicPriority.HIGH, links: [{ title: "Função exponencial", url: "https://www.youtube.com/results?search_query=função+exponencial" }, { title: "Função logarítmica e trigonometria", url: "https://www.youtube.com/results?search_query=funcao+logaritmica+trigonometria" }] },
  { slug: "equacoes", title: "Equações", description: "Equações do 1º e 2º grau, resolução, raízes e aplicações.", priority: TopicPriority.HIGH, links: [{ title: "Equações do 1 e 2 grau", url: "https://www.youtube.com/results?search_query=equacoes+1+e+2+grau" }] },
  { slug: "analise-combinatoria", title: "Análise combinatória", description: "Princípio fundamental da contagem, arranjos, combinações e permutações.", priority: TopicPriority.NORMAL, links: [{ title: "Análise combinatória", url: "https://www.youtube.com/results?search_query=analise+combinatoria" }] },
  { slug: "pa-pg", title: "PA e PG", description: "Progressões aritméticas e geométricas, termos gerais e somatórios.", priority: TopicPriority.NORMAL, links: [{ title: "PA e PG", url: "https://www.youtube.com/results?search_query=pa+e+pg" }] },
  { slug: "matrizes-e-sistemas", title: "Matrizes e sistemas", description: "Operações com matrizes, determinantes e resolução de sistemas lineares.", priority: TopicPriority.NORMAL, links: [{ title: "Matrizes e sistemas lineares", url: "https://www.youtube.com/results?search_query=matrizes+sistemas+lineares" }] },
  { slug: "geometria", title: "Geometria", description: "Geometria plana e espacial, áreas, volumes e relações métricas.", priority: TopicPriority.NORMAL, links: [{ title: "Geometria para concursos", url: "https://www.youtube.com/results?search_query=geometria+para+concursos" }] },
  { slug: "geometria-analitica", title: "Geometria analítica", description: "Plano cartesiano, reta, circunferência, distância e inclinação.", priority: TopicPriority.NORMAL, links: [{ title: "Geometria analítica", url: "https://www.youtube.com/results?search_query=geometria+analitica" }] },
  { slug: "matematica-financeira", title: "Matemática financeira", description: "Juros simples e compostos, descontos, equivalência e séries de pagamentos.", priority: TopicPriority.HIGH, links: [{ title: "Juros compostos", url: "https://www.youtube.com/results?search_query=juros+compostos" }, { title: "Matemática financeira para concursos", url: "https://www.youtube.com/results?search_query=matematica+financeira+para+concursos" }] },
];

export const portugueseTopics = [
  { slug: "interpretacao-de-texto", title: "Interpretação de texto", description: "Compreensão global, inferência, implícitos e leitura estratégica no estilo de concurso.", priority: TopicPriority.HIGH, links: [{ title: "Interpretação de texto concurso", url: "https://www.youtube.com/results?search_query=interpretação+de+texto+concurso" }] },
  { slug: "tipos-textuais", title: "Tipos textuais", description: "Narração, descrição, dissertação, injunção e tipologia textual aplicada.", priority: TopicPriority.NORMAL, links: [{ title: "Tipos textuais concurso", url: "https://www.youtube.com/results?search_query=tipos+textuais+concurso" }] },
  { slug: "ortografia", title: "Ortografia", description: "Grafia oficial, acentuação, uso do hífen e emprego correto das palavras.", priority: TopicPriority.NORMAL, links: [{ title: "Ortografia concurso", url: "https://www.youtube.com/results?search_query=ortografia+concurso" }] },
  { slug: "classes-de-palavras", title: "Classes de palavras", description: "Substantivo, adjetivo, verbo, pronome, advérbio e funções morfológicas.", priority: TopicPriority.NORMAL, links: [{ title: "Classes de palavras concurso", url: "https://www.youtube.com/results?search_query=classes+de+palavras+concurso" }] },
  { slug: "concordancia", title: "Concordância", description: "Concordância verbal e nominal com foco em construções recorrentes de prova.", priority: TopicPriority.HIGH, links: [{ title: "Concordância verbal e nominal", url: "https://www.youtube.com/results?search_query=concordancia+verbal+nominal" }] },
  { slug: "regencia", title: "Regência", description: "Regência verbal e nominal, crase e relação entre termos da oração.", priority: TopicPriority.NORMAL, links: [{ title: "Regência concurso", url: "https://www.youtube.com/results?search_query=regencia+concurso" }] },
  { slug: "pontuacao", title: "Pontuação", description: "Emprego de vírgula, ponto e vírgula, dois-pontos e impacto na interpretação.", priority: TopicPriority.HIGH, links: [{ title: "Pontuação concurso", url: "https://www.youtube.com/results?search_query=pontuação+concurso" }] },
  { slug: "reescrita", title: "Reescrita", description: "Equivalência semântica, coesão, coêrencia e transformação de estruturas.", priority: TopicPriority.NORMAL, links: [{ title: "Reescrita de textos concurso", url: "https://www.youtube.com/results?search_query=reescrita+de+textos+concurso" }] },
];

export const moduleMeta = {
  [TopicModule.INSTRUMENTACAO]: {
    title: "Instrumentação Industrial – Petrobras",
    route: "/instrumentacao-industrial",
  },
  [TopicModule.MATEMATICA]: {
    title: "Matemática – Petrobras",
    route: "/matematica-petrobras",
  },
  [TopicModule.PORTUGUES]: {
    title: "Português – Petrobras",
    route: "/portugues-petrobras",
  },
};
