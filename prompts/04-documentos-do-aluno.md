# 04. Documentos do aluno

**Ferramenta:** Claude · **Onde virou código:** app `documentos` e telas `documentos`, `escDocumentos`

## Prompt atual (v2)

```
CONTEXTO
SE Educa. Aluno e responsável precisam mandar documentos para a escola.

PEDIDO
Criar o envio de documentos (atestado, justificativa, laudo, vacina, RG/CPF, comprovante de
residência etc.). O aluno ou responsável envia e pode cancelar enquanto aguarda; a escola abre,
aceita ou recusa com motivo, e a família é avisada.
Na chamada do professor, aluno com atestado ou justificativa ACEITOS no dia aparece em amarelo.

REGRAS E RESTRIÇÕES
- Só PDF, JPG ou PNG, até 5 MB, conferindo o conteúdo do arquivo (não só a extensão).
- O arquivo fica no banco, porque o disco do Render é apagado a cada deploy.
- Aceitar atestado NÃO abona a falta automaticamente.
- Período só para atestado e justificativa.

FORMATO DA RESPOSTA
Plano, depois arquivos completos e testes (tipo de arquivo, tamanho, quem pode ver).
```

## Histórico de versões

| Versão | Data | Mudança | Motivo |
|---|---|---|---|
| v1 | 2026-10-22 | Envio, aceite/recusa, avisos; tipo do arquivo checado pelo conteúdo. | Primeira versão. |
| v2 | 2026-10-29 | Linha amarela na chamada para atestado/justificativa aceitos, sem abono automático. | Feedback do mentor: o professor precisa ver, mas a decisão de abonar é humana. |
