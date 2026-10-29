/* Ficha da escola, no modelo da página de cada escola do site da SEDUC:
   dados da escola, turmas (tocando na turma, os alunos dela), equipe diretiva, professores e resoluções (atos do DED).
   - Secretaria: escolhe a escola (chega aqui pelo botão "Ficha" do DIES ou tocando na escola em Escolas da rede).
   - Gestão da escola: vê só a ficha da sua.
   Dados: GET /api/escolas/ID/ficha/?ano=AAAA e, para os alunos, GET /api/matriculas/?turma=ID&situacao=confirmada */

import { Fragment, useState } from "react";
import { Escolha, EstadoApi } from "@/components/Form";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { useApi } from "@/hooks/useApi";
import { useUsuario } from "@/hooks/useUsuario";
import { ANO_ATUAL, dataBR, opcoesDe } from "@/lib/formato";
import type { Escola, FichaEscola as Ficha, Matricula } from "@/lib/tipos";
import { BLUE, BLUE_DARK, GREEN, INK, INK_SOFT, RED } from "@/theme/colors";

const ANOS = [ANO_ATUAL - 1, ANO_ATUAL, ANO_ATUAL + 1].map((a) => ({ valor: String(a), nome: String(a) }));

export function FichaEscola({ back, inicial }: { back: () => void; inicial?: number | null }) {
  const usuario = useUsuario();
  const daEscola = usuario?.perfil === "escola";
  const escolas = useApi<Escola[]>(daEscola ? null : "/api/escolas/");
  const [escolhida, setEscolhida] = useState(inicial ? String(inicial) : "");
  const [ano, setAno] = useState(String(ANO_ATUAL));
  const [turmaAberta, setTurmaAberta] = useState<number | null>(null);
  const escolaId = daEscola ? String(usuario?.escola ?? "") : escolhida || String(escolas.dados?.[0]?.id ?? "");
  const ficha = useApi<Ficha>(escolaId ? `/api/escolas/${escolaId}/ficha/?ano=${ano}` : null);
  const f = ficha.dados;
  const e = f?.escola;

  return (
    <>
      <TopBar title="Ficha da escola" subtitle={e ? `${e.regional_nome} · ${e.municipio}` : "Dados, turmas e equipe"} onBack={back} accent={BLUE} />
      <Screen>
        <div className="mb-3 flex gap-2">
          {!daEscola && <div className="min-w-0 flex-[3]"><Escolha label="Escola" value={escolaId} onChange={setEscolhida} opcoes={opcoesDe(escolas.dados, (x) => x.nome)} /></div>}
          <div className="min-w-0 flex-1"><Escolha label="Ano letivo" value={ano} onChange={setAno} opcoes={ANOS} /></div>
        </div>

        <EstadoApi carregando={ficha.carregando || escolas.carregando} erro={ficha.erro ?? escolas.erro} onRetry={ficha.recarregar}>
          {f && e && (
            <div className="space-y-4">
              <Bloco titulo="Dados da escola">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                  <Dado rotulo="Nome da escola" valor={e.nome} largo />
                  <Dado rotulo="CNPJ" valor={e.cnpj_formatado} />
                  <Dado rotulo="DRE" valor={e.regional_nome} />
                  <Dado rotulo="Código MEC" valor={e.codigo_inep} />
                  <Dado rotulo="Dependência" valor={e.dependencia_nome} />
                  <Dado rotulo="Telefone" valor={e.telefone} />
                  <Dado rotulo="E-mail" valor={e.email} largo />
                  <Dado rotulo="Nº salas" valor={e.numero_salas === null ? "" : String(e.numero_salas)} />
                  <Dado rotulo="Zona" valor={e.zona_nome} />
                  <Dado rotulo="Comodato" valor={e.comodato ? "Sim" : "Não"} />
                </div>
                <div className="my-3 border-t" style={{ borderColor: "#e2e8f0" }} />
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                  <Dado rotulo="Endereço (logradouro)" valor={e.endereco} largo />
                  <Dado rotulo="Número" valor={e.numero} />
                  <Dado rotulo="Complemento" valor={e.complemento} />
                  <Dado rotulo="Bairro" valor={e.bairro} />
                  <Dado rotulo="Município" valor={e.municipio} />
                  <Dado rotulo="CEP" valor={e.cep_formatado} />
                </div>
              </Bloco>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Numero rotulo="Turmas" valor={f.resumo.turmas} />
                <Numero rotulo="Alunos" valor={f.resumo.alunos} />
                <Numero rotulo="Vagas" valor={f.resumo.vagas} />
                <Numero rotulo="Servidores" valor={f.resumo.servidores} />
              </div>

              <Bloco titulo={`Turmas da escola · ${f.ano}`}>
                {f.turmas.length === 0 ? <Vazio texto="Nenhuma turma neste ano. Quem cria as turmas é a DIES." /> : (
                  <Tabela colunas={["Série", "Turma", "Turno", "Alunos"]}>
                    {f.turmas.map((t) => (
                      <Fragment key={t.id}>
                        <tr onClick={() => setTurmaAberta(turmaAberta === t.id ? null : t.id)} className="cursor-pointer border-t" style={{ borderColor: "#eef2f7", background: turmaAberta === t.id ? BLUE + "0a" : undefined }}>
                          <td className="py-2 pr-2"><span className="font-semibold">{t.serie_nome}</span><span className="block text-[11px]" style={{ color: INK_SOFT }}>{t.curso_nome}</span></td>
                          <td className="py-2 pr-2 text-center">{t.letra}</td>
                          <td className="py-2 pr-2 text-center">{t.turno_nome}</td>
                          <td className="py-2 text-center" style={{ color: t.alunos > t.capacidade ? RED : INK }}>{t.alunos}/{t.capacidade}</td>
                        </tr>
                        {turmaAberta === t.id && <tr><td colSpan={4} className="pb-3"><AlunosDaTurma turma={t.id} /></td></tr>}
                      </Fragment>
                    ))}
                  </Tabela>
                )}
                {f.turmas.length > 0 && <p className="mt-2 text-[11px]" style={{ color: INK_SOFT }}>Toque numa turma para ver os alunos.</p>}
              </Bloco>

              <Bloco titulo="Equipe diretiva da escola">
                {f.equipe_diretiva.length === 0 ? <Vazio texto="A escola ainda não definiu diretor, coordenador ou secretário (tela Professores e funções)." /> : (
                  <Tabela colunas={["Função", "Nome", "Portaria"]}>
                    {f.equipe_diretiva.map((m) => (
                      <tr key={`${m.funcao_nome}-${m.nome}`} className="border-t" style={{ borderColor: "#eef2f7" }}>
                        <td className="py-2 pr-2 font-semibold">{m.funcao_nome}</td>
                        <td className="py-2 pr-2">{m.nome}</td>
                        <td className="py-2 text-center">{m.portaria || "—"}</td>
                      </tr>
                    ))}
                  </Tabela>
                )}
              </Bloco>

              <Bloco titulo={`Professores · ${f.professores.length}`}>
                {f.por_vinculo.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {f.por_vinculo.map((v) => <Pill key={v.vinculo_nome} color={BLUE}>{v.vinculo_nome}: {v.total}</Pill>)}
                  </div>
                )}
                {f.professores.length === 0 ? <Vazio texto="O RH ainda não alocou professores nesta escola." /> : (
                  <div className="divide-y divide-[color:var(--color-line)]">
                    {f.professores.map((p) => (
                      <div key={p.nome} className="flex items-center gap-2 py-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12.5px] font-semibold" style={{ color: INK }}>{p.nome}</p>
                          <p className="text-[11px]" style={{ color: INK_SOFT }}>{p.vinculo_nome} · {p.horas} h na escola · {p.aulas} aulas por semana</p>
                        </div>
                        {p.afastado && <Pill color={RED}>Afastado</Pill>}
                      </div>
                    ))}
                  </div>
                )}
              </Bloco>

              <Bloco titulo="Resoluções">
                {f.resolucoes.length === 0 ? <Vazio texto="Nenhum ato autorizativo cadastrado pelo DED." /> : (
                  <div className="divide-y divide-[color:var(--color-line)]">
                    {f.resolucoes.map((r) => (
                      <div key={`${r.tipo_nome}-${r.numero}`} className="flex items-start gap-2 py-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[12.5px] font-semibold" style={{ color: INK }}>{r.tipo_nome}{r.curso_nome ? ` · ${r.curso_nome}` : ""}</p>
                          <p className="text-[11px]" style={{ color: INK_SOFT }}>{r.numero} ({r.orgao_emissor}) · publicada em {dataBR(r.data_publicacao)}{r.validade ? ` · até ${dataBR(r.validade)}` : ""}</p>
                        </div>
                        <Pill color={r.vigente ? GREEN : RED}>{r.vigente ? "Vigente" : "Vencida"}</Pill>
                      </div>
                    ))}
                  </div>
                )}
              </Bloco>
            </div>
          )}
        </EstadoApi>
      </Screen>
    </>
  );
}

/* Alunos com matrícula confirmada numa turma (nome e código). */
function AlunosDaTurma({ turma }: { turma: number }) {
  const alunos = useApi<Matricula[]>(`/api/matriculas/?turma=${turma}&situacao=confirmada`);
  const lista = [...(alunos.dados ?? [])].sort((a, b) => a.aluno_nome.localeCompare(b.aluno_nome));
  return (
    <EstadoApi carregando={alunos.carregando} erro={alunos.erro} onRetry={alunos.recarregar}>
      {lista.length === 0 ? <p className="py-2 text-[12px]" style={{ color: INK_SOFT }}>Nenhum aluno com matrícula confirmada.</p> : (
        <ol className="mt-1 rounded-xl px-3 py-2 text-[12.5px]" style={{ background: "#f6f8fb", color: INK }}>
          {lista.map((m, i) => (
            <li key={m.id} className="flex gap-2 py-1">
              <span className="w-5 flex-none text-right tabular-nums" style={{ color: INK_SOFT }}>{i + 1}.</span>
              <span className="min-w-0 flex-1 truncate">{m.aluno_nome}</span>
              <span className="flex-none text-[11px] tabular-nums" style={{ color: INK_SOFT }}>{m.aluno_codigo}</span>
            </li>
          ))}
        </ol>
      )}
    </EstadoApi>
  );
}

/* Seção com a faixa azul no topo, igual à ficha do site da SEDUC. */
function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="card overflow-hidden">
      <h2 className="px-4 py-2.5 text-[13px] font-bold uppercase tracking-wide text-white" style={{ background: BLUE_DARK }}>{titulo}</h2>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Dado({ rotulo, valor, largo }: { rotulo: string; valor: string; largo?: boolean }) {
  return (
    <div className={`min-w-0 ${largo ? "col-span-2" : ""}`}>
      <p className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: INK_SOFT }}>{rotulo}</p>
      <p className="break-words text-[13px]" style={{ color: valor ? INK : "#94a3b8" }}>{valor || "—"}</p>
    </div>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="card p-3 text-center">
      <p className="text-[11px]" style={{ color: INK_SOFT }}>{rotulo}</p>
      <p className="text-[20px] font-extrabold" style={{ color: BLUE }}>{valor}</p>
    </div>
  );
}

function Tabela({ colunas, children }: { colunas: string[]; children: React.ReactNode }) {
  return (
    <table className="w-full text-left text-[12.5px]" style={{ color: INK }}>
      <thead>
        <tr>{colunas.map((c, i) => <th key={c} className={`pb-1.5 text-[10.5px] font-bold uppercase tracking-wide ${i === 0 ? "" : "text-center"}`} style={{ color: BLUE_DARK }}>{c}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function Vazio({ texto }: { texto: string }) {
  return <p className="text-[12.5px]" style={{ color: INK_SOFT }}>{texto}</p>;
}
