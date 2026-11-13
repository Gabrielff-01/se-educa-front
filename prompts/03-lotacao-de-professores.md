# 03. Lotação de professores

**Ferramenta:** Claude · **Onde virou código:** app `rh` (Alocacao, Lotacao, Formacao) e telas `rhLotacoes`, `admProfessores`

## Prompt atual (v3)

```
CONTEXTO
SE Educa, apps rh e rede. Hoje o RH coloca o professor direto na turma.

PEDIDO
Separar em duas etapas:
1. O RH só aloca o professor na escola (horas na escola e portaria).
2. A escola escolhe a função dele (Professor, Diretor, Coordenador, Secretário) e, se for
   Professor, as turmas, matérias e aulas por semana.
Mostrar a formação do professor (licenciatura, complementação pedagógica, pós) no cadastro do RH.

REGRAS E RESTRIÇÕES
- Só pode dar aula de matéria em que tem habilitação: licenciatura ou complementação
  pedagógica habilitam; pós-graduação não (LDB art. 62).
- A matéria tem que estar na matriz da escola (ou da rede).
- Continua valendo a regra dos 2/3 por escola.
- Data de admissão do professor obrigatória.

FORMATO DA RESPOSTA
Plano primeiro. Depois arquivos completos, migrations e testes. Atualizar o popular_demo.
```

## Histórico de versões

| Versão | Data | Mudança | Motivo |
|---|---|---|---|
| v1 | 2026-10-20 | RH faz a lotação completa (escola + turma + matéria + aulas). | Primeira versão. |
| v2 | 2026-10-29 | RH só aloca na escola; a escola define função, turma e matéria. | Feedback do mentor: na rede real quem distribui as turmas é a escola. |
| v3 | 2026-10-30 | Lotação exige habilitação pela formação; data de admissão obrigatória. | Feedback do mentor; regra conferida na LDB art. 62. |
