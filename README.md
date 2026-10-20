# SE Educa

Protótipo do aplicativo SE Educa, desenvolvido no projeto de Residência 1 do curso de Sistemas de Informação da UNIT.

## Equipe
- Gabriel Freire Franco
- Clara Barreto
- Victor Eduardo
- Pedro Henrique
- José Valmir
- Gabriel Lopes
- Arthur Pereira
- Kristiane Cavalcante

## Links
- Produção (main): https://se-educa-front.vercel.app/
- Back-end (API Django): https://github.com/Gabrielff-01/se-educa-api

## Branches
- **main**: versão estável
- **testes**: validação antes de ir pro main
- **dev**: desenvolvimento do dia a dia

## Como rodar no computador
```
pnpm install
pnpm dev
```
O site abre em http://localhost:8443.

O login e as telas dos setores (DIES, DED e RH) buscam os dados na API. Deixe o
`runserver` do **se-educa-api** rodando em outro terminal (http://127.0.0.1:8000).
Para usar outra API, crie um arquivo `.env` igual ao `.env.example` e mude o `VITE_API_URL`.
Na Vercel, essa variável fica em Settings > Environment Variables.

## Login de demonstração
Não tem mais a escolha de perfil: o perfil vem do usuário. As contas são criadas pelo
comando `python manage.py popular_demo` da API, e a senha é o nome do perfil:
aluno1/aluno, responsavel1/responsavel, professor1/professor, escola1/escola,
dies1/dies, ded1/ded e rh1/rh.

As telas de aluno, professor, responsável e escola ainda usam os dados fictícios de `src/data/`.
## Estrutura de pastas
```
src/
  App.tsx       casca do app: guarda a tela atual e o perfil e escolhe qual tela mostrar
  routes.ts     lista de telas (#/notas, #/perfil...) e a tela inicial de cada perfil
  types.ts      tipos usados em várias partes (Perfil, TabId...)
  components/   peças reutilizáveis: TopBar, BottomNav, Avatar, botões, ícones, Form (campos e avisos)
  lib/          api.ts (login e pedidos à API), tipos.ts (formato dos dados) e formato.ts (datas, horas)
  screens/      uma tela por arquivo, separadas por perfil
    acesso/       Splash, Login, Cadastro
    aluno/        telas do aluno
    responsavel/  telas do responsável
    professor/    telas do professor
    escola/       telas da gestão da escola
    secretaria/   telas da Secretaria de Educação
    setores/      telas do DIES, DED e RH ligadas à API (escolas, turmas, calendário, matrizes...)
    servicos/     matrícula, escolas, secretaria virtual
    comum/        telas que todos os perfis usam (perfil, notificações, chat...)
  data/         dados fictícios (quando tiver back-end, isso vem da API)
  hooks/        funções reutilizáveis do React (useToast, useApi)
  theme/        cores do app
```
