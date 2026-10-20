import { useState } from "react";
import { BotaoNovo, CartaoForm, Entrada, Escolha, EstadoApi, useEnvio } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { IconAlert, IconDoc } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { dataBR, opcoesDe } from "@/lib/formato";
import type { Ato, Curso, Escola, Opcoes } from "@/lib/tipos";
import { GREEN, INK, INK_SOFT, RED, VIOLET } from "@/theme/colors";

type FormAto = { escola: string; curso: string; tipo: string; numero: string; orgao_emissor: string; data_publicacao: string; validade: string };

/* DED — Atos autorizativos (o "documento" que autoriza a escola ou um curso dela a funcionar) */
export function DedAtos({ back }: { back: () => void }) {
  const atos = useApi<Ato[]>("/api/atos/");
  const escolas = useApi<Escola[]>("/api/escolas/");
  const cursos = useApi<Curso[]>("/api/cursos/");
  const opcoes = useApi<Opcoes>("/api/opcoes/");
  const [form, setForm] = useState<FormAto | null>(null);
  const envio = useEnvio(["escola", "curso", "numero", "data_publicacao", "validade"]);

  const abrir = () => {
    envio.limpar();
    setForm({ escola: String(escolas.dados?.[0]?.id ?? ""), curso: "", tipo: "credenciamento", numero: "", orgao_emissor: "CEE/SE", data_publicacao: "", validade: "" });
  };
  const salvar = () => envio.enviar(async () => {
    if (!form) return;
    const corpo = { ...form, escola: Number(form.escola) || null, curso: Number(form.curso) || null, validade: form.validade || null, data_publicacao: form.data_publicacao || null };
    await api("/api/atos/", { method: "POST", body: corpo });
    setForm(null);
    atos.recarregar();
  });
  const mudar = (campo: keyof FormAto) => (v: string) => form && setForm({ ...form, [campo]: v });
  const vencidos = (atos.dados ?? []).filter((a) => !a.vigente).length;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Atos autorizativos" subtitle={`DED · ${atos.dados?.length ?? 0} atos`} onBack={back} accent={VIOLET} right={<BotaoNovo label="Novo ato" cor={VIOLET} onClick={abrir} />} />
      <Screen>
        {vencidos > 0 && (
          <div className="mb-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: RED + "12", color: RED }}>
            <IconAlert size={17} /> {vencidos} ato(s) vencido(s). Essas escolas não deveriam abrir matrícula nova.
          </div>
        )}
        {form && (
          <CartaoForm titulo="Novo ato autorizativo" onSalvar={salvar} onCancelar={() => setForm(null)} salvando={envio.enviando} erro={envio.erro} cor={VIOLET}>
            <Escolha label="Escola" value={form.escola} onChange={mudar("escola")} opcoes={opcoesDe(escolas.dados, (e) => e.nome)} erro={envio.campos.escola} />
            <div className="flex gap-2">
              <Escolha label="Tipo" value={form.tipo} onChange={mudar("tipo")} opcoes={opcoes.dados?.tipos_ato ?? []} />
              <Escolha label="Curso" value={form.curso} onChange={mudar("curso")} opcoes={opcoesDe(cursos.dados, (c) => c.nome)} erro={envio.campos.curso} vazio="Escola toda" />
            </div>
            <div className="flex gap-2">
              <Entrada label="Número" value={form.numero} onChange={mudar("numero")} erro={envio.campos.numero} placeholder="Resolução nº 123/2026" />
              <Entrada label="Órgão" value={form.orgao_emissor} onChange={mudar("orgao_emissor")} />
            </div>
            <div className="flex gap-2">
              <Entrada label="Publicação" type="date" value={form.data_publicacao} onChange={mudar("data_publicacao")} erro={envio.campos.data_publicacao} />
              <Entrada label="Válido até (opcional)" type="date" value={form.validade} onChange={mudar("validade")} erro={envio.campos.validade} />
            </div>
          </CartaoForm>
        )}
        <EstadoApi carregando={atos.carregando} erro={atos.erro} onRetry={atos.recarregar}>
          <div className="space-y-2.5">
            {(atos.dados ?? []).map((a) => (
              <div key={a.id} className="card flex items-start gap-3 p-4">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: VIOLET + "16", color: VIOLET }}><IconDoc size={20} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold" style={{ color: INK }}>{a.tipo_nome}{a.curso_nome ? ` · ${a.curso_nome}` : ""}</p>
                  <p className="text-[12px]" style={{ color: INK }}>{a.escola_nome}</p>
                  <p className="text-[11.5px]" style={{ color: INK_SOFT }}>{a.numero} ({a.orgao_emissor}) · publicado em {dataBR(a.data_publicacao)}{a.validade ? ` · até ${dataBR(a.validade)}` : " · sem prazo"}</p>
                </div>
                <Pill color={a.vigente ? GREEN : RED}>{a.vigente ? "Vigente" : "Vencido"}</Pill>
              </div>
            ))}
          </div>
        </EstadoApi>
      </Screen>
    </div>
  );
}
