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

## Branches
- **main**: versão estável
- **testes**: validação antes de ir pro main
- **dev**: desenvolvimento do dia a dia

## Como rodar no computador
pnpm install
pnpm dev
## Estrutura de pastas
```
src/
  App.tsx       casca do app: guarda a tela atual e o perfil e escolhe qual tela mostrar
  routes.ts     lista de telas (#/notas, #/perfil...) e a tela inicial de cada perfil
  types.ts      tipos usados em várias partes (Perfil, TabId...)
  components/   peças reutilizáveis: TopBar, BottomNav, Avatar, botões, ícones
  screens/      uma tela por arquivo, separadas por perfil
    acesso/       Splash, Login, Cadastro
    aluno/        telas do aluno
    responsavel/  telas do responsável
    professor/    telas do professor
    escola/       telas da gestão da escola
    secretaria/   telas da Secretaria de Educação
    servicos/     matrícula, escolas, secretaria virtual
    comum/        telas que todos os perfis usam (perfil, notificações, chat...)
  data/         dados fictícios (quando tiver back-end, isso vem da API)
  hooks/        funções reutilizáveis do React (ex.: useToast)
  theme/        cores do app
```
