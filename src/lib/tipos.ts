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
  zonas: Opcao[];
  funcoes: Opcao[];
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
  cnpj: string;
  cnpj_formatado: string;
  dependencia: string;
  dependencia_nome: string;
  regional: number;
  regional_nome: string;
  telefone: string;
  email: string;
  numero_salas: number | null;
  zona: string;
  zona_nome: string;
  comodato: boolean;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  cep: string;
  cep_formatado: string;
  ativa: boolean;
  latitude: number | null;
  longitude: number | null;
};

/* Ficha da escola (GET /api/escolas/ID/ficha/), no modelo do site da SEDUC. */
export type FichaEscola = {
  escola: Escola;
  ano: number;
  resumo: { turmas: number; alunos: number; vagas: number; servidores: number };
  turmas: { id: number; curso_nome: string; serie_nome: string; letra: string; turno_nome: string; sala: string; alunos: number; capacidade: number }[];
  equipe_diretiva: { funcao_nome: string; nome: string; portaria: string }[];
  professores: { nome: string; vinculo_nome: string; horas: number; aulas: number; afastado: boolean }[];
  por_vinculo: { vinculo_nome: string; total: number }[];
  resolucoes: { tipo_nome: string; curso_nome: string | null; numero: string; orgao_emissor: string; data_publicacao: string; validade: string | null; vigente: boolean }[];
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

/* Em qual escola o professor trabalha (o RH aloca) e a função dele lá (a escola define). */
export type Alocacao = {
  id: number;
  professor: number;
  professor_nome: string;
  carga_professor: number;
  vinculo_nome: string;
  escola: number;
  escola_nome: string;
  horas_semanais: number;
  horas_nome: string;
  portaria: string;
  desde: string;
  funcao: string;
  funcao_nome: string;
  portaria_funcao: string;
  limite_aulas: number;
  aulas_ano_atual: number;
  afastamento_atual: { tipo_nome: string; fim: string } | null;
};

/* GET /api/escola/professores/: cada professor alocado na escola, com as turmas dele. */
export type ProfessorDaEscola = {
  id: number;
  alocacao: number;
  nome: string;
  carga: number;
  horas_na_escola: number;
  vinculo_nome: string;
  funcao: string;
  funcao_nome: string;
  portaria_funcao: string;
  materias: string[];
  turmas: string[];
  aulas_na_escola: number;
  limite_aulas: number;
  lotacoes: { id: number; turma: number; turma_nome: string; materia: number; materia_nome: string; aulas_semanais: number; no_quadro: number }[];
  afastamento: { tipo_nome: string; fim: string } | null;
};

/* GET /api/documentos/na-chamada/: atestado ou justificativa aceitos que cobrem o dia da chamada. */
/* GET /api/escolas/rede/: uma escola na tela "Escolas da rede" (lista e mapa).
   alunos, turmas e servidores só vêm para a gestão (Secretaria e escolas). */
export type EscolaDaRede = {
  id: number;
  nome: string;
  dependencia_nome: string;
  regional_nome: string;
  zona: string;
  zona_nome: string;
  endereco: string;
  numero: string;
  bairro: string;
  municipio: string;
  cep_formatado: string;
  telefone: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  cursos: string[];
  turnos: string[];
  vagas: number;
  vagas_por_serie: { curso_nome: string; serie_nome: string; turno_nome: string; vagas: number }[];
  turmas?: number;
  alunos?: number;
  servidores?: number;
};

export type DocumentoNaChamada = { aluno: number; tipo: string; tipo_nome: string; data_inicio: string; data_fim: string };

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

/* Documento que o aluno ou o responsável mandou para a escola (atestado, papéis da matrícula...). */
export type Documento = {
  id: number;
  aluno: number;
  aluno_nome: string;
  turma_nome: string | null;
  escola: number;
  escola_nome: string;
  tipo: string;
  tipo_nome: string;
  descricao: string;
  data_inicio: string | null;
  data_fim: string | null;
  faltas_no_periodo: number | null;
  nome_arquivo: string;
  tipo_arquivo: string;
  tamanho: number;
  status: "aguardando" | "aceito" | "recusado";
  status_nome: string;
  resposta: string;
  enviado_por_nome: string;
  enviado_em: string;
  analisado_por_nome: string | null;
  analisado_em: string | null;
  pode_cancelar: boolean;
};
