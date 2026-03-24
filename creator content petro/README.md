# AGENTE PETROBRAS - Tecnico de Manutencao / Instrumentacao

Gerador de conteudo semanal para o concurso da Petrobras no estilo CEBRASPE, com foco em:
- planejamento semanal
- aulas e links de video
- pegadinhas da banca
- questoes comentadas
- revisao espacada

## Estrutura corrigida

```text
creator content petro/
  README.md
  prova-2023-instrumentacao.md
  pegadinhas.md
  plano-100-dias.md
  semana-01.json
  knowledge/
    edital.md
    estrategia-cebraspe.md
    prova-2023-basicos.md
    prova-2023-instrumentacao.md
    pegadinhas.md
    plano-100-dias.md
  prompts/
    system-prompt.md
  schemas/
    lesson.schema.json
    week.schema.json
  commands/
    commands.md
  output/
    semana-01.json
```

## Fonte de verdade

Os arquivos desta pasta foram corrigidos com base na prova e no gabarito oficial de 30/04/2023.

Resumo factual:
- prova total: 100 itens
- basicos: 40 itens
- instrumentacao: 60 itens
- itens anulados em instrumentacao: 8
- formato: certo/errado

### Gabarito basicos 2023

```text
1-20:  E E C C E C C E C C C E E E C C C E E E
21-40: C C E E C E E X C E E E E C E C C C C E
```

### Gabarito instrumentacao 2023

```text
41-60: E C C C E E E C C E C E C C E E C E E C
61-80: C C E E C E C E C X C E C E E C C E E E
81-100: C C C X E C E C X X C C X X X E E X E E
```

## Prioridade de temas por incidencia

- Alta: Sensores (13), PID + CLP/Ladder (10), Eletronica + Circuitos (9)
- Media: Redes industriais (5), Valvulas + ISA 5.1 (5), Metrologia (3)
- Complementar: Manutencao (4), Outras medicoes (6), Instrumentacao analitica (2), Pneumatica/Hidraulica (6)

## Como usar no Claude

1. Ler [prompts/system-prompt.md](/c:/projects/Petrobrás/creator%20content%20petro/prompts/system-prompt.md).
2. Usar a pasta `knowledge/` como base principal.
3. Gerar a semana em JSON seguindo [schemas/week.schema.json](/c:/projects/Petrobrás/creator%20content%20petro/schemas/week.schema.json).
4. Salvar o resultado em `output/semana-XX.json`.

## Comandos sugeridos

Ver [commands/commands.md](/c:/projects/Petrobrás/creator%20content%20petro/commands/commands.md).
