/* Histórico de alterações: tudo que foi cadastrado, editado ou apagado no sistema, e por quem.
   Dados: GET /api/registros/?limite=200 (&acao=criou|editou|apagou &tipo=...).
   A Secretaria vê o histórico de todo mundo; os outros perfis veem só o que eles mesmos fizeram.
   Tocar numa linha mostra as mudanças campo a campo (antes -> depois). */

import { useEffect, useState } from "react";
import { Chips } from "@/components/Chips";
import { EmptyState } from "@/components/EmptyState";
import { Escolha, EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconSearch, IconShield } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { dataHoraBR } from "@/lib/formato";
import type { Registro } from "@/lib/tipos";
import { BLUE, GREEN, INDIGO, INK, INK_SOFT, RED } from "@/theme/colors";

type FiltroAcao = "todas" | Registro["acao"];

const COR_ACAO: Record<Registro["acao"], string> = { criou: GREEN, editou: BLUE, apagou: RED };

export function HistoricoAlteracoes({ back }: { back: () => void }) {
  const usuario = useUsuario();
  const veTudo = !!usuario && (usuario.perfil === "secretaria" || usuario.is_superuser);
  const [acao, setAcao] = useState<FiltroAcao[]>(["todas"]);
  const [tipo, setTipo] = useState("");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<number | null>(null);
  // Tipos que já apareceram (para o filtro não sumir com as opções quando escolhemos um tipo).
  const [tiposVistos, setTiposVistos] = useState<string[]>([]);

  const filtros = new URLSearchParams({ limite: "200" });
  if (acao[0] !== "todas") filtros.set("acao", acao[0]);
  if (tipo) filtros.set("tipo", tipo);
  const registros = useApi<Registro[]>(`/api/registros/?${filtros}`);

  // Sempre que chega uma lista nova, guarda os tipos que ainda não conhecíamos.
  useEffect(() => {
    if (!registros.dados) return;
    const tipos = registros.dados.map((r) => r.tipo);
    setTiposVistos((vistos) => [...new Set([...vistos, ...tipos])].sort());
  }, [registros.dados]);

  const termo = busca.trim().toLowerCase();
  const lista = (registros.dados ?? []).filter((r) => !termo || `${r.usuario_nome} ${r.descricao} ${r.tipo}`.toLowerCase().includes(termo));

  return (
    <>
      <TopBar title="Histórico de alterações" subtitle="Quem cadastrou, editou ou apagou" onBack={back} accent={INDIGO} />
      <Screen>
        <div className="flex items-start gap-2 rounded-2xl p-3.5 text-[12.5px]" style={{ background: INDIGO + "0d", color: INK }}>
          <IconShield size={18} className="mt-0.5 flex-none" style={{ color: INDIGO }} />
          <span>
            Todo cadastro, edição ou exclusão fica registrado aqui, com quem fez e quando.{" "}
            <b>A Secretaria vê tudo; os outros perfis veem só o que eles mesmos fizeram.</b>
            {usuario && (veTudo ? " Você está vendo o histórico da rede toda." : " Você está vendo só as suas alterações.")}
          </span>
        </div>

        <div className="mt-3"><Chips<FiltroAcao> items={[{ id: "todas", label: "Todas" }, { id: "criou", label: "Criou" }, { id: "editou", label: "Editou" }, { id: "apagou", label: "Apagou" }]} value={acao} onChange={setAcao} cor={INDIGO} /></div>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end">
          <Escolha label="Tipo de cadastro" value={tipo} onChange={setTipo} vazio="Todos os tipos" opcoes={tiposVistos.map((t) => ({ valor: t, nome: t }))} />
          <label className="block min-w-0 flex-1">
            <span className="mb-1 block text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>Buscar</span>
            <span className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5" style={{ borderColor: "#e2e8f0" }}>
              <IconSearch size={16} style={{ color: INK_SOFT }} />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pessoa ou descrição" className="flex-1 bg-transparent text-[13px] outline-none" style={{ color: INK }} />
            </span>
          </label>
        </div>

        <EstadoApi carregando={registros.carregando && !registros.dados} erro={registros.erro} onRetry={registros.recarregar}>
          <p className="mt-3 text-[11.5px]" style={{ color: INK_SOFT }}>{lista.length} {lista.length === 1 ? "registro" : "registros"} (os 200 mais recentes){termo && " com essa busca"}.</p>
          {lista.length === 0 && <EmptyState title="Nenhuma alteração" text="Nada registrado com esses filtros." icon={<IconShield size={26} />} />}
          <div className="mt-2 space-y-2">
            {lista.map((r) => {
              const cor = COR_ACAO[r.acao] ?? INK_SOFT;
              const mostrar = aberto === r.id;
              return (
                <button key={r.id} onClick={() => setAberto(mostrar ? null : r.id)} className="card block w-full p-3.5 text-left" style={{ borderLeft: `3px solid ${cor}` }}>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Pill color={cor}>{r.acao_nome}</Pill>
                    <Pill color={INK_SOFT}>{r.tipo}</Pill>
                    <span className="ml-auto text-[11px]" style={{ color: "#94a3b8" }}>{dataHoraBR(r.criado_em)}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] font-semibold" style={{ color: INK }}>{r.descricao}</p>
                  <p className="text-[11.5px]" style={{ color: INK_SOFT }}>por <b>{r.usuario_nome}</b>{r.mudancas.length > 0 && ` · ${r.mudancas.length} ${r.mudancas.length === 1 ? "campo mudou" : "campos mudaram"}${mostrar ? "" : " (toque para ver)"}`}</p>
                  {mostrar && r.mudancas.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 rounded-xl p-2.5" style={{ background: "#f4f7fb" }}>
                      {r.mudancas.map((m) => (
                        <div key={m.campo} className="text-[12px]" style={{ color: INK }}>
                          <span className="font-semibold">{m.campo}: </span>
                          <span className="line-through" style={{ color: RED }}>{m.antes}</span>
                          <span style={{ color: INK_SOFT }}> → </span>
                          <span className="font-semibold" style={{ color: GREEN }}>{m.depois}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {mostrar && r.mudancas.length === 0 && <p className="mt-2 text-[11.5px]" style={{ color: INK_SOFT }}>Sem detalhe campo a campo (só editar guarda o antes e o depois).</p>}
                </button>
              );
            })}
          </div>
        </EstadoApi>
      </Screen>
    </>
  );
}
