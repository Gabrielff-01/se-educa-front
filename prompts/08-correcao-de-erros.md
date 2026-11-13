# 08. Correção de erros

**Ferramenta:** Claude · **Uso:** sempre que algo quebrava ao rodar no PC ou no deploy

## Prompt atual (v1)

```
CONTEXTO
SE Educa (<repositório>, branch dev). Segue o print do erro e o arquivo envolvido.

PEDIDO
Explique o que causou o erro e mande o arquivo COMPLETO corrigido.

REGRAS E RESTRIÇÕES
- Mexer só no que é preciso para corrigir.
- Se for falta de comando (migrate, pnpm install, popular_demo), dizer qual rodar.

FORMATO DA RESPOSTA
1. Causa em poucas linhas. 2. Arquivo completo. 3. Como conferir que resolveu.
```

## Histórico de versões

| Versão | Data | Mudança | Motivo |
|---|---|---|---|
| v1 | 2026-10-16 | Modelo fixado. | Com o print do erro e o arquivo, a IA acha a causa sem precisar adivinhar. |
