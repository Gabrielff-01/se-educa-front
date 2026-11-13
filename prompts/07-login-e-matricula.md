# 07. Login e matrícula pela internet

**Ferramenta:** Claude · **Onde virou código:** apps `contas`, `inscricoes` e telas de acesso e `escInscricoes`

## Prompt atual (v2)

```
CONTEXTO
SE Educa. O login usa usuário e senha, com contas de demonstração.

PEDIDO
- O primeiro passo do login é o CPF (ou usuário/e-mail). O sistema diz se a pessoa já tem
  cadastro; se não tiver, leva para a matrícula pela internet.
- Na matrícula, a ordem é: série → turno → município → escola (só escolas com turma
  daquela série e turno).
- Quem aprova a matrícula é a ESCOLA escolhida, que já escolhe a turma.
- Tirar da tela de login os botões com senhas prontas.

REGRAS E RESTRIÇÕES
- CPF válido e único; NIS obrigatório para Bolsa Família.
- Limitar tentativas por IP (identificar e enviar inscrição).
- Senha guardada criptografada.

FORMATO DA RESPOSTA
Arquivos completos, migrations, testes e teste no navegador em celular e computador.
```

## Histórico de versões

| Versão | Data | Mudança | Motivo |
|---|---|---|---|
| v1 | 2026-10-16 | Login real por usuário, sem a tela "escolha seu perfil". | Pedido do mentor. |
| v2 | 2026-11-11 | CPF primeiro, matrícula série→turno→escola, escola aprova, sem senhas prontas na tela. | Lista de ajustes do mentor de 2026-11-10. |
