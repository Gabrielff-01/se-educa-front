/* Alunos e responsáveis da escola: busca, dados do aluno, edição e criação do login (usuário e senha).
   Editando um aluno dá pra ligar e desligar responsáveis (ex.: a mesma mãe de dois irmãos).
   Dados: GET /api/alunos/?busca=, PATCH /api/alunos/ID/, POST /api/alunos/ID/criar_acesso/,
          POST /api/alunos/ID/vincular_responsavel/ e /desvincular_responsavel/,
          GET /api/responsaveis/?busca=, POST /api/responsaveis/ID/criar_acesso/ e /api/opcoes/ (programas, parentescos). */

import { useEffect, useState } from "react";
import { AvisoErro, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconEdit, IconSearch, IconUser, IconUsers } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { dataBR } from "@/lib/formato";
import type { Aluno, Opcao, Opcoes, Responsavel } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

type FormAluno = { nome: string; data_nascimento: string; programa_social: string; nis: string; necessidade_especial: string };
type FormAcesso = { username: string; senha: string };
// Qual formulário está aberto: editar um aluno, ou criar o login de um aluno / responsável.
type Aberto = { tipo: "editar"; id: number; form: FormAluno } | { tipo: "acesso"; quem: "alunos" | "responsaveis"; id: number; nome: string; form: FormAcesso };

/* Sugestão de usuário: primeiro nome sem acento + número. Ex.: "Ana Souza", 3 -> "ana3" */
function sugerirUsuario(nome: string, id: number) {
  const primeiro = nome.split(" ")[0].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return `${primeiro}${id}`;
}

export function AdmAlunos({ back }: { back: () => void }) {
  const [aba, setAba] = useState<"alunos" | "responsaveis">("alunos");
  const [texto, setTexto] = useState("");
  const [busca, setBusca] = useState("");
  // Espera a pessoa parar de digitar (0,4 s) antes de pedir à API.
  useEffect(() => { const t = setTimeout(() => setBusca(texto.trim()), 400); return () => clearTimeout(t); }, [texto]);
  const filtro = busca ? `?busca=${encodeURIComponent(busca)}` : "";
  const alunos = useApi<Aluno[]>(aba === "alunos" ? `/api/alunos/${filtro}` : null);
  // Alunos que mudaram de responsável nesta visita (a API devolve o aluno atualizado; não precisa recarregar a lista).
  const [atualizados, setAtualizados] = useState<Record<number, Aluno>>({});
  useEffect(() => setAtualizados({}), [alunos.dados]);
  const listaAlunos = (alunos.dados ?? []).map((a) => atualizados[a.id] ?? a);
  // A busca de responsáveis acha pelo nome dele, pelo nome do filho ou pelo CPF.
  const responsaveis = useApi<Responsavel[]>(aba === "responsaveis" ? `/api/responsaveis/${filtro}` : null);
  const listaResponsaveis = responsaveis.dados ?? [];
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [aberto, setAberto] = useState<Aberto | null>(null);
  const [aviso, setAviso] = useState<{ id: string; texto: string } | null>(null);
  const envio = useEnvio(["nome", "data_nascimento", "programa_social", "nis", "necessidade_especial", "username", "senha"]);

  // A faixa verde some sozinha depois de 4 s (só se ninguém trocou a mensagem nesse meio-tempo).
  const avisar = (id: string, msg: string) => { const novo = { id, texto: msg }; setAviso(novo); setTimeout(() => setAviso((atual) => (atual === novo ? null : atual)), 4000); };
  const abrirEdicao = (a: Aluno) => {
    envio.limpar();
    setAberto({ tipo: "editar", id: a.id, form: { nome: a.nome, data_nascimento: a.data_nascimento, programa_social: a.programa_social, nis: a.nis, necessidade_especial: a.necessidade_especial } });
  };
  const abrirAcesso = (quem: "alunos" | "responsaveis", id: number, nome: string) => {
    envio.limpar();
    setAberto({ tipo: "acesso", quem, id, nome, form: { username: sugerirUsuario(nome, id), senha: "" } });
  };
  const mudar = (campo: string) => (v: string) => aberto && setAberto({ ...aberto, form: { ...aberto.form, [campo]: v } } as Aberto);

  const salvar = () => envio.enviar(async () => {
    if (!aberto) return;
    if (aberto.tipo === "editar") {
      await api(`/api/alunos/${aberto.id}/`, { method: "PATCH", body: aberto.form });
      avisar(`alunos-${aberto.id}`, "Dados do aluno salvos.");
      alunos.recarregar();
    } else {
      await api(`/api/${aberto.quem}/${aberto.id}/criar_acesso/`, { method: "POST", body: aberto.form });
      avisar(`${aberto.quem}-${aberto.id}`, `Login criado: ${aberto.form.username.trim().toLowerCase()}. Passe a senha para ${aberto.nome.split(" ")[0]}.`);
      if (aberto.quem === "alunos") alunos.recarregar(); else responsaveis.recarregar();
    }
    setAberto(null);
  });

  const formAberto = (quem: "alunos" | "responsaveis", id: number, aluno?: Aluno) => {
    if (!aberto || aberto.id !== id) return null;
    if (aberto.tipo === "editar" && quem === "alunos" && aluno) {
      const f = aberto.form;
      return (
        <>
          <CartaoForm titulo="Editar aluno" onSalvar={salvar} onCancelar={() => setAberto(null)} salvando={envio.enviando} erro={envio.erro} cor={BLUE}>
            <Entrada label="Nome completo" value={f.nome} onChange={mudar("nome")} erro={envio.campos.nome} />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label="Nascimento" type="date" value={f.data_nascimento} onChange={mudar("data_nascimento")} erro={envio.campos.data_nascimento} />
              <Escolha label="Programa social" value={f.programa_social} onChange={mudar("programa_social")} opcoes={opcoes.dados?.programas ?? []} vazio="Nenhum" erro={envio.campos.programa_social} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Entrada label={f.programa_social ? "NIS (obrigatório)" : "NIS (opcional)"} value={f.nis} onChange={mudar("nis")} erro={envio.campos.nis} inputMode="numeric" placeholder="11 números" />
              <Entrada label="Necessidade especial (AEE)" value={f.necessidade_especial} onChange={mudar("necessidade_especial")} erro={envio.campos.necessidade_especial} placeholder="Em branco = não tem" />
            </div>
          </CartaoForm>
          {/* Responsáveis: ligar e desligar grava na hora, separado do Salvar acima. */}
          <ResponsaveisDoAluno aluno={aluno} parentescos={opcoes.dados?.parentescos ?? []} mudou={(novo, msg) => { setAtualizados((t) => ({ ...t, [novo.id]: novo })); avisar(`alunos-${novo.id}`, msg); }} />
        </>
      );
    }
    if (aberto.tipo === "acesso" && aberto.quem === quem) {
      return (
        <CartaoForm titulo={`Criar login de ${aberto.nome}`} onSalvar={salvar} onCancelar={() => setAberto(null)} salvando={envio.enviando} erro={envio.erro} cor={GREEN}>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Entrada label="Usuário" value={aberto.form.username} onChange={mudar("username")} erro={envio.campos.username} />
            <Entrada label="Senha (mínimo 8 caracteres)" type="password" value={aberto.form.senha} onChange={mudar("senha")} erro={envio.campos.senha} />
          </div>
        </CartaoForm>
      );
    }
    return null;
  };

  const faixa = (chave: string) => aviso?.id === chave && (
    <div className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} />{aviso.texto}</div>
  );

  return (
    <>
      <TopBar title="Alunos e responsáveis" subtitle="Cadastro e acesso ao aplicativo" onBack={back} accent={BLUE} />
      <div className="px-5">
        <div className="flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {([["alunos", "Alunos"], ["responsaveis", "Responsáveis"]] as const).map(([id, nome]) => (
            <button key={id} onClick={() => { setAba(id); setAberto(null); }} className="flex-1 rounded-xl py-2 text-[12.5px] font-semibold transition" style={aba === id ? { background: BLUE, color: "#fff" } : { color: INK_SOFT }}>{nome}</button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} />
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={aba === "alunos" ? "Buscar por nome ou código" : "Buscar responsável pelo nome ou CPF"} className="flex-1 bg-transparent text-[13.5px] outline-none" />
        </div>
      </div>
      <Screen className="pt-3">
        {aba === "alunos" ? (
          <EstadoApi carregando={alunos.carregando} erro={alunos.erro} onRetry={alunos.recarregar}>
            {listaAlunos.length === 0 ? <EmptyState title="Nenhum aluno" text={busca ? "Ninguém com esse nome ou código." : "A escola ainda não tem alunos."} icon={<IconSearch size={26} />} /> : (
              <div className="grid gap-2.5 lg:grid-cols-2">
                {listaAlunos.map((a) => (
                  <div key={a.id}>
                    {formAberto("alunos", a.id, a) ?? <CartaoAluno a={a} editar={() => abrirEdicao(a)} criarAcesso={() => abrirAcesso("alunos", a.id, a.nome)} />}
                    {faixa(`alunos-${a.id}`)}
                  </div>
                ))}
              </div>
            )}
          </EstadoApi>
        ) : (
          <EstadoApi carregando={responsaveis.carregando} erro={responsaveis.erro} onRetry={responsaveis.recarregar}>
            {listaResponsaveis.length === 0 ? <EmptyState title="Nenhum responsável" text={busca ? "Ninguém com esse nome, CPF ou filho." : "Nenhum responsável cadastrado."} icon={<IconUsers size={26} />} /> : (
              <div className="grid gap-2.5 lg:grid-cols-2">
                {listaResponsaveis.map((r) => (
                  <div key={r.id}>
                    {formAberto("responsaveis", r.id) ?? (
                      <div className="card p-4">
                        <p className="text-[13.5px] font-bold" style={{ color: INK }}>{r.nome}</p>
                        <p className="text-[11.5px]" style={{ color: INK_SOFT }}>CPF {r.cpf_formatado}{r.telefone ? ` · ${r.telefone}` : ""}{r.email ? ` · ${r.email}` : ""}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {r.alunos.map((a) => <Pill key={a.id} color={VIOLET}>{a.parentesco} de {a.nome.split(" ")[0]}</Pill>)}
                          {r.tem_acesso ? <Pill color={BLUE}>Tem login</Pill> : <Pill color={INK_SOFT}>Sem login</Pill>}
                        </div>
                        {!r.tem_acesso && <button onClick={() => abrirAcesso("responsaveis", r.id, r.nome)} className="mt-3 w-full rounded-xl py-2 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}>Criar acesso</button>}
                      </div>
                    )}
                    {faixa(`responsaveis-${r.id}`)}
                  </div>
                ))}
              </div>
            )}
          </EstadoApi>
        )}
      </Screen>
    </>
  );
}

function CartaoAluno({ a, editar, criarAcesso }: { a: Aluno; editar: () => void; criarAcesso: () => void }) {
  const m = a.matricula_atual;
  const corSituacao = m?.situacao === "confirmada" ? GREEN : AMBER;
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-bold" style={{ color: INK }}>{a.nome}</p>
          <p className="text-[11.5px]" style={{ color: INK_SOFT }}>Código {a.codigo} · {a.idade} anos · nasc. {dataBR(a.data_nascimento)}</p>
        </div>
        <button onClick={editar} aria-label={`Editar ${a.nome}`} className="grid h-9 w-9 flex-none place-items-center rounded-full" style={{ background: BLUE + "14", color: BLUE }}><IconEdit size={17} /></button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {a.programa_social && <Pill color={GREEN}>{a.programa_nome} · NIS {a.nis || "—"}</Pill>}
        {a.necessidade_especial && <Pill color={VIOLET}>AEE: {a.necessidade_especial}</Pill>}
        {a.tem_acesso ? <Pill color={BLUE}>Tem login</Pill> : <Pill color={INK_SOFT}>Sem login</Pill>}
      </div>
      <div className="mt-2.5 rounded-xl px-3 py-2 text-[11.5px]" style={{ background: "#f6f8fb" }}>
        {m ? (
          <div className="flex items-center justify-between gap-2">
            <span style={{ color: INK }}>{m.turma_nome ? `Turma ${m.turma_nome}` : `${m.serie_nome} · sem turma`}</span>
            <Pill color={corSituacao}>{m.situacao_nome}</Pill>
          </div>
        ) : <span style={{ color: RED }}>Sem matrícula ativa neste ano</span>}
      </div>
      {a.responsaveis.length > 0 ? (
        <ul className="mt-2 space-y-0.5 text-[11.5px]" style={{ color: INK_SOFT }}>
          {a.responsaveis.map((r) => <li key={r.id} className="flex items-center gap-1.5"><IconUser size={13} />{r.nome} ({r.parentesco}){r.telefone ? ` · ${r.telefone}` : ""}</li>)}
        </ul>
      ) : <p className="mt-2 text-[11.5px]" style={{ color: INK_SOFT }}>Nenhum responsável cadastrado.</p>}
      {!a.tem_acesso && <button onClick={criarAcesso} className="mt-3 w-full rounded-xl py-2 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}>Criar acesso do aluno</button>}
    </div>
  );
}

/* Responsáveis de um aluno, dentro da edição: desligar e ligar (achar um já cadastrado ou cadastrar pelo CPF).
   Cada botão já grava na hora (não depende do "Salvar" dos dados do aluno). */
function ResponsaveisDoAluno({ aluno, parentescos, mudou }: { aluno: Aluno; parentescos: Opcao[]; mudou: (a: Aluno, msg: string) => void }) {
  const [modo, setModo] = useState<"buscar" | "cpf">("buscar");
  const [texto, setTexto] = useState("");
  const [busca, setBusca] = useState("");
  useEffect(() => { const t = setTimeout(() => setBusca(texto.trim()), 400); return () => clearTimeout(t); }, [texto]);
  // A busca acha responsáveis de alunos desta escola (pelo nome dele, do filho ou CPF).
  const achados = useApi<Responsavel[]>(modo === "buscar" && busca.length >= 2 ? `/api/responsaveis/?busca=${encodeURIComponent(busca)}` : null);
  const ligados = new Set(aluno.responsaveis.map((r) => r.id));
  const opcoesAchados = (achados.dados ?? []).filter((r) => !ligados.has(r.id)).slice(0, 6);
  const [escolhido, setEscolhido] = useState<Responsavel | null>(null);
  const [novo, setNovo] = useState({ cpf: "", nome: "", telefone: "" });
  const [parentesco, setParentesco] = useState("");
  const [desligar, setDesligar] = useState<number | null>(null); // pede confirmação antes de desligar
  const envio = useEnvio(["cpf", "nome", "telefone", "parentesco", "responsavel"]);

  const limpar = () => { setTexto(""); setEscolhido(null); setNovo({ cpf: "", nome: "", telefone: "" }); setParentesco(""); };
  const ligar = () => envio.enviar(async () => {
    const corpo = modo === "buscar" ? { responsavel: escolhido?.id ?? null, parentesco } : { ...novo, parentesco };
    const atualizado = await api<Aluno>(`/api/alunos/${aluno.id}/vincular_responsavel/`, { method: "POST", body: corpo });
    const nome = modo === "buscar" ? escolhido?.nome : atualizado.responsaveis[atualizado.responsaveis.length - 1]?.nome;
    limpar();
    mudou(atualizado, `${nome ?? "Responsável"} ligado a ${aluno.nome.split(" ")[0]}.`);
  });
  const confirmarDesligar = (id: number, nome: string) => envio.enviar(async () => {
    const atualizado = await api<Aluno>(`/api/alunos/${aluno.id}/desvincular_responsavel/`, { method: "POST", body: { responsavel: id } });
    setDesligar(null);
    mudou(atualizado, `${nome} não é mais responsável por ${aluno.nome.split(" ")[0]} (o cadastro dele continua).`);
  });

  return (
    <div className="card mb-3 space-y-3 p-4" style={{ outline: `2px solid ${VIOLET}33` }}>
      <p className="text-[14px] font-bold" style={{ color: INK }}>Responsáveis de {aluno.nome.split(" ")[0]}</p>
      {aluno.responsaveis.length === 0 ? <p className="text-[12px]" style={{ color: INK_SOFT }}>Nenhum responsável ligado ainda.</p> : (
        <ul className="space-y-1.5">
          {aluno.responsaveis.map((r) => (
            <li key={r.id} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "#f6f8fb" }}>
              <IconUser size={15} style={{ color: VIOLET }} />
              <span className="min-w-0 flex-1 text-[12.5px]" style={{ color: INK }}>{r.nome} <span style={{ color: INK_SOFT }}>({r.parentesco})</span></span>
              {desligar === r.id ? (
                <>
                  <button onClick={() => confirmarDesligar(r.id, r.nome)} disabled={envio.enviando} className="rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-white" style={{ background: RED }}>Confirmar</button>
                  <button onClick={() => setDesligar(null)} className="text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Não</button>
                </>
              ) : <button onClick={() => setDesligar(r.id)} className="rounded-lg px-2.5 py-1 text-[11.5px] font-semibold" style={{ background: RED + "12", color: RED }}>Desligar</button>}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-1.5 rounded-xl p-1" style={{ background: "#f1f5f9" }}>
        {([["buscar", "Já cadastrado"], ["cpf", "Pelo CPF / novo"]] as const).map(([id, nome]) => (
          <button key={id} onClick={() => { setModo(id); envio.limpar(); }} className="flex-1 rounded-lg py-1.5 text-[12px] font-semibold" style={modo === id ? { background: "#fff", color: VIOLET } : { color: INK_SOFT }}>{nome}</button>
        ))}
      </div>
      {modo === "buscar" ? (
        escolhido ? (
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px]" style={{ background: VIOLET + "12", color: INK }}>
            <IconCheck size={15} style={{ color: VIOLET }} /><span className="flex-1">{escolhido.nome} · CPF {escolhido.cpf_formatado}</span>
            <button onClick={() => setEscolhido(null)} className="text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Trocar</button>
          </div>
        ) : (
          <div>
            <Entrada label="Buscar responsável" value={texto} onChange={setTexto} placeholder="Nome, CPF ou nome de outro filho" erro={envio.campos.responsavel} />
            {busca.length >= 2 && !achados.carregando && (
              opcoesAchados.length === 0
                ? <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>Ninguém encontrado nesta escola. Se o responsável só tem filho em outra escola, use "Pelo CPF / novo".</p>
                : <div className="mt-1.5 space-y-1">{opcoesAchados.map((r) => (
                    <button key={r.id} onClick={() => setEscolhido(r)} className="block w-full rounded-xl border px-3 py-2 text-left text-[12px]" style={{ borderColor: "#e2e8f0", color: INK }}>
                      <b>{r.nome}</b> <span style={{ color: INK_SOFT }}>· CPF {r.cpf_formatado}{r.alunos.length ? ` · ${r.alunos.map((x) => `${x.parentesco} de ${x.nome.split(" ")[0]}`).join(", ")}` : ""}</span>
                    </button>
                  ))}</div>
            )}
          </div>
        )
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Entrada label="CPF do responsável" value={novo.cpf} onChange={(v) => setNovo({ ...novo, cpf: v })} inputMode="numeric" placeholder="000.000.000-00" erro={envio.campos.cpf} />
            <Entrada label="Telefone (se for novo)" value={novo.telefone} onChange={(v) => setNovo({ ...novo, telefone: v })} erro={envio.campos.telefone} />
          </div>
          <Entrada label="Nome completo (só se o CPF ainda não estiver cadastrado)" value={novo.nome} onChange={(v) => setNovo({ ...novo, nome: v })} erro={envio.campos.nome} />
        </>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Escolha label="Parentesco" value={parentesco} onChange={setParentesco} opcoes={parentescos} vazio="Escolha" erro={envio.campos.parentesco} />
        <button onClick={ligar} disabled={envio.enviando || (modo === "buscar" && !escolhido)} className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50" style={{ background: VIOLET }}>{envio.enviando ? "Ligando..." : "Ligar ao aluno"}</button>
      </div>
      {envio.erro && <AvisoErro texto={envio.erro} />}
    </div>
  );
}

