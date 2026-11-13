# 06. Atos autorizativos e oferta de séries

**Ferramenta:** Claude · **Onde virou código:** app `regulacao` e telas `diesAtos`, `dedMatrizes`

## Prompt atual (v2)

```
CONTEXTO
SE Educa, app regulacao (atos autorizativos, ofertas de séries e matrizes curriculares).

PEDIDO
- Os atos autorizativos passam a ser cadastrados pelo DIES (antes eram do DED).
- A escola só pode oferecer séries de um curso para o qual tenha ato de autorização,
  reconhecimento ou renovação.
- A matriz curricular pode ser da rede ou própria de uma escola (escolhida no fim do formulário).

REGRAS E RESTRIÇÕES
- Escola sem ato do Ensino Médio não pode ganhar 6º ano, e vice-versa.
- Matriz própria só se a escola oferecer a série; sem ela, a turma usa a matriz da rede.

FORMATO DA RESPOSTA
Arquivos completos e testes. Dizer quais telas antigas apagar.
```

## Histórico de versões

| Versão | Data | Mudança | Motivo |
|---|---|---|---|
| v1 | 2026-10-16 | Atos cadastrados pelo DED. | Divisão inicial passada pelo mentor. |
| v2 | 2026-10-30 / 2026-11-11 | Atos passam ao DIES; matriz por escola; oferta exige ato. | Feedback do mentor nas duas datas. |
