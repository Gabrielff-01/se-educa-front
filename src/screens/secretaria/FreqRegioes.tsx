/* Frequência por regional (aparece no painel da Secretaria).
   Dados: GET /api/rede/frequencia/ -> por regional, "atual" (últimos 30 dias) e "anterior" (os 30 dias antes).
   null = a regional não teve aulas registradas no período. */

import { EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { useApi } from "@/hooks/useApi";
import { porcentoBR } from "@/lib/formato";
import { BLUE, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

type FreqRegional = { regional: number; regional_nome: string; atual: number | null; anterior: number | null };

export function FreqRegioes() {
  const freq = useApi<FreqRegional[]>("/api/rede/frequencia/");
  const todas = freq.dados ?? [];
  const comAulas = todas.filter((r) => r.atual !== null);
  const semAulas = todas.filter((r) => r.atual === null);
  // Maior e menor só fazem sentido se houver pelo menos 2 regionais com aulas.
  const ordenadas = [...comAulas].sort((a, b) => (b.atual ?? 0) - (a.atual ?? 0));
  const maior = ordenadas.length > 1 ? ordenadas[0] : null;
  const menor = ordenadas.length > 1 ? ordenadas[ordenadas.length - 1] : null;
  const media = comAulas.length ? comAulas.reduce((s, r) => s + (r.atual ?? 0), 0) / comAulas.length : null;
  const base = 50; // eixo das barras começa em 50% para as diferenças aparecerem
  const altura = (v: number | null) => (v === null ? 0 : Math.max(((v - base) / (100 - base)) * 100, 2));
  const corDe = (r: FreqRegional) => (r === maior ? GREEN : r === menor ? RED : BLUE);

  return (
    <EstadoApi carregando={freq.carregando} erro={freq.erro} onRetry={freq.recarregar}>
      {todas.length === 0 ? (
        <p className="card p-4 text-[12.5px]" style={{ color: INK_SOFT }}>Nenhuma regional cadastrada.</p>
      ) : (
        <>
          {maior && menor && (
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-3.5" style={{ outline: `2px solid ${GREEN}2a` }}><Pill color={GREEN}>Maior frequência</Pill><p className="mt-2 text-[21px] font-extrabold" style={{ color: GREEN }}>{porcentoBR(maior.atual)}</p><p className="text-[12px] font-semibold" style={{ color: INK }}>{maior.regional_nome}</p></div>
              <div className="card p-3.5" style={{ outline: `2px solid ${RED}2a` }}><Pill color={RED}>Menor frequência</Pill><p className="mt-2 text-[21px] font-extrabold" style={{ color: RED }}>{porcentoBR(menor.atual)}</p><p className="text-[12px] font-semibold" style={{ color: INK }}>{menor.regional_nome}</p></div>
            </div>
          )}
          {comAulas.length > 0 && (
            <div className="card mt-3 p-4">
              <div className="mb-3 flex items-center justify-between text-[11px]" style={{ color: INK_SOFT }}>
                <span>Média das regionais: <b style={{ color: INK }}>{porcentoBR(media)}</b></span>
                <span className="flex items-center gap-2"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: BLUE }} />30 dias</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: "#cbd5e1" }} />antes</span></span>
              </div>
              <div className="flex items-end justify-around gap-3" style={{ height: 140 }}>
                {comAulas.map((r) => (
                  <div key={r.regional} className="flex h-full max-w-[90px] flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-bold" style={{ color: corDe(r) }}>{Math.round(r.atual ?? 0)}</span>
                    <div className="flex w-full flex-1 items-end justify-center gap-[3px]">
                      <div className="w-1/3 rounded-t" style={{ height: `${altura(r.anterior)}%`, background: "#cbd5e1" }} />
                      <div className="w-1/2 rounded-t" style={{ height: `${altura(r.atual)}%`, background: corDe(r) }} />
                    </div>
                    <span className="w-full truncate text-center text-[10px]" style={{ color: INK_SOFT }}>{r.regional_nome}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[9.5px]" style={{ color: "#94a3b8" }}>Eixo a partir de {base}% para destacar as diferenças.</p>
            </div>
          )}
          <div className="card mt-3 divide-y">
            {[...ordenadas, ...semAulas].map((r) => {
              const diferenca = r.atual !== null && r.anterior !== null ? r.atual - r.anterior : null;
              return (
                <div key={r.regional} className="flex items-center gap-3 px-4 py-2.5" style={{ borderColor: "#eef2f7" }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold" style={{ color: INK }}>{r.regional_nome}</p>
                    <p className="text-[10.5px]" style={{ color: INK_SOFT }}>{r.atual === null ? "Sem aulas registradas nos últimos 30 dias" : `30 dias antes: ${porcentoBR(r.anterior)}`}</p>
                  </div>
                  <span className="text-[13px] font-extrabold" style={{ color: r.atual === null ? INK_SOFT : corDe(r) === BLUE ? INK : corDe(r) }}>{porcentoBR(r.atual)}</span>
                  <span className="w-14 text-right text-[11px] font-bold" style={{ color: diferenca === null ? INK_SOFT : diferenca >= 0 ? GREEN : RED }}>
                    {diferenca === null ? "" : `${diferenca >= 0 ? "▲" : "▼"} ${Math.abs(diferenca).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}`}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </EstadoApi>
  );
}
