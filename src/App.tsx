/* App: guarda o estado (tela atual, perfil, acessibilidade) e escolhe qual tela mostrar.
   Cada tela fica em src/screens; aqui só tem a "casca" e a navegação. */

import { useEffect, useRef, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HOME_BY_PERFIL, PERFIL_BY_SCREEN, screenFromHash } from "@/routes";
import type { ScreenId } from "@/routes";
import { Cadastro } from "@/screens/acesso/Cadastro";
import { Login } from "@/screens/acesso/Login";
import { Splash } from "@/screens/acesso/Splash";
import { AlunoHome } from "@/screens/aluno/AlunoHome";
import { BibliotecaVirtual } from "@/screens/aluno/BibliotecaVirtual";
import { Boletim } from "@/screens/aluno/Boletim";
import { Frequencia } from "@/screens/aluno/Frequencia";
import { HistoricoEscolar } from "@/screens/aluno/HistoricoEscolar";
import { Horarios } from "@/screens/aluno/Horarios";
import { MapaEstudos } from "@/screens/aluno/MapaEstudos";
import { Merenda } from "@/screens/aluno/Merenda";
import { Notas } from "@/screens/aluno/Notas";
import { Transporte } from "@/screens/aluno/Transporte";
import { Calendario } from "@/screens/comum/Calendario";
import { Chat } from "@/screens/comum/Chat";
import { Comunicados } from "@/screens/comum/Comunicados";
import { Configuracoes } from "@/screens/comum/Configuracoes";
import { HistoricoAlteracoes } from "@/screens/comum/HistoricoAlteracoes";
import { MeuPerfil } from "@/screens/comum/MeuPerfil";
import { Notificacoes } from "@/screens/comum/Notificacoes";
import { Pedidos } from "@/screens/comum/Pedidos";
import { Tarefas } from "@/screens/comum/Tarefas";
import { TodasTelas } from "@/screens/comum/TodasTelas";
import { AdmAlunos } from "@/screens/escola/AdmAlunos";
import { AdmBoletins } from "@/screens/escola/AdmBoletins";
import { AdmDiario } from "@/screens/escola/AdmDiario";
import { AdmHorarios } from "@/screens/escola/AdmHorarios";
import { AdmMatriculas } from "@/screens/escola/AdmMatriculas";
import { AdmProfessores } from "@/screens/escola/AdmProfessores";
import { AdmTurmas } from "@/screens/escola/AdmTurmas";
import { EscolaHome } from "@/screens/escola/EscolaHome";
import { GestorFreqSocial } from "@/screens/escola/GestorFreqSocial";
import { GestorPendencias } from "@/screens/escola/GestorPendencias";
import { ProfDiario } from "@/screens/professor/ProfDiario";
import { ProfFrequencia } from "@/screens/professor/ProfFrequencia";
import { ProfNotas } from "@/screens/professor/ProfNotas";
import { ProfPlanejamento } from "@/screens/professor/ProfPlanejamento";
import { ProfessorHome } from "@/screens/professor/ProfessorHome";
import { ResponsavelHome } from "@/screens/responsavel/ResponsavelHome";
import { NotificacoesSecretaria } from "@/screens/secretaria/NotificacoesSecretaria";
import { SecCargaHoraria } from "@/screens/secretaria/SecCargaHoraria";
import { SecEnturmacao } from "@/screens/secretaria/SecEnturmacao";
import { SecMatriculas } from "@/screens/secretaria/SecMatriculas";
import { SecPedagogico } from "@/screens/secretaria/SecPedagogico";
import { SecPesquisas } from "@/screens/secretaria/SecPesquisas";
import { SecRegional } from "@/screens/secretaria/SecRegional";
import { SecretariaHome } from "@/screens/secretaria/SecretariaHome";
import { DedAtos } from "@/screens/setores/DedAtos";
import { DedMatrizes } from "@/screens/setores/DedMatrizes";
import { DedOfertas } from "@/screens/setores/DedOfertas";
import { DiesCalendario } from "@/screens/setores/DiesCalendario";
import { DiesCursos } from "@/screens/setores/DiesCursos";
import { DiesEscolas } from "@/screens/setores/DiesEscolas";
import { DiesTurmas } from "@/screens/setores/DiesTurmas";
import { RhLotacoes } from "@/screens/setores/RhLotacoes";
import { RhAfastamentos } from "@/screens/setores/RhAfastamentos";
import { RhCarencias } from "@/screens/setores/RhCarencias";
import { RhPainel } from "@/screens/setores/RhPainel";
import { RhProfessores } from "@/screens/setores/RhProfessores";
import { Acompanhamento } from "@/screens/servicos/Acompanhamento";
import { Escolas } from "@/screens/servicos/Escolas";
import { Matricula } from "@/screens/servicos/Matricula";
import { SecretariaVirtual } from "@/screens/servicos/SecretariaVirtual";
import { useApi } from "@/hooks/useApi";
import { UsuarioContext } from "@/hooks/useUsuario";
import { logout, sessaoAtual } from "@/lib/api";
import type { Notificacao, Usuario } from "@/lib/tipos";
import type { A11y, EscCtx, Perfil, TabId } from "@/types";

export default function App() {
  // Quem está logado (vem do login na API e fica guardado no navegador).
  const [usuario, setUsuario] = useState<Usuario | null>(() => sessaoAtual()?.usuario ?? null);
  const [screen, setScreen] = useState<ScreenId>(() => screenFromHash() ?? "splash");
  const [perfil, setPerfil] = useState<Perfil>(() => PERFIL_BY_SCREEN[screenFromHash() ?? "splash"] ?? usuario?.perfil ?? "aluno");
  const [tab, setTab] = useState<TabId>("inicio");
  const [a11y, setA11y] = useState<A11y>({ fontScale: 1, contraste: false, animacoes: true });

  const goHome = () => setScreen(HOME_BY_PERFIL[perfil]);

  const onTab = (t: TabId) => {
    setTab(t);
    if (t === "inicio") setScreen(HOME_BY_PERFIL[perfil]);
    else if (t === "academico") setScreen(perfil === "aluno" ? "notas" : perfil === "responsavel" ? "boletim" : perfil === "professor" ? "profNotas" : "calendario");
    else if (t === "servicos") setScreen(perfil === "professor" ? "profDiario" : perfil === "escola" || perfil === "secretaria" ? "escolas" : "secretariaVirtual");
    else if (t === "notificacoes") setScreen("notificacoes");
    else setScreen("perfil");
  };

  const showChrome = !["splash", "login", "cadastro", "telas"].includes(screen);
  const showNav = showChrome && screen !== "chat";

  const [escCtx, setEscCtx] = useState<EscCtx>("todas");
  const nav = (s: ScreenId) => { if (s === "escolas") setEscCtx("todas"); setScreen(s); };
  const openGallery = (s: ScreenId) => { setScreen(s); const p = PERFIL_BY_SCREEN[s]; if (p) setPerfil(p); };

  /* Rotas: cada tela ganha um endereço próprio (#/notas, #/perfil...).
     Assim o botão "voltar" do navegador funciona e dá pra mandar o link de uma tela. */
  const prevScreen = useRef<ScreenId | null>(null);
  useEffect(() => {
    const alvo = `#/${screen}`;
    if (window.location.hash !== alvo) {
      // A splash não entra no histórico: "voltar" a partir do login não deve reabrir ela
      if (prevScreen.current === null || prevScreen.current === "splash") window.history.replaceState(null, "", alvo);
      else window.history.pushState(null, "", alvo);
    }
    prevScreen.current = screen;
  }, [screen]);
  useEffect(() => {
    const onVoltar = () => { const s = screenFromHash(); if (s) openGallery(s); };
    window.addEventListener("popstate", onVoltar);
    return () => window.removeEventListener("popstate", onVoltar);
  }, []);
  const entrar = (u: Usuario) => { setUsuario(u); setPerfil(u.perfil); setScreen(HOME_BY_PERFIL[u.perfil]); setTab("inicio"); };
  const sair = () => { logout(); setUsuario(null); setScreen("login"); };
  // Depois da splash: quem já está logado vai direto pra tela inicial do seu perfil.
  const depoisDaSplash = () => (usuario ? entrar(usuario) : setScreen("login"));

  // Número no sino: quantas notificações novas. Busca de novo a cada troca de tela
  // (assim, depois de abrir as notificações, o número some).
  const notificacoes = useApi<Notificacao[]>(usuario ? "/api/notificacoes/" : null);
  const recarregarNotificacoes = notificacoes.recarregar;
  useEffect(() => { recarregarNotificacoes(); }, [screen, recarregarNotificacoes]);
  const naoLidas = (notificacoes.dados ?? []).filter((n) => n.nova).length;

  const voltar = () => (window.history.length > 1 ? window.history.back() : setScreen("login"));

  const renderScreen = () => {
    switch (screen) {
      case "splash": return <Splash go={depoisDaSplash} />;
      case "login": return <Login onEnter={entrar} onCadastro={() => setScreen("cadastro")} onTelas={() => setScreen("telas")} />;
      case "cadastro": return <Cadastro back={() => setScreen("login")} />;
      case "alunoHome": return <AlunoHome nav={nav} />;
      case "responsavelHome": return <ResponsavelHome nav={nav} />;
      case "notas": return <Notas back={goHome} />;
      case "frequencia": return <Frequencia back={goHome} />;
      case "horarios": return <Horarios back={goHome} />;
      case "boletim": return <Boletim back={goHome} />;
      case "historico": return <HistoricoEscolar back={goHome} />;
      case "tarefas": return <Tarefas back={goHome} role={perfil === "professor" ? "professor" : "aluno"} />;
      case "comunicados": return <Comunicados back={goHome} />;
      case "matricula": return <Matricula back={() => setScreen("secretariaVirtual")} />;
      case "escolas": return <Escolas key={"l" + escCtx} back={goHome} perfil={perfil} ctx={escCtx} />;
      case "acompanhamento": return <Acompanhamento back={() => setScreen("secretariaVirtual")} />;
      case "secretariaVirtual": return <SecretariaVirtual back={goHome} nav={nav} />;
      case "notificacoes": return perfil === "secretaria" ? <NotificacoesSecretaria back={goHome} nav={nav} /> : <Notificacoes back={goHome} nav={nav} />;
      case "perfil": return <MeuPerfil back={goHome} onLogout={sair} perfil={perfil} nav={nav} usuario={usuario} />;
      case "configuracoes": return <Configuracoes back={goHome} a11y={a11y} setA11y={setA11y} onLogout={sair} />;
      case "professorHome": return <ProfessorHome nav={nav} />;
      case "profNotas": return <ProfNotas back={goHome} />;
      case "profFrequencia": return <ProfFrequencia back={goHome} />;
      case "profDiario": return <ProfDiario back={goHome} />;
      case "profPlanejamento": return <ProfPlanejamento back={goHome} />;
      case "escolaHome": return <EscolaHome nav={nav} />;
      case "secretariaHome": return <SecretariaHome nav={nav} usuario={usuario} abrirEscolas={(c) => { setEscCtx(c); setScreen("escolas"); }} />;
      case "admMatriculas": return <AdmMatriculas back={goHome} />;
      case "admTurmas": return <AdmTurmas back={goHome} nav={nav} />;
      case "admProfessores": return <AdmProfessores back={goHome} />;
      case "admHorarios": return <AdmHorarios back={goHome} />;
      case "admDiario": return <AdmDiario back={goHome} />;
      case "admBoletins": return <AdmBoletins back={goHome} />;
      case "secMatriculas": return <SecMatriculas back={goHome} />;
      case "secEnturmacao": return <SecEnturmacao back={goHome} />;
      case "secPedagogico": return <SecPedagogico back={goHome} />;
      case "secCargaHoraria": return <SecCargaHoraria back={goHome} />;
      case "secRegional": return <SecRegional back={goHome} />;
      case "mapaEstudos": return <MapaEstudos back={goHome} />;
      case "transporte": return <Transporte back={goHome} />;
      case "merenda": return <Merenda back={goHome} />;
      case "mapaEscolas": return <Escolas key="mapa" back={goHome} perfil={perfil} modoInicial="mapa" />;
      case "secPesquisas": return <SecPesquisas back={goHome} />;
      case "biblioteca": return <BibliotecaVirtual back={goHome} />;
      case "gestorFreqSocial": return <GestorFreqSocial back={goHome} />;
      case "gestorPendencias": return <GestorPendencias back={goHome} />;
      case "calendario": return <Calendario back={goHome} />;
      case "chat": return <Chat back={goHome} />;
      case "diesEscolas": return <DiesEscolas back={goHome} />;
      case "diesTurmas": return <DiesTurmas back={goHome} />;
      case "diesCursos": return <DiesCursos back={goHome} />;
      case "diesCalendario": return <DiesCalendario back={goHome} />;
      case "dedAtos": return <DedAtos back={goHome} />;
      case "dedOfertas": return <DedOfertas back={goHome} />;
      case "dedMatrizes": return <DedMatrizes back={goHome} />;
      case "rhProfessores": return <RhProfessores back={goHome} />;
      case "rhLotacoes": return <RhLotacoes back={goHome} />;
      case "rhPainel": return <RhPainel back={goHome} nav={nav} />;
      case "rhCarencias": return <RhCarencias back={goHome} />;
      case "rhAfastamentos": return <RhAfastamentos back={goHome} />;
      case "admAlunos": return <AdmAlunos back={goHome} />;
      case "historicoAlteracoes": return <HistoricoAlteracoes back={goHome} />;
      case "escPedidos": return <Pedidos back={goHome} lado="escola" />;
      case "diesPedidos": return <Pedidos back={goHome} lado="dies" />;
      case "telas": return <TodasTelas back={voltar} abrir={openGallery} />;
    }
  };

  // Largura máxima do conteúdo: login/cadastro ficam estreitos (formulário),
  // o resto usa uma coluna confortável de ler no desktop, e a splash ocupa tudo.
  const largura = screen === "splash" ? "" : screen === "login" || screen === "cadastro" ? "max-w-md" : "max-w-3xl";

  return (
    <UsuarioContext.Provider value={usuario}>
    <div className={`flex h-full w-full flex-col bg-[color:var(--color-surface)] md:flex-row ${a11y.animacoes ? "" : "no-anim"}`} style={{ filter: a11y.contraste ? "contrast(1.14) saturate(1.05)" : undefined }}>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className={`mx-auto flex min-h-0 w-full flex-1 flex-col ${largura}`} style={{ zoom: a11y.fontScale } as React.CSSProperties}>{renderScreen()}</div>
      </main>
      {showNav && <BottomNav active={tab} onChange={onTab} badge={naoLidas} />}
    </div>
    </UsuarioContext.Provider>
  );
}
