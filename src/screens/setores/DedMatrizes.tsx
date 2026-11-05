import { useState } from "react";
import { BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconClock } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { ANO_ATUAL, horasBR, opcoesDe } from "@/lib/formato";
import type { Curso, ItemMatriz, Materia, Matriz, Oferta, Opcoes } from "@/lib/tipos";
import { GREEN, INK, INK_SOFT, RED, TEAL, VIOLET } from "@/theme/colors";

type Edicao = { id?: number; serie: string; jornada: string; duracao: string; semanas: string; itens: ItemMatriz[]; escola: string; escolaNome?: string | null };

/* Mesma conta do Django (regulacao/models.py): aulas × minutos × semanas ÷ 60 = horas no ano. */
const horasAno = (aulas: number, minutos: number, semanas: number) => (aulas * minutos * semanas) / 60;

/* DED — Matrizes curriculares: aulas por semana de cada matéria, fechando a carga mínima do curso.
   A matriz pode valer para a rede toda (escola vazia) ou só para uma escola que tenha uma matriz diferente
   (ex.: Centro de Excelência com mais aulas de Matemática). A escola com matriz própria usa a dela;
   as outras usam a da rede. */
export function DedMatrizes({ back }: { back: () => void }) {
  const [ano, setAno] = useState(String(ANO_ATUAL));
  const matrizes = useApi<Matriz[]>(`/api/matrizes/?ano_letivo=${ano}`);
  const cursos = useApi<Curso[]>("/api/cursos/");
  const materias = useApi<Materia[]>("/api/materias/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const ofertas = useApi<Oferta[]>(`/api/ofertas/?ano_letivo=${ano}`);
  const [ed, setEd] = useState<Edicao | null>(null);
  const [nova, setNova] = useState("");
  const envio = useEnvio(["serie", "duracao_aula_minutos", "semanas_letivas", "itens", "escola"]);

  const series = (cursos.dados ?? []).flatMap((c) => c.series.map((s) => ({ ...s, minimo: c.carga_horaria_minima_anual })));
  const abrir = (m?: Matriz) => {
    envio.limpar();
    setNova("");
    setEd(m
      ? { id: m.id, serie: String(m.serie), jornada: m.jornada, duracao: String(m.duracao_aula_minutos), semanas: String(m.semanas_letivas), itens: m.itens.map((i) => ({ ...i })), escola: String(m.escola ?? ""), escolaNome: m.escola_nome }
      : { serie: String(series[0]?.id ?? ""), jornada: "parcial", duracao: "50", semanas: "40", itens: [], escola: "" });
  };
  const mudarAulas = (materia: number, delta: number) => ed && setEd({
    ...ed,
    itens: ed.itens.map((i) => (i.materia === materia ? { ...i, aulas_semanais: i.aulas_semanais + delta } : i)).filter((i) => i.aulas_semanais > 0),
  });
  const incluir = () => {
    const m = materias.dados?.find((x) => String(x.id) === nova);
    if (!ed || !m || ed.itens.some((i) => i.materia === m.id)) return;
    setEd({ ...ed, itens: [...ed.itens, { materia: m.id, materia_nome: m.nome, aulas_semanais: 2 }] });
    setNova("");
  };
  const salvar = () => envio.enviar(async () => {
    if (!ed) return;
    const itens = ed.itens.map(({ materia, aulas_semanais }) => ({ materia, aulas_semanais }));
    const dados = { duracao_aula_minutos: Number(ed.duracao), semanas_letivas: Number(ed.semanas), itens };
    if (ed.id) await api(`/api/matrizes/${ed.id}/`, { method: "PATCH", body: dados });
    else await api("/api/matrizes/", { method: "POST", body: { ...dados, serie: Number(ed.serie), ano_letivo: Number(ano), jornada: ed.jornada, escola: Number(ed.escola) || null } });
    setEd(null);
    matrizes.recarregar();
  });

  // Conta ao vivo, enquanto o DED mexe nas aulas (o Django confere de novo ao salvar).
  const total = ed ? ed.itens.reduce((s, i) => s + i.aulas_semanais, 0) : 0;
  const horas = ed ? horasAno(total, Number(ed.duracao) || 0, Number(ed.semanas) || 0) : 0;
  const minimo = series.find((s) => String(s.id) === ed?.serie)?.minimo ?? 0;
  const faltam = minimo - horas;
  const livres = (materias.dados ?? []).filter((m) => !ed?.itens.some((i) => i.materia === m.id));
  const anos = [ANO_ATUAL - 1, ANO_ATUAL, ANO_ATUAL + 1].map((a) => ({ valor: String(a), nome: String(a) }));
  // Só aparecem as escolas que oferecem essa série no ano (oferta cadastrada em "Oferta de séries").
  const escolasDaSerie = (ofertas.dados ?? []).filter((o) => o.series.includes(Number(ed?.serie)))
    .map((o) => ({ valor: String(o.escola), nome: o.escola_nome })).sort((a, b) => a.nome.localeCompare(b.nome));
  // Matriz da rede da mesma série e jornada: serve de ponto de partida para a matriz da escola.
  const daRede = ed && !ed.id ? (matrizes.dados ?? []).find((m) => m.escola === null && String(m.serie) === ed.serie && m.jornada === ed.jornada) : undefined;
  const copiarDaRede = () => ed && daRede && setEd({ ...ed, duracao: String(daRede.duracao_aula_minutos), semanas: String(daRede.semanas_letivas), itens: daRede.itens.map((i) => ({ ...i })) });
  const lista = [...(matrizes.dados ?? [])].sort((a, b) => (a.escola === null ? 0 : 1) - (b.escola === null ? 0 : 1) || (a.escola_nome ?? "").localeCompare(b.escola_nome ?? ""));

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Matrizes curriculares" subtitle="DED · carga horária por matéria" onBack={back} accent={VIOLET} right={<BotaoNovo label="Nova matriz" cor={VIOLET} onClick={() => abrir()} />} />
      <Screen>
        <div className="mb-3 w-32"><Escolha label="Ano letivo" value={ano} onChange={setAno} opcoes={anos} /></div>
        {ed && (
          <CartaoForm titulo={ed.id ? "Editar matriz" : `Nova matriz ${ano}`} onSalvar={salvar} onCancelar={() => setEd(null)} salvando={envio.enviando} erro={envio.erro} cor={VIOLET}>
            {!ed.id && (
              <div className="flex gap-2">
                <Escolha label="Série" value={ed.serie} onChange={(v) => setEd({ ...ed, serie: v, escola: "" })} opcoes={series.map((s) => ({ valor: String(s.id), nome: `${s.nome} · ${s.curso_nome}` }))} erro={envio.campos.serie} />
                <Escolha label="Jornada" value={ed.jornada} onChange={(v) => setEd({ ...ed, jornada: v })} opcoes={opcoes.dados?.jornadas ?? []} />
              </div>
            )}
            <div className="flex gap-2">
              <Entrada label="Duração da aula (min)" value={ed.duracao} onChange={(v) => setEd({ ...ed, duracao: v })} erro={envio.campos.duracao_aula_minutos} inputMode="numeric" />
              <Entrada label="Semanas letivas" value={ed.semanas} onChange={(v) => setEd({ ...ed, semanas: v })} erro={envio.campos.semanas_letivas} inputMode="numeric" />
            </div>
            <div className="rounded-xl p-3" style={{ background: (faltam > 0 ? RED : GREEN) + "10" }}>
              <p className="text-[13px] font-bold" style={{ color: faltam > 0 ? RED : GREEN }}>{total} aulas/semana = {horasBR(horas)} h no ano</p>
              <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{faltam > 0 ? `Faltam ${horasBR(faltam)} h para o mínimo de ${horasBR(minimo)} h.` : `Cumpre o mínimo de ${horasBR(minimo)} h do curso.`}</p>
            </div>
            <div className="divide-y divide-[color:var(--color-line)] rounded-xl border" style={{ borderColor: "#e2e8f0" }}>
              {ed.itens.map((i) => (
                <div key={i.materia} className="flex items-center gap-2 px-3 py-2">
                  <span className="flex-1 text-[13px] font-semibold" style={{ color: INK }}>{i.materia_nome}</span>
                  <button onClick={() => mudarAulas(i.materia, -1)} aria-label="Menos uma aula" className="h-7 w-7 rounded-full border text-[15px] font-bold" style={{ borderColor: "#e2e8f0", color: INK }}>−</button>
                  <span className="w-6 text-center text-[13px] font-bold" style={{ color: VIOLET }}>{i.aulas_semanais}</span>
                  <button onClick={() => mudarAulas(i.materia, 1)} aria-label="Mais uma aula" className="h-7 w-7 rounded-full border text-[15px] font-bold" style={{ borderColor: "#e2e8f0", color: INK }}>+</button>
                </div>
              ))}
              {ed.itens.length === 0 && <p className="px-3 py-3 text-[12px]" style={{ color: INK_SOFT }}>Adicione as matérias abaixo.</p>}
            </div>
            {envio.campos.itens && <p className="text-[11.5px] font-medium" style={{ color: RED }}>{envio.campos.itens}</p>}
            <div className="flex items-end gap-2">
              <Escolha label="Adicionar matéria" value={nova} onChange={setNova} opcoes={opcoesDe(livres, (m) => m.nome)} vazio="Escolha" />
              <button onClick={incluir} className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white" style={{ background: VIOLET }}>Incluir</button>
            </div>
            <div className="border-t pt-3" style={{ borderColor: "#e2e8f0" }}>
              {ed.id ? (
                <p className="text-[12.5px]" style={{ color: INK }}>Vale para: <b>{ed.escolaNome ?? "toda a rede"}</b></p>
              ) : (
                <>
                  <Escolha label="Vale para qual escola?" value={ed.escola} onChange={(v) => setEd({ ...ed, escola: v })} opcoes={escolasDaSerie} vazio="Toda a rede (padrão)" erro={envio.campos.escola} />
                  <p className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>
                    {ed.escola
                      ? "Matriz própria: só essa escola usa. As outras continuam com a matriz da rede."
                      : "Todas as escolas que oferecem a série usam esta matriz, menos as que tiverem uma própria."}
                  </p>
                  {ed.escola && daRede && ed.itens.length === 0 && (
                    <button onClick={copiarDaRede} className="mt-2 rounded-full px-3 py-1.5 text-[12px] font-semibold" style={{ background: VIOLET + "14", color: VIOLET }}>Começar com as aulas da matriz da rede</button>
                  )}
                </>
              )}
            </div>
          </CartaoForm>
        )}
        <EstadoApi carregando={matrizes.carregando} erro={matrizes.erro} onRetry={matrizes.recarregar}>
          <div className="space-y-2.5">
            {lista.map((m) => (
              <button key={m.id} onClick={() => abrir(m)} className="card flex w-full items-center gap-3 p-4 text-left active:scale-[0.99] transition">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: VIOLET + "16", color: VIOLET }}><IconClock size={20} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold" style={{ color: INK }}>{m.serie_nome} · {m.curso_nome}</p>
                  <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{m.jornada_nome} · {m.total_aulas_semanais} aulas de {m.duracao_aula_minutos} min · {horasBR(m.carga_horaria_anual)} h/ano (mín. {horasBR(m.carga_minima)} h)</p>
                </div>
                <div className="flex flex-none flex-col items-end gap-1">
                  <Pill color={m.cumpre_minimo ? GREEN : RED}>{m.cumpre_minimo ? "Cumpre" : "Abaixo"}</Pill>
                  <Pill color={m.escola === null ? INK_SOFT : TEAL}>{m.escola_nome ?? "Toda a rede"}</Pill>
                </div>
              </button>
            ))}
            {matrizes.dados?.length === 0 && <p className="mt-6 text-center text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma matriz em {ano}.</p>}
          </div>
        </EstadoApi>
      </Screen>
    </div>
  );
}
