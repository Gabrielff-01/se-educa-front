# 02. Regra dos 2/3 (aulas do professor em sala)

**Ferramenta:** Claude · **Onde virou código:** app `rh` (Lotacao, Alocacao)

## Prompt atual (v2)

```
CONTEXTO
App rh do SE Educa. O RH aloca o professor numa escola com um número de horas.

PEDIDO
Validar que o professor não passe de 2/3 da jornada em sala de aula (Lei 11.738/2008).

REGRAS E RESTRIÇÕES
- Contar em aulas: 1 aula = 1 hora da jornada. 40 h → no máximo 26 aulas/semana; 20 h → 13.
- O limite vale POR ESCOLA: usa as horas da alocação do professor naquela escola.
- A regra fica no clean() do model, para valer igual no admin e na API.

FORMATO DA RESPOSTA
Arquivos completos + testes com os casos 40 h/26 aulas, 20 h/13 aulas e um acima do limite.
```

## Histórico de versões

| Versão | Data | Mudança | Motivo |
|---|---|---|---|
| v1 | 2026-10-17 | Limite de 2/3 sobre a carga total do professor, contando aulas. | Primeira versão do RH. |
| v2 | 2026-10-29 | Limite passou a ser por escola (horas da alocação). | Mudança da lotação (ver [03](03-lotacao-de-professores.md)): um professor pode ter horas em mais de uma escola. |
