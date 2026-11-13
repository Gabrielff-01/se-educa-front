# 01. Plano do back-end

**Ferramenta:** Claude · **Onde virou código:** apps `contas`, `rede`, `regulacao`, `calendario`, `rh` (se-educa-api)

## Prompt atual (v2)

```
CONTEXTO
O SE Educa hoje é só o front React feito no Figma Make, com dados fictícios. O mentor pediu
um back-end de verdade.

PEDIDO
Monte um plano de implementação em Django + Django REST Framework, dividido em aulas, para:
- DIES: cadastrar escolas, cursos, turmas e matérias e gerenciar o calendário escolar
  (aulas, férias, feriados, provas);
- DED: registrar atos autorizativos, as séries que cada escola oferece e a carga horária
  semanal de cada matéria;
- RH: cadastrar professores, carga horária e matrícula funcional;
- login real por usuário (tirar a tela "escolha seu perfil") com contas de demonstração.

REGRAS E RESTRIÇÕES
- A carga horária mínima anual NÃO é fixa: fica no Curso. Confira na LDB (art. 24) e na
  Lei 14.945/2024 qual é o mínimo do Fundamental e do Ensino Médio e cite a fonte.
- Hora-aula de 50 minutos não é hora de relógio.
- DIES, DED e RH são setores dentro do perfil Secretaria.
- O front continua na Vercel; a API vai para o Render com PostgreSQL no Neon.

FORMATO DA RESPOSTA
Plano em aulas (o que cada aula entrega), sem código ainda. Esperar nosso ok.
```

## Histórico de versões

| Versão | Data | Mudança | Motivo |
|---|---|---|---|
| v1 | 2026-10-15 | Pedido com "a matriz tem que fechar 800 h". | Número dito pelo mentor. |
| v2 | 2026-10-16 | Mínimo passou a ficar no Curso; pedido para conferir a lei e citar fonte. | A pesquisa mostrou que o Ensino Médio exige 1.000 h/ano (LDB art. 24, Lei 14.945/2024); 800 h é do Fundamental. Fixar 800 h deixaria o sistema errado. |

**Validação:** regra coberta por testes em `regulacao/tests.py` (matriz abaixo do mínimo do curso é recusada).
