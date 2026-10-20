import { useState } from "react";
import { AvisoErro, BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconEdit, IconSearch, IconUser } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { dataBR } from "@/lib/formato";
import type { Opcoes, Professor } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

type FormProfessor = { id?: number; nome: string; matricula: string; cpf: string; carga_horaria_semanal: string; vinculo: string; data_admissao: string };
const VAZIO: FormProfessor = { nome: "", matricula: "", cpf: "", carga_horaria_semanal: "40", vinculo: "efetivo", data_admissao: "" };

/* RH — Professores: matrícula, CPF, carga horária e quantas aulas já estão lotadas (máx. 2/3).
   Dados: GET /api/professores/ (com afastamento_atual e o login, usuario_nome).
   "Criar acesso": POST /api/professores/ID/criar_acesso/ {username, senha} cria o login do professor. */
export function RhProfessores({ back }: { back: () => void }) {
  const professores = useApi<Professor[]>("/api/professores/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState<FormProfessor | null>(null);
  const [aviso, setAviso] = useState("");
  const envio = useEnvio(["nome", "matricula", "cpf", "carga_horaria_semanal"]);

  const abrir = (p?: Professor) => {
    envio.limpar();
    setForm(p
      ? { id: p.id, nome: p.nome, matricula: p.matricula, cpf: "", carga_horaria_semanal: String(p.carga_horaria_semanal), vinculo: p.vinculo, data_admissao: p.data_admissao ?? "" }
      : VAZIO);
  };
  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const { id, cpf, ...resto } = form;
    const corpo: Record<string, unknown> = { ...resto, carga_horaria_semanal: Number(resto.carga_horaria_semanal), data_admissao: resto.data_admissao || null };
    if (cpf || !id) corpo.cpf = cpf; // na edição, CPF em branco = não mudar
    if (id) await api(`/api/professores/${id}/`, { method: "PATCH", body: corpo });
    else await api("/api/professores/", { method: "POST", body: corpo });
    setForm(null);
    setAviso(id ? "Professor atualizado." : "Professor cadastrado.");
    professores.recarregar();
  });
  const mudar = (campo: keyof FormProfessor) => (v: string) => form && setForm({ ...form, [campo]: v });
  const lista = (professores.dados ?? []).filter((p) => `${p.nome} ${p.matricula}`.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Professores" subtitle={`RH · ${professores.dados?.length ?? 0} cadastrados`} onBack={back} accent={GREEN} right={<BotaoNovo label="Novo professor" cor={GREEN} onClick={() => abrir()} />} />
      <Screen>
        {form && (
          <CartaoForm titulo={form.id ? "Editar professor" : "Novo professor"} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={GREEN}>
            <Entrada label="Nome completo" value={form.nome} onChange={mudar("nome")} erro={envio.campos.nome} />
            <div className="flex gap-2">
              <Entrada label="Matrícula" value={form.matricula} onChange={mudar("matricula")} erro={envio.campos.matricula} placeholder="123456-7" />
              <Entrada label={form.id ? "CPF (só se for mudar)" : "CPF"} value={form.cpf} onChange={mudar("cpf")} erro={envio.campos.cpf} placeholder="000.000.000-00" inputMode="numeric" />
            </div>
            <div className="flex gap-2">
              <Escolha label="Carga horária" value={form.carga_horaria_semanal} onChange={mudar("carga_horaria_semanal")} opcoes={opcoes.dados?.cargas ?? []} erro={envio.campos.carga_horaria_semanal} />
              <Escolha label="Vínculo" value={form.vinculo} onChange={mudar("vinculo")} opcoes={opcoes.dados?.vinculos ?? []} />
            </div>
            <Entrada label="Data de admissão (opcional)" type="date" value={form.data_admissao} onChange={mudar("data_admissao")} />
          </CartaoForm>
        )}
        {aviso && (
          <div className="mb-3 flex items-center gap-2 rounded-2xl px-3.5 py-3 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}>
            <IconCheck size={17} />{aviso}
          </div>
        )}
        <div className="mb-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou matrícula" className="flex-1 bg-transparent text-[13px] outline-none" />
        </div>
        <EstadoApi carregando={professores.carregando} erro={professores.erro} onRetry={professores.recarregar}>
          <div className="space-y-2.5">
            {lista.map((p) => {
              const pct = Math.round((p.aulas_ano_atual / p.limite_aulas) * 100);
              const cor = pct >= 100 ? RED : pct >= 80 ? AMBER : GREEN;
              return (
                <div key={p.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-bold" style={{ color: INK }}>{p.nome}</p>
                      <p className="text-[11.5px]" style={{ color: INK_SOFT }}>Matrícula {p.matricula} · CPF {p.cpf_formatado}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5"><Pill color={GREEN}>{p.carga_horaria_semanal} h</Pill><Pill color={INK_SOFT}>{p.vinculo_nome}</Pill>{!p.ativo && <Pill color={RED}>Inativo</Pill>}{p.afastamento_atual && <Pill color={VIOLET}>Afastado até {dataBR(p.afastamento_atual.fim).slice(0, 5)}</Pill>}</div>
                      {p.afastamento_atual && <p className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>{p.afastamento_atual.tipo_nome}</p>}
                    </div>
                    <button onClick={() => abrir(p)} aria-label={`Editar ${p.nome}`} className="grid h-9 w-9 flex-none place-items-center rounded-full" style={{ background: GREEN + "14", color: GREEN }}><IconEdit size={17} /></button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: cor }} /></div>
                    <span className="text-[11.5px] font-bold" style={{ color: cor }}>{p.aulas_ano_atual} de {p.limite_aulas} aulas</span>
                  </div>
                  <p className="mt-1 text-[10.5px]" style={{ color: INK_SOFT }}>Em sala no máximo 2/3 da carga (Lei 11.738/2008). O resto é planejamento.</p>
                  <AcessoProfessor professor={p} onCriado={(login) => { setAviso(`Acesso criado: ${p.nome} já pode entrar com o usuário ${login}.`); professores.recarregar(); }} />
                </div>
              );
            })}
          </div>
        </EstadoApi>
      </Screen>
    </div>
  );
}

/* Login do professor: mostra o usuário, ou um mini formulário para criar o acesso. */
function AcessoProfessor({ professor, onCriado }: { professor: Professor; onCriado: (login: string) => void }) {
  const [aberto, setAberto] = useState(false);
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const envio = useEnvio(["username", "senha"]);

  if (professor.usuario !== null) {
    return (
      <p className="mt-2.5 flex items-center gap-1.5 border-t pt-2.5 text-[11.5px]" style={{ color: INK_SOFT, borderColor: "#eef2f7" }}>
        <IconUser size={14} style={{ color: GREEN }} />Entra no app como <b style={{ color: INK }}>{professor.usuario_nome}</b>
      </p>
    );
  }
  const criar = () => envio.enviar(async () => {
    await api(`/api/professores/${professor.id}/criar_acesso/`, { method: "POST", body: { username, senha } });
    setAberto(false);
    onCriado(username.trim().toLowerCase()); // a API guarda o usuário em minúsculas
  });
  if (!aberto) {
    return (
      <div className="mt-2.5 flex items-center gap-2 border-t pt-2.5" style={{ borderColor: "#eef2f7" }}>
        <span className="flex-1 text-[11.5px]" style={{ color: INK_SOFT }}>Ainda não tem login no app.</span>
        <button onClick={() => { envio.limpar(); setAberto(true); }} className="rounded-xl px-3 py-1.5 text-[12px] font-semibold" style={{ background: BLUE + "14", color: BLUE }}>Criar acesso</button>
      </div>
    );
  }
  return (
    <div className="mt-2.5 space-y-2 border-t pt-2.5" style={{ borderColor: "#eef2f7" }}>
      <p className="text-[12px] font-semibold" style={{ color: INK }}>Criar acesso de {professor.nome}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Entrada label="Usuário" value={username} onChange={setUsername} erro={envio.campos.username} placeholder="ex.: paulo.dias" />
        <Entrada label="Senha (mín. 8)" type="password" value={senha} onChange={setSenha} erro={envio.campos.senha} />
      </div>
      {envio.erro && <AvisoErro texto={envio.erro} />}
      <div className="flex gap-2">
        <button onClick={() => setAberto(false)} className="flex-1 rounded-xl border py-2 text-[12.5px] font-semibold" style={{ borderColor: "#e2e8f0", color: INK_SOFT }}>Cancelar</button>
        <button onClick={criar} disabled={envio.enviando} className="flex-1 rounded-xl py-2 text-[12.5px] font-semibold text-white disabled:opacity-70" style={{ background: BLUE }}>{envio.enviando ? "Criando..." : "Criar acesso"}</button>
      </div>
    </div>
  );
}
