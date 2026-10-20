/* Formato dos dados que a API devolve (o mesmo dos serializers do Django). */

import type { Perfil } from "@/types";

export type Setor = "dies" | "ded" | "rh";

export type Usuario = {
  id: number;
  username: string;
  nome: string;
  email: string;
  perfil: Perfil;
  perfil_nome: string;
  setor: Setor | "";
  setor_nome: string;
  escola: number | null;
  escola_nome: string | null;
  is_superuser: boolean;
};

export type Opcao = { valor: string; nome: string };

export type Opcoes = {
  dependencias: Opcao[];
  areas: Opcao[];
  turnos: Opcao[];
  tipos_ato: Opcao[];
  jornadas: Opcao[];
  tipos_evento: Opcao[];
  cargas: Opcao[];
  vinculos: Opcao[];
  tipos_afastamento: Opcao[];
  programas: Opcao[];
  parentescos: Opcao[];
  situacoes_matricula: Opcao[];
  status_plano: Opcao[];
  alcances: Opcao[];
  dias_semana: Opcao[];
  dias_letivos_minimos: number;
};

export type Regional = { id: number; nome: string };

export type Escola = {
  id: number;
  nome: string;
  codigo_inep: string;
  dependencia: string;
  dependencia_nome: string;
  regional: number;
  regional_nome: string;
  municipio: string;
  bairro: string;
  endereco: string;
  ativa: boolean;
};

export type Serie = { id: number; curso: number; curso_nome: string; nome: string; ordem: number };

export type Curso = { id: number; nome: string; ordem: number; carga_horaria_minima_anual: number; series: Serie[] };

export type Materia = { id: number; nome: string; area: string; area_nome: string };

export type Turma = {
  id: number;
  nome: string;
  escola: number;
  escola_nome: string;
  serie: number;
  serie_nome: string;
  curso_nome: string;
  ano_letivo: number;
  turno: string;
  turno_nome: string;
  letra: string;
  sala: string;
  capacidade: number;
  alunos: number; // matrículas confirmadas na turma
};

export type Evento = {
  id: number;
  calendario: number;
  tipo: string;
  tipo_nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string | null;
  ultimo_dia: string;
  letivo: boolean;
};

export type Calendario = {
  id: number;
  ano_letivo: number;
  escola: number | null;
  escola_nome: string | null;
  abrangencia: string;
  data_inicio: string;
  data_fim: string;
  dias_letivos: number;
  dias_letivos_minimos: number;
  cumpre_minimo: boolean;
  eventos: Evento[];
};

export type Ato = {
  id: number;
  escola: number;
  escola_nome: string;
  curso: number | null;
  curso_nome: string | null;
  tipo: string;
  tipo_nome: string;
  numero: string;
  orgao_emissor: string;
  data_publicacao: string;
  validade: string | null;
  vigente: boolean;
  observacao: string;
};

export type Oferta = { id: number; escola: number; escola_nome: string; ano_letivo: number; series: number[]; series_nomes: string[] };

export type ItemMatriz = { materia: number; materia_nome?: string; aulas_semanais: number };

export type Matriz = {
  id: number;
  serie: number;
  serie_nome: string;
  curso_nome: string;
  ano_letivo: number;
  jornada: string;
  jornada_nome: string;
  duracao_aula_minutos: number;
  semanas_letivas: number;
  itens: ItemMatriz[];
  total_aulas_semanais: number;
  carga_horaria_anual: number;
  carga_minima: number;
  cumpre_minimo: boolean;
};

export type Professor = {
  id: number;
  nome: string;
  matricula: string;
  cpf_formatado: string;
  usuario: number | null;
  usuario_nome: string | null;
  carga_horaria_semanal: number;
  carga_nome: string;
  vinculo: string;
  vinculo_nome: string;
  data_admissao: string | null;
  ativo: boolean;
  limite_aulas: number;
  aulas_ano_atual: number;
  afastamento_atual: { tipo_nome: string; fim: string } | null;
};

export type Lotacao = {
  id: number;
  professor: number;
  professor_nome: string;
  turma: number;
  turma_nome: string;
  escola_nome: string;
  ano_letivo: number;
  materia: number;
  materia_nome: string;
  aulas_semanais: number;
};

/* ---------------------------------------------------------------- Acadêmico
   (app "academico" da API: alunos, matrículas, diário, notas, tarefas...) */

export type ResumoAluno = {
  id: number;
  nome: string;
  codigo: string;
  idade: number;
  data_nascimento: string;
  programa_social: string;
  programa_nome: string;
};

/* GET /api/meus-alunos/: o próprio aluno, ou os filhos do responsável */
export type MeuAluno = ResumoAluno & { parentesco: string | null; turma_nome: string | null; escola: number | null; escola_nome: string | null };

export type Aluno = {
  id: number;
  codigo: string;
  nome: string;
  data_nascimento: string;
  idade: number;
  programa_social: string;
  programa_nome: string;
  nis: string;
  necessidade_especial: string;
  responsaveis: { id: number; nome: string; parentesco: string; parentesco_codigo: string; telefone: string }[];
  matricula_atual: { id: number; escola_nome: string; serie_nome: string; turma: number | null; turma_nome: string | null; situacao: string; situacao_nome: string } | null;
  tem_acesso: boolean;
};

export type Responsavel = {
  id: number;
  nome: string;
  cpf_formatado: string;
  telefone: string;
  email: string;
  alunos: { id: number; nome: string; parentesco: string }[];
  tem_acesso: boolean;
};

export type Matricula = {
  id: number;
  aluno: number;
  aluno_nome: string;
  aluno_codigo: string;
  programa_social: string;
  escola: number;
  escola_nome: string;
  serie: number;
  serie_nome: string;
  curso_nome: string;
  ano_letivo: number;
  turma: number | null;
  turma_nome: string | null;
  situacao: "em_analise" | "confirmada" | "cancelada" | "transferida";
  situacao_nome: string;
  data: string;
  resultado_final: string;
  media_final: string | null;
};

/* Uma aula do diário de classe, com a chamada (faltosos = ids das matrículas que faltaram) */
export type Aula = {
  id: number;
  turma: number;
  turma_nome: string;
  materia: number;
  materia_nome: string;
  professor: number;
  professor_nome: string;
  data: string;
  quantidade: number;
  conteudo: string;
  unidade: number | null;
  faltosos: number[];
  presentes: number;
  total_alunos: number;
};

export type Nota = {
  id: number;
  matricula: number;
  aluno_nome: string;
  materia: number;
  materia_nome: string;
  unidade: number;
  valor: string; // vem como texto: "7.50"
  atualizada_em: string;
};

export type Fechamento = { id: number; turma: number; turma_nome: string; unidade: number; fechado_por_nome: string | null; fechado_em: string };

export type Tarefa = {
  id: number;
  turma: number;
  turma_nome: string;
  materia: number;
  materia_nome: string;
  professor: number;
  professor_nome: string;
  titulo: string;
  descricao: string;
  prazo: string;
  criada_em: string;
  entregas: number[]; // ids das matrículas que entregaram
  total_alunos: number;
};

/* GET /api/minhas-tarefas/ (aluno ou responsável) */
export type MinhaTarefa = {
  id: number;
  titulo: string;
  descricao: string;
  prazo: string;
  materia_nome: string;
  professor_nome: string;
  status: "Pendente" | "Entregue" | "Atrasada";
};

export type PlanoAula = {
  id: number;
  professor: number;
  turma: number;
  turma_nome: string;
  materia: number;
  materia_nome: string;
  unidade: number;
  tema: string;
  objetivos: string;
  status: "planejado" | "em_andamento" | "concluido";
  status_nome: string;
};

export type Comunicado = {
  id: number;
  titulo: string;
  texto: string;
  alcance: "rede" | "escola" | "turma" | "pessoa";
  alcance_nome: string;
  escola: number | null;
  turma: number | null;
  destinatario: number | null;
  autor: number | null;
  autor_nome: string;
  para: string;
  criado_em: string;
};

export type Horario = {
  id: number;
  lotacao: number;
  dia_semana: number;
  dia_nome: string;
  inicio: string; // "07:00:00"
  turma: number;
  turma_nome: string;
  materia: number;
  materia_nome: string;
  professor_nome: string;
  sala: string;
};

export type Cardapio = { id: number; escola: number; dia_semana: number; dia_nome: string; almoco: string; lanche: string };

export type Notificacao = {
  id: string;
  tipo: string;
  quando: string;
  titulo: string;
  texto: string;
  tela: string | null;
  nova: boolean;
};

export type EventoAgenda = { data: string; fim: string | null; titulo: string; tipo: string };

/* GET /api/boletim/ */
export type MateriaBoletim = {
  materia: number;
  materia_nome: string;
  professores: string[];
  aulas_semanais: number;
  notas: Record<"1" | "2" | "3" | "4", string | null>;
  media: string | null;
  aulas: number;
  faltas: number;
  frequencia: number | null;
  situacao: string;
};

export type Boletim = {
  aluno: ResumoAluno;
  matricula: {
    id: number; ano_letivo: number; escola: number; escola_nome: string; municipio: string; serie_nome: string; curso_nome: string;
    turma: number | null; turma_nome: string | null; turno_nome: string | null; sala: string | null; situacao_nome: string;
  } | null;
  unidade_atual: number | null;
  unidades_fechadas: number[];
  materias: MateriaBoletim[];
  media_geral: string | null;
  frequencia_geral: number | null;
  aulas_total: number;
  faltas_total: number;
  media_aprovacao: string;
  frequencia_minima: number;
};

export type Historico = {
  aluno: ResumoAluno;
  anos: { ano_letivo: number; serie_nome: string; escola_nome: string; media: string | null; situacao: string }[];
};

/* Uma turma+matéria de um professor, com a situação do diário e das notas
   (vem em /api/painel/professor/ e, sem os campos do dia, em /api/escola/diario/) */
export type SituacaoDiario = {
  lotacao: number;
  professor: number;
  professor_nome: string;
  professor_usuario: number | null;
  turma: number;
  turma_nome: string;
  materia: number;
  materia_nome: string;
  alunos: number;
  aulas_semanais: number;
  tem_grade: boolean;
  ultima_aula: string | null;
  aulas_sem_registro: number;
  sem_registro_desde: string | null;
  status_diario: string;
  unidade_notas: number | null;
  notas_lancadas: number;
  notas_faltando: number;
  status_notas: string;
};

export type TurmaDoProfessor = SituacaoDiario & {
  escola_nome: string;
  sala: string;
  horarios_hoje: string[];
  chamada_hoje: boolean;
  unidade_atual: number | null;
};

export type PainelProfessor = {
  professor: { id: number; nome: string; carga: number; materias: string[]; aulas_semanais: number; limite_aulas: number; afastado_ate: string | null } | null;
  turmas: TurmaDoProfessor[];
  totais: { alunos: number; turmas: number; pendencias: number };
};

/* ------------------------------------------------------------------- RH */

export type Afastamento = {
  id: number;
  professor: number;
  professor_nome: string;
  tipo: string;
  tipo_nome: string;
  inicio: string;
  fim: string;
  observacao: string;
  vigente: boolean;
};

/* ----------------------------------------------------- Histórico (auditoria) */

export type Registro = {
  id: number;
  usuario: number | null;
  usuario_nome: string;
  acao: "criou" | "editou" | "apagou";
  acao_nome: string;
  tipo: string;
  objeto_id: string;
  descricao: string;
  mudancas: { campo: string; antes: string; depois: string }[];
  criado_em: string;
};

/* Pedido da escola para a DIES (abrir turma, mudar capacidade ou outro assunto), com a conversa. */
export type MensagemPedido = { id: number; texto: string; autor_nome: string; lado: "escola" | "dies" | "sistema"; criada_em: string };

export type Pedido = {
  id: number;
  escola: number;
  escola_nome: string;
  tipo: "nova_turma" | "capacidade" | "outro";
  tipo_nome: string;
  titulo: string;
  serie: number | null;
  turno: string;
  turno_nome: string;
  turma: number | null;
  capacidade: number | null;
  assunto: string;
  status: "aberta" | "atendida" | "recusada";
  status_nome: string;
  criada_por_nome: string;
  criada_em: string;
  atualizada_em: string;
  mensagens: MensagemPedido[];
  ultima_fala: "escola" | "dies" | "sistema" | null;
};
