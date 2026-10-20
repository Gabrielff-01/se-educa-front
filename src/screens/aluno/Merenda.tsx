/* Merenda escolar: cardápio da semana (segunda a sexta) da escola.
   Dados: /api/cardapios/?escola=ID. Almoço e lanche vêm como texto, um item por linha ("\n").
   - Aluno/responsável: vê o cardápio da escola do aluno (o id vem em /api/meus-alunos/).
   - Escola (perfil "escola"): vê o da sua escola e pode editar cada dia (PATCH /api/cardapios/ID/).
   - Outros perfis: escolhem a escola numa lista. */

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { CartaoForm, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { SeletorAluno } from "@/components/SeletorAluno";
import { TopBar } from "@/components/TopBar";
import { IconCheck, IconEdit, IconFood, IconShield } from "@/components/icons";
import { useAlunoEscolhido } from "@/hooks/useAlunoEscolhido";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { api } from "@/lib/api";
import { opcoesDe } from "@/lib/formato";
import type { Cardapio, Escola } from "@/lib/tipos";
import { AMBER, BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

const SIGLAS = ["SEG", "TER", "QUA", "QUI", "SEX"];

/* Datas de segunda a sexta desta semana (no fim de semana, já mostra a próxima). */
function diasDaSemana() {
  const hoje = new Date();
  const dia = hoje.getDay(); // 0 = domingo ... 6 = sábado
  const ateSegunda = dia === 0 ? 1 : dia === 6 ? 2 : 1 - dia;
  return SIGLAS.map((_, i) => {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + ateSegunda + i);
    return d;
  });
}

/* "Arroz\nFeijão\n" -> ["Arroz", "Feijão"] */
const itensDe = (texto: string) => texto.split("\n").map((i) => i.trim()).filter(Boolean);

export function Merenda({ back }: { back: () => void }) {
  const usuario = useUsuario();
  const ehEscola = usuario?.perfil === "escola";
  const ehFamilia = usuario?.perfil === "aluno" || usuario?.perfil === "responsavel";
  const { filhos, atual, escolher } = useAlunoEscolhido();
  const escolas = useApi<Escola[]>("/api/escolas/");
  const [escolaEscolhida, setEscolaEscolhida] = useState("");

  // Qual escola mostrar depende de quem está olhando
  const escolaId = ehEscola ? usuario?.escola ?? null : ehFamilia ? atual?.escola ?? null : Number(escolaEscolhida) || null;
  const escolaNome = ehEscola ? usuario?.escola_nome : ehFamilia ? atual?.escola_nome : escolas.dados?.find((e) => e.id === escolaId)?.nome;
  const cardapios = useApi<Cardapio[]>(escolaId ? `/api/cardapios/?escola=${escolaId}` : null);

  const datas = diasDaSemana();
  const hoje = new Date().getDay();
  const [dia, setDia] = useState(hoje >= 1 && hoje <= 5 ? hoje : 1);
  const doDia = (cardapios.dados ?? []).find((c) => c.dia_semana === dia) ?? null;

  // Edição (só a escola)
  const [form, setForm] = useState<{ id: number; almoco: string; lanche: string } | null>(null);
  const [salvo, setSalvo] = useState("");
  const envio = useEnvio(["almoco", "lanche"]);
  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    await api(`/api/cardapios/${form.id}/`, { method: "PATCH", body: { almoco: form.almoco, lanche: form.lanche } });
    setForm(null);
    setSalvo(`Cardápio de ${doDia?.dia_nome.toLowerCase() ?? "hoje"} salvo!`);
    cardapios.recarregar();
  });

  const carregando = escolas.carregando || (ehFamilia && filhos.carregando) || cardapios.carregando;
  const erro = escolas.erro ?? (ehFamilia ? filhos.erro : null) ?? cardapios.erro;

  return (
    <>
      <TopBar title="Merenda escolar" subtitle={escolaNome ? `Cardápio · ${escolaNome}` : "Cardápio da semana"} onBack={back} accent={GREEN} />
      <Screen>
        {ehFamilia && <SeletorAluno alunos={filhos.dados ?? []} atual={atual} escolher={escolher} cor={GREEN} />}
        {!ehFamilia && !ehEscola && (
          <div className="mb-3"><Escolha label="Escola" value={escolaEscolhida} onChange={setEscolaEscolhida} opcoes={opcoesDe(escolas.dados, (e) => e.nome)} vazio="Escolha uma escola" /></div>
        )}
        <EstadoApi carregando={carregando} erro={erro} onRetry={cardapios.recarregar}>
          {!escolaId ? (
            <EmptyState title="Escolha a escola" text={ehFamilia ? "O aluno ainda não tem escola nesta rede." : "Escolha uma escola acima para ver o cardápio."} icon={<IconFood size={26} />} />
          ) : (cardapios.dados ?? []).length === 0 ? (
            <EmptyState title="Cardápio não cadastrado" text="Esta escola ainda não cadastrou o cardápio da semana." icon={<IconFood size={26} />} />
          ) : (
            <>
              <div className="grid grid-cols-5 gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
                {SIGLAS.map((sigla, i) => (
                  <button key={sigla} onClick={() => { setDia(i + 1); setForm(null); }} className="rounded-xl py-2 text-center transition" style={dia === i + 1 ? { background: GREEN, color: "#fff" } : { color: INK_SOFT }}>
                    <p className="text-[10px] font-bold">{sigla}</p><p className="text-[15px] font-extrabold">{datas[i].getDate()}</p>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                {dia === hoje ? <span className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: GREEN }}><span className="h-2 w-2 rounded-full" style={{ background: GREEN }} />Cardápio de hoje</span> : <span className="text-[12px] font-semibold" style={{ color: INK_SOFT }}>{doDia?.dia_nome ?? ""}</span>}
                {ehEscola && doDia && !form && (
                  <button onClick={() => { envio.limpar(); setSalvo(""); setForm({ id: doDia.id, almoco: doDia.almoco, lanche: doDia.lanche }); }} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}>
                    <IconEdit size={14} />Editar {doDia.dia_nome.toLowerCase()}
                  </button>
                )}
              </div>

              {salvo && <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}><IconCheck size={16} />{salvo}</div>}

              {form && (
                <div className="mt-3">
                  <CartaoForm titulo={`Cardápio de ${doDia?.dia_nome.toLowerCase()}`} onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={GREEN}>
                    <p className="text-[11.5px]" style={{ color: INK_SOFT }}>Um item por linha.</p>
                    <AreaTexto label="Lanche" value={form.lanche} onChange={(v) => setForm({ ...form, lanche: v })} erro={envio.campos.lanche} />
                    <AreaTexto label="Almoço" value={form.almoco} onChange={(v) => setForm({ ...form, almoco: v })} erro={envio.campos.almoco} />
                  </CartaoForm>
                </div>
              )}

              {doDia ? (
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Bloco titulo="Lanche" itens={itensDe(doDia.lanche)} cor={AMBER} />
                  <Bloco titulo="Almoço" itens={itensDe(doDia.almoco)} cor={GREEN} />
                </div>
              ) : (
                <p className="mt-3 text-[12.5px]" style={{ color: INK_SOFT }}>Sem cardápio cadastrado para este dia.</p>
              )}
            </>
          )}
        </EstadoApi>
        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: BLUE + "0e" }}>
          <IconShield size={18} className="mt-0.5 flex-none" style={{ color: BLUE }} />
          <p className="text-[12px] leading-relaxed" style={{ color: INK }}>Cardápio do Programa Nacional de Alimentação Escolar (PNAE). Alunos com restrição alimentar recebem refeição adaptada — informe na secretaria da escola.</p>
        </div>
      </Screen>
    </>
  );
}

function Bloco({ titulo, itens, cor }: { titulo: string; itens: string[]; cor: string }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 p-4" style={{ background: cor + "10" }}>
        <div className="grid h-11 w-11 place-items-center rounded-2xl text-white" style={{ background: cor }}><IconFood size={21} /></div>
        <div className="flex-1"><p className="text-[15px] font-bold" style={{ color: INK }}>{titulo}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{itens.length} {itens.length === 1 ? "item" : "itens"}</p></div>
      </div>
      {itens.length === 0 ? <p className="px-4 py-3 text-[12.5px]" style={{ color: INK_SOFT }}>Nada cadastrado.</p> : (
        <ul className="divide-y divide-slate-100 px-4">
          {itens.map((i, n) => <li key={n} className="flex items-center gap-2.5 py-2.5 text-[13px]" style={{ color: INK }}><span className="h-1.5 w-1.5 flex-none rounded-full" style={{ background: cor }} />{i}</li>)}
        </ul>
      )}
    </div>
  );
}

/* Caixa de texto de várias linhas, no mesmo visual da <Entrada> do Form.tsx */
function AreaTexto({ label, value, onChange, erro }: { label: string; value: string; onChange: (v: string) => void; erro?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px] outline-none" style={{ borderColor: erro ? RED : "#e2e8f0", color: INK }} />
      {erro && <span className="mt-1 block text-[11px] font-medium" style={{ color: RED }}>{erro}</span>}
    </label>
  );
}
