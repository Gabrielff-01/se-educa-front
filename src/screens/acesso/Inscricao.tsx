/* Matrícula pela internet (sem login). É a página de cadastro que a equipe fez em HTML/CSS,
   agora dentro do app e ligada à API:
   1. Dados do aluno e do responsável   2. Endereço (o CEP preenche sozinho)   3. Escola e série
   Enviar = POST /api/inscricoes/. O pedido vai para o DIES analisar; aprovado, vira matrícula
   "em análise" e cai na Enturmação. O e-mail e a senha escolhidos aqui viram o login do aluno. */

import { useEffect, useState } from "react";
import { IconAlert, IconCheck, IconShield } from "@/components/icons";
import { useApi } from "@/hooks/useApi";
import { apiPublica } from "@/lib/api";
import type { ErroApi } from "@/lib/api";
import { cpfValido, mascaraCep, mascaraCpf, mascaraTelefone } from "@/lib/formato";
import type { EscolaInscricao, InscricaoEnviada } from "@/lib/tipos";
import { Logo } from "@/screens/acesso/Logo";

const AZUL = "#1a6ce5";
const VERMELHO = "#ef4444";

const UFS = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"];
const RACAS = [["amarela", "Amarela"], ["branca", "Branca"], ["indigena", "Indígena"], ["parda", "Parda"], ["preta", "Preta"]];
const PARENTESCOS = [["mae", "Mãe"], ["pai", "Pai"], ["avo", "Avó / avô"], ["tio", "Tia / tio"], ["outro", "Outro responsável legal"]];
const ETAPAS = ["Dados do aluno", "Endereço", "Escola e série"];

/* Em que etapa fica cada campo (pra voltar pra etapa certa quando a API recusar um campo). */
const CAMPOS_DA_ETAPA = [
  ["aluno_nome", "data_nascimento", "sexo", "raca", "cpf", "bolsa_familia", "nis", "responsavel_nome", "responsavel_cpf", "responsavel_parentesco", "telefone", "email", "senha", "repetir"],
  ["cep", "endereco", "numero", "complemento", "bairro", "cidade", "uf"],
  ["municipio", "escola", "serie", "turno_preferido"],
];

const VAZIO = {
  aluno_nome: "", data_nascimento: "", sexo: "", raca: "", cpf: "", bolsa_familia: "", nis: "",
  responsavel_nome: "", responsavel_cpf: "", responsavel_parentesco: "mae", telefone: "", email: "", senha: "", repetir: "",
  cep: "", endereco: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "SE",
  municipio: "", escola: "", serie: "", turno_preferido: "",
};
type Dados = typeof VAZIO;
type Campo = keyof Dados;

/* ---------- peças com o visual da página HTML (inputs de 48px, cantos de 12px, borda #cbd5e1) ---------- */

const caixa = "h-12 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 text-[15px] outline-none transition placeholder:text-[#94a3b8] focus:border-[#1a6ce5] focus:shadow-[0_0_0_3px_rgba(26,108,229,0.15)]";
// Com erro a borda fica vermelha; sem erro vale a cor das classes (cinza, e azul quando o campo está em foco).
const estiloCaixa = (erro?: string) => (erro ? { borderColor: VERMELHO, boxShadow: "0 0 0 3px rgba(239,68,68,0.15)", color: "#334155" } : { color: "#334155" });

/* col = quantas das 12 colunas o campo ocupa no computador (no celular todos ocupam a linha inteira). */
const COLUNA: Record<number, string> = { 12: "md:col-span-12", 9: "md:col-span-9", 8: "md:col-span-8", 6: "md:col-span-6", 5: "md:col-span-5", 4: "md:col-span-4", 3: "md:col-span-3" };

function Caixa({ label, col = 12, erro, obrigatorio = true, dica, children }: { label: string; col?: number; erro?: string; obrigatorio?: boolean; dica?: string; children: React.ReactNode }) {
  return (
    <div className={`col-span-12 flex flex-col gap-1.5 ${COLUNA[col]}`}>
      <label className="text-[13.5px] font-semibold" style={{ color: "#334155" }}>{label} {obrigatorio && <span style={{ color: VERMELHO }}>*</span>}</label>
      {children}
      {erro ? <span className="ml-1 text-[12.5px] font-medium" style={{ color: VERMELHO }}>{erro}</span> : dica && <span className="ml-1 text-[12px]" style={{ color: "#64748b" }}>{dica}</span>}
    </div>
  );
}

function Radios({ nome, valor, opcoes, onChange, erro }: { nome: string; valor: string; opcoes: string[][]; onChange: (v: string) => void; erro?: string }) {
  return (
    <div className="flex min-h-12 flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2" style={estiloCaixa(erro)}>
      {opcoes.map(([v, rotulo]) => (
        <label key={v} className="flex cursor-pointer items-center gap-1.5 text-[14.5px] font-medium" style={{ color: "#334155" }}>
          <input type="radio" name={nome} checked={valor === v} onChange={() => onChange(v)} style={{ accentColor: AZUL }} />{rotulo}
        </label>
      ))}
    </div>
  );
}

function Botao({ children, onClick, secundario, carregando }: { children: React.ReactNode; onClick: () => void; secundario?: boolean; carregando?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={carregando} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-[16px] font-semibold transition hover:opacity-90 disabled:opacity-70"
      style={secundario ? { background: "#fff", color: AZUL, border: `1px solid ${AZUL}` } : { background: AZUL, color: "#fff" }}>
      {carregando && <span className="spinner h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </button>
  );
}

/* ---------- a tela ---------- */

export function Inscricao({ voltar, irProLogin }: { voltar: () => void; irProLogin: () => void }) {
  const [etapa, setEtapa] = useState(0);
  const [d, setD] = useState<Dados>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [pronto, setPronto] = useState<InscricaoEnviada | null>(null);
  const oferta = useApi<{ ano_letivo: number; escolas: EscolaInscricao[] }>("/api/inscricoes/escolas/", { publica: true });

  const muda = (campo: Campo) => (valor: string) => {
    setD((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };
  const texto = (campo: Campo, extra: React.InputHTMLAttributes<HTMLInputElement> = {}, mascara?: (v: string) => string) => (
    <input value={d[campo]} onChange={(e) => muda(campo)(mascara ? mascara(e.target.value) : e.target.value)} className={caixa} style={estiloCaixa(erros[campo])} {...extra} />
  );
  const lista = (campo: Campo, opcoes: string[][], vazio?: string) => (
    <select value={d[campo]} onChange={(e) => muda(campo)(e.target.value)} className={caixa} style={estiloCaixa(erros[campo])}>
      {vazio !== undefined && <option value="">{vazio}</option>}
      {opcoes.map(([v, rotulo]) => <option key={v} value={v}>{rotulo}</option>)}
    </select>
  );

  // Rola pro topo quando muda de etapa (no celular o botão fica lá embaixo).
  useEffect(() => { document.querySelector("#inscricao-topo")?.scrollIntoView({ block: "start" }); }, [etapa, pronto]);

  /* CEP: quando tem os 8 números, busca o endereço no ViaCEP e preenche o que achar. */
  const cepNumeros = d.cep.replace(/\D/g, "");
  useEffect(() => {
    if (cepNumeros.length !== 8) return;
    let cancelado = false;
    setBuscandoCep(true);
    fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`)
      .then((r) => r.json())
      .then((r) => {
        if (cancelado) return;
        if (r.erro) { setErros((e) => ({ ...e, cep: "CEP não encontrado. Confira ou preencha o endereço à mão." })); return; }
        setD((atual) => ({ ...atual, endereco: r.logradouro || atual.endereco, bairro: r.bairro || atual.bairro, cidade: r.localidade || atual.cidade, uf: r.uf || atual.uf }));
      })
      .catch(() => { /* sem internet pro ViaCEP: a pessoa preenche à mão */ })
      .finally(() => { if (!cancelado) setBuscandoCep(false); });
    return () => { cancelado = true; };
  }, [cepNumeros]);

  /* Confere a etapa antes de seguir (a API confere tudo de novo no final). */
  const conferir = (n: number) => {
    const e: Partial<Record<Campo, string>> = {};
    const obrigatorio = (campo: Campo, msg = "Campo obrigatório") => { if (!d[campo].trim()) e[campo] = msg; };
    if (n === 0) {
      obrigatorio("aluno_nome");
      if (d.aluno_nome.trim() && d.aluno_nome.trim().split(/\s+/).length < 2) e.aluno_nome = "Escreva o nome completo, com sobrenome.";
      obrigatorio("data_nascimento");
      obrigatorio("sexo", "Escolha uma opção");
      obrigatorio("raca", "Escolha uma opção");
      if (!cpfValido(d.cpf)) e.cpf = d.cpf ? "CPF inválido. Confira os números." : "Campo obrigatório";
      obrigatorio("bolsa_familia", "Escolha sim ou não");
      if (d.bolsa_familia === "sim" && d.nis.replace(/\D/g, "").length !== 11) e.nis = "O NIS tem 11 números.";
      obrigatorio("responsavel_nome");
      if (!cpfValido(d.responsavel_cpf)) e.responsavel_cpf = d.responsavel_cpf ? "CPF inválido. Confira os números." : "Campo obrigatório";
      if (d.telefone.replace(/\D/g, "").length < 10) e.telefone = "Telefone com DDD. Ex.: (79) 99999-0000";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = "E-mail inválido.";
      if (d.senha.length < 8) e.senha = "A senha precisa ter pelo menos 8 caracteres.";
      if (d.repetir !== d.senha) e.repetir = "As senhas não são iguais.";
    }
    if (n === 1) {
      if (cepNumeros.length !== 8) e.cep = "CEP tem 8 números.";
      obrigatorio("endereco"); obrigatorio("numero"); obrigatorio("bairro"); obrigatorio("cidade");
    }
    if (n === 2) {
      obrigatorio("escola", "Escolha a escola");
      obrigatorio("serie", "Escolha a série");
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const proximo = () => { setAviso(""); if (conferir(etapa)) setEtapa(etapa + 1); };

  const enviar = async () => {
    setAviso("");
    if (!conferir(2)) return;
    setEnviando(true);
    try {
      const corpo = {
        aluno_nome: d.aluno_nome.trim(), data_nascimento: d.data_nascimento, sexo: d.sexo, raca: d.raca, cpf: d.cpf,
        bolsa_familia: d.bolsa_familia === "sim", nis: d.bolsa_familia === "sim" ? d.nis.replace(/\D/g, "") : "",
        responsavel_nome: d.responsavel_nome.trim(), responsavel_cpf: d.responsavel_cpf, responsavel_parentesco: d.responsavel_parentesco,
        telefone: d.telefone, email: d.email.trim(), senha: d.senha,
        cep: d.cep, endereco: d.endereco.trim(), numero: d.numero.trim(), complemento: d.complemento.trim(), bairro: d.bairro.trim(), cidade: d.cidade.trim(), uf: d.uf,
        escola: Number(d.escola), serie: Number(d.serie), turno_preferido: d.turno_preferido,
      };
      setPronto(await apiPublica<InscricaoEnviada>("/api/inscricoes/", { method: "POST", body: corpo }));
    } catch (e) {
      // A API recusou: mostra o erro embaixo do campo e volta pra etapa onde ele está.
      const falha = e as ErroApi;
      const campos = falha.campos ?? {};
      setErros(campos as Partial<Record<Campo, string>>);
      const primeira = CAMPOS_DA_ETAPA.findIndex((lista) => lista.some((c) => campos[c]));
      const soltos = Object.entries(campos).filter(([c]) => !CAMPOS_DA_ETAPA.flat().includes(c)).map(([, m]) => m);
      setAviso([falha.geral, ...soltos].filter(Boolean).join(" ") || (primeira >= 0 ? "Confira os campos em vermelho." : falha.message));
      if (primeira >= 0) setEtapa(primeira);
    } finally {
      setEnviando(false);
    }
  };

  /* Etapa 3: escolas por município, as séries que a escola oferece e os turnos que ela tem. */
  const escolas = oferta.dados?.escolas ?? [];
  const municipios = [...new Set(escolas.map((e) => e.municipio))].sort();
  const escolasDoMunicipio = escolas.filter((e) => !d.municipio || e.municipio === d.municipio);
  const escola = escolas.find((e) => String(e.id) === d.escola);
  const serie = escola?.series.find((s) => String(s.id) === d.serie);

  const casca = (conteudo: React.ReactNode) => (
    <div className="scroll-area flex-1 overflow-y-auto" style={{ background: "#f0f2f5" }}>
      <div id="inscricao-topo" className="mx-auto w-full max-w-[800px] px-5 pb-10 pt-8">
        {conteudo}
        <div className="mt-10 flex items-center justify-center gap-1.5 text-[12.5px]" style={{ color: "#64748b" }}>
          <IconShield size={14} /> Ambiente seguro · Governo de Sergipe
        </div>
      </div>
    </div>
  );

  if (pronto) {
    return casca(
      <>
        <Logo subtitulo="Cadastro do Aluno" />
        <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-[0_4px_6px_rgba(0,0,0,0.05)] md:px-10">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full" style={{ background: "#e6f6f0", color: "#00a65a" }}><IconCheck size={40} strokeWidth={2.4} /></div>
          <h2 className="mb-3 text-[24px] font-bold" style={{ color: "#1e293b" }}>Inscrição realizada com sucesso!</h2>
          <p className="mb-2 text-[16px] leading-relaxed" style={{ color: "#64748b" }}>
            O pedido de matrícula de <b style={{ color: "#1e293b" }}>{pronto.aluno_nome}</b> ({pronto.serie_nome} · {pronto.curso_nome} · {pronto.escola_nome}) foi para a análise do DIES.
          </p>
          <p className="mx-auto my-5 w-fit rounded-xl px-5 py-3 text-[15px]" style={{ background: "#f0f2f5", color: "#334155" }}>Protocolo <b className="text-[18px]" style={{ color: AZUL }}>{pronto.protocolo}</b></p>
          <p className="mb-8 text-[14.5px] leading-relaxed [overflow-wrap:anywhere]" style={{ color: "#64748b" }}>
            Para acompanhar, entre com o e-mail <b style={{ color: "#1e293b" }}>{pronto.email}</b> e a senha que você criou. Depois que o DIES aprovar, esse mesmo login abre o app do aluno.
          </p>
          <div className="mx-auto flex max-w-[420px] flex-col gap-3 md:flex-row">
            <Botao secundario onClick={voltar}>Voltar ao Início</Botao>
            <Botao onClick={irProLogin}>Ir para o login</Botao>
          </div>
        </div>
      </>,
    );
  }

  return casca(
    <>
      <Logo subtitulo="Cadastro do Aluno" />

      {/* Barra das etapas */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {ETAPAS.map((nome, i) => (
          <div key={nome}>
            <div className="h-1.5 rounded-full transition" style={{ background: i <= etapa ? AZUL : "#cbd5e1" }} />
            <p className="mt-1.5 text-[12px] font-semibold" style={{ color: i === etapa ? AZUL : "#64748b" }}>{i + 1}. {nome}</p>
          </div>
        ))}
      </div>

      {aviso && (
        <div className="mb-4 flex items-start gap-2 rounded-xl px-4 py-3 text-[13.5px] font-medium" style={{ background: VERMELHO + "14", color: VERMELHO }}>
          <IconAlert size={18} className="mt-0.5 flex-none" />{aviso}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} noValidate>
        {etapa === 0 && (
          <div className="grid grid-cols-12 gap-4">
            <Caixa label="Nome completo do aluno (sem abreviações)" erro={erros.aluno_nome}>{texto("aluno_nome", { placeholder: "Ex.: João da Silva", autoComplete: "off" })}</Caixa>
            <Caixa label="Data de nascimento" col={6} erro={erros.data_nascimento}>{texto("data_nascimento", { type: "date", max: new Date().toISOString().slice(0, 10) })}</Caixa>
            <Caixa label="Sexo" col={6} erro={erros.sexo}><Radios nome="sexo" valor={d.sexo} onChange={muda("sexo")} erro={erros.sexo} opcoes={[["M", "M"], ["F", "F"], ["N", "Prefiro não informar"]]} /></Caixa>
            <Caixa label="CPF do estudante" col={4} erro={erros.cpf}>{texto("cpf", { placeholder: "000.000.000-00", inputMode: "numeric" }, mascaraCpf)}</Caixa>
            <Caixa label="Cor/Raça" col={4} erro={erros.raca}>{lista("raca", RACAS, "Selecione")}</Caixa>
            <Caixa label="Recebe Bolsa Família?" col={4} erro={erros.bolsa_familia}><Radios nome="bolsa" valor={d.bolsa_familia} onChange={muda("bolsa_familia")} erro={erros.bolsa_familia} opcoes={[["sim", "Sim"], ["nao", "Não"]]} /></Caixa>
            {d.bolsa_familia === "sim" && (
              <Caixa label="NIS (Número de Identificação Social)" col={6} erro={erros.nis} dica="Está no cartão do Bolsa Família.">{texto("nis", { placeholder: "11 números", inputMode: "numeric", maxLength: 11 }, (v) => v.replace(/\D/g, ""))}</Caixa>
            )}

            <p className="col-span-12 mt-2 text-[15px] font-bold" style={{ color: "#1e293b" }}>Responsável legal</p>
            <Caixa label="Nome do responsável legal" col={6} erro={erros.responsavel_nome}>{texto("responsavel_nome", { placeholder: "Ex.: Maria da Silva" })}</Caixa>
            <Caixa label="Parentesco" col={6} erro={erros.responsavel_parentesco}>{lista("responsavel_parentesco", PARENTESCOS)}</Caixa>
            <Caixa label="CPF do responsável" col={6} erro={erros.responsavel_cpf}>{texto("responsavel_cpf", { placeholder: "000.000.000-00", inputMode: "numeric" }, mascaraCpf)}</Caixa>
            <Caixa label="Telefone (WhatsApp)" col={6} erro={erros.telefone}>{texto("telefone", { placeholder: "(79) 99999-0000", inputMode: "tel" }, mascaraTelefone)}</Caixa>

            <p className="col-span-12 mt-2 text-[15px] font-bold" style={{ color: "#1e293b" }}>Acesso ao SE Educa</p>
            <Caixa label="E-mail" erro={erros.email} dica="Depois que o DIES aprovar, este e-mail vira o login do aluno.">{texto("email", { type: "email", placeholder: "Ex.: joao@email.com", autoComplete: "email" })}</Caixa>
            <Caixa label="Senha" col={6} erro={erros.senha}>{texto("senha", { type: "password", placeholder: "Mínimo de 8 caracteres", autoComplete: "new-password" })}</Caixa>
            <Caixa label="Repetir senha" col={6} erro={erros.repetir}>{texto("repetir", { type: "password", placeholder: "Digite a senha de novo", autoComplete: "new-password" })}</Caixa>

            <div className="col-span-12 mt-2"><Botao onClick={proximo}>Próximo</Botao></div>
          </div>
        )}

        {etapa === 1 && (
          <div className="grid grid-cols-12 gap-4">
            <Caixa label="CEP" col={4} erro={erros.cep} dica={buscandoCep ? "Buscando o endereço..." : "O endereço é preenchido sozinho."}>{texto("cep", { placeholder: "00000-000", inputMode: "numeric" }, mascaraCep)}</Caixa>
            <Caixa label="Endereço" col={8} erro={erros.endereco}>{texto("endereco", { placeholder: "Rua, avenida..." })}</Caixa>
            <Caixa label="Número" col={3} erro={erros.numero}>{texto("numero", { placeholder: "Ex.: 123" })}</Caixa>
            <Caixa label="Complemento" col={5} obrigatorio={false} erro={erros.complemento}>{texto("complemento", { placeholder: "Apto, bloco, casa..." })}</Caixa>
            <Caixa label="Bairro" col={4} erro={erros.bairro}>{texto("bairro", { placeholder: "Seu bairro" })}</Caixa>
            <Caixa label="Cidade" col={9} erro={erros.cidade}>{texto("cidade", { placeholder: "Sua cidade" })}</Caixa>
            <Caixa label="UF" col={3} erro={erros.uf}>{lista("uf", UFS.map((u) => [u, u]))}</Caixa>
            <div className="col-span-12 mt-2 flex flex-col-reverse gap-3 md:flex-row">
              <Botao secundario onClick={() => { setAviso(""); setEtapa(0); }}>Voltar</Botao>
              <Botao onClick={proximo}>Próximo</Botao>
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="grid grid-cols-12 gap-4">
            {oferta.carregando ? (
              <p className="col-span-12 rounded-xl bg-white px-4 py-4 text-[14px]" style={{ color: "#64748b" }}>Buscando as escolas... (se o servidor estava dormindo, pode levar até 1 minuto)</p>
            ) : oferta.erro ? (
              <div className="col-span-12 rounded-xl bg-white px-4 py-4 text-[14px]" style={{ color: VERMELHO }}>
                Não consegui buscar as escolas agora. <button type="button" onClick={oferta.recarregar} className="font-semibold underline">Tentar de novo</button>
              </div>
            ) : (
              <>
                <p className="col-span-12 text-[13.5px]" style={{ color: "#64748b" }}>Matrícula para o ano letivo de <b style={{ color: "#1e293b" }}>{oferta.dados?.ano_letivo}</b>. Aparecem só as escolas que já têm séries abertas nesse ano.</p>
                <Caixa label="Município" col={5} obrigatorio={false}>
                  <select value={d.municipio} onChange={(e) => setD({ ...d, municipio: e.target.value, escola: "", serie: "", turno_preferido: "" })} className={caixa} style={estiloCaixa()}>
                    <option value="">Todos os municípios</option>
                    {municipios.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Caixa>
                <Caixa label="Escola" col={7} erro={erros.escola}>
                  <select value={d.escola} onChange={(e) => { setD({ ...d, escola: e.target.value, serie: "", turno_preferido: "" }); setErros({ ...erros, escola: undefined }); }} className={caixa} style={estiloCaixa(erros.escola)}>
                    <option value="">Selecione a escola</option>
                    {escolasDoMunicipio.map((e) => <option key={e.id} value={e.id}>{e.nome}{d.municipio ? "" : ` · ${e.municipio}`}</option>)}
                  </select>
                </Caixa>
                {escola && (
                  <p className="col-span-12 -mt-1 text-[12.5px]" style={{ color: "#64748b" }}>{escola.bairro ? `${escola.bairro}, ` : ""}{escola.municipio} · {escola.regional_nome}</p>
                )}
                <Caixa label="Série" col={7} erro={erros.serie}>
                  <select value={d.serie} disabled={!escola} onChange={(e) => { setD({ ...d, serie: e.target.value, turno_preferido: "" }); setErros({ ...erros, serie: undefined }); }} className={`${caixa} disabled:bg-[#f8fafc]`} style={estiloCaixa(erros.serie)}>
                    <option value="">{escola ? "Selecione a série" : "Escolha a escola primeiro"}</option>
                    {escola?.series.map((s) => <option key={s.id} value={s.id}>{s.nome} · {s.curso_nome}</option>)}
                  </select>
                </Caixa>
                <Caixa label="Turno preferido" col={5} obrigatorio={false} erro={erros.turno_preferido} dica="A escola tenta, mas o turno depende da vaga.">
                  <select value={d.turno_preferido} disabled={!serie} onChange={(e) => muda("turno_preferido")(e.target.value)} className={`${caixa} disabled:bg-[#f8fafc]`} style={estiloCaixa(erros.turno_preferido)}>
                    <option value="">Sem preferência</option>
                    {serie?.turnos.map((t) => <option key={t.valor} value={t.valor}>{t.nome}</option>)}
                  </select>
                </Caixa>
              </>
            )}
            <div className="col-span-12 mt-2 flex flex-col-reverse gap-3 md:flex-row">
              <Botao secundario onClick={() => { setAviso(""); setEtapa(1); }}>Voltar</Botao>
              <Botao onClick={enviar} carregando={enviando}>{enviando ? "Enviando..." : "Finalizar Inscrição"}</Botao>
            </div>
          </div>
        )}
      </form>

      <button type="button" onClick={voltar} className="mx-auto mt-6 block text-[13.5px] font-semibold" style={{ color: AZUL }}>Desistir e voltar ao início</button>
    </>,
  );
}
