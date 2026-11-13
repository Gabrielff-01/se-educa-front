# Modelo de prompt

Todo prompt da equipe seguiu esta estrutura em 4 partes. Ela evita que a IA invente
regra ou entregue código que não conversa com o resto do projeto.

```
CONTEXTO
Projeto SE Educa: gestão escolar da rede estadual de Sergipe. Front React (Vercel),
API Django REST (Render) e PostgreSQL (Neon). Apps: <apps envolvidos>.

PEDIDO
<o que precisa ser feito, de preferência copiando o feedback do mentor>

REGRAS E RESTRIÇÕES
- <regra de negócio ou lei que vale>
- <quem pode fazer o quê (perfil/setor)>
- Não mudar o que não foi pedido.

FORMATO DA RESPOSTA
- Antes do código, um plano curto para a equipe aprovar.
- Depois, arquivos completos (não trechos) e testes automáticos para cada regra nova.
- Dizer o que precisamos rodar (migrate, popular_demo, pnpm install).
```

## Histórico de versões

| Versão | Data | Mudança |
|---|---|---|
| v1 | 2026-10-16 | Estrutura adotada a partir do plano do back-end, para os pedidos virem sempre com contexto, regras e formato. |
