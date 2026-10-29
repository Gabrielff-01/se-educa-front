/* Documentos para a escola (aluno e responsável): mandar atestado, papéis da matrícula etc.
   e acompanhar a resposta da escola (aguardando, aceito ou recusado com o motivo).
   - O responsável escolhe o filho no topo; o documento vai para a escola onde ele está matriculado.
   - Recusado? O botão "Enviar de novo" já abre o formulário com o mesmo tipo.
   Dados: GET/POST /api/documentos/?aluno=ID, DELETE /api/documentos/ID/ e /api/documentos/ID/arquivo/. */

import { useRef, useState } from "react";
import { CartaoForm, Entrada, EstadoApi, useEnvio } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { SeletorAluno } from "@/components/SeletorAluno";
import { TopBar } from "@/components/TopBar";
import { VerArquivo } from "@/components/VerArquivo";
import { IconCheck, IconDoc, IconPlus, IconX } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { api, ErroApi } from "@/lib/api";
import { COR_DO_STATUS, FORMATOS_ACEITOS, GRUPOS_DE_TIPOS, TAMANHO_MAXIMO, TIPOS_COM_PERIODO, tamanhoBR } from "@/lib/documentos";
import { dataBR, dataHoraBR, hojeISO } from "@/lib/formato";
import type { Documento } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED, TEAL } from "@/theme/colors";

type Form = { tipo: string; data_inicio: string; data_fim: string; descricao: string };
const VAZIO: Form = { tipo: "atestado", data_inicio: hojeISO(), data_fim: hojeISO(), descricao: "" };

export function EnviarDocumentos({ back }: { back: () => void }) {
  const { filhos, atual, escolher, comAluno } = useAlunoEscolhido();
  const documentos = useApi<Documento[]>(comAluno("/api/documentos/"));
  const [form, setForm] = useState<Form | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [vendo, setVendo] = useState<Documento | null>(null);
  const [aviso, setAviso] = useState("");
  const envio = useEnvio(["tipo", "data_inicio", "data_fim", "descricao", "arquivo"]);
  const cancelando = useEnvio();
  const escolherArquivo = useRef<HTMLInputElement>(null);

  const abrir = (inicial: Partial<Form> = {}) => { envio.limpar(); setArquivo(null); setForm({ ...VAZIO, ...inicial }); };
  const mudar = (campo: keyof Form) => (valor: string) => form && setForm({ ...form, [campo]: valor });
  // A faixa verde some sozinha depois de 5 s.
  const avisar = (msg: string) => { setAviso(msg); setTimeout(() => setAviso((agora) => (agora === msg ? "" : agora)), 5000); };

  const enviar = () => envio.enviar(async () => {
    if (!form || !atual) return;
    // Confere antes de mandar (a API confere de novo): poupa a internet de quem está no celular.
    if (!arquivo) throw new ErroApi("Anexe o arquivo.", 400, { arquivo: "Anexe o arquivo (PDF ou foto)." }, "");
    if (arquivo.size > TAMANHO_MAXIMO) throw new ErroApi("Arquivo grande.", 400, { arquivo: `O arquivo tem ${tamanhoBR(arquivo.size)}. O máximo é 5 MB.` }, "");
    const dados = new FormData();
    dados.append("aluno", String(atual.id));
    dados.append("tipo", form.tipo);
    dados.append("descricao", form.descricao);
    if (TIPOS_COM_PERIODO.includes(form.tipo)) {
      dados.append("data_inicio", form.data_inicio);
      dados.append("data_fim", form.data_fim);
    }
    dados.append("arquivo", arquivo);
    const novo = await api<Documento>("/api/documentos/", { method: "POST", body: dados });
    setForm(null);
    setArquivo(null);
    avisar(`${novo.tipo_nome} enviado para ${novo.escola_nome}.`);
    documentos.recarregar();
  });

  const cancelar = (d: Documento) => {
    if (!window.confirm(`Cancelar o envio de "${d.tipo_nome}"?`)) return;
    cancelando.enviar(async () => {
      await api(`/api/documentos/${d.id}/`, { method: "DELETE" });
      documentos.recarregar();
    });
  };

  const lista = documentos.dados ?? [];
  const esperando = lista.filter((d) => d.status === "aguardando").length;
  const comPeriodo = form ? TIPOS_COM_PERIODO.includes(form.tipo) : false;

  return (
    <>
      <TopBar
        title="Enviar documentos"
        subtitle={atual?.escola_nome ? `Para ${atual.escola_nome}` : "Atestados e documentos da matrícula"}
        onBack={back}
        accent={TEAL}
      />
      <Screen>
        <SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={(id) => { escolher(id); setForm(null); }} cor={TEAL} />
        {aviso && <div className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} />{aviso}</div>}

        <EstadoApi carregando={filhos.carregando} erro={filhos.erro} onRetry={filhos.recarregar}>
          {!atual ? (
            <EmptyState title="Nenhum aluno ligado" text="Peça à secretaria da escola para ligar seu cadastro ao do aluno." />
          ) : !atual.escola ? (
            <EmptyState title="Sem matrícula neste ano" text={`${atual.nome.split(" ")[0]} não tem matrícula ativa. Fale com a escola para matricular.`} />
          ) : (
            <>
              {form ? (
                <CartaoForm titulo={`Enviar documento de ${atual.nome.split(" ")[0]}`} onSalvar={enviar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={TEAL} rotulo="Enviar" rotuloSalvando="Enviando...">
                  <label className="block">
                    <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Que documento é?</span>
                    <select value={form.tipo} onChange={(e) => { envio.limpar(); mudar("tipo")(e.target.value); }} className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none" style={{ borderColor: envio.campos.tipo ? RED : "#e2e8f0", color: INK }}>
                      {GRUPOS_DE_TIPOS.map((g) => (
                        <optgroup key={g.grupo} label={g.grupo}>
                          {g.tipos.map((t) => <option key={t.valor} value={t.valor}>{t.nome}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                  {comPeriodo && (
                    <div className="flex gap-2">
                      <Entrada label="Primeiro dia" type="date" value={form.data_inicio} onChange={mudar("data_inicio")} erro={envio.campos.data_inicio} />
                      <Entrada label="Último dia" type="date" value={form.data_fim} onChange={mudar("data_fim")} erro={envio.campos.data_fim} />
                    </div>
                  )}
                  <label className="block">
                    <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>{form.tipo === "outro" ? "Que documento é esse?" : "Observação para a escola (opcional)"}</span>
                    <textarea value={form.descricao} onChange={(e) => mudar("descricao")(e.target.value)} rows={2} maxLength={300} placeholder={comPeriodo ? "Ex.: ficou de repouso por causa de uma virose." : ""} className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none" style={{ borderColor: envio.campos.descricao ? RED : "#e2e8f0", color: INK }} />
                    {envio.campos.descricao && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{envio.campos.descricao}</span>}
                  </label>

                  {/* No celular, este botão também deixa tirar uma foto na hora. */}
                  <input ref={escolherArquivo} type="file" accept={FORMATOS_ACEITOS} className="hidden" onChange={(e) => { envio.limpar(); setArquivo(e.target.files?.[0] ?? null); e.target.value = ""; }} />
                  {arquivo ? (
                    <div className="flex items-center gap-3 rounded-xl border px-3 py-2.5" style={{ borderColor: arquivo.size > TAMANHO_MAXIMO ? RED : "#e2e8f0" }}>
                      <div className="grid h-9 w-9 flex-none place-items-center rounded-xl" style={{ background: TEAL + "16", color: TEAL }}><IconDoc size={18} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-semibold" style={{ color: INK }}>{arquivo.name}</p>
                        <p className="text-[11px]" style={{ color: arquivo.size > TAMANHO_MAXIMO ? RED : INK_SOFT }}>{tamanhoBR(arquivo.size)}{arquivo.size > TAMANHO_MAXIMO ? " · passa de 5 MB" : ""}</p>
                      </div>
                      <button onClick={() => setArquivo(null)} aria-label="Tirar arquivo" style={{ color: INK_SOFT }}><IconX size={18} /></button>
                    </div>
                  ) : (
                    <button onClick={() => escolherArquivo.current?.click()} className="flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed py-4 text-center" style={{ borderColor: envio.campos.arquivo ? RED : TEAL + "55", color: TEAL }}>
                      <IconPlus size={20} />
                      <span className="text-[13px] font-semibold">Escolher arquivo ou tirar foto</span>
                      <span className="text-[11px]" style={{ color: INK_SOFT }}>PDF, JPG ou PNG até 5 MB</span>
                    </button>
                  )}
                  {envio.campos.arquivo && <span className="block text-[11px] font-medium" style={{ color: RED }}>{envio.campos.arquivo}</span>}
                </CartaoForm>
              ) : (
                <button onClick={() => abrir()} className="card mb-1 flex w-full items-center gap-3 p-4 text-left active:scale-[0.99] transition" style={{ outline: `2px dashed ${TEAL}44` }}>
                  <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: TEAL + "16", color: TEAL }}><IconPlus size={22} /></div>
                  <div className="flex-1">
                    <p className="text-[13.5px] font-semibold" style={{ color: INK }}>Enviar um documento</p>
                    <p className="text-[11.5px]" style={{ color: INK_SOFT }}>Atestado, certidão, comprovante de residência, vacinação...</p>
                  </div>
                </button>
              )}

              <SectionHeader title={esperando ? `Enviados · ${esperando} aguardando a escola` : "Enviados"} />
              {cancelando.erro && <p className="mb-2 text-[12px] font-medium" style={{ color: RED }}>{cancelando.erro}</p>}
              <EstadoApi carregando={documentos.carregando} erro={documentos.erro} onRetry={documentos.recarregar}>
                {lista.length === 0 ? (
                  <EmptyState title="Nenhum documento enviado" text="O que você mandar para a escola aparece aqui, com a resposta dela." icon={<IconDoc size={26} />} />
                ) : (
                  <div className="grid gap-2.5 lg:grid-cols-2">
                    {lista.map((d) => (
                      <div key={d.id} className="card p-3.5" style={{ borderLeft: `3px solid ${COR_DO_STATUS[d.status]}` }}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-bold" style={{ color: INK }}>{d.tipo_nome}</p>
                            <p className="text-[11.5px]" style={{ color: INK_SOFT }}>
                              Enviado em {dataHoraBR(d.enviado_em)}{d.data_inicio ? ` · ${dataBR(d.data_inicio)} a ${dataBR(d.data_fim)}` : ""}
                            </p>
                          </div>
                          <Pill color={COR_DO_STATUS[d.status]}>{d.status_nome}</Pill>
                        </div>
                        {d.descricao && <p className="mt-1.5 text-[12px]" style={{ color: INK_SOFT }}>“{d.descricao}”</p>}
                        {d.resposta && (
                          <div className="mt-2 rounded-xl px-3 py-2 text-[12px]" style={{ background: COR_DO_STATUS[d.status] + "12", color: INK }}>
                            <b style={{ color: COR_DO_STATUS[d.status] }}>{d.status === "recusado" ? "Motivo" : "Escola"}:</b> {d.resposta}
                          </div>
                        )}
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          <button onClick={() => setVendo(d)} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ background: BLUE + "12", color: BLUE }}>Ver arquivo</button>
                          {d.status === "recusado" && (
                            <button onClick={() => abrir({ tipo: d.tipo, data_inicio: d.data_inicio ?? hojeISO(), data_fim: d.data_fim ?? hojeISO(), descricao: d.descricao })} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white" style={{ background: TEAL }}>Enviar de novo</button>
                          )}
                          {d.pode_cancelar && (
                            <button onClick={() => cancelar(d)} disabled={cancelando.enviando} className="rounded-lg px-3 py-1.5 text-[12px] font-semibold" style={{ background: RED + "10", color: RED }}>Cancelar envio</button>
                          )}
                          {d.status === "aguardando" && <span className="self-center text-[11px]" style={{ color: AMBER }}>A escola ainda vai conferir</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </EstadoApi>
            </>
          )}
        </EstadoApi>
      </Screen>
      {vendo && <VerArquivo documento={vendo} fechar={() => setVendo(null)} />}
    </>
  );
}
