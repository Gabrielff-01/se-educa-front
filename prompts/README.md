# Repositório de prompts do SE Educa

Esta pasta guarda os prompts que a equipe usou com IA durante o desenvolvimento do SE Educa,
e como cada um mudou ao longo do projeto.

**Importante:** o sistema não usa IA quando roda. Estes prompts foram usados no
desenvolvimento, com o **Claude (Anthropic)**, por chat, e com o **Figma Make** no protótipo.
O que eles pediram virou código comum (Django e React), coberto por testes automáticos.

## Como a rastreabilidade funciona

1. **Cada arquivo tem uma seção "Histórico de versões"**, com a data, o que mudou e por quê
   (quase sempre por feedback do mentor ou por erro encontrado no teste).
2. **O Git guarda o resto:** toda mudança nesta pasta entra por commit na `dev` e chega na `main`
   por pull request (`dev` → `testes` → `main`). Para ver o que mudou num prompt:
   - no GitHub: abra o arquivo e clique em **History**;
   - no terminal: `git log -p -- prompts/03-lotacao-de-professores.md`.
3. **O [CHANGELOG.md](CHANGELOG.md)** junta todas as mudanças em ordem de data.

As versões anteriores a esta pasta (outubro e novembro de 2026) foram registradas a partir das
conversas da equipe com o Claude. O texto é fiel ao pedido feito, com ajustes pequenos de
redação. A partir da criação da pasta, qualquer mudança passa pelo Git.

## Índice

| Arquivo | Assunto | Versão atual |
|---|---|---|
| [00-modelo.md](00-modelo.md) | estrutura que todo prompt segue | v1 |
| [01-plano-do-back-end.md](01-plano-do-back-end.md) | plano da API Django e carga horária mínima | v2 |
| [02-regra-dos-dois-tercos.md](02-regra-dos-dois-tercos.md) | limite de aulas do professor em sala | v2 |
| [03-lotacao-de-professores.md](03-lotacao-de-professores.md) | quem coloca o professor na escola e na turma | v3 |
| [04-documentos-do-aluno.md](04-documentos-do-aluno.md) | envio de atestados e documentos | v2 |
| [05-escolas-da-rede.md](05-escolas-da-rede.md) | cadastro, ficha e mapa das escolas | v3 |
| [06-atos-autorizativos.md](06-atos-autorizativos.md) | atos autorizativos e oferta de séries | v2 |
| [07-login-e-matricula.md](07-login-e-matricula.md) | login real, CPF e matrícula pela internet | v2 |
| [08-correcao-de-erros.md](08-correcao-de-erros.md) | modelo para pedir correção de erro | v1 |
| [09-documentacao.md](09-documentacao.md) | guias e documentação | v1 |

## Como adicionar ou mudar um prompt

1. Na `dev`, crie o arquivo seguindo o [00-modelo.md](00-modelo.md) ou edite o existente.
2. Ao mudar, **não apague a versão antiga**: escreva a nova versão em cima e acrescente uma linha
   no "Histórico de versões" e no CHANGELOG.
3. Commit com mensagem clara, por exemplo: `prompts: lotação v3 exige habilitação do professor`.
4. PR `dev` → `testes` → `main`.
