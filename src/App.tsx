import { useEffect, useRef, useState } from "react";

/* ============================================================
   SE Educa — protótipo mobile (iPhone 15 Pro Max)
   Todo o texto visível em pt-BR. Dados fictícios.
   ============================================================ */

/* ---------------------------- Ícones ---------------------------- */
type IconProps = { size?: number; className?: string; strokeWidth?: number; style?: React.CSSProperties };
const Ic = (path: React.ReactNode) =>
  function Icon({ size = 22, className = "", strokeWidth = 1.8, style }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
      >
        {path}
      </svg>
    );
  };

const IconHome = Ic(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></>);
const IconBook = Ic(<><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></>);
const IconGrid = Ic(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>);
const IconBell = Ic(<><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>);
const IconUser = Ic(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></>);
const IconChart = Ic(<><path d="M4 20V4" /><path d="M4 20h16" /><rect x="7" y="11" width="3" height="6" rx="1" /><rect x="12" y="7" width="3" height="10" rx="1" /><rect x="17" y="13" width="3" height="4" rx="1" /></>);
const IconCalendar = Ic(<><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 3v3M16 3v3" /></>);
const IconClock = Ic(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
const IconCheck = Ic(<path d="m4 12 5 5L20 6" />);
const IconChevron = Ic(<path d="m9 6 6 6-6 6" />);
const IconBack = Ic(<path d="m15 6-6 6 6 6" />);
const IconSearch = Ic(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>);
const IconPin = Ic(<><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>);
const IconDoc = Ic(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></>);
const IconChat = Ic(<><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4Z" /></>);
const IconShield = Ic(<><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z" /><path d="m9 12 2 2 4-4" /></>);
const IconGrad = Ic(<><path d="M22 9 12 4 2 9l10 5 10-5Z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></>);
const IconLogout = Ic(<><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 12H3M6 8l-3 4 3 4" /></>);
const IconAlert = Ic(<><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17.5v.5" /></>);
const IconSend = Ic(<path d="M4 12 20 4l-6 16-3-7-7-1Z" />);
const IconPlus = Ic(<><path d="M12 5v14M5 12h14" /></>);
const IconStar = Ic(<path d="m12 3 2.6 5.6L21 9.3l-4.5 4.2 1.1 6L12 16.7 6.4 19.5l1.1-6L3 9.3l6.4-.7Z" />);
const IconUsers = Ic(<><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M16 5.2A3.2 3.2 0 0 1 16 14M21 20c0-2.6-1.4-4.2-3.5-4.8" /></>);
const IconEdit = Ic(<><path d="M4 20h4L18 10l-4-4L4 16Z" /><path d="M13.5 6.5 17.5 10.5" /></>);
const IconRoute = Ic(<><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16" /></>);
const IconBus = Ic(<><rect x="4" y="3" width="16" height="15" rx="3" /><path d="M4 11h16M8 18v2.5M16 18v2.5" /><circle cx="8" cy="14.5" r=".8" /><circle cx="16" cy="14.5" r=".8" /></>);
const IconFood = Ic(<><path d="M5 3v7a2 2 0 0 0 4 0V3M7 10v11" /><path d="M17 21V3c-2 0-3.5 2.5-3.5 6s1.5 4 3.5 4" /></>);
const IconLayers = Ic(<><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>);
const IconTarget = Ic(<><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>);
const IconX = Ic(<path d="M6 6l12 12M18 6 6 18" />);
const IconTrend = Ic(<><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>);

/* ---------------------------- Paleta ---------------------------- */
const BLUE = "#1a6fd4";
const GREEN = "#10b981";
const TEAL = "#0891b2";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const INDIGO = "#6366f1";
const VIOLET = "#8b5cf6";
const PINK = "#ec4899";
const INK = "#0f2135";
const INK_SOFT = "#47586b";

/* ---------------------------- Status Bar ---------------------------- */
function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? "#ffffff" : INK;
  return (
    <div className="relative z-40 flex items-center justify-between px-8 pt-3.5 pb-1 text-[13px] font-semibold" style={{ color: c }}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="0" y="7" width="3" height="5" rx="1" fill={c} /><rect x="4.5" y="4.5" width="3" height="7.5" rx="1" fill={c} /><rect x="9" y="2" width="3" height="10" rx="1" fill={c} /><rect x="13.5" y="0" width="3" height="12" rx="1" fill={c} opacity="0.4" /></svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><path d="M8.5 3.5C10.4 3.5 12.1 4.2 13.4 5.4L14.7 4C13 2.5 10.9 1.6 8.5 1.6S4 2.5 2.3 4l1.3 1.4C4.9 4.2 6.6 3.5 8.5 3.5Z" fill={c} /><path d="M8.5 6.6c1 0 2 .4 2.7 1.1l1.3-1.4C11.4 5.2 10 4.6 8.5 4.6S5.6 5.2 4.5 6.3l1.3 1.4C6.5 7 7.5 6.6 8.5 6.6Z" fill={c} /><circle cx="8.5" cy="9.8" r="1.5" fill={c} /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="3" stroke={c} strokeOpacity="0.5" /><rect x="2.5" y="2.5" width="16" height="7" rx="1.5" fill={c} /><rect x="23" y="4" width="2" height="4" rx="1" fill={c} opacity="0.5" /></svg>
      </div>
    </div>
  );
}

/* ---------------------------- Top Bar ---------------------------- */
function TopBar({ title, subtitle, onBack, right, accent = BLUE }: { title: string; subtitle?: string; onBack?: () => void; right?: React.ReactNode; accent?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-1 pb-3">
      {onBack && (
        <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-white text-[color:var(--color-ink)] shadow-sm active:scale-95 transition" style={{ color: INK }}>
          <IconBack size={20} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[19px] font-bold leading-tight" style={{ color: INK }}>{title}</h1>
        {subtitle && <p className="truncate text-[12.5px]" style={{ color: INK_SOFT }}>{subtitle}</p>}
      </div>
      {right}
      <span className="ml-1 h-1.5 w-6 rounded-full" style={{ background: accent }} />
    </div>
  );
}

/* ---------------------------- Bottom Nav ---------------------------- */
type TabId = "inicio" | "academico" | "servicos" | "notificacoes" | "perfil";
function BottomNav({ active, onChange, badge = 3 }: { active: TabId; onChange: (t: TabId) => void; badge?: number }) {
  const items: { id: TabId; label: string; Icon: (p: IconProps) => React.ReactElement }[] = [
    { id: "inicio", label: "Início", Icon: IconHome },
    { id: "academico", label: "Acadêmico", Icon: IconBook },
    { id: "servicos", label: "Serviços", Icon: IconGrid },
    { id: "notificacoes", label: "Notificações", Icon: IconBell },
    { id: "perfil", label: "Perfil", Icon: IconUser },
  ];
  return (
    <div className="border-t border-[color:var(--color-line)] bg-white/95 px-2 pb-6 pt-2 backdrop-blur">
      <div className="flex items-stretch justify-between">
        {items.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <button key={id} onClick={() => onChange(id)} className="relative flex flex-1 flex-col items-center gap-1 py-1 transition active:scale-95" style={{ color: on ? BLUE : INK_SOFT }}>
              <div className="relative">
                <Icon size={23} strokeWidth={on ? 2.2 : 1.7} />
                {id === "notificacoes" && badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold text-white" style={{ background: RED }}>{badge}</span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{label}</span>
              {on && <span className="absolute -top-2 h-1 w-8 rounded-full" style={{ background: BLUE }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------- Blocos utilitários ---------------------------- */
function Screen({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6 ${className}`}>{children}</div>;
}
function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-2.5 mt-5 flex items-center justify-between">
      <h2 className="text-[15px] font-bold" style={{ color: INK }}>{title}</h2>
      {action && <button onClick={onAction} className="text-[12.5px] font-semibold" style={{ color: BLUE }}>{action}</button>}
    </div>
  );
}
function Pill({ children, color = BLUE, soft = true }: { children: React.ReactNode; color?: string; soft?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={soft ? { background: color + "1a", color } : { background: color, color: "#fff" }}>
      {children}
    </span>
  );
}
function Ring({ value, size = 64, color = GREEN, label }: { value: number; size?: number; color?: string; label?: string }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e9eef4" strokeWidth={6} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * value) / 100} />
      </svg>
      <div className="absolute text-center">
        <div className="text-[15px] font-extrabold leading-none" style={{ color: INK }}>{value}%</div>
        {label && <div className="text-[8px]" style={{ color: INK_SOFT }}>{label}</div>}
      </div>
    </div>
  );
}
function EmptyState({ title, text, icon }: { title: string; text: string; icon?: React.ReactNode }) {
  return (
    <div className="mt-10 flex flex-col items-center px-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl" style={{ background: BLUE + "12", color: BLUE }}>{icon ?? <IconDoc size={28} />}</div>
      <h3 className="mt-4 text-[15px] font-bold" style={{ color: INK }}>{title}</h3>
      <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: INK_SOFT }}>{text}</p>
    </div>
  );
}
function LoadingState({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="mt-16 flex flex-col items-center gap-3">
      <div className="spinner h-9 w-9 rounded-full border-[3px]" style={{ borderColor: BLUE + "33", borderTopColor: BLUE }} />
      <p className="text-[12.5px]" style={{ color: INK_SOFT }}>{text}</p>
    </div>
  );
}
function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="mt-10 flex flex-col items-center px-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl" style={{ background: RED + "14", color: RED }}><IconAlert size={28} /></div>
      <h3 className="mt-4 text-[15px] font-bold" style={{ color: INK }}>Não foi possível carregar</h3>
      <p className="mt-1 text-[12.5px]" style={{ color: INK_SOFT }}>Verifique sua conexão e tente novamente.</p>
      {onRetry && <button onClick={onRetry} className="mt-4 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white" style={{ background: BLUE }}>Tentar novamente</button>}
    </div>
  );
}
function Avatar({ name, color = BLUE, size = 44 }: { name: string; color?: string; size?: number }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("");
  return (
    <div className="grid flex-none place-items-center rounded-full font-bold text-white" style={{ width: size, height: size, background: color, fontSize: size * 0.34 }}>{initials}</div>
  );
}
function PrimaryButton({ children, onClick, color = BLUE, loading = false }: { children: React.ReactNode; onClick?: () => void; color?: string; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-70" style={{ background: color, boxShadow: `0 12px 24px -10px ${color}99` }}>
      {loading && <span className="spinner h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </button>
  );
}

/* ============================================================
   Dados fictícios
   ============================================================ */
const ALUNO = { nome: "Ana Beatriz Nunes", turma: "9º ano B", escola: "E.M.E.F. Poeta João Ribeiro", cidade: "Aracaju - SE", matricula: "2025.09384-7" };
const NOTAS = [
  { mat: "Matemática", n1: 8.5, n2: 7.0, media: 7.8, status: "Aprovado", cor: GREEN },
  { mat: "Português", n1: 9.0, n2: 8.5, media: 8.8, status: "Aprovado", cor: GREEN },
  { mat: "Ciências", n1: 6.0, n2: 5.5, media: 5.8, status: "Recuperação", cor: AMBER },
  { mat: "História", n1: 7.5, n2: 8.0, media: 7.8, status: "Aprovado", cor: GREEN },
  { mat: "Geografia", n1: 8.0, n2: 7.5, media: 7.8, status: "Aprovado", cor: GREEN },
  { mat: "Inglês", n1: 4.5, n2: 5.0, media: 4.8, status: "Reprovado", cor: RED },
];
const FREQ = [
  { mat: "Matemática", pct: 96, faltas: 3 },
  { mat: "Português", pct: 92, faltas: 6 },
  { mat: "Ciências", pct: 88, faltas: 9 },
  { mat: "História", pct: 98, faltas: 1 },
  { mat: "Inglês", pct: 74, faltas: 18 },
];
const DIAS = ["SEG", "TER", "QUA", "QUI", "SEX"];
const HORARIOS: Record<string, { h: string; m: string; sala: string; cor: string }[]> = {
  SEG: [{ h: "07:00", m: "Matemática", sala: "Sala 12", cor: BLUE }, { h: "07:50", m: "Português", sala: "Sala 12", cor: TEAL }, { h: "08:40", m: "Ciências", sala: "Lab. 2", cor: GREEN }],
  TER: [{ h: "07:00", m: "História", sala: "Sala 12", cor: AMBER }, { h: "07:50", m: "Inglês", sala: "Sala 09", cor: "#8b5cf6" }, { h: "08:40", m: "Ed. Física", sala: "Quadra", cor: GREEN }],
  QUA: [{ h: "07:00", m: "Geografia", sala: "Sala 12", cor: "#ec4899" }, { h: "07:50", m: "Matemática", sala: "Sala 12", cor: BLUE }, { h: "08:40", m: "Artes", sala: "Sala 05", cor: TEAL }],
  QUI: [{ h: "07:00", m: "Português", sala: "Sala 12", cor: TEAL }, { h: "07:50", m: "Ciências", sala: "Lab. 2", cor: GREEN }, { h: "08:40", m: "História", sala: "Sala 12", cor: AMBER }],
  SEX: [{ h: "07:00", m: "Inglês", sala: "Sala 09", cor: "#8b5cf6" }, { h: "07:50", m: "Geografia", sala: "Sala 12", cor: "#ec4899" }, { h: "08:40", m: "Matemática", sala: "Sala 12", cor: BLUE }],
};

/* ============================================================
   1. Splash
   ============================================================ */
function Logo({ size = 56, light = false }: { size?: number; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid place-items-center rounded-2xl shadow-lg" style={{ width: size, height: size, background: light ? "#fff" : `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}>
        <IconGrad size={size * 0.55} className="" strokeWidth={2} />
      </div>
    </div>
  );
}
function Splash({ go }: { go: () => void }) {
  useEffect(() => { const t = setTimeout(go, 2200); return () => clearTimeout(t); }, [go]);
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden text-white" style={{ background: `linear-gradient(160deg, ${BLUE} 0%, ${BLUE_DARK} 55%, ${TEAL} 130%)` }}>
      <div className="pointer-events-none absolute -left-16 top-16 h-56 w-56 rounded-full" style={{ background: "#ffffff18" }} />
      <div className="pointer-events-none absolute -right-20 bottom-24 h-72 w-72 rounded-full" style={{ background: "#ffffff10" }} />
      <div className="animate-in flex flex-col items-center">
        <div className="grid h-24 w-24 place-items-center rounded-[28px] bg-white shadow-2xl">
          <IconGrad size={54} className="" strokeWidth={2} />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight"><span style={{ color: "#9ae6c4" }}>SE</span> Educa</h1>
        <p className="mt-3 max-w-[240px] text-center text-[14px] font-medium leading-relaxed text-white/85">Educação conectada, simples e acessível.</p>
      </div>
      <div className="absolute bottom-14 flex flex-col items-center gap-3">
        <div className="spinner h-6 w-6 rounded-full border-2 border-white/30 border-t-white" />
        <p className="text-[11px] text-white/70">Secretaria de Educação · Sergipe</p>
      </div>
    </div>
  );
}
const BLUE_DARK = "#0f4c96";

/* ============================================================
   2. Login
   ============================================================ */
type Perfil = "aluno" | "responsavel" | "professor" | "escola" | "secretaria";
const PERFIS: { id: Perfil; label: string; Icon: (p: IconProps) => React.ReactElement; cor: string }[] = [
  { id: "aluno", label: "Aluno", Icon: IconGrad, cor: BLUE },
  { id: "responsavel", label: "Responsável", Icon: IconUsers, cor: INDIGO },
  { id: "professor", label: "Professor", Icon: IconBook, cor: TEAL },
  { id: "escola", label: "Escola", Icon: IconGrid, cor: GREEN },
  { id: "secretaria", label: "Secretaria", Icon: IconShield, cor: AMBER },
];
function Login({ onEnter, onCadastro }: { onEnter: (p: Perfil) => void; onCadastro: () => void }) {
  const [perfil, setPerfil] = useState<Perfil>("aluno");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const cor = PERFIS.find((p) => p.id === perfil)!.cor;

  const entrar = () => {
    setErro("");
    if (!cpf || !senha) { setErro("Preencha CPF/matrícula e senha para continuar."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onEnter(perfil); }, 1100);
  };

  return (
    <div className="scroll-area flex-1 overflow-y-auto">
      <div className="px-6 pb-8 pt-2">
        <div className="flex flex-col items-center pt-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}><IconGrad size={34} strokeWidth={2} /></div>
          <h1 className="mt-3 text-2xl font-extrabold" style={{ color: INK }}><span style={{ color: GREEN }}>SE</span> Educa</h1>
          <p className="text-[12.5px]" style={{ color: INK_SOFT }}>Acesse sua conta</p>
        </div>

        <p className="mb-2 mt-7 text-[13px] font-semibold" style={{ color: INK }}>Selecione seu perfil</p>
        <div className="grid grid-cols-5 gap-1.5">
          {PERFIS.map(({ id, label, Icon, cor: c }) => {
            const on = perfil === id;
            return (
              <button key={id} onClick={() => setPerfil(id)} className="flex flex-col items-center gap-1 rounded-2xl border py-2.5 transition active:scale-95" style={{ borderColor: on ? c : "#e2e8f0", background: on ? c + "12" : "#fff", color: on ? c : INK_SOFT }}>
                <Icon size={20} strokeWidth={1.9} />
                <span className="text-[8.5px] font-semibold leading-tight text-center">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: INK }}>CPF ou matrícula</label>
            <input value={cpf} onChange={(e) => setCpf(e.target.value)} inputMode="numeric" placeholder="000.000.000-00" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: INK }}>Senha</label>
            <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" placeholder="••••••••" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" />
          </div>
        </div>

        {erro && <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-medium" style={{ background: RED + "12", color: RED }}><IconAlert size={16} />{erro}</div>}

        <div className="mt-5"><PrimaryButton onClick={entrar} color={cor} loading={loading}>{loading ? "Entrando..." : "Entrar"}</PrimaryButton></div>

        <div className="mt-4 flex items-center justify-between text-[12.5px] font-semibold">
          <button style={{ color: INK_SOFT }}>Recuperar senha</button>
          <button onClick={onCadastro} style={{ color: cor }}>Primeiro acesso</button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px]" style={{ color: INK_SOFT }}>
          <IconShield size={14} /> Ambiente seguro · Governo de Sergipe
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   3. Aluno Home
   ============================================================ */
function AlunoHome({ nav }: { nav: (s: ScreenId) => void }) {
  const atalhos: { label: string; Icon: (p: IconProps) => React.ReactElement; cor: string; s: ScreenId }[] = [
    { label: "Notas", Icon: IconStar, cor: BLUE, s: "notas" },
    { label: "Frequência", Icon: IconCheck, cor: GREEN, s: "frequencia" },
    { label: "Horários", Icon: IconClock, cor: TEAL, s: "horarios" },
    { label: "Boletim", Icon: IconDoc, cor: AMBER, s: "boletim" },
    { label: "Calendário", Icon: IconCalendar, cor: "#8b5cf6", s: "calendario" },
    { label: "Chat", Icon: IconChat, cor: "#ec4899", s: "chat" },
    { label: "Tarefas", Icon: IconEdit, cor: INDIGO, s: "tarefas" },
    { label: "Locais de estudo", Icon: IconPin, cor: RED, s: "mapaEstudos" },
    { label: "Transporte", Icon: IconBus, cor: GREEN, s: "transporte" },
    { label: "Merenda", Icon: IconFood, cor: AMBER, s: "merenda" },
    { label: "Escolas", Icon: IconGrad, cor: TEAL, s: "escolas" },
    { label: "Biblioteca Virtual", Icon: IconBook, cor: INDIGO, s: "biblioteca" },
    { label: "Secretaria", Icon: IconGrid, cor: BLUE, s: "secretariaVirtual" },
  ];
  return (
    <>
      <div className="px-5 pb-4 pt-1 text-white" style={{ background: `linear-gradient(150deg, ${BLUE}, ${BLUE_DARK})`, borderRadius: "0 0 26px 26px" }}>
        <div className="flex items-center gap-3">
          <Avatar name={ALUNO.nome} color="#ffffff" size={46} />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-white/75">Olá, bom dia 👋</p>
            <h1 className="truncate text-[17px] font-bold">{ALUNO.nome}</h1>
          </div>
          <button onClick={() => nav("notificacoes")} className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15"><IconBell size={19} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: AMBER }} /></button>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/12 px-3 py-2.5 text-[12px]">
          <IconGrad size={16} /><span className="font-semibold">{ALUNO.turma}</span><span className="text-white/60">·</span><span className="truncate text-white/80">{ALUNO.escola}</span>
        </div>
      </div>

      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => nav("notas")} className="card p-3.5 text-left active:scale-[0.98] transition">
            <div className="flex items-center justify-between"><span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>Média geral</span><IconStar size={16} className="" /></div>
            <div className="mt-1 text-[26px] font-extrabold" style={{ color: BLUE }}>7,3</div>
            <Pill color={GREEN}>Acima da média</Pill>
          </button>
          <button onClick={() => nav("frequencia")} className="card p-3.5 text-left active:scale-[0.98] transition">
            <div className="flex items-center justify-between"><span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>Frequência</span><IconCheck size={16} /></div>
            <div className="mt-1 text-[26px] font-extrabold" style={{ color: GREEN }}>89,6%</div>
            <Pill color={AMBER}>Atenção em Inglês</Pill>
          </button>
        </div>

        <SectionHeader title="Avisos da escola" />
        <div className="card space-y-3 p-4">
          {[{ t: "Semana da Ciência", d: "Inscrições abertas até 10/09.", c: TEAL }, { t: "Merenda escolar", d: "Hoje: carne de panela com macaxeira.", c: GREEN }].map((a) => (
            <div key={a.t} className="flex gap-3">
              <span className="mt-1 h-2 w-2 flex-none rounded-full" style={{ background: a.c }} />
              <div><p className="text-[13px] font-semibold" style={{ color: INK }}>{a.t}</p><p className="text-[12px]" style={{ color: INK_SOFT }}>{a.d}</p></div>
            </div>
          ))}
        </div>

        <SectionHeader title="Acesso rápido" />
        <div className="grid grid-cols-3 gap-3">
          {atalhos.map(({ label, Icon, cor, s }) => (
            <button key={label} onClick={() => nav(s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
              <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><Icon size={22} /></div>
              <span className="text-[11.5px] font-semibold" style={{ color: INK }}>{label}</span>
            </button>
          ))}
        </div>

        <SectionHeader title="Próximos eventos" action="Ver tudo" onAction={() => nav("calendario")} />
        <div className="space-y-2.5">
          {[{ d: "08", m: "SET", t: "Prova de Matemática", h: "2ª unidade · 07:00", c: BLUE }, { d: "12", m: "SET", t: "Entrega do trabalho de Ciências", h: "Até 23:59", c: GREEN }, { d: "15", m: "SET", t: "Reunião de pais e mestres", h: "18:30 · Auditório", c: AMBER }].map((e) => (
            <div key={e.t} className="card flex items-center gap-3 p-3">
              <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-center" style={{ background: e.c + "14", color: e.c }}><div><div className="text-[16px] font-extrabold leading-none">{e.d}</div><div className="text-[8px] font-bold">{e.m}</div></div></div>
              <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-semibold" style={{ color: INK }}>{e.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{e.h}</p></div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

/* ============================================================
   4. Notas
   ============================================================ */
function Notas({ back }: { back: () => void }) {
  const [uni, setUni] = useState(2);
  return (
    <>
      <TopBar title="Notas" subtitle={`${ALUNO.turma} · ${ALUNO.matricula}`} onBack={back} />
      <Screen>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((u) => (
            <button key={u} onClick={() => setUni(u)} className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition" style={uni === u ? { background: BLUE, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{u}ª Uni.</button>
          ))}
        </div>
        <div className="mt-4 card p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-[12px]" style={{ color: INK_SOFT }}>Média da unidade</p><p className="text-[28px] font-extrabold" style={{ color: BLUE }}>7,3</p></div>
            <Ring value={73} color={BLUE} label="da meta" />
          </div>
        </div>
        <SectionHeader title="Por disciplina" />
        <div className="space-y-2.5">
          {NOTAS.map((n) => (
            <div key={n.mat} className="card p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold" style={{ color: INK }}>{n.mat}</p>
                <Pill color={n.cor}>{n.status}</Pill>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {[["N1", n.n1], ["N2", n.n2], ["Média", n.media]].map(([l, v], i) => (
                  <div key={l as string} className="flex-1 rounded-xl px-2 py-2 text-center" style={{ background: i === 2 ? n.cor + "14" : "#f4f7fb" }}>
                    <div className="text-[10px] font-medium" style={{ color: INK_SOFT }}>{l}</div>
                    <div className="text-[16px] font-extrabold" style={{ color: i === 2 ? n.cor : INK }}>{(v as number).toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   5. Frequência
   ============================================================ */
function Frequencia({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Frequência" subtitle="Ano letivo 2025" onBack={back} accent={GREEN} />
      <Screen>
        <div className="card flex items-center gap-4 p-4">
          <Ring value={90} size={82} color={GREEN} label="presença" />
          <div className="flex-1">
            <p className="text-[13px] font-bold" style={{ color: INK }}>Frequência geral</p>
            <p className="mt-0.5 text-[12px]" style={{ color: INK_SOFT }}>37 faltas de 360 aulas</p>
            <div className="mt-2 inline-flex"><Pill color={GREEN}>Dentro do limite (mín. 75%)</Pill></div>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: AMBER + "12" }}>
          <IconAlert size={18} className="mt-0.5 flex-none" style={{ color: AMBER } as any} />
          <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>Atenção: <b>Inglês</b> está com 74% de presença, abaixo do mínimo exigido.</p>
        </div>
        <SectionHeader title="Detalhe por disciplina" />
        <div className="space-y-2.5">
          {FREQ.map((f) => {
            const cor = f.pct >= 90 ? GREEN : f.pct >= 75 ? AMBER : RED;
            return (
              <div key={f.mat} className="card p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold" style={{ color: INK }}>{f.mat}</p>
                  <span className="text-[14px] font-extrabold" style={{ color: cor }}>{f.pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: cor }} /></div>
                <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>{f.faltas} faltas registradas</p>
              </div>
            );
          })}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   6. Horários
   ============================================================ */
function Horarios({ back }: { back: () => void }) {
  const [dia, setDia] = useState("SEG");
  return (
    <>
      <TopBar title="Horários" subtitle="Grade semanal · Turno matutino" onBack={back} accent={TEAL} />
      <Screen>
        <div className="flex gap-2">
          {DIAS.map((d) => (
            <button key={d} onClick={() => setDia(d)} className="flex-1 rounded-xl py-2.5 text-[12px] font-bold transition" style={dia === d ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{d}</button>
          ))}
        </div>
        <SectionHeader title={`Aulas de ${dia === "SEG" ? "segunda" : dia === "TER" ? "terça" : dia === "QUA" ? "quarta" : dia === "QUI" ? "quinta" : "sexta"}-feira`} />
        <div className="relative space-y-3 pl-4">
          <span className="absolute bottom-2 left-[5px] top-2 w-0.5 rounded" style={{ background: "#e2e8f0" }} />
          {HORARIOS[dia].map((a) => (
            <div key={a.h} className="relative card flex items-center gap-3 p-3.5">
              <span className="absolute -left-[13px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: a.cor }} />
              <div className="w-12 flex-none text-center"><p className="text-[13px] font-extrabold" style={{ color: INK }}>{a.h}</p></div>
              <div className="h-9 w-1 rounded-full" style={{ background: a.cor }} />
              <div className="flex-1"><p className="text-[14px] font-semibold" style={{ color: INK }}>{a.m}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{a.sala}</p></div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   7. Boletim
   ============================================================ */
function Boletim({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Boletim" subtitle="2025 · Emitido em 04/09/2025" onBack={back} accent={AMBER} right={<button className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm" style={{ color: BLUE }}><IconDoc size={18} /></button>} />
      <Screen>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Avatar name={ALUNO.nome} size={44} />
            <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-bold" style={{ color: INK }}>{ALUNO.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{ALUNO.turma} · Mat. {ALUNO.matricula}</p></div>
          </div>
          <div className="mt-3 border-t border-[color:var(--color-line)] pt-3 text-[11.5px]" style={{ color: INK_SOFT }}>
            <p>{ALUNO.escola}</p><p>{ALUNO.cidade}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="card p-3.5 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Média final</p><p className="text-[24px] font-extrabold" style={{ color: BLUE }}>7,3</p></div>
          <div className="card p-3.5 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Frequência</p><p className="text-[24px] font-extrabold" style={{ color: GREEN }}>89,6%</p></div>
        </div>
        <SectionHeader title="Quadro de notas" />
        <div className="card overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-2.5 text-[10.5px] font-bold uppercase" style={{ background: "#f4f7fb", color: INK_SOFT }}>
            <span>Disciplina</span><span className="w-12 text-center">Média</span><span className="w-16 text-center">Situação</span>
          </div>
          {NOTAS.map((n) => (
            <div key={n.mat} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-t border-[color:var(--color-line)] px-4 py-3">
              <span className="text-[13px] font-medium" style={{ color: INK }}>{n.mat}</span>
              <span className="w-12 text-center text-[14px] font-bold" style={{ color: n.cor }}>{n.media.toFixed(1)}</span>
              <span className="w-16 text-center"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: n.cor }} /></span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px]" style={{ color: INK_SOFT }}>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: GREEN }} />Aprovado</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: AMBER }} />Recuperação</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: RED }} />Reprovado</span>
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   8. Matrícula
   ============================================================ */
function Matricula({ back }: { back: () => void }) {
  const [step, setStep] = useState(1);
  const [cidade, setCidade] = useState("Aracaju");
  const [escola, setEscola] = useState("");
  const [serie, setSerie] = useState("");
  const [turno, setTurno] = useState("");
  const [docs, setDocs] = useState<Record<string, boolean>>({});
  const [enviado, setEnviado] = useState(false);
  const escolas = ["E.M.E.F. Poeta João Ribeiro", "E.M.E.F. Tobias Barreto", "E.M. Prof. José Conrado"];
  const documentos = ["RG / Certidão de nascimento", "CPF do responsável", "Comprovante de residência", "Histórico escolar", "Foto 3x4"];

  if (enviado) {
    return (
      <>
        <TopBar title="Matrícula" onBack={back} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full text-white" style={{ background: GREEN }}><IconCheck size={40} strokeWidth={2.4} /></div>
          <h2 className="mt-5 text-[19px] font-extrabold" style={{ color: INK }}>Solicitação enviada!</h2>
          <p className="mt-2 text-[13px] leading-relaxed" style={{ color: INK_SOFT }}>Protocolo <b style={{ color: INK }}>2025-MAT-48210</b>. Acompanhe o andamento na tela de Acompanhamento.</p>
          <div className="mt-6 w-full"><PrimaryButton onClick={back} color={GREEN}>Concluir</PrimaryButton></div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Matrícula" subtitle={`Etapa ${step} de 3`} onBack={step === 1 ? back : () => setStep(step - 1)} />
      <Screen>
        <div className="mb-4 flex gap-1.5">
          {[1, 2, 3].map((s) => <div key={s} className="h-1.5 flex-1 rounded-full transition" style={{ background: s <= step ? BLUE : "#e2e8f0" }} />)}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Município">
              <div className="flex gap-2">{["Aracaju", "Nossa Sra. do Socorro", "Lagarto"].map((c) => (
                <button key={c} onClick={() => setCidade(c)} className="flex-1 rounded-xl border px-2 py-2.5 text-[11.5px] font-semibold transition" style={{ borderColor: cidade === c ? BLUE : "#e2e8f0", background: cidade === c ? BLUE + "12" : "#fff", color: cidade === c ? BLUE : INK_SOFT }}>{c}</button>
              ))}</div>
            </Field>
            <Field label="Escola">
              <div className="space-y-2">{escolas.map((e) => (
                <button key={e} onClick={() => setEscola(e)} className="flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left transition" style={{ borderColor: escola === e ? BLUE : "#e2e8f0", background: escola === e ? BLUE + "0a" : "#fff" }}>
                  <div><p className="text-[13px] font-semibold" style={{ color: INK }}>{e}</p><p className="text-[11px]" style={{ color: GREEN }}>Vagas disponíveis</p></div>
                  {escola === e && <IconCheck size={18} className="" style={{ color: BLUE } as any} />}
                </button>
              ))}</div>
            </Field>
            <PrimaryButton onClick={() => escola && setStep(2)}>Continuar</PrimaryButton>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Série / Ano">
              <div className="grid grid-cols-3 gap-2">{["6º ano", "7º ano", "8º ano", "9º ano", "1ª série", "2ª série"].map((s) => (
                <button key={s} onClick={() => setSerie(s)} className="rounded-xl border py-2.5 text-[12px] font-semibold transition" style={{ borderColor: serie === s ? BLUE : "#e2e8f0", background: serie === s ? BLUE + "12" : "#fff", color: serie === s ? BLUE : INK_SOFT }}>{s}</button>
              ))}</div>
            </Field>
            <Field label="Turno">
              <div className="flex gap-2">{["Matutino", "Vespertino", "Integral"].map((t) => (
                <button key={t} onClick={() => setTurno(t)} className="flex-1 rounded-xl border py-2.5 text-[12px] font-semibold transition" style={{ borderColor: turno === t ? BLUE : "#e2e8f0", background: turno === t ? BLUE + "12" : "#fff", color: turno === t ? BLUE : INK_SOFT }}>{t}</button>
              ))}</div>
            </Field>
            <div className="card flex items-center gap-3 p-3.5">
              <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: GREEN + "16", color: GREEN }}><IconUsers size={22} /></div>
              <div><p className="text-[13px] font-bold" style={{ color: INK }}>28 vagas disponíveis</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{serie || "Selecione a série"} · {turno || "turno"}</p></div>
            </div>
            <PrimaryButton onClick={() => serie && turno && setStep(3)}>Continuar</PrimaryButton>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-[13px] font-bold" style={{ color: INK }}>Documentos necessários</p>
              <p className="mb-3 text-[12px]" style={{ color: INK_SOFT }}>Marque os documentos que você já possui em mãos.</p>
              <div className="space-y-2">{documentos.map((d) => {
                const on = docs[d];
                return (
                  <button key={d} onClick={() => setDocs({ ...docs, [d]: !on })} className="flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition" style={{ borderColor: on ? GREEN : "#e2e8f0", background: on ? GREEN + "0d" : "#fff" }}>
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-lg border-2" style={{ borderColor: on ? GREEN : "#cbd5e1", background: on ? GREEN : "transparent" }}>{on && <IconCheck size={14} strokeWidth={3} className="text-white" />}</span>
                    <span className="text-[13px] font-medium" style={{ color: INK }}>{d}</span>
                  </button>
                );
              })}</div>
            </div>
            <div className="card space-y-1 p-3.5 text-[12px]" style={{ color: INK_SOFT }}>
              <p><b style={{ color: INK }}>Resumo:</b></p>
              <p>{cidade} · {escola}</p>
              <p>{serie} · {turno}</p>
            </div>
            <PrimaryButton onClick={() => setEnviado(true)} color={GREEN}>Enviar solicitação</PrimaryButton>
          </div>
        )}
      </Screen>
    </>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-2 text-[13px] font-semibold" style={{ color: INK }}>{label}</p>{children}</div>;
}

/* ============================================================
   9. Escolas / Vagas
   ============================================================ */

/* ============================================================
   10. Acompanhamento
   ============================================================ */
function Acompanhamento({ back }: { back: () => void }) {
  const etapas = [
    { t: "Solicitação enviada", d: "01/09 · 09:14", done: true },
    { t: "Em análise", d: "02/09 · 14:30", done: true },
    { t: "Documentação", d: "Aguardando envio de 1 documento", done: false, atual: true },
    { t: "Matrícula confirmada", d: "Pendente", done: false },
  ];
  return (
    <>
      <TopBar title="Acompanhamento" subtitle="Protocolo 2025-MAT-48210" onBack={back} accent={TEAL} />
      <Screen>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-[12px]" style={{ color: INK_SOFT }}>Status atual</p><p className="text-[16px] font-bold" style={{ color: AMBER }}>Documentação pendente</p></div>
            <Pill color={AMBER}>Em andamento</Pill>
          </div>
          <p className="mt-2 text-[12px]" style={{ color: INK_SOFT }}>E.M.E.F. Poeta João Ribeiro · 9º ano · Matutino</p>
        </div>
        <SectionHeader title="Linha do tempo" />
        <div className="relative pl-8">
          <span className="absolute bottom-4 left-[11px] top-2 w-0.5" style={{ background: "#e2e8f0" }} />
          <div className="space-y-5">
            {etapas.map((e, i) => (
              <div key={e.t} className="relative">
                <span className="absolute -left-8 top-0.5 grid h-6 w-6 place-items-center rounded-full border-2 border-white" style={{ background: e.done ? GREEN : e.atual ? AMBER : "#cbd5e1" }}>
                  {e.done ? <IconCheck size={13} strokeWidth={3} className="text-white" /> : <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <p className="text-[14px] font-bold" style={{ color: e.done || e.atual ? INK : INK_SOFT }}>{e.t}</p>
                <p className="text-[12px]" style={{ color: INK_SOFT }}>{e.d}</p>
                {e.atual && <button className="mt-2 rounded-xl px-4 py-2 text-[12.5px] font-semibold text-white" style={{ background: AMBER }}>Enviar documento</button>}
              </div>
            ))}
          </div>
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   11. Secretaria Virtual
   ============================================================ */
function SecretariaVirtual({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const servicos = [
    { t: "Declaração de matrícula", d: "Emissão imediata", Icon: IconDoc, cor: BLUE },
    { t: "Histórico escolar", d: "Prazo de 5 dias úteis", Icon: IconBook, cor: TEAL },
    { t: "Transferência", d: "Solicitar mudança de escola", Icon: IconGrid, cor: GREEN },
    { t: "Atualização cadastral", d: "Dados pessoais e contato", Icon: IconEdit, cor: AMBER },
    { t: "Segunda via de boletim", d: "Ano letivo atual", Icon: IconStar, cor: "#8b5cf6" },
    { t: "Requerimentos", d: "Outras solicitações", Icon: IconSend, cor: "#ec4899" },
  ];
  return (
    <>
      <TopBar title="Secretaria Virtual" subtitle="Serviços online" onBack={back} accent={BLUE} />
      <Screen>
        <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}>
          <p className="text-[13px] font-semibold">Resolva sem sair de casa 🏠</p>
          <p className="mt-1 text-[12px] text-white/85">Solicite documentos e serviços da rede municipal em poucos toques.</p>
        </div>
        <SectionHeader title="Serviços disponíveis" />
        <div className="space-y-2.5">
          {servicos.map((s) => (
            <button key={s.t} onClick={() => nav("acompanhamento")} className="card flex w-full items-center gap-3 p-3.5 text-left active:scale-[0.99] transition">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: s.cor + "16", color: s.cor }}><s.Icon size={22} /></div>
              <div className="flex-1"><p className="text-[13.5px] font-semibold" style={{ color: INK }}>{s.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{s.d}</p></div>
              <IconChevron size={18} className="" style={{ color: "#cbd5e1" } as any} />
            </button>
          ))}
        </div>
        <SectionHeader title="Meus protocolos" action="Acompanhar" onAction={() => nav("acompanhamento")} />
        <div className="card flex items-center gap-3 p-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: AMBER + "16", color: AMBER }}><IconClock size={19} /></div>
          <div className="flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>2025-MAT-48210</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Matrícula · Documentação pendente</p></div>
          <Pill color={AMBER}>Em análise</Pill>
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   12. Notificações
   ============================================================ */
type NotiSec = { id: string; t: string; d: string; h: string; Icon: (p: IconProps) => React.ReactElement; cor: string; cat: "urgente" | "demanda" | "rede" | "prazos"; dia: "Hoje" | "Ontem" | "Esta semana"; acao?: { label: string; s: ScreenId } };
const NOTIS_SEC: NotiSec[] = [
  { id: "n1", t: "Alta demanda: vagas especiais", d: "Buscas por vagas para alunos com necessidades especiais subiram 62% na semana. Zona Norte concentra 412 buscas.", h: "08:12", Icon: IconTrend, cor: RED, cat: "urgente", dia: "Hoje", acao: { label: "Ver análise", s: "secPesquisas" } },
  { id: "n2", t: "Escola sem vagas AEE", d: "E.M.E.F. Santa Maria zerou as vagas de atendimento especializado. 176 famílias procuraram a unidade.", h: "07:45", Icon: IconAlert, cor: RED, cat: "urgente", dia: "Hoje", acao: { label: "Ver no mapa", s: "mapaEscolas" } },
  { id: "n3", t: "Fila de enturmação", d: "38 alunos aguardam enturmação há mais de 5 dias na Regional Centro.", h: "07:30", Icon: IconUsers, cor: AMBER, cat: "demanda", dia: "Hoje", acao: { label: "Enturmar", s: "secEnturmacao" } },
  { id: "n4", t: "Carga horária abaixo do mínimo", d: "4 escolas estão abaixo das 800h anuais previstas na LDB. Prazo de ajuste: 15/10.", h: "06:58", Icon: IconClock, cor: AMBER, cat: "prazos", dia: "Hoje", acao: { label: "Ver escolas", s: "secCargaHoraria" } },
  { id: "n5", t: "Ofício respondido", d: "Diretoria Regional 08 respondeu sobre a contratação de 6 intérpretes de Libras.", h: "18:20", Icon: IconChat, cor: INDIGO, cat: "rede", dia: "Ontem", acao: { label: "Abrir conversa", s: "secRegional" } },
  { id: "n6", t: "Matrículas 2027 · balanço", d: "1.284 vagas abertas na rede; 412 pré-matrículas recebidas nas primeiras 48h.", h: "16:05", Icon: IconEdit, cor: BLUE, cat: "rede", dia: "Ontem", acao: { label: "Ver matrículas", s: "secMatriculas" } },
  { id: "n7", t: "Censo Escolar — prazo", d: "Envio da 2ª etapa (situação do aluno) ao INEP encerra em 12 dias. 9 escolas pendentes.", h: "14:40", Icon: IconCalendar, cor: VIOLET, cat: "prazos", dia: "Ontem" },
  { id: "n8", t: "Transporte escolar sem rastreio", d: "Linha L-022 (Santa Maria) segue sem GPS. Licitação do rastreamento em análise.", h: "Seg", Icon: IconBus, cor: TEAL, cat: "rede", dia: "Esta semana" },
  { id: "n9", t: "IDEB parcial atualizado", d: "Rede atingiu 5,8 (meta 6,0). 12 escolas abaixo da meta individual.", h: "Seg", Icon: IconChart, cor: GREEN, cat: "rede", dia: "Esta semana", acao: { label: "Gestão pedagógica", s: "secPedagogico" } },
  { id: "n10", t: "Merenda — prestação PNAE", d: "Prestação de contas do 3º bimestre aprovada pelo FNDE.", h: "Dom", Icon: IconFood, cor: GREEN, cat: "prazos", dia: "Esta semana" },
];

function NotificacoesSecretaria({ back, nav }: { back: () => void; nav: (s: ScreenId) => void }) {
  const [cat, setCat] = useState<("todas" | NotiSec["cat"])[]>(["todas"]);
  const [lidas, setLidas] = useState<string[]>(["n8", "n9", "n10"]);
  const lista = NOTIS_SEC.filter((n) => cat[0] === "todas" || n.cat === cat[0]);
  const naoLidas = NOTIS_SEC.filter((n) => !lidas.includes(n.id)).length;
  const urgentes = NOTIS_SEC.filter((n) => n.cat === "urgente").length;
  return (
    <>
      <TopBar title="Notificações" subtitle={naoLidas ? `${naoLidas} não lidas · Secretaria` : "Tudo em dia"} onBack={back} accent={AMBER} right={<button onClick={() => setLidas(NOTIS_SEC.map((n) => n.id))} className="text-[12px] font-semibold" style={{ color: BLUE }}>Marcar lidas</button>} />
      <Screen>
        <div className="grid grid-cols-3 gap-2">
          {[{ n: urgentes, l: "Urgentes", c: RED }, { n: NOTIS_SEC.filter((x) => x.cat === "prazos").length, l: "Prazos", c: VIOLET }, { n: naoLidas, l: "Não lidas", c: BLUE }].map((k) => (
            <div key={k.l} className="card p-3 text-center"><p className="text-[20px] font-extrabold" style={{ color: k.c }}>{k.n}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{k.l}</p></div>
          ))}
        </div>
        <div className="mt-3"><Chips items={[{ id: "todas", label: "Todas" }, { id: "urgente", label: "Urgentes" }, { id: "demanda", label: "Demandas" }, { id: "prazos", label: "Prazos" }, { id: "rede", label: "Rede" }]} value={cat} onChange={setCat} cor={AMBER} /></div>
        {lista.length === 0 && <EmptyState title="Nada por aqui" text="Nenhuma notificação nesta categoria." icon={<IconBell size={26} />} />}
        {(["Hoje", "Ontem", "Esta semana"] as const).map((dia) => {
          const grupo = lista.filter((n) => n.dia === dia);
          if (!grupo.length) return null;
          return (
            <div key={dia}>
              <SectionHeader title={dia} />
              <div className="space-y-2.5">
                {grupo.map((n) => {
                  const novo = !lidas.includes(n.id);
                  return (
                    <div key={n.id} onClick={() => setLidas((l) => (l.includes(n.id) ? l : [...l, n.id]))} className="card flex items-start gap-3 p-3.5" style={{ borderLeft: novo ? `3px solid ${n.cor}` : "3px solid transparent" }}>
                      <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: n.cor + "16", color: n.cor }}><n.Icon size={20} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{n.t}</p>{novo && <span className="h-2 w-2 flex-none rounded-full" style={{ background: RED }} />}<span className="ml-auto flex-none text-[11px]" style={{ color: "#94a3b8" }}>{n.h}</span></div>
                        <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: INK_SOFT }}>{n.d}</p>
                        {n.acao && <button onClick={(e) => { e.stopPropagation(); nav(n.acao!.s); }} className="mt-2 flex items-center gap-1 text-[12px] font-bold" style={{ color: n.cor }}>{n.acao.label}<IconChevron size={14} /></button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Screen>
    </>
  );
}

function Notificacoes({ back }: { back: () => void }) {
  const notis = [
    { t: "Nova nota lançada", d: "Matemática · 2ª unidade: 8,5", h: "Há 10 min", Icon: IconStar, cor: BLUE, novo: true },
    { t: "Falta registrada", d: "Inglês · 03/09", h: "Há 2 h", Icon: IconAlert, cor: AMBER, novo: true },
    { t: "Mensagem da escola", d: "Reunião de pais confirmada para 15/09", h: "Ontem", Icon: IconChat, cor: TEAL, novo: true },
    { t: "Documento aprovado", d: "Comprovante de residência validado", h: "2 dias", Icon: IconCheck, cor: GREEN, novo: false },
    { t: "Calendário atualizado", d: "Feriado municipal em 08/09", h: "3 dias", Icon: IconCalendar, cor: "#8b5cf6", novo: false },
  ];
  return (
    <>
      <TopBar title="Notificações" subtitle="3 não lidas" onBack={back} accent={RED} right={<button className="text-[12px] font-semibold" style={{ color: BLUE }}>Marcar lidas</button>} />
      <Screen>
        <SectionHeader title="Hoje" />
        <div className="space-y-2.5">
          {notis.map((n) => (
            <div key={n.t} className="card flex items-start gap-3 p-3.5" style={{ borderLeft: n.novo ? `3px solid ${n.cor}` : "3px solid transparent" }}>
              <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: n.cor + "16", color: n.cor }}><n.Icon size={20} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{n.t}</p>{n.novo && <span className="h-2 w-2 rounded-full" style={{ background: RED }} />}</div>
                <p className="text-[12px]" style={{ color: INK_SOFT }}>{n.d}</p>
                <p className="mt-1 text-[11px]" style={{ color: "#94a3b8" }}>{n.h}</p>
              </div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   13. Perfil + LGPD
   ============================================================ */
function Perfil({ back, onLogout, perfil, nav }: { back: () => void; onLogout: () => void; perfil: Perfil; nav: (s: ScreenId) => void }) {
  const [privacidade, setPrivacidade] = useState({ dados: true, notif: true, localizacao: false });
  const nomeMap: Record<Perfil, string> = { aluno: ALUNO.nome, responsavel: "Regina Nunes", professor: "Prof. Carlos Menezes", escola: "Diretora Márcia Lopes", secretaria: "Gestor Rafael Andrade" };
  const info = [
    { l: "CPF", v: "***.456.789-**" },
    { l: "E-mail", v: "ana.nunes@edu.se.gov.br" },
    { l: "Telefone", v: "(79) 9 9XXX-XX12" },
    { l: "Data de nascimento", v: "14/03/2010" },
  ];
  return (
    <>
      <TopBar title="Perfil" onBack={back} accent={BLUE} right={<button onClick={() => nav("configuracoes")} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm" style={{ color: BLUE }}><IconEdit size={18} /></button>} />
      <Screen>
        <div className="card flex flex-col items-center p-5">
          <Avatar name={nomeMap[perfil]} color={PERFIS.find((p) => p.id === perfil)!.cor} size={72} />
          <h2 className="mt-3 text-[17px] font-bold" style={{ color: INK }}>{nomeMap[perfil]}</h2>
          <p className="text-[12.5px]" style={{ color: INK_SOFT }}>{perfil === "aluno" ? `${ALUNO.turma} · ${ALUNO.escola}` : perfil === "responsavel" ? `Responsável · ${ALUNO.nome}` : "Rede Municipal de Aracaju"}</p>
          <div className="mt-3"><Pill color={PERFIS.find((p) => p.id === perfil)!.cor}>{PERFIS.find((p) => p.id === perfil)!.label}</Pill></div>
        </div>

        <SectionHeader title="Preferências" />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {[
            { t: "Configurações e acessibilidade", d: "Fonte, contraste, notificações", Icon: IconGrid, s: "configuracoes" as ScreenId },
            { t: "Central de mensagens", d: "Falar com a escola", Icon: IconChat, s: "chat" as ScreenId },
          ].map((o) => (
            <button key={o.t} onClick={() => nav(o.s)} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[color:var(--color-surface)] transition">
              <div className="grid h-9 w-9 flex-none place-items-center rounded-xl" style={{ background: BLUE + "12", color: BLUE }}><o.Icon size={18} /></div>
              <div className="flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>{o.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{o.d}</p></div>
              <IconChevron size={18} style={{ color: "#cbd5e1" }} />
            </button>
          ))}
        </div>
        <SectionHeader title="Dados cadastrais" />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {info.map((i) => (<div key={i.l} className="flex items-center justify-between px-4 py-3"><span className="text-[12.5px]" style={{ color: INK_SOFT }}>{i.l}</span><span className="text-[13px] font-semibold" style={{ color: INK }}>{i.v}</span></div>))}
        </div>
        <SectionHeader title="Privacidade e LGPD" />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {[{ k: "dados", t: "Compartilhar dados com a escola", d: "Necessário para serviços acadêmicos" }, { k: "notif", t: "Notificações por e-mail", d: "Avisos e comunicados" }, { k: "localizacao", t: "Usar localização", d: "Sugerir escolas próximas" }].map((o) => {
            const on = (privacidade as any)[o.k];
            return (
              <div key={o.k} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>{o.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{o.d}</p></div>
                <button onClick={() => setPrivacidade({ ...privacidade, [o.k]: !on })} className="relative h-6 w-11 flex-none rounded-full transition" style={{ background: on ? GREEN : "#cbd5e1" }}>
                  <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: on ? "22px" : "2px" }} />
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: BLUE + "0d" }}>
          <IconShield size={18} className="mt-0.5 flex-none" style={{ color: BLUE } as any} />
          <p className="text-[11.5px] leading-relaxed" style={{ color: INK_SOFT }}>Seus dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD nº 13.709/2018). <span className="font-semibold" style={{ color: BLUE }}>Saiba mais</span></p>
        </div>
        <button onClick={onLogout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold" style={{ background: RED + "12", color: RED }}><IconLogout size={18} />Sair da conta</button>
      </Screen>
    </>
  );
}

/* ============================================================
   14. Professor Home
   ============================================================ */
function ProfessorHome({ nav }: { nav: (s: ScreenId) => void }) {
  return (
    <>
      <ProfileHeader nome="Prof. Carlos Menezes" sub="Matemática · 5 turmas" cor={TEAL} nav={nav} />
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[{ n: "142", l: "Alunos", c: TEAL }, { n: "5", l: "Turmas", c: BLUE }, { n: "8", l: "Pendências", c: AMBER }].map((k) => (
            <div key={k.l} className="card p-3 text-center"><div className="text-[22px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[11px]" style={{ color: INK_SOFT }}>{k.l}</div></div>
          ))}
        </div>
        <SectionHeader title="Ações do dia" />
        <div className="grid grid-cols-2 gap-3">
          {[
            { t: "Registrar frequência", Icon: IconCheck, c: GREEN, s: "profFrequencia" as ScreenId },
            { t: "Lançar notas", Icon: IconStar, c: BLUE, s: "profNotas" as ScreenId },
            { t: "Plano de aula", Icon: IconBook, c: TEAL, s: "profPlanejamento" as ScreenId },
            { t: "Diário de classe", Icon: IconEdit, c: VIOLET, s: "profDiario" as ScreenId },
            { t: "Tarefas", Icon: IconDoc, c: AMBER, s: "tarefas" as ScreenId },
            { t: "Comunicados", Icon: IconBell, c: PINK, s: "comunicados" as ScreenId },
          ].map((a) => (
            <button key={a.t} onClick={() => nav(a.s)} className="card flex items-center gap-2.5 p-3.5 text-left active:scale-[0.98] transition">
              <div className="grid h-10 w-10 flex-none place-items-center rounded-xl" style={{ background: a.c + "16", color: a.c }}><a.Icon size={20} /></div>
              <span className="text-[12.5px] font-semibold leading-tight" style={{ color: INK }}>{a.t}</span>
            </button>
          ))}
        </div>
        <SectionHeader title="Minhas turmas" />
        <div className="space-y-2.5">
          {[{ t: "9º ano B", a: 32, freq: "presente", h: "07:00 · Sala 12" }, { t: "8º ano A", a: 29, freq: "pendente", h: "08:40 · Sala 09" }, { t: "7º ano C", a: 31, freq: "pendente", h: "10:20 · Sala 05" }].map((t) => (
            <button key={t.t} onClick={() => nav("profFrequencia")} className="card flex w-full items-center gap-3 p-3.5 text-left active:scale-[0.98] transition">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl text-[13px] font-extrabold" style={{ background: TEAL + "16", color: TEAL }}>{t.t.split(" ")[0]}</div>
              <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{t.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{t.a} alunos · {t.h}</p></div>
              {t.freq === "pendente" ? <Pill color={AMBER}>Frequência</Pill> : <Pill color={GREEN}>Registrada</Pill>}
            </button>
          ))}
        </div>
        <SectionHeader title="Avisos e planejamento" />
        <div className="card space-y-3 p-4">
          {[{ t: "Prova da 2ª unidade", d: "Aplicar até 12/09 nas turmas do 9º ano", c: BLUE }, { t: "Conselho de classe", d: "18/09 · 14h · Sala dos professores", c: TEAL }].map((a) => (
            <div key={a.t} className="flex gap-3"><span className="mt-1 h-2 w-2 flex-none rounded-full" style={{ background: a.c }} /><div><p className="text-[13px] font-semibold" style={{ color: INK }}>{a.t}</p><p className="text-[12px]" style={{ color: INK_SOFT }}>{a.d}</p></div></div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ============================================================
   15. Escola / Administração
   ============================================================ */
function EscolaHome({ nav }: { nav: (s: ScreenId) => void }) {
  return (
    <>
      <ProfileHeader nome="Diretora Márcia Lopes" sub="E.M.E.F. Poeta João Ribeiro" cor={GREEN} nav={nav} />
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <SectionHeader title="Indicadores" />
        <div className="grid grid-cols-2 gap-3">
          {[{ n: "842", l: "Alunos matriculados", c: BLUE, sub: "+18 este mês" }, { n: "48", l: "Professores", c: TEAL, sub: "3 novos" }, { n: "24", l: "Turmas ativas", c: GREEN, sub: "6 turnos" }, { n: "92%", l: "Frequência média", c: AMBER, sub: "meta 90%" }].map((k) => (
            <div key={k.l} className="card p-4"><div className="text-[24px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[12px] font-medium" style={{ color: INK }}>{k.l}</div><div className="text-[11px]" style={{ color: GREEN }}>{k.sub}</div></div>
          ))}
        </div>
        <SectionHeader title="Matrículas por status" />
        <div className="card p-4">
          {[{ l: "Confirmadas", v: 842, max: 900, c: GREEN }, { l: "Em análise", v: 36, max: 900, c: AMBER }, { l: "Vagas restantes", v: 58, max: 900, c: BLUE }].map((b) => (
            <div key={b.l} className="mb-3 last:mb-0">
              <div className="mb-1 flex justify-between text-[12px]"><span style={{ color: INK }}>{b.l}</span><span className="font-bold" style={{ color: b.c }}>{b.v}</span></div>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${(b.v / b.max) * 100}%`, background: b.c }} /></div>
            </div>
          ))}
        </div>
        <SectionHeader title="Gestão" />
        <div className="grid grid-cols-3 gap-3">
          {[{ t: "Matrículas", Icon: IconEdit, c: AMBER, s: "admMatriculas" as ScreenId }, { t: "Professores", Icon: IconUsers, c: TEAL, s: "admProfessores" as ScreenId }, { t: "Turmas", Icon: IconGrid, c: GREEN, s: "admTurmas" as ScreenId }, { t: "Horários", Icon: IconClock, c: BLUE, s: "admHorarios" as ScreenId }, { t: "Diário", Icon: IconCheck, c: VIOLET, s: "admDiario" as ScreenId }, { t: "Boletins", Icon: IconBook, c: PINK, s: "admBoletins" as ScreenId }, { t: "Add. turmas", Icon: IconPlus, c: TEAL, s: "admTurmas" as ScreenId }, { t: "Escolas", Icon: IconPin, c: RED, s: "escolas" as ScreenId }, { t: "Merenda", Icon: IconFood, c: AMBER, s: "merenda" as ScreenId }, { t: "Freq. programas", Icon: IconShield, c: GREEN, s: "gestorFreqSocial" as ScreenId }, { t: "Pendências", Icon: IconAlert, c: RED, s: "gestorPendencias" as ScreenId }].map((a) => (
            <button key={a.t} onClick={() => nav(a.s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
              <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: a.c + "16", color: a.c }}><a.Icon size={20} /></div>
              <span className="text-[11px] font-semibold" style={{ color: INK }}>{a.t}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ============================================================
   16. Secretaria de Educação
   ============================================================ */
function SecretariaHome({ nav, abrirEscolas }: { nav: (s: ScreenId) => void; abrirEscolas: (c: EscCtx) => void }) {
  return (
    <>
      <ProfileHeader nome="Gestor Rafael Andrade" sub="Secretaria Municipal de Educação" cor={AMBER} nav={nav} />
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <SectionHeader title="Panorama da rede" />
        <div className="grid grid-cols-2 gap-3">
          {[{ n: "127", l: "Escolas", c: BLUE, x: "todas" as EscCtx }, { n: "48.320", l: "Alunos", c: TEAL, x: "alunos" as EscCtx }, { n: "3.140", l: "Servidores", c: GREEN, x: "servidores" as EscCtx }, { n: "1.284", l: "Vagas abertas", c: AMBER, x: "vagas" as EscCtx }].map((k) => (
            <button key={k.l} onClick={() => abrirEscolas(k.x)} className="card p-4 text-left active:scale-[0.98] transition"><div className="flex items-start justify-between"><div className="text-[23px] font-extrabold" style={{ color: k.c }}>{k.n}</div><IconChevron size={16} style={{ color: "#cbd5e1" }} /></div><div className="text-[12px]" style={{ color: INK_SOFT }}>{k.l}</div></button>
          ))}
        </div>
        <button onClick={() => nav("secPesquisas")} className="card mt-3 flex w-full items-center gap-3 p-3.5 text-left" style={{ outline: `2px solid ${RED}2a` }}>
          <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: RED + "14", color: RED }}><IconTrend size={21} /></div>
          <div className="flex-1"><p className="text-[13px] font-bold" style={{ color: INK }}>+62% em buscas por vagas especiais</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Pesquisas recentes · ver análise</p></div>
          <IconChevron size={18} style={{ color: "#cbd5e1" }} />
        </button>
        <SectionHeader title="Frequência por região" action="Setembro/2025" />
        <FreqRegioes />
        <SectionHeader title="Gestão pedagógica" />
        <div className="space-y-2.5">
          {[{ t: "IDEB da rede", v: "5,8", d: "Meta 6,0 · +0,3 no ano", c: GREEN }, { t: "Alfabetização (2º ano)", v: "81%", d: "no nível adequado", c: BLUE }, { t: "Distorção idade-série", v: "9,4%", d: "-1,2 p.p.", c: AMBER }].map((i) => (
            <div key={i.t} className="card flex items-center gap-3 p-3.5">
              <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-[15px] font-extrabold" style={{ background: i.c + "16", color: i.c }}>{i.v}</div>
              <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{i.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{i.d}</p></div>
              <IconChart size={20} className="" style={{ color: i.c } as any} />
            </div>
          ))}
        </div>
        <SectionHeader title="Módulos" />
        <div className="grid grid-cols-3 gap-3">
          {[{ t: "Matrículas", Icon: IconEdit, s: "secMatriculas" as ScreenId }, { t: "Enturmação", Icon: IconUsers, s: "secEnturmacao" as ScreenId }, { t: "Pedagógico", Icon: IconGrad, s: "secPedagogico" as ScreenId }, { t: "Carga horária", Icon: IconClock, s: "secCargaHoraria" as ScreenId }, { t: "Escolas", Icon: IconGrid, s: "escolas" as ScreenId }, { t: "Regional", Icon: IconChat, s: "secRegional" as ScreenId }, { t: "Pesquisas", Icon: IconTrend, s: "secPesquisas" as ScreenId }].map((a) => (
            <button key={a.t} onClick={() => nav(a.s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
              <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: AMBER + "16", color: AMBER }}><a.Icon size={20} /></div>
              <span className="text-[10.5px] font-semibold" style={{ color: INK }}>{a.t}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* Header compartilhado para perfis de gestão */
function ProfileHeader({ nome, sub, cor, nav }: { nome: string; sub: string; cor: string; nav: (s: ScreenId) => void }) {
  return (
    <div className="px-5 pb-4 pt-1 text-white" style={{ background: `linear-gradient(150deg, ${cor}, ${shade(cor)})`, borderRadius: "0 0 26px 26px" }}>
      <div className="flex items-center gap-3">
        <Avatar name={nome} color="#ffffff" size={46} />
        <div className="min-w-0 flex-1"><p className="text-[12px] text-white/80">Bem-vindo(a)</p><h1 className="truncate text-[16px] font-bold">{nome}</h1><p className="truncate text-[11.5px] text-white/75">{sub}</p></div>
        <button onClick={() => nav("notificacoes")} className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15"><IconBell size={19} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: "#fff" }} /></button>
      </div>
    </div>
  );
}
function shade(hex: string) {
  const map: Record<string, string> = { [TEAL]: "#065f73", [GREEN]: "#0a7d5a", [AMBER]: "#b45309", [BLUE]: BLUE_DARK, [INDIGO]: "#4338ca" };
  return map[hex] ?? BLUE_DARK;
}

/* ============================================================
   17. Calendário Escolar
   ============================================================ */
/* ============================================================
   18. Chat
   ============================================================ */
function Chat({ back }: { back: () => void }) {
  const [aba, setAba] = useState(0);
  const abas = ["Aluno ↔ Escola", "Prof. ↔ Adm.", "Escola ↔ Sec."];
  const [msgs, setMsgs] = useState([
    { eu: false, txt: "Bom dia! A declaração de matrícula já está disponível na Secretaria Virtual.", h: "08:12" },
    { eu: true, txt: "Perfeito, muito obrigada! E sobre a reunião de pais?", h: "08:15" },
    { eu: false, txt: "Será dia 15/09 às 18h30 no auditório. Enviaremos o comunicado oficial.", h: "08:16" },
  ]);
  const [txt, setTxt] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [msgs]);
  const enviar = () => {
    if (!txt.trim()) return;
    setMsgs([...msgs, { eu: true, txt, h: "08:20" }]);
    setTxt("");
    setTimeout(() => setMsgs((m) => [...m, { eu: false, txt: "Recebido! Retornaremos em breve. 😊", h: "08:21" }]), 900);
  };
  return (
    <>
      <TopBar title="Mensagens" subtitle="Secretaria Escolar · online" onBack={back} accent="#ec4899" />
      <div className="px-5">
        <div className="flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {abas.map((a, i) => (
            <button key={a} onClick={() => setAba(i)} className="flex-1 rounded-xl py-2 text-[10.5px] font-semibold transition" style={aba === i ? { background: "#ec4899", color: "#fff" } : { color: INK_SOFT }}>{a}</button>
          ))}
        </div>
      </div>
      <div ref={scrollRef} className="scroll-area flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <p className="text-center text-[11px]" style={{ color: "#94a3b8" }}>Hoje</p>
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.eu ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[78%] rounded-2xl px-3.5 py-2.5" style={m.eu ? { background: BLUE, color: "#fff", borderBottomRightRadius: 6 } : { background: "#fff", color: INK, borderBottomLeftRadius: 6, boxShadow: "0 1px 2px rgba(15,33,53,.06)" }}>
              <p className="text-[13px] leading-snug">{m.txt}</p>
              <p className="mt-1 text-right text-[9.5px]" style={{ color: m.eu ? "#ffffffaa" : "#94a3b8" }}>{m.h}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-[color:var(--color-line)] bg-white px-4 py-3 pb-6">
        <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && enviar()} placeholder="Escreva uma mensagem..." className="flex-1 rounded-full bg-[color:var(--color-surface)] px-4 py-2.5 text-[13.5px] outline-none" />
        <button onClick={enviar} className="grid h-10 w-10 flex-none place-items-center rounded-full text-white" style={{ background: BLUE }}><IconSend size={18} /></button>
      </div>
    </>
  );
}

/* ============================================================
   Dados adicionais (responsável, professor, comunicação)
   ============================================================ */
const ALUNOS_TURMA = ["Ana Beatriz Nunes", "Bruno Carvalho Lima", "Carla Dias Santos", "Diego Farias Melo", "Eduarda Gomes Rocha", "Felipe Andrade Souza", "Gabriela Nunes Reis", "Heitor Vasconcelos"];
const TAREFAS = [
  { mat: "Matemática", t: "Lista de equações do 2º grau", prazo: "08/09", status: "Pendente", cor: AMBER },
  { mat: "Português", t: "Resenha do livro Vidas Secas", prazo: "12/09", status: "Pendente", cor: AMBER },
  { mat: "Ciências", t: "Relatório da aula prática", prazo: "03/09", status: "Atrasada", cor: RED },
  { mat: "História", t: "Linha do tempo — Brasil Colônia", prazo: "28/08", status: "Entregue", cor: GREEN },
  { mat: "Geografia", t: "Mapa climático do Nordeste", prazo: "25/08", status: "Entregue", cor: GREEN },
];
const COMUNICADOS = [
  { cat: "Secretaria", t: "Calendário de matrículas 2026", d: "As matrículas da rede municipal abrem em 06/10. Consulte escolas e vagas pelo app.", data: "Hoje", cor: AMBER, novo: true },
  { cat: "Escola", t: "Reunião de pais e mestres", d: "Dia 15/09, às 18h30, no auditório. Presença dos responsáveis é muito importante.", data: "Ontem", cor: GREEN, novo: true },
  { cat: "Turma", t: "Alteração de horário — Inglês", d: "A aula de Inglês de sexta passa a ser no 1º horário a partir da próxima semana.", data: "2 dias", cor: BLUE, novo: false },
  { cat: "Escola", t: "Campanha do agasalho", d: "Traga peças em bom estado até 20/09. Pontos de coleta na entrada.", data: "5 dias", cor: TEAL, novo: false },
];
const HISTORICO = [
  { ano: "2025", serie: "9º ano", escola: ALUNO.escola, media: "7,3", situacao: "Cursando", cor: BLUE },
  { ano: "2024", serie: "8º ano", escola: ALUNO.escola, media: "8,1", situacao: "Aprovado", cor: GREEN },
  { ano: "2023", serie: "7º ano", escola: "E.M.E.F. Tobias Barreto", media: "7,9", situacao: "Aprovado", cor: GREEN },
  { ano: "2022", serie: "6º ano", escola: "E.M.E.F. Tobias Barreto", media: "8,4", situacao: "Aprovado", cor: GREEN },
];

/* ============================================================
   Perfil Responsáveis — Home (contexto do filho)
   ============================================================ */
function ResponsavelHome({ nav }: { nav: (s: ScreenId) => void }) {
  const atalhos: { label: string; Icon: (p: IconProps) => React.ReactElement; cor: string; s: ScreenId }[] = [
    { label: "Notas", Icon: IconStar, cor: BLUE, s: "notas" },
    { label: "Boletim", Icon: IconDoc, cor: AMBER, s: "boletim" },
    { label: "Frequência", Icon: IconCheck, cor: GREEN, s: "frequencia" },
    { label: "Horários", Icon: IconClock, cor: TEAL, s: "horarios" },
    { label: "Tarefas", Icon: IconEdit, cor: VIOLET, s: "tarefas" },
    { label: "Calendário", Icon: IconCalendar, cor: "#0ea5e9", s: "calendario" },
    { label: "Histórico", Icon: IconBook, cor: INDIGO, s: "historico" },
    { label: "Comunicação", Icon: IconChat, cor: PINK, s: "chat" },
    { label: "Secretaria", Icon: IconGrid, cor: BLUE, s: "secretariaVirtual" },
    { label: "Locais de estudo", Icon: IconPin, cor: RED, s: "mapaEstudos" },
    { label: "Transporte", Icon: IconBus, cor: GREEN, s: "transporte" },
    { label: "Merenda", Icon: IconFood, cor: AMBER, s: "merenda" },
  ];
  return (
    <>
      <div className="px-5 pb-4 pt-1 text-white" style={{ background: `linear-gradient(150deg, ${INDIGO}, ${shade(INDIGO)})`, borderRadius: "0 0 26px 26px" }}>
        <div className="flex items-center gap-3">
          <Avatar name="Regina Nunes" color="#ffffff" size={46} />
          <div className="min-w-0 flex-1"><p className="text-[12px] text-white/80">Olá, Regina 👋</p><h1 className="truncate text-[16px] font-bold">Acompanhamento familiar</h1></div>
          <button onClick={() => nav("notificacoes")} className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15"><IconBell size={19} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: AMBER }} /></button>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/12 px-3 py-2.5">
          <Avatar name={ALUNO.nome} color="#ffffff22" size={30} />
          <div className="min-w-0 flex-1"><p className="truncate text-[12.5px] font-semibold">{ALUNO.nome}</p><p className="truncate text-[11px] text-white/75">{ALUNO.turma} · {ALUNO.escola}</p></div>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">Filha</span>
        </div>
      </div>
      <div className="scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6">
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => nav("notas")} className="card p-3.5 text-left active:scale-[0.98] transition"><div className="flex items-center justify-between"><span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>Média geral</span><IconStar size={16} style={{ color: BLUE }} /></div><div className="mt-1 text-[26px] font-extrabold" style={{ color: BLUE }}>7,3</div><Pill color={GREEN}>Acima da média</Pill></button>
          <button onClick={() => nav("frequencia")} className="card p-3.5 text-left active:scale-[0.98] transition"><div className="flex items-center justify-between"><span className="text-[12px] font-medium" style={{ color: INK_SOFT }}>Frequência</span><IconCheck size={16} style={{ color: GREEN }} /></div><div className="mt-1 text-[26px] font-extrabold" style={{ color: GREEN }}>89,6%</div><Pill color={AMBER}>Atenção em Inglês</Pill></button>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: RED + "10" }}>
          <IconAlert size={18} className="mt-0.5 flex-none" style={{ color: RED }} />
          <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>1 tarefa <b>atrasada</b> em Ciências e frequência baixa em Inglês. <button onClick={() => nav("tarefas")} className="font-semibold" style={{ color: RED }}>Ver tarefas</button></p>
        </div>

        <SectionHeader title="Acesso rápido" />
        <div className="grid grid-cols-3 gap-3">
          {atalhos.map(({ label, Icon, cor, s }) => (
            <button key={label} onClick={() => nav(s)} className="card flex flex-col items-center gap-2 py-4 active:scale-95 transition">
              <div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: cor + "16", color: cor }}><Icon size={22} /></div>
              <span className="text-[11px] font-semibold" style={{ color: INK }}>{label}</span>
            </button>
          ))}
        </div>

        <SectionHeader title="Comunicados recentes" action="Ver tudo" onAction={() => nav("comunicados")} />
        <div className="space-y-2.5">
          {COMUNICADOS.slice(0, 2).map((c) => (
            <button key={c.t} onClick={() => nav("comunicados")} className="card flex w-full items-start gap-3 p-3.5 text-left active:scale-[0.99] transition">
              <span className="mt-1 h-2 w-2 flex-none rounded-full" style={{ background: c.cor }} />
              <div className="flex-1"><div className="flex items-center gap-2"><p className="text-[13px] font-semibold" style={{ color: INK }}>{c.t}</p>{c.novo && <span className="h-1.5 w-1.5 rounded-full" style={{ background: RED }} />}</div><p className="line-clamp-1 text-[11.5px]" style={{ color: INK_SOFT }}>{c.d}</p></div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ============================================================
   Tarefas (aluno/responsável e professor)
   ============================================================ */
function Tarefas({ back, role }: { back: () => void; role: "aluno" | "professor" }) {
  const [filtro, setFiltro] = useState("Todas");
  if (role === "professor") {
    const tarefas = [
      { mat: "9º ano B", t: "Lista de equações do 2º grau", prazo: "08/09", entregues: 18, total: 32, cor: BLUE },
      { mat: "8º ano A", t: "Trabalho sobre funções", prazo: "14/09", entregues: 5, total: 29, cor: AMBER },
      { mat: "7º ano C", t: "Exercícios de frações", prazo: "10/09", entregues: 31, total: 31, cor: GREEN },
    ];
    return (
      <>
        <TopBar title="Tarefas" subtitle="Atividades atribuídas" onBack={back} accent={TEAL} right={<button className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: TEAL }}><IconPlus size={18} /></button>} />
        <Screen>
          <div className="space-y-2.5">
            {tarefas.map((t) => {
              const pct = Math.round((t.entregues / t.total) * 100);
              return (
                <div key={t.t} className="card p-4">
                  <div className="flex items-center justify-between"><Pill color={t.cor}>{t.mat}</Pill><span className="text-[11.5px]" style={{ color: INK_SOFT }}>Prazo {t.prazo}</span></div>
                  <p className="mt-2 text-[14px] font-bold" style={{ color: INK }}>{t.t}</p>
                  <div className="mt-2.5 flex items-center gap-2"><div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: t.cor }} /></div><span className="text-[12px] font-bold" style={{ color: t.cor }}>{t.entregues}/{t.total}</span></div>
                  <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>{t.entregues} entregas · {t.total - t.entregues} pendentes</p>
                </div>
              );
            })}
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-[13.5px] font-semibold" style={{ borderColor: TEAL + "55", color: TEAL }}><IconPlus size={18} />Nova tarefa</button>
        </Screen>
      </>
    );
  }
  const list = TAREFAS.filter((t) => filtro === "Todas" || (filtro === "Pendentes" && t.status !== "Entregue") || (filtro === "Entregues" && t.status === "Entregue"));
  return (
    <>
      <TopBar title="Tarefas" subtitle={`${ALUNO.turma} · atividades`} onBack={back} accent={VIOLET} />
      <Screen>
        <div className="flex gap-2">
          {["Todas", "Pendentes", "Entregues"].map((f) => (
            <button key={f} onClick={() => setFiltro(f)} className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={filtro === f ? { background: VIOLET, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{f}</button>
          ))}
        </div>
        {list.length === 0 ? (
          <EmptyState title="Nada por aqui" text="Não há tarefas nesta categoria no momento." icon={<IconCheck size={26} />} />
        ) : (
          <div className="mt-4 space-y-2.5">
            {list.map((t) => (
              <div key={t.t} className="card p-3.5" style={{ borderLeft: `3px solid ${t.cor}` }}>
                <div className="flex items-center justify-between"><Pill color={BLUE}>{t.mat}</Pill><Pill color={t.cor}>{t.status}</Pill></div>
                <p className="mt-2 text-[13.5px] font-semibold" style={{ color: INK }}>{t.t}</p>
                <p className="mt-1 flex items-center gap-1 text-[11.5px]" style={{ color: INK_SOFT }}><IconClock size={13} />Entrega até {t.prazo}</p>
              </div>
            ))}
          </div>
        )}
      </Screen>
    </>
  );
}

/* ============================================================
   Comunicados
   ============================================================ */
function Comunicados({ back }: { back: () => void }) {
  const [cat, setCat] = useState("Todos");
  const list = COMUNICADOS.filter((c) => cat === "Todos" || c.cat === cat);
  return (
    <>
      <TopBar title="Comunicados" subtitle="Avisos e notícias" onBack={back} accent={GREEN} />
      <Screen>
        <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
          {["Todos", "Secretaria", "Escola", "Turma"].map((f) => (
            <button key={f} onClick={() => setCat(f)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={cat === f ? { background: GREEN, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{f}</button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {list.map((c) => (
            <div key={c.t} className="card p-4">
              <div className="flex items-center justify-between"><Pill color={c.cor}>{c.cat}</Pill><span className="text-[11px]" style={{ color: INK_SOFT }}>{c.data}</span></div>
              <div className="mt-2 flex items-center gap-2"><p className="text-[14px] font-bold" style={{ color: INK }}>{c.t}</p>{c.novo && <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: RED }}>NOVO</span>}</div>
              <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: INK_SOFT }}>{c.d}</p>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   Histórico Escolar
   ============================================================ */
function HistoricoEscolar({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Histórico escolar" subtitle={ALUNO.nome} onBack={back} accent={INDIGO} right={<button className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm" style={{ color: INDIGO }}><IconDoc size={18} /></button>} />
      <Screen>
        <div className="card flex items-center gap-3 p-4">
          <Avatar name={ALUNO.nome} color={INDIGO} size={44} />
          <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-bold" style={{ color: INK }}>{ALUNO.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Mat. {ALUNO.matricula} · {ALUNO.cidade}</p></div>
        </div>
        <SectionHeader title="Trajetória acadêmica" />
        <div className="relative space-y-3 pl-5">
          <span className="absolute bottom-3 left-[5px] top-3 w-0.5" style={{ background: "#e2e8f0" }} />
          {HISTORICO.map((h) => (
            <div key={h.ano} className="relative card p-3.5">
              <span className="absolute -left-[17px] top-5 h-3 w-3 rounded-full border-2 border-white" style={{ background: h.cor }} />
              <div className="flex items-center justify-between">
                <div><p className="text-[14px] font-bold" style={{ color: INK }}>{h.serie} · {h.ano}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{h.escola}</p></div>
                <div className="text-right"><p className="text-[18px] font-extrabold" style={{ color: h.cor }}>{h.media}</p><Pill color={h.cor}>{h.situacao}</Pill></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: INDIGO + "0d" }}>
          <IconShield size={18} className="mt-0.5 flex-none" style={{ color: INDIGO }} />
          <p className="text-[11.5px] leading-relaxed" style={{ color: INK_SOFT }}>Documento oficial com validade jurídica. A 2ª via também pode ser solicitada na Secretaria Virtual.</p>
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   Cadastro (Primeiro acesso)
   ============================================================ */
function Cadastro({ back }: { back: () => void }) {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<Perfil>("aluno");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [aceite, setAceite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const cor = PERFIS.find((p) => p.id === tipo)!.cor;

  if (ok) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full text-white" style={{ background: GREEN }}><IconCheck size={40} strokeWidth={2.4} /></div>
        <h2 className="mt-5 text-[19px] font-extrabold" style={{ color: INK }}>Cadastro concluído!</h2>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: INK_SOFT }}>Enviamos um link de confirmação para o seu e-mail. Você já pode acessar sua conta.</p>
        <div className="mt-6 w-full"><PrimaryButton onClick={back} color={GREEN}>Ir para o login</PrimaryButton></div>
      </div>
    );
  }
  return (
    <>
      <TopBar title="Primeiro acesso" subtitle={`Etapa ${step} de 3`} onBack={step === 1 ? back : () => setStep(step - 1)} accent={cor} />
      <Screen>
        <div className="mb-4 flex gap-1.5">{[1, 2, 3].map((s) => <div key={s} className="h-1.5 flex-1 rounded-full transition" style={{ background: s <= step ? cor : "#e2e8f0" }} />)}</div>

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Tipo de perfil">
              <div className="grid grid-cols-2 gap-2">
                {PERFIS.map(({ id, label, Icon, cor: c }) => (
                  <button key={id} onClick={() => setTipo(id)} className="flex items-center gap-2 rounded-xl border px-3 py-3 transition" style={{ borderColor: tipo === id ? c : "#e2e8f0", background: tipo === id ? c + "10" : "#fff", color: tipo === id ? c : INK_SOFT }}>
                    <Icon size={20} /><span className="text-[12px] font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Nome completo"><input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite seu nome" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" /></Field>
            <Field label="CPF"><input value={cpf} onChange={(e) => setCpf(e.target.value)} inputMode="numeric" placeholder="000.000.000-00" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" /></Field>
            <PrimaryButton onClick={() => nome && cpf && setStep(2)} color={cor}>Continuar</PrimaryButton>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <Field label="E-mail"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="voce@email.com" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" /></Field>
            <Field label="Telefone"><input inputMode="tel" placeholder="(79) 9 0000-0000" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" /></Field>
            <Field label="Crie uma senha"><input type="password" placeholder="Mínimo de 8 caracteres" className="w-full rounded-2xl border border-[color:var(--color-line)] bg-white px-4 py-3.5 text-[14px] outline-none focus:border-[color:var(--color-brand-blue)]" /></Field>
            <PrimaryButton onClick={() => email && setStep(3)} color={cor}>Continuar</PrimaryButton>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div className="card space-y-1.5 p-4 text-[12.5px]" style={{ color: INK_SOFT }}>
              <p className="text-[13px] font-bold" style={{ color: INK }}>Confira seus dados</p>
              <p>Perfil: <b style={{ color: INK }}>{PERFIS.find((p) => p.id === tipo)!.label}</b></p>
              <p>Nome: <b style={{ color: INK }}>{nome || "—"}</b></p>
              <p>CPF: <b style={{ color: INK }}>{cpf || "—"}</b></p>
              <p>E-mail: <b style={{ color: INK }}>{email || "—"}</b></p>
            </div>
            <button onClick={() => setAceite(!aceite)} className="flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition" style={{ borderColor: aceite ? GREEN : "#e2e8f0", background: aceite ? GREEN + "0a" : "#fff" }}>
              <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-lg border-2" style={{ borderColor: aceite ? GREEN : "#cbd5e1", background: aceite ? GREEN : "transparent" }}>{aceite && <IconCheck size={14} strokeWidth={3} className="text-white" />}</span>
              <span className="text-[12px] leading-relaxed" style={{ color: INK }}>Li e concordo com os <b>Termos de Uso</b> e a <b>Política de Privacidade (LGPD)</b>.</span>
            </button>
            <PrimaryButton onClick={() => { if (!aceite) return; setLoading(true); setTimeout(() => { setLoading(false); setOk(true); }, 1200); }} color={cor} loading={loading}>{loading ? "Criando conta..." : "Criar conta"}</PrimaryButton>
          </div>
        )}
      </Screen>
    </>
  );
}

/* ============================================================
   Configurações + Acessibilidade
   ============================================================ */
type A11y = { fontScale: number; contraste: boolean; animacoes: boolean };
function Configuracoes({ back, a11y, setA11y, onLogout }: { back: () => void; a11y: A11y; setA11y: (a: A11y) => void; onLogout: () => void }) {
  const [notif, setNotif] = useState({ push: true, email: true, resultados: true });
  const fontes = [{ l: "A", v: 0.9, n: "Pequena" }, { l: "A", v: 1, n: "Padrão" }, { l: "A", v: 1.15, n: "Grande" }, { l: "A", v: 1.3, n: "Máx." }];
  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} className="relative h-6 w-11 flex-none rounded-full transition" style={{ background: on ? GREEN : "#cbd5e1" }}><span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: on ? "22px" : "2px" }} /></button>
  );
  return (
    <>
      <TopBar title="Configurações" subtitle="Preferências e acessibilidade" onBack={back} accent={BLUE} />
      <Screen>
        <SectionHeader title="Acessibilidade" />
        <div className="card p-4">
          <p className="text-[13px] font-semibold" style={{ color: INK }}>Tamanho da fonte</p>
          <p className="mb-3 text-[11.5px]" style={{ color: INK_SOFT }}>Ajuste para uma leitura mais confortável.</p>
          <div className="flex gap-2">
            {fontes.map((f, i) => {
              const on = a11y.fontScale === f.v;
              return (
                <button key={i} onClick={() => setA11y({ ...a11y, fontScale: f.v })} className="flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-2.5 transition" style={{ borderColor: on ? BLUE : "#e2e8f0", background: on ? BLUE + "10" : "#fff", color: on ? BLUE : INK_SOFT }}>
                  <span className="font-extrabold" style={{ fontSize: 12 + i * 3 }}>{f.l}</span>
                  <span className="text-[9.5px] font-semibold">{f.n}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-3 card divide-y divide-[color:var(--color-line)]">
          <div className="flex items-center gap-3 px-4 py-3"><div className="flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>Alto contraste</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Realça textos e cores</p></div><Toggle on={a11y.contraste} onClick={() => setA11y({ ...a11y, contraste: !a11y.contraste })} /></div>
          <div className="flex items-center gap-3 px-4 py-3"><div className="flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>Reduzir animações</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Menos movimento na tela</p></div><Toggle on={!a11y.animacoes} onClick={() => setA11y({ ...a11y, animacoes: !a11y.animacoes })} /></div>
        </div>

        <SectionHeader title="Notificações" />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {[{ k: "push", t: "Notificações no aparelho" }, { k: "email", t: "Resumo por e-mail" }, { k: "resultados", t: "Novas notas e frequência" }].map((o) => {
            const on = (notif as any)[o.k];
            return <div key={o.k} className="flex items-center gap-3 px-4 py-3"><p className="flex-1 text-[13px] font-semibold" style={{ color: INK }}>{o.t}</p><Toggle on={on} onClick={() => setNotif({ ...notif, [o.k]: !on })} /></div>;
          })}
        </div>

        <SectionHeader title="Conta" />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {["Editar dados cadastrais", "Alterar senha", "Idioma · Português (Brasil)", "Política de Privacidade (LGPD)"].map((t) => (
            <button key={t} className="flex w-full items-center justify-between px-4 py-3 text-left active:bg-[color:var(--color-surface)] transition"><span className="text-[13px] font-medium" style={{ color: INK }}>{t}</span><IconChevron size={18} style={{ color: "#cbd5e1" }} /></button>
          ))}
        </div>

        <p className="mt-4 text-center text-[11px]" style={{ color: "#94a3b8" }}>SE Educa · versão 1.0.0 (protótipo)</p>
        <button onClick={onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold" style={{ background: RED + "12", color: RED }}><IconLogout size={18} />Sair da conta</button>
      </Screen>
    </>
  );
}

/* ============================================================
   Professor — Lançamento de Notas
   ============================================================ */
function ProfNotas({ back }: { back: () => void }) {
  const [turma, setTurma] = useState("9º ano B");
  const [uni, setUni] = useState(2);
  const [notas, setNotas] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<"idle" | "salvando" | "salvo">("idle");
  const salvar = () => { setEstado("salvando"); setTimeout(() => setEstado("salvo"), 1000); };
  return (
    <>
      <TopBar title="Lançar notas" subtitle="Matemática" onBack={back} accent={BLUE} />
      <Screen>
        <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
          {["9º ano B", "8º ano A", "7º ano C"].map((t) => (
            <button key={t} onClick={() => setTurma(t)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={turma === t ? { background: BLUE, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{t}</button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">{[1, 2, 3, 4].map((u) => <button key={u} onClick={() => setUni(u)} className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition" style={uni === u ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{u}ª Uni.</button>)}</div>
        {estado === "salvo" && <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}><IconCheck size={16} />Notas salvas com sucesso!</div>}
        <SectionHeader title={`Alunos · ${turma}`} />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {ALUNOS_TURMA.map((a, i) => (
            <div key={a} className="flex items-center gap-3 px-3.5 py-2.5">
              <span className="w-5 text-[11px] font-bold" style={{ color: "#94a3b8" }}>{i + 1}</span>
              <Avatar name={a} color={BLUE} size={32} />
              <span className="flex-1 truncate text-[13px] font-medium" style={{ color: INK }}>{a}</span>
              <input value={notas[a] ?? ""} onChange={(e) => setNotas({ ...notas, [a]: e.target.value })} inputMode="decimal" placeholder="0,0" className="w-16 rounded-xl border border-[color:var(--color-line)] px-2 py-2 text-center text-[14px] font-bold outline-none focus:border-[color:var(--color-brand-blue)]" style={{ color: INK }} />
            </div>
          ))}
        </div>
        <div className="mt-4"><PrimaryButton onClick={salvar} loading={estado === "salvando"}>{estado === "salvando" ? "Salvando..." : "Salvar notas"}</PrimaryButton></div>
      </Screen>
    </>
  );
}

/* ============================================================
   Professor — Registro de Frequência
   ============================================================ */
function ProfFrequencia({ back }: { back: () => void }) {
  const [turma, setTurma] = useState("9º ano B");
  const [pres, setPres] = useState<Record<string, boolean>>(() => Object.fromEntries(ALUNOS_TURMA.map((a) => [a, true])));
  const [estado, setEstado] = useState<"idle" | "salvando" | "salvo">("idle");
  const presentes = Object.values(pres).filter(Boolean).length;
  const faltas = ALUNOS_TURMA.length - presentes;
  const salvar = () => { setEstado("salvando"); setTimeout(() => setEstado("salvo"), 1000); };
  return (
    <>
      <TopBar title="Frequência" subtitle="Registro de chamada · Hoje, 17/09" onBack={back} accent={GREEN} />
      <Screen>
        <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
          {["9º ano B", "8º ano A", "7º ano C"].map((t) => (
            <button key={t} onClick={() => setTurma(t)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={turma === t ? { background: GREEN, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{t}</button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="card p-3 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Presentes</p><p className="text-[22px] font-extrabold" style={{ color: GREEN }}>{presentes}</p></div>
          <div className="card p-3 text-center"><p className="text-[11px]" style={{ color: INK_SOFT }}>Faltas</p><p className="text-[22px] font-extrabold" style={{ color: RED }}>{faltas}</p></div>
        </div>
        {estado === "salvo" && <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold" style={{ background: GREEN + "14", color: GREEN }}><IconCheck size={16} />Chamada registrada!</div>}
        <SectionHeader title={`Alunos · ${turma}`} />
        <div className="card divide-y divide-[color:var(--color-line)]">
          {ALUNOS_TURMA.map((a) => {
            const on = pres[a];
            return (
              <div key={a} className="flex items-center gap-3 px-3.5 py-2.5">
                <Avatar name={a} color={on ? GREEN : RED} size={32} />
                <span className="flex-1 truncate text-[13px] font-medium" style={{ color: INK }}>{a}</span>
                <button onClick={() => setPres({ ...pres, [a]: true })} className="rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition" style={on ? { background: GREEN, color: "#fff" } : { background: "#f4f7fb", color: INK_SOFT }}>P</button>
                <button onClick={() => setPres({ ...pres, [a]: false })} className="rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition" style={!on ? { background: RED, color: "#fff" } : { background: "#f4f7fb", color: INK_SOFT }}>F</button>
              </div>
            );
          })}
        </div>
        <div className="mt-4"><PrimaryButton onClick={salvar} color={GREEN} loading={estado === "salvando"}>{estado === "salvando" ? "Salvando..." : "Salvar chamada"}</PrimaryButton></div>
      </Screen>
    </>
  );
}

/* ============================================================
   Professor — Diário de Classe
   ============================================================ */
function ProfDiario({ back }: { back: () => void }) {
  const [conteudo, setConteudo] = useState("");
  const [entradas, setEntradas] = useState([
    { data: "16/09", turma: "9º ano B", txt: "Equações do 2º grau: fórmula de Bhaskara e exercícios." },
    { data: "13/09", turma: "9º ano B", txt: "Introdução a equações quadráticas; resolução por fatoração." },
    { data: "11/09", turma: "9º ano B", txt: "Revisão de expressões algébricas e correção da lista." },
  ]);
  const registrar = () => { if (!conteudo.trim()) return; setEntradas([{ data: "17/09", turma: "9º ano B", txt: conteudo }, ...entradas]); setConteudo(""); };
  return (
    <>
      <TopBar title="Diário de classe" subtitle="9º ano B · Matemática" onBack={back} accent={VIOLET} />
      <Screen>
        <div className="card p-4">
          <p className="mb-2 text-[13px] font-semibold" style={{ color: INK }}>Registrar aula de hoje</p>
          <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows={3} placeholder="Conteúdo lecionado, observações..." className="w-full resize-none rounded-xl border border-[color:var(--color-line)] p-3 text-[13px] outline-none focus:border-[color:var(--color-brand-blue)]" style={{ color: INK }} />
          <div className="mt-2"><PrimaryButton onClick={registrar} color={VIOLET}>Registrar no diário</PrimaryButton></div>
        </div>
        <SectionHeader title="Registros anteriores" />
        <div className="space-y-2.5">
          {entradas.map((e, i) => (
            <div key={i} className="card flex gap-3 p-3.5">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl text-center" style={{ background: VIOLET + "14", color: VIOLET }}><span className="text-[12px] font-extrabold leading-tight">{e.data}</span></div>
              <div className="flex-1"><p className="text-[13px] leading-snug" style={{ color: INK }}>{e.txt}</p><p className="mt-1 text-[11px]" style={{ color: INK_SOFT }}>{e.turma}</p></div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   Professor — Planejamento de Aulas
   ============================================================ */
function ProfPlanejamento({ back }: { back: () => void }) {
  const planos = [
    { tema: "Equações do 2º grau", turma: "9º ano B", periodo: "2ª unidade", status: "Em andamento", cor: BLUE },
    { tema: "Funções e gráficos", turma: "8º ano A", periodo: "2ª unidade", status: "Planejado", cor: AMBER },
    { tema: "Números racionais", turma: "7º ano C", periodo: "2ª unidade", status: "Concluído", cor: GREEN },
    { tema: "Geometria plana", turma: "9º ano B", periodo: "3ª unidade", status: "Planejado", cor: AMBER },
  ];
  return (
    <>
      <TopBar title="Planejamento" subtitle="Planos de aula" onBack={back} accent={TEAL} right={<button className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: TEAL }}><IconPlus size={18} /></button>} />
      <Screen>
        <div className="space-y-2.5">
          {planos.map((p) => (
            <div key={p.tema} className="card p-4">
              <div className="flex items-center justify-between"><Pill color={BLUE}>{p.turma}</Pill><Pill color={p.cor}>{p.status}</Pill></div>
              <p className="mt-2 text-[14px] font-bold" style={{ color: INK }}>{p.tema}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11.5px]" style={{ color: INK_SOFT }}><IconBook size={13} />{p.periodo}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-[13.5px] font-semibold" style={{ borderColor: TEAL + "55", color: TEAL }}><IconPlus size={18} />Novo plano de aula</button>
      </Screen>
    </>
  );
}

/* ============================================================
   Dados de gestão (Administração e Secretaria)
   ============================================================ */
const TURMAS_ADM = [
  { nome: "9º ano A", turno: "Matutino", alunos: 32, cap: 35, sala: "12", regente: "Prof. Carlos Menezes" },
  { nome: "9º ano B", turno: "Matutino", alunos: 34, cap: 35, sala: "09", regente: "Profª. Sandra Alves" },
  { nome: "8º ano A", turno: "Vespertino", alunos: 29, cap: 35, sala: "05", regente: "Prof. Jonas Reis" },
  { nome: "7º ano C", turno: "Vespertino", alunos: 31, cap: 32, sala: "03", regente: "Profª. Lúcia Prado" },
  { nome: "6º ano A", turno: "Matutino", alunos: 28, cap: 30, sala: "01", regente: "Prof. André Lima" },
];
const CURSOS = [
  { nome: "Ensino Fund. — Anos Iniciais", turmas: 10, alunos: 312, cor: BLUE },
  { nome: "Ensino Fund. — Anos Finais", turmas: 14, alunos: 530, cor: TEAL },
  { nome: "Educação de Jovens e Adultos", turmas: 4, alunos: 120, cor: VIOLET },
];
const PROFESSORES = [
  { nome: "Carlos Menezes", disc: "Matemática", turmas: 5, carga: 40, status: "Ativo", cor: GREEN },
  { nome: "Sandra Alves", disc: "Português", turmas: 4, carga: 40, status: "Ativo", cor: GREEN },
  { nome: "Jonas Reis", disc: "Ciências", turmas: 3, carga: 30, status: "Ativo", cor: GREEN },
  { nome: "Lúcia Prado", disc: "História", turmas: 4, carga: 36, status: "Ativo", cor: GREEN },
  { nome: "André Lima", disc: "Geografia", turmas: 3, carga: 24, status: "Licença", cor: AMBER },
  { nome: "Marina Costa", disc: "Inglês", turmas: 6, carga: 40, status: "Ativo", cor: GREEN },
];
const MATRICULAS_ADM = [
  { nome: "Ana Beatriz Nunes", turma: "9º ano B", status: "Confirmada", cor: GREEN },
  { nome: "Bruno Carvalho Lima", turma: "9º ano B", status: "Confirmada", cor: GREEN },
  { nome: "Carla Dias Santos", turma: "8º ano A", status: "Em análise", cor: AMBER },
  { nome: "Diego Farias Melo", turma: "—", status: "Pendente", cor: RED },
  { nome: "Eduarda Gomes Rocha", turma: "7º ano C", status: "Confirmada", cor: GREEN },
  { nome: "Felipe Andrade Souza", turma: "—", status: "Em análise", cor: AMBER },
];
const DIARIO_SUP = [
  { prof: "Carlos Menezes", turma: "9º ano B", diario: "Em dia", notas: "Em dia", freq: "Em dia", cor: GREEN },
  { prof: "Sandra Alves", turma: "9º ano A", diario: "Pendente", notas: "Em dia", freq: "Em dia", cor: AMBER },
  { prof: "Jonas Reis", turma: "8º ano A", diario: "Atrasado", notas: "Pendente", freq: "Pendente", cor: RED },
  { prof: "Lúcia Prado", turma: "7º ano C", diario: "Em dia", notas: "Em dia", freq: "Pendente", cor: AMBER },
];
const BOLETINS_ADM = [
  { turma: "9º ano A", status: "Publicado", pct: 100, cor: GREEN },
  { turma: "9º ano B", status: "Em fechamento", pct: 78, cor: AMBER },
  { turma: "8º ano A", status: "Aberto", pct: 35, cor: BLUE },
  { turma: "7º ano C", status: "Aberto", pct: 12, cor: BLUE },
];

/* ============================================================
   Administração — Gestão de Matrículas
   ============================================================ */
function AdmMatriculas({ back }: { back: () => void }) {
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState("Todas");
  const list = MATRICULAS_ADM.filter((m) => m.nome.toLowerCase().includes(q.toLowerCase()) && (filtro === "Todas" || m.status === filtro));
  return (
    <>
      <TopBar title="Matrículas" subtitle="E.M.E.F. Poeta João Ribeiro" onBack={back} accent={GREEN} right={<button className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: GREEN }}><IconPlus size={18} /></button>} />
      <Screen>
        <div className="grid grid-cols-3 gap-2.5">
          {[{ n: "842", l: "Confirmadas", c: GREEN }, { n: "36", l: "Em análise", c: AMBER }, { n: "8", l: "Pendentes", c: RED }].map((k) => (
            <div key={k.l} className="card p-3 text-center"><div className="text-[19px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[10px]" style={{ color: INK_SOFT }}>{k.l}</div></div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar aluno" className="flex-1 bg-transparent text-[13.5px] outline-none" />
        </div>
        <div className="scroll-area mt-3 flex gap-2 overflow-x-auto pb-1">
          {["Todas", "Confirmada", "Em análise", "Pendente"].map((f) => (
            <button key={f} onClick={() => setFiltro(f)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={filtro === f ? { background: GREEN, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{f}</button>
          ))}
        </div>
        {list.length === 0 ? <EmptyState title="Nenhum aluno" text="Ajuste a busca ou os filtros." icon={<IconSearch size={26} />} /> : (
          <div className="mt-3 card divide-y divide-[color:var(--color-line)]">
            {list.map((m) => (
              <div key={m.nome} className="flex items-center gap-3 px-3.5 py-3">
                <Avatar name={m.nome} color={m.cor} size={36} />
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{m.nome}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{m.turma}</p></div>
                <Pill color={m.cor}>{m.status}</Pill>
              </div>
            ))}
          </div>
        )}
      </Screen>
    </>
  );
}

/* ============================================================
   Administração — Turmas e Cursos
   ============================================================ */
function AdmTurmas({ back }: { back: () => void }) {
  const [aba, setAba] = useState<"turmas" | "cursos">("turmas");
  const [turmas, setTurmas] = useState(TURMAS_ADM);
  const [form, setForm] = useState<null | { serie: string; letra: string; turno: string; sala: string; regente: string; cap: string }>(null);
  const [erro, setErro] = useState("");
  const [toast, setToast] = useState("");
  const abrir = () => { setErro(""); setForm({ serie: "6º ano", letra: "B", turno: "Matutino", sala: "", regente: "Prof. " + PROFESSORES[0].nome, cap: "35" }); };
  const salvar = () => {
    if (!form) return;
    const nome = `${form.serie} ${form.letra}`;
    if (!form.sala.trim()) return setErro("Informe a sala da turma.");
    if (turmas.some((t) => t.nome === nome && t.turno === form.turno)) return setErro(`Já existe ${nome} no turno ${form.turno.toLowerCase()}.`);
    setTurmas([{ nome, turno: form.turno, alunos: 0, cap: +form.cap || 35, sala: form.sala.padStart(2, "0"), regente: form.regente }, ...turmas]);
    setForm(null); setAba("turmas"); setToast(`${nome} cadastrada com sucesso`); setTimeout(() => setToast(""), 2500);
  };
  const sel = "w-full rounded-xl border bg-white px-3 py-2.5 text-[13px]";
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TopBar title="Turmas e cursos" subtitle={`${turmas.length} turmas cadastradas`} onBack={back} accent={TEAL} right={<button onClick={abrir} aria-label="Adicionar turma" className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: TEAL }}><IconPlus size={18} /></button>} />
      <div className="px-5">
        <div className="flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {(["turmas", "cursos"] as const).map((a) => (
            <button key={a} onClick={() => setAba(a)} className="flex-1 rounded-xl py-2 text-[12.5px] font-semibold capitalize transition" style={aba === a ? { background: TEAL, color: "#fff" } : { color: INK_SOFT }}>{a}</button>
          ))}
        </div>
      </div>
      <Screen className="pt-3">
        {toast && <div className="mb-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} />{toast}</div>}
        {aba === "turmas" ? (
          <div className="space-y-2.5">
            <button onClick={abrir} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3 text-[13px] font-semibold" style={{ borderColor: TEAL + "66", color: TEAL }}><IconPlus size={17} />Adicionar turma</button>
            {turmas.map((t) => {
              const lot = Math.round((t.alunos / t.cap) * 100);
              return (
                <div key={t.nome} className="card p-3.5">
                  <div className="flex items-center justify-between"><p className="text-[14px] font-bold" style={{ color: INK }}>{t.nome}</p><Pill color={TEAL}>{t.turno}</Pill></div>
                  <p className="mt-1 text-[11.5px]" style={{ color: INK_SOFT }}>Sala {t.sala} · Regente: {t.regente}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${lot}%`, background: lot >= 95 ? AMBER : GREEN }} /></div>
                    <span className="text-[11.5px] font-bold" style={{ color: INK }}>{t.alunos}/{t.cap}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2.5">
            {CURSOS.map((c) => (
              <div key={c.nome} className="card flex items-center gap-3 p-3.5">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: c.cor + "16", color: c.cor }}><IconBook size={22} /></div>
                <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{c.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{c.turmas} turmas · {c.alunos} alunos</p></div>
                <IconChevron size={18} style={{ color: "#cbd5e1" }} />
              </div>
            ))}
          </div>
        )}
      </Screen>
      {form && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end" style={{ background: "rgba(15,33,53,.42)" }} onClick={() => setForm(null)}>
          <div className="animate-in rounded-t-[26px] bg-white px-5 pb-6 pt-3" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <div className="mb-3 flex items-center justify-between"><h2 className="text-[17px] font-bold" style={{ color: INK }}>Adicionar turma</h2><button onClick={() => setForm(null)} aria-label="Fechar" style={{ color: INK_SOFT }}><IconX size={20} /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_88px] gap-2">
                <Field label="Série"><select className={sel} style={{ borderColor: "#e2e8f0", color: INK }} value={form.serie} onChange={(e) => setForm({ ...form, serie: e.target.value })}>{["1º ano", "2º ano", "3º ano", "4º ano", "5º ano", "6º ano", "7º ano", "8º ano", "9º ano", "EJA I", "EJA II"].map((o) => <option key={o}>{o}</option>)}</select></Field>
                <Field label="Turma"><select className={sel} style={{ borderColor: "#e2e8f0", color: INK }} value={form.letra} onChange={(e) => setForm({ ...form, letra: e.target.value })}>{["A", "B", "C", "D"].map((o) => <option key={o}>{o}</option>)}</select></Field>
              </div>
              <Field label="Turno">
                <div className="flex gap-1.5 rounded-2xl p-1" style={{ background: "#eef2f7" }}>
                  {["Matutino", "Vespertino", "Noturno"].map((t) => <button key={t} onClick={() => setForm({ ...form, turno: t })} className="flex-1 rounded-xl py-2 text-[12px] font-semibold" style={form.turno === t ? { background: "#fff", color: TEAL, boxShadow: "0 1px 3px rgba(0,0,0,.08)" } : { color: INK_SOFT }}>{t}</button>)}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Sala"><input inputMode="numeric" placeholder="Ex.: 14" className={sel} style={{ borderColor: erro && !form.sala ? RED : "#e2e8f0", color: INK }} value={form.sala} onChange={(e) => setForm({ ...form, sala: e.target.value })} /></Field>
                <Field label="Capacidade"><input inputMode="numeric" className={sel} style={{ borderColor: "#e2e8f0", color: INK }} value={form.cap} onChange={(e) => setForm({ ...form, cap: e.target.value })} /></Field>
              </div>
              <Field label="Professor regente"><select className={sel} style={{ borderColor: "#e2e8f0", color: INK }} value={form.regente} onChange={(e) => setForm({ ...form, regente: e.target.value })}>{PROFESSORES.map((p) => <option key={p.nome} value={"Prof. " + p.nome}>{p.nome} · {p.disc}</option>)}</select></Field>
              {erro && <p className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: RED }}><IconAlert size={14} />{erro}</p>}
              <PrimaryButton color={TEAL} onClick={salvar}>Cadastrar turma</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Administração — Tabela de Professores
   ============================================================ */
function AdmProfessores({ back }: { back: () => void }) {
  const [q, setQ] = useState("");
  const list = PROFESSORES.filter((p) => p.nome.toLowerCase().includes(q.toLowerCase()) || p.disc.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <TopBar title="Professores" subtitle="Quadro docente · 48 no total" onBack={back} accent={TEAL} right={<button className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: TEAL }}><IconPlus size={18} /></button>} />
      <Screen>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
          <IconSearch size={18} style={{ color: INK_SOFT }} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou disciplina" className="flex-1 bg-transparent text-[13.5px] outline-none" />
        </div>
        <div className="mt-3 space-y-2.5">
          {list.map((p) => (
            <div key={p.nome} className="card flex items-center gap-3 p-3.5">
              <Avatar name={p.nome} color={TEAL} size={40} />
              <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{p.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{p.disc} · {p.turmas} turmas · {p.carga}h/sem</p></div>
              <Pill color={p.cor}>{p.status}</Pill>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   Administração — Gestão de Horários
   ============================================================ */
function AdmHorarios({ back }: { back: () => void }) {
  const [turma, setTurma] = useState("9º ano B");
  const horas = ["07:00", "07:50", "08:40"];
  return (
    <>
      <TopBar title="Gestão de horários" subtitle="Grade por turma" onBack={back} accent={TEAL} />
      <Screen>
        <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
          {TURMAS_ADM.map((t) => (
            <button key={t.nome} onClick={() => setTurma(t.nome)} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={turma === t.nome ? { background: TEAL, color: "#fff" } : { background: "#fff", color: INK_SOFT }}>{t.nome}</button>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3 text-[12px]" style={{ background: GREEN + "10", color: INK }}>
          <IconCheck size={16} className="mt-0.5 flex-none" style={{ color: GREEN }} />Sem conflitos de horário nesta turma.
        </div>
        <div className="scroll-area mt-3 overflow-x-auto">
          <div className="card min-w-[520px] overflow-hidden">
            <div className="grid grid-cols-[56px_repeat(5,1fr)] bg-[color:var(--color-surface)] text-[10px] font-bold uppercase" style={{ color: INK_SOFT }}>
              <span className="px-2 py-2.5">Hora</span>
              {DIAS.map((d) => <span key={d} className="px-2 py-2.5 text-center">{d}</span>)}
            </div>
            {horas.map((h, ri) => (
              <div key={h} className="grid grid-cols-[56px_repeat(5,1fr)] border-t border-[color:var(--color-line)]">
                <span className="px-2 py-2.5 text-[11px] font-bold" style={{ color: INK }}>{h}</span>
                {DIAS.map((d) => {
                  const aula = HORARIOS[d][ri];
                  return <div key={d} className="border-l border-[color:var(--color-line)] px-1.5 py-2 text-center"><span className="inline-block rounded-md px-1.5 py-1 text-[9.5px] font-semibold leading-tight" style={{ background: aula.cor + "18", color: aula.cor }}>{aula.m}</span></div>;
                })}
              </div>
            ))}
          </div>
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-[13.5px] font-semibold" style={{ borderColor: TEAL + "55", color: TEAL }}><IconEdit size={18} />Editar grade</button>
      </Screen>
    </>
  );
}

/* ============================================================
   Administração — Supervisão do Diário
   ============================================================ */
function AdmDiario({ back }: { back: () => void }) {
  const st = (v: string) => (v === "Em dia" ? GREEN : v === "Pendente" ? AMBER : RED);
  return (
    <>
      <TopBar title="Supervisão do diário" subtitle="Lançamentos dos professores" onBack={back} accent={VIOLET} />
      <Screen>
        <div className="grid grid-cols-3 gap-2.5">
          {[{ n: "2", l: "Em dia", c: GREEN }, { n: "1", l: "Pendentes", c: AMBER }, { n: "1", l: "Atrasados", c: RED }].map((k) => (
            <div key={k.l} className="card p-3 text-center"><div className="text-[19px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[10px]" style={{ color: INK_SOFT }}>{k.l}</div></div>
          ))}
        </div>
        <div className="mt-3 space-y-2.5">
          {DIARIO_SUP.map((d) => (
            <div key={d.prof} className="card p-3.5">
              <div className="flex items-center gap-3">
                <Avatar name={d.prof} color={VIOLET} size={36} />
                <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{d.prof}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{d.turma}</p></div>
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {[["Diário", d.diario], ["Notas", d.notas], ["Frequência", d.freq]].map(([l, v]) => (
                  <div key={l} className="rounded-xl px-2 py-1.5 text-center" style={{ background: st(v) + "14" }}>
                    <div className="text-[9.5px] font-medium" style={{ color: INK_SOFT }}>{l}</div>
                    <div className="text-[10.5px] font-bold" style={{ color: st(v) }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   Administração — Lançamento de Boletins
   ============================================================ */
function AdmBoletins({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Boletins" subtitle="Fechamento da 2ª unidade" onBack={back} accent={AMBER} />
      <Screen>
        <div className="space-y-2.5">
          {BOLETINS_ADM.map((b) => (
            <div key={b.turma} className="card p-4">
              <div className="flex items-center justify-between"><p className="text-[14px] font-bold" style={{ color: INK }}>{b.turma}</p><Pill color={b.cor}>{b.status}</Pill></div>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.cor }} /></div>
                <span className="text-[11.5px] font-bold" style={{ color: b.cor }}>{b.pct}%</span>
              </div>
              <p className="mt-1.5 text-[11px]" style={{ color: INK_SOFT }}>{b.pct === 100 ? "Todas as notas lançadas" : "Notas lançadas"}</p>
              {b.status !== "Publicado" && <button className="mt-2.5 w-full rounded-xl py-2.5 text-[12.5px] font-semibold text-white" style={{ background: b.cor }}>{b.status === "Em fechamento" ? "Publicar boletim" : "Fechar unidade"}</button>}
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   Dados — Secretaria de Educação
   ============================================================ */
const REDE_MATR = [
  { reg: "Aracaju", conf: "18.420", vagas: 640, fila: 210 },
  { reg: "N. Sra. do Socorro", conf: "9.210", vagas: 180, fila: 95 },
  { reg: "Lagarto", conf: "7.650", vagas: 220, fila: 40 },
  { reg: "Itabaiana", conf: "6.120", vagas: 150, fila: 28 },
];
const FILA_ENT = [
  { nome: "Miguel Santos Rocha", serie: "6º ano", escola: "E.M. João Ribeiro", sugestao: "6º ano A" },
  { nome: "Laura Fontes Dias", serie: "1ª série", escola: "E.M. Tobias Barreto", sugestao: "1ª série B" },
  { nome: "Davi Oliveira Melo", serie: "8º ano", escola: "E.M. José Conrado", sugestao: "8º ano A" },
  { nome: "Sofia Andrade Reis", serie: "7º ano", escola: "E.M. Manoel Bomfim", sugestao: "7º ano C" },
];
const IDEB_ESCOLAS = [
  { esc: "E.M. Tobias Barreto", ideb: "6,2", meta: "6,0", cor: GREEN },
  { esc: "E.M. João Ribeiro", ideb: "5,9", meta: "6,0", cor: AMBER },
  { esc: "E.M. José Conrado", ideb: "5,1", meta: "5,8", cor: RED },
];
const CONTRATACOES = [
  { cargo: "Professor de Matemática", vagas: 6, status: "Edital aberto", cor: GREEN },
  { cargo: "Professor de Inglês", vagas: 3, status: "Em análise", cor: AMBER },
  { cargo: "Coordenador Pedagógico", vagas: 2, status: "Concluído", cor: BLUE },
];
const CARGA_HOR = [
  { esc: "E.M. João Ribeiro", contratada: 1840, cumprida: 1790, cor: GREEN },
  { esc: "E.M. Tobias Barreto", contratada: 1520, cumprida: 1610, cor: AMBER },
  { esc: "E.M. José Conrado", contratada: 1280, cumprida: 1120, cor: RED },
];
const OFICIOS = [
  { num: "OF. 2025/214", assunto: "Solicitação de merenda adicional", status: "Respondido", cor: GREEN, data: "12/09" },
  { num: "OF. 2025/219", assunto: "Repasse de material didático", status: "Em análise", cor: AMBER, data: "15/09" },
  { num: "OF. 2025/223", assunto: "Reforma da quadra — E.M. Atalaia", status: "Enviado", cor: BLUE, data: "16/09" },
];

/* Secretaria — Matrículas da rede */
function SecMatriculas({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Matrículas da rede" subtitle="Rede municipal · 2025" onBack={back} accent={AMBER} />
      <Screen>
        <div className="grid grid-cols-2 gap-3">
          {[{ n: "48.320", l: "Confirmadas", c: GREEN }, { n: "1.284", l: "Vagas abertas", c: BLUE }, { n: "373", l: "Em fila de espera", c: AMBER }, { n: "127", l: "Escolas", c: TEAL }].map((k) => (
            <div key={k.l} className="card p-4"><div className="text-[22px] font-extrabold" style={{ color: k.c }}>{k.n}</div><div className="text-[12px]" style={{ color: INK_SOFT }}>{k.l}</div></div>
          ))}
        </div>
        <SectionHeader title="Por município" />
        <div className="space-y-2.5">
          {REDE_MATR.map((r) => (
            <div key={r.reg} className="card p-3.5">
              <div className="flex items-center justify-between"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{r.reg}</p><span className="text-[12px] font-semibold" style={{ color: GREEN }}>{r.conf}</span></div>
              <div className="mt-1.5 flex items-center gap-3 text-[11.5px]" style={{ color: INK_SOFT }}>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: BLUE }} />{r.vagas} vagas</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: AMBER }} />{r.fila} na fila</span>
              </div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* Secretaria — Enturmação */
function SecEnturmacao({ back }: { back: () => void }) {
  const [feitos, setFeitos] = useState<Record<string, boolean>>({});
  return (
    <>
      <TopBar title="Enturmação" subtitle="Alunos aguardando turma" onBack={back} accent={BLUE} />
      <Screen>
        <div className="flex items-start gap-2 rounded-2xl p-3.5 text-[12.5px]" style={{ background: BLUE + "0d", color: INK }}>
          <IconUsers size={18} className="mt-0.5 flex-none" style={{ color: BLUE }} />{FILA_ENT.filter((f) => !feitos[f.nome]).length} alunos na fila de enturmação. Confirme a turma sugerida ou ajuste.
        </div>
        <div className="mt-3 space-y-2.5">
          {FILA_ENT.map((f) => {
            const ok = feitos[f.nome];
            return (
              <div key={f.nome} className="card p-3.5">
                <div className="flex items-center gap-3">
                  <Avatar name={f.nome} color={ok ? GREEN : BLUE} size={38} />
                  <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{f.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{f.serie} · {f.escola}</p></div>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 rounded-xl px-3 py-2 text-[12px]" style={{ background: "#f4f7fb", color: INK }}>Sugestão: <b>{f.sugestao}</b></div>
                  {ok ? <Pill color={GREEN}>Enturmado</Pill> : <button onClick={() => setFeitos({ ...feitos, [f.nome]: true })} className="rounded-xl px-3.5 py-2 text-[12px] font-semibold text-white" style={{ background: BLUE }}>Enturmar</button>}
                </div>
              </div>
            );
          })}
        </div>
      </Screen>
    </>
  );
}

/* Secretaria — Gestão Pedagógica (acompanhamento + contratações) */
function SecPedagogico({ back }: { back: () => void }) {
  const [aba, setAba] = useState<"acomp" | "contrat">("acomp");
  return (
    <>
      <TopBar title="Gestão pedagógica" subtitle="Acompanhamento e contratações" onBack={back} accent={GREEN} />
      <div className="px-5">
        <div className="flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          <button onClick={() => setAba("acomp")} className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition" style={aba === "acomp" ? { background: GREEN, color: "#fff" } : { color: INK_SOFT }}>Acompanhamento</button>
          <button onClick={() => setAba("contrat")} className="flex-1 rounded-xl py-2 text-[12px] font-semibold transition" style={aba === "contrat" ? { background: GREEN, color: "#fff" } : { color: INK_SOFT }}>Contratações</button>
        </div>
      </div>
      <Screen className="pt-3">
        {aba === "acomp" ? (
          <>
            <div className="card flex items-center justify-between p-4">
              <div><p className="text-[12px]" style={{ color: INK_SOFT }}>IDEB médio da rede</p><p className="text-[26px] font-extrabold" style={{ color: GREEN }}>5,8</p></div>
              <Ring value={97} size={64} color={GREEN} label="da meta" />
            </div>
            <SectionHeader title="IDEB por escola" />
            <div className="space-y-2.5">
              {IDEB_ESCOLAS.map((e) => (
                <div key={e.esc} className="card flex items-center gap-3 p-3.5">
                  <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-[15px] font-extrabold" style={{ background: e.cor + "16", color: e.cor }}>{e.ideb}</div>
                  <div className="flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{e.esc}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>Meta: {e.meta}</p></div>
                  <Pill color={e.cor}>{e.cor === GREEN ? "Atingiu" : e.cor === AMBER ? "Próximo" : "Abaixo"}</Pill>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-2.5">
            {CONTRATACOES.map((c) => (
              <div key={c.cargo} className="card p-3.5">
                <div className="flex items-center justify-between"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{c.cargo}</p><Pill color={c.cor}>{c.status}</Pill></div>
                <p className="mt-1 flex items-center gap-1 text-[11.5px]" style={{ color: INK_SOFT }}><IconUsers size={13} />{c.vagas} vagas de contratação</p>
              </div>
            ))}
            <button className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-[13.5px] font-semibold" style={{ borderColor: GREEN + "55", color: GREEN }}><IconPlus size={18} />Abrir novo edital</button>
          </div>
        )}
      </Screen>
    </>
  );
}

/* Secretaria — Controle de Carga Horária */
function SecCargaHoraria({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Carga horária" subtitle="Contratada × cumprida" onBack={back} accent={TEAL} />
      <Screen>
        <div className="space-y-2.5">
          {CARGA_HOR.map((c) => {
            const pct = Math.round((c.cumprida / c.contratada) * 100);
            const label = pct > 100 ? "Excedente" : pct >= 95 ? "Regular" : "Déficit";
            return (
              <div key={c.esc} className="card p-4">
                <div className="flex items-center justify-between"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{c.esc}</p><Pill color={c.cor}>{label}</Pill></div>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: c.cor }} /></div>
                  <span className="text-[11.5px] font-bold" style={{ color: c.cor }}>{pct}%</span>
                </div>
                <p className="mt-1.5 text-[11.5px]" style={{ color: INK_SOFT }}>{c.cumprida}h cumpridas de {c.contratada}h contratadas</p>
              </div>
            );
          })}
        </div>
      </Screen>
    </>
  );
}

/* Secretaria — Contato com o Regional */
function SecRegional({ back }: { back: () => void }) {
  return (
    <>
      <TopBar title="Contato com o Regional" subtitle="Diretoria Regional de Educação" onBack={back} accent={INDIGO} right={<button className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm" style={{ background: INDIGO }}><IconPlus size={18} /></button>} />
      <Screen>
        <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${INDIGO}, ${shade(INDIGO)})` }}>
          <p className="text-[13px] font-semibold">Canal oficial com o órgão superior</p>
          <p className="mt-1 text-[12px] text-white/85">Envie ofícios e acompanhe as respostas da Diretoria Regional.</p>
        </div>
        <SectionHeader title="Ofícios e solicitações" />
        <div className="space-y-2.5">
          {OFICIOS.map((o) => (
            <div key={o.num} className="card p-3.5">
              <div className="flex items-center justify-between"><span className="text-[12px] font-bold" style={{ color: INDIGO }}>{o.num}</span><span className="text-[11px]" style={{ color: INK_SOFT }}>{o.data}</span></div>
              <p className="mt-1 text-[13.5px] font-semibold" style={{ color: INK }}>{o.assunto}</p>
              <div className="mt-2"><Pill color={o.cor}>{o.status}</Pill></div>
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   Mapas — base estilo "Google Maps" (SVG próprio, Aracaju fictícia)
   ============================================================ */

type MapPin = { id: string; x: number; y: number; cor?: string; label?: string };

function rotaUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function MapCanvas({ pins, selected, onSelect, route, stops, bus, height = 300, children }: { pins: MapPin[]; selected?: string; onSelect?: (id: string) => void; route?: string; stops?: { x: number; y: number; on?: boolean }[]; bus?: { x: number; y: number }; height?: number; children?: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height, background: "#eef0e6" }}>
      <svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* oceano e Rio Sergipe */}
        <path d="M330 0h70v360h-110c20-60 10-120 30-180S320 40 330 0Z" fill="#aadaff" />
        <path d="M0 40c60 10 110-5 160 10s90 20 175-5l-5 25c-80 25-120 15-170 5S50 70 0 66Z" fill="#aadaff" />
        {/* parques */}
        <rect x="40" y="150" width="70" height="50" rx="10" fill="#c8e6c0" />
        <path d="M200 250c30-10 60 0 70 25s-30 40-60 30-40-45-10-55Z" fill="#c8e6c0" />
        <rect x="250" y="95" width="40" height="34" rx="8" fill="#d7ecd0" />
        {/* quadras */}
        <g stroke="#ffffff" strokeWidth="7" fill="none" strokeLinecap="round">
          {[100, 140, 190, 230, 280, 320].map((y) => <path key={y} d={`M0 ${y} L320 ${y - 8}`} />)}
          {[30, 80, 130, 180, 230, 275].map((x) => <path key={x} d={`M${x} 70 L${x + 12} 360`} />)}
        </g>
        {/* avenidas */}
        <path d="M0 210 C90 200 180 180 300 140" stroke="#f9d977" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M0 210 C90 200 180 180 300 140" stroke="#fde9a8" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M160 70 C150 160 170 260 150 360" stroke="#f9d977" strokeWidth="10" fill="none" />
        <path d="M160 70 C150 160 170 260 150 360" stroke="#fde9a8" strokeWidth="6" fill="none" />
        <path d="M305 40 C290 140 300 240 285 360" stroke="#ffffff" strokeWidth="9" fill="none" />
        <g fontSize="8" fill="#7b8794" fontFamily="Inter" fontWeight="600">
          <text x="20" y="200" transform="rotate(-6 20 200)">Av. Hermes Fontes</text>
          <text x="166" y="300" transform="rotate(-82 166 300)">Av. Beira Mar</text>
          <text x="200" y="35" fill="#4f86c6" fontStyle="italic">Rio Sergipe</text>
          <text x="345" y="200" fill="#4f86c6" fontStyle="italic" transform="rotate(90 345 200)">Oceano Atlântico</text>
          <text x="52" y="180" fill="#5f8f55">Parque da Sementeira</text>
        </g>
        {route && (<><path d={route} stroke="#ffffff" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={route} stroke={BLUE} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>)}
        {stops?.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r="5" fill="#fff" stroke={s.on ? GREEN : BLUE} strokeWidth="3" />)}
        {bus && (
          <g transform={`translate(${bus.x} ${bus.y})`}>
            <circle r="16" fill={GREEN} opacity=".18"><animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" /></circle>
            <circle r="10" fill={GREEN} stroke="#fff" strokeWidth="2.5" />
            <rect x="-4.5" y="-5" width="9" height="8" rx="1.5" fill="#fff" /><rect x="-3" y="-3.5" width="6" height="2.5" fill={GREEN} />
          </g>
        )}
        {/* você está aqui */}
        <circle cx="120" cy="245" r="14" fill={BLUE} opacity=".15" />
        <circle cx="120" cy="245" r="6" fill={BLUE} stroke="#fff" strokeWidth="2.5" />
        {pins.map((p) => {
          const on = selected === p.id;
          const s = on ? 1.35 : 1;
          return (
            <g key={p.id} transform={`translate(${p.x} ${p.y}) scale(${s})`} onClick={() => onSelect?.(p.id)} style={{ cursor: "pointer", transition: "transform .2s" }}>
              <ellipse cx="0" cy="1" rx="5" ry="2" fill="#000" opacity=".18" />
              <path d="M0 0C-3-6-10-10-10-17a10 10 0 0 1 20 0c0 7-7 11-10 17Z" fill={p.cor ?? "#ea4335"} stroke="#a52714" strokeWidth=".8" />
              <circle cx="0" cy="-17" r="3.6" fill={on ? "#fff" : "#7c1a10"} />
              {on && p.label && (
                <g transform="translate(0 -36) scale(0.74)">
                  <rect x={-p.label.length * 3.1 - 8} y="-11" width={p.label.length * 6.2 + 16} height="18" rx="9" fill="#fff" stroke="#e2e8f0" />
                  <text textAnchor="middle" y="2" fontSize="10" fontWeight="700" fill={INK} fontFamily="Inter">{p.label}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 right-3 flex flex-col gap-2">
        <button className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-md" style={{ color: INK_SOFT }} aria-label="Camadas"><IconLayers size={18} /></button>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-md" style={{ color: BLUE }} aria-label="Minha localização"><IconTarget size={18} /></button>
      </div>
      {children}
    </div>
  );
}

function MapSearch({ placeholder, onBack }: { placeholder: string; onBack: () => void }) {
  return (
    <div className="absolute left-3 right-3 top-3 flex items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-lg">
      <button onClick={onBack} className="grid h-8 w-8 place-items-center rounded-full" style={{ color: INK }} aria-label="Voltar"><IconBack size={19} /></button>
      <span className="flex-1 truncate text-[13px]" style={{ color: "#94a3b8" }}>{placeholder}</span>
      <IconSearch size={18} style={{ color: INK_SOFT }} />
      <Avatar name="Ana Nunes" size={28} />
    </div>
  );
}

function Chips<T extends string>({ items, value, onChange, cor = BLUE, multi }: { items: { id: T; label: string }[]; value: T[]; onChange: (v: T[]) => void; cor?: string; multi?: boolean }) {
  return (
    <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
      {items.map((it) => {
        const on = value.includes(it.id);
        return (
          <button key={it.id} onClick={() => onChange(multi ? (on ? value.filter((v) => v !== it.id) : [...value, it.id]) : [it.id])} className="flex-none rounded-full border px-3 py-1.5 text-[11.5px] font-semibold shadow-sm transition" style={on ? { background: cor, color: "#fff", borderColor: cor } : { background: "#fff", color: INK, borderColor: "#e2e8f0" }}>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function RouteButton({ lat, lng, label = "Traçar rota" }: { lat: number; lng: number; label?: string }) {
  return (
    <a href={rotaUrl(lat, lng)} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-bold text-white shadow-sm active:scale-[0.98] transition" style={{ background: BLUE }}>
      <IconRoute size={17} />{label}
    </a>
  );
}

/* ============================================================
   Locais de estudo (aluno/responsável)
   ============================================================ */
type LocalTipo = "biblioteca" | "coworking" | "cultural" | "praca";
const LOCAIS: { id: string; nome: string; tipo: LocalTipo; end: string; dist: string; min: string; horario: string; aberto: boolean; wifi: boolean; nota: number; x: number; y: number; lat: number; lng: number }[] = [
  { id: "l1", nome: "Biblioteca Pública Epifânio Dória", tipo: "biblioteca", end: "R. Vila Cristina, 1051 · São José", dist: "1,2 km", min: "6 min de carro · 15 min a pé", horario: "08:00 – 18:00", aberto: true, wifi: true, nota: 4.7, x: 195, y: 150, lat: -10.9195, lng: -37.0567 },
  { id: "l2", nome: "Biblioteca Municipal Clodomir Silva", tipo: "biblioteca", end: "Praça Fausto Cardoso · Centro", dist: "2,4 km", min: "9 min de carro", horario: "08:00 – 17:00", aberto: true, wifi: true, nota: 4.5, x: 250, y: 85, lat: -10.9111, lng: -37.0490 },
  { id: "l3", nome: "Coworking Jovem Conectado", tipo: "coworking", end: "Av. Hermes Fontes, 1200 · Luzia", dist: "0,8 km", min: "4 min de carro · 10 min a pé", horario: "07:00 – 22:00", aberto: true, wifi: true, nota: 4.8, x: 90, y: 215, lat: -10.9380, lng: -37.0620 },
  { id: "l4", nome: "Espaço Estudar SE — Hub Atalaia", tipo: "coworking", end: "Av. Santos Dumont · Atalaia", dist: "4,1 km", min: "12 min de carro", horario: "09:00 – 21:00", aberto: false, wifi: true, nota: 4.4, x: 290, y: 270, lat: -10.9850, lng: -37.0460 },
  { id: "l5", nome: "Centro Cultural de Aracaju", tipo: "cultural", end: "Praça Gal. Valadão · Centro", dist: "2,9 km", min: "10 min de carro", horario: "09:00 – 18:00", aberto: true, wifi: false, nota: 4.6, x: 215, y: 105, lat: -10.9118, lng: -37.0505 },
  { id: "l6", nome: "Parque da Sementeira — Área de leitura", tipo: "praca", end: "Av. Beira Mar · Jardins", dist: "1,9 km", min: "7 min de carro", horario: "05:00 – 22:00", aberto: true, wifi: true, nota: 4.3, x: 75, y: 168, lat: -10.9470, lng: -37.0560 },
];
const TIPO_LABEL: Record<LocalTipo, string> = { biblioteca: "Biblioteca pública", coworking: "Coworking estudantil", cultural: "Centro cultural", praca: "Espaço ao ar livre" };

function MapaEstudos({ back }: { back: () => void }) {
  const [filtro, setFiltro] = useState<("todos" | LocalTipo)[]>(["todos"]);
  const [sel, setSel] = useState("l1");
  const lista = LOCAIS.filter((l) => filtro[0] === "todos" || l.tipo === filtro[0]);
  const local = LOCAIS.find((l) => l.id === sel) ?? LOCAIS[0];
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MapCanvas pins={lista.map((l) => ({ id: l.id, x: l.x, y: l.y, label: l.nome.split(" ").slice(0, 2).join(" ") }))} selected={sel} onSelect={setSel} height={330}>
        <MapSearch placeholder="Buscar locais de estudo" onBack={back} />
        <div className="absolute left-3 right-3 top-[60px]">
          <Chips items={[{ id: "todos", label: "Todos" }, { id: "biblioteca", label: "Bibliotecas" }, { id: "coworking", label: "Coworkings" }, { id: "cultural", label: "Cultural" }, { id: "praca", label: "Ao ar livre" }]} value={filtro} onChange={setFiltro} />
        </div>
      </MapCanvas>
      <div className="scroll-area animate-in -mt-5 flex-1 overflow-y-auto rounded-t-[26px] bg-[#f6f8fb] px-5 pb-6 pt-2 shadow-[0_-8px_24px_rgba(15,33,53,.08)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RED }}>{TIPO_LABEL[local.tipo]}</p>
          <h2 className="mt-0.5 text-[17px] font-bold leading-snug" style={{ color: INK }}>{local.nome}</h2>
          <div className="mt-1 flex items-center gap-1.5 text-[12px]" style={{ color: INK_SOFT }}>
            <span className="font-bold" style={{ color: INK }}>{local.nota.toLocaleString("pt-BR")}</span><IconStar size={13} style={{ color: AMBER }} /><span>·</span><span>{local.dist}</span><span>·</span>
            <span className="font-semibold" style={{ color: local.aberto ? GREEN : RED }}>{local.aberto ? "Aberto agora" : "Fechado"}</span>
          </div>
          <div className="mt-3 space-y-1.5 text-[12.5px]" style={{ color: INK }}>
            <p className="flex items-center gap-2"><IconPin size={15} style={{ color: INK_SOFT }} />{local.end}</p>
            <p className="flex items-center gap-2"><IconClock size={15} style={{ color: INK_SOFT }} />{local.horario} · seg a sáb</p>
            <p className="flex items-center gap-2"><IconRoute size={15} style={{ color: INK_SOFT }} />{local.min}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">{local.wifi && <Pill color={TEAL}>Wi-Fi gratuito</Pill>}<Pill color={VIOLET}>Silencioso</Pill><Pill color={GREEN}>Acessível</Pill></div>
          <div className="mt-4 flex gap-2">
            <RouteButton lat={local.lat} lng={local.lng} />
            <button className="rounded-full border px-4 text-[13px] font-semibold" style={{ borderColor: "#cbd5e1", color: BLUE }}>Salvar</button>
          </div>
        </div>
        <SectionHeader title={`${lista.length} locais próximos`} />
        <div className="space-y-2">
          {lista.map((l) => (
            <button key={l.id} onClick={() => setSel(l.id)} className="card flex w-full items-center gap-3 p-3 text-left transition" style={l.id === sel ? { outline: `2px solid ${RED}40` } : undefined}>
              <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: RED + "14", color: RED }}><IconPin size={20} /></div>
              <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{l.nome}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{l.dist} · {l.horario}</p></div>
              <span className="text-[11px] font-semibold" style={{ color: l.aberto ? GREEN : RED }}>{l.aberto ? "Aberto" : "Fechado"}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Transporte Escolar (aluno/responsável)
   ============================================================ */
const PARADAS = [
  { nome: "Terminal Zona Sul", h: "06:10", x: 30, y: 300, passou: true },
  { nome: "R. Bahia × Av. Hermes Fontes", h: "06:18", x: 70, y: 214, passou: true },
  { nome: "Praça do Bairro Luzia", h: "06:24", x: 120, y: 205, passou: true },
  { nome: "Av. Beira Mar · Jardins", h: "06:31", x: 160, y: 190, passou: false },
  { nome: "Mercado Thales Ferraz", h: "06:38", x: 200, y: 165, passou: false },
  { nome: "E.M.E.F. Poeta João Ribeiro", h: "06:45", x: 245, y: 125, passou: false },
];
const ROTA_BUS = "M30 300 L40 260 L70 214 L120 205 L160 190 L200 165 L245 125";

function Transporte({ back }: { back: () => void }) {
  const [linha, setLinha] = useState<("L014" | "L022")[]>(["L014"]);
  const rastreio = linha[0] === "L014";
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MapCanvas pins={[{ id: "esc", x: 245, y: 125, label: "Sua escola" }]} selected="esc" route={ROTA_BUS} stops={PARADAS.slice(0, -1).map((p) => ({ x: p.x, y: p.y, on: p.passou }))} bus={rastreio ? { x: 140, y: 198 } : undefined} height={310}>
        <MapSearch placeholder="Transporte escolar · Linha" onBack={back} />
        <div className="absolute left-3 right-3 top-[60px]">
          <Chips items={[{ id: "L014", label: "L-014 · Zona Sul ↔ Escola" }, { id: "L022", label: "L-022 · Santa Maria" }]} value={linha} onChange={setLinha} cor={GREEN} />
        </div>
      </MapCanvas>
      <div className="scroll-area animate-in -mt-5 flex-1 overflow-y-auto rounded-t-[26px] bg-[#f6f8fb] px-5 pb-6 pt-2 shadow-[0_-8px_24px_rgba(15,33,53,.08)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
        {rastreio ? (
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: GREEN }}><IconBus size={24} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 animate-pulse rounded-full" style={{ background: GREEN }} /><span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: GREEN }}>Ao vivo</span></div>
                <p className="text-[15px] font-bold" style={{ color: INK }}>Ônibus chega em 7 min</p>
                <p className="text-[11.5px]" style={{ color: INK_SOFT }}>Próxima parada: Av. Beira Mar · Jardins</p>
              </div>
              <div className="text-right"><p className="text-[22px] font-extrabold leading-none" style={{ color: GREEN }}>06:31</p><p className="text-[10px]" style={{ color: INK_SOFT }}>previsão</p></div>
            </div>
            <div className="grid grid-cols-3 border-t text-center text-[11px]" style={{ borderColor: "#eef2f7", color: INK_SOFT }}>
              <div className="py-2.5"><p className="text-[13px] font-bold" style={{ color: INK }}>QPA-4E21</p>Placa</div>
              <div className="border-x py-2.5" style={{ borderColor: "#eef2f7" }}><p className="text-[13px] font-bold" style={{ color: INK }}>Seu José</p>Motorista</div>
              <div className="py-2.5"><p className="text-[13px] font-bold" style={{ color: INK }}>28/40</p>Lotação</div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl p-3.5" style={{ background: AMBER + "14" }}>
            <IconAlert size={18} className="mt-0.5 flex-none" style={{ color: AMBER }} />
            <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>Esta linha ainda <b>não possui rastreamento</b> em tempo real. Confira abaixo os horários programados.</p>
          </div>
        )}
        <SectionHeader title={rastreio ? "Pontos de parada" : "Horários da linha"} />
        {rastreio ? (
          <div className="card p-4">
            {PARADAS.map((p, i) => (
              <div key={p.nome} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-3 w-3 rounded-full border-[3px]" style={{ borderColor: p.passou ? GREEN : BLUE, background: i === PARADAS.length - 1 ? BLUE : "#fff" }} />
                  {i < PARADAS.length - 1 && <span className="w-0.5 flex-1" style={{ background: p.passou ? GREEN : "#dbe3ee", minHeight: 26 }} />}
                </div>
                <div className="flex flex-1 justify-between pb-3">
                  <p className="text-[12.5px]" style={{ color: p.passou ? INK_SOFT : INK, fontWeight: i === 3 ? 700 : 500 }}>{p.nome}</p>
                  <span className="text-[12px] font-semibold" style={{ color: p.passou ? "#94a3b8" : INK }}>{p.h}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card divide-y" style={{ borderColor: "#eef2f7" }}>
            {[{ t: "Ida · manhã", h: ["05:50", "06:20", "06:50"] }, { t: "Volta · meio-dia", h: ["11:40", "12:10"] }, { t: "Ida · tarde", h: ["12:20", "12:50"] }, { t: "Volta · fim da tarde", h: ["17:30", "18:00"] }].map((r) => (
              <div key={r.t} className="flex items-center justify-between p-3.5">
                <p className="text-[12.5px] font-semibold" style={{ color: INK }}>{r.t}</p>
                <div className="flex gap-1.5">{r.h.map((h) => <span key={h} className="rounded-lg px-2 py-1 text-[11.5px] font-bold" style={{ background: GREEN + "14", color: GREEN }}>{h}</span>)}</div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-2"><RouteButton lat={-10.9112} lng={-37.0510} label="Rota até a parada" /></div>
      </div>
    </div>
  );
}

/* ============================================================
   Merenda Escolar
   ============================================================ */
const CARDAPIO: Record<string, { almoco: string[]; lanche: string[] }> = {
  SEG: { almoco: ["Arroz branco", "Feijão carioca", "Carne de panela", "Macaxeira cozida", "Salada de tomate"], lanche: ["Suco de caju", "Biscoito de polvilho", "Banana"] },
  TER: { almoco: ["Cuscuz de milho", "Galinha guisada", "Feijão de corda", "Vinagrete"], lanche: ["Iogurte natural", "Pão com manteiga"] },
  QUA: { almoco: ["Arroz com cenoura", "Feijão preto", "Peixe ao molho", "Abóbora refogada"], lanche: ["Suco de acerola", "Bolo de macaxeira"] },
  QUI: { almoco: ["Baião de dois", "Carne de sol desfiada", "Macaxeira frita no forno", "Salada verde"], lanche: ["Mamão", "Biscoito integral", "Suco de goiaba"] },
  SEX: { almoco: ["Arroz branco", "Feijão carioca", "Frango assado", "Purê de inhame"], lanche: ["Pão de queijo", "Iogurte de morango", "Laranja"] },
};
function Merenda({ back }: { back: () => void }) {
  const [dia, setDia] = useState("SEG");
  const c = CARDAPIO[dia];
  const Bloco = ({ titulo, h, itens, cor }: { titulo: string; h: string; itens: string[]; cor: string }) => (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 p-4" style={{ background: cor + "10" }}>
        <div className="grid h-11 w-11 place-items-center rounded-2xl text-white" style={{ background: cor }}><IconFood size={21} /></div>
        <div className="flex-1"><p className="text-[15px] font-bold" style={{ color: INK }}>{titulo}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{h}</p></div>
      </div>
      <ul className="divide-y px-4" style={{ borderColor: "#eef2f7" }}>
        {itens.map((i) => <li key={i} className="flex items-center gap-2.5 py-2.5 text-[13px]" style={{ color: INK }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: cor }} />{i}</li>)}
      </ul>
    </div>
  );
  return (
    <>
      <TopBar title="Merenda escolar" subtitle={`Cardápio · ${ALUNO.escola}`} onBack={back} accent={GREEN} />
      <Screen>
        <div className="grid grid-cols-5 gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {DIAS.map((d, i) => (
            <button key={d} onClick={() => setDia(d)} className="rounded-xl py-2 text-center transition" style={dia === d ? { background: GREEN, color: "#fff" } : { color: INK_SOFT }}>
              <p className="text-[10px] font-bold">{d}</p><p className="text-[15px] font-extrabold">{8 + i}</p>
            </button>
          ))}
        </div>
        {dia === "SEG" && <div className="mt-3 flex items-center gap-2 text-[12px] font-semibold" style={{ color: GREEN }}><span className="h-2 w-2 rounded-full" style={{ background: GREEN }} />Cardápio de hoje</div>}
        <div className="mt-3 space-y-3">
          <Bloco titulo="Lanche da manhã" h="09:20 · Pátio" itens={c.lanche} cor={AMBER} />
          <Bloco titulo="Almoço" h="11:30 · Refeitório" itens={c.almoco} cor={GREEN} />
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: BLUE + "0e" }}>
          <IconShield size={18} className="mt-0.5 flex-none" style={{ color: BLUE }} />
          <p className="text-[12px] leading-relaxed" style={{ color: INK }}>Cardápio elaborado por nutricionista da rede (PNAE). Alunos com restrição alimentar recebem refeição adaptada — informe na secretaria.</p>
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   Mapa de Escolas (todos os perfis; matrículas só para gestores)
   ============================================================ */
type FiltroEsc = "especializado" | "surdos" | "autismo" | "acessibilidade" | "eja";
const INFRA_LABEL = { quadra: "Quadra", informatica: "Sala de informática", biblioteca: "Biblioteca", refeitorio: "Refeitório", acessivel: "Acessibilidade", internet: "Internet", ar: "Ar-condicionado" } as const;
type Infra = keyof typeof INFRA_LABEL;
type VagaEt = { etapa: string; turno: "Matutino" | "Vespertino" | "Noturno" | "Integral"; n: number };
type EscolaRede = { id: string; nome: string; bairro: string; cidade: string; dist: string; alunos: number; servidores: number; vagasDet: VagaEt[]; infra: Infra[]; filtros: FiltroEsc[]; x: number; y: number; lat: number; lng: number };
const ESCOLAS_MAPA: EscolaRede[] = [
  { id: "e1", nome: "E.M.E.F. Poeta João Ribeiro", bairro: "Centro", cidade: "Aracaju", dist: "1,1 km", alunos: 842, servidores: 64, vagasDet: [{ etapa: "Anos iniciais", turno: "Matutino", n: 18 }, { etapa: "Anos finais", turno: "Vespertino", n: 26 }, { etapa: "EJA", turno: "Noturno", n: 14 }], infra: ["quadra", "informatica", "biblioteca", "refeitorio", "acessivel", "internet"], filtros: ["especializado", "acessibilidade", "autismo", "eja"], x: 245, y: 125, lat: -10.912, lng: -37.051 },
  { id: "e2", nome: "E.M. Profª Laudelina Gonçalves", bairro: "Luzia", cidade: "Aracaju", dist: "0,9 km", alunos: 615, servidores: 41, vagasDet: [{ etapa: "Educação infantil", turno: "Matutino", n: 8 }, { etapa: "EJA", turno: "Noturno", n: 14 }], infra: ["quadra", "refeitorio", "internet", "ar"], filtros: ["eja"], x: 95, y: 228, lat: -10.938, lng: -37.063 },
  { id: "e3", nome: "Centro de Ensino Bilíngue para Surdos", bairro: "São José", cidade: "Aracaju", dist: "1,6 km", alunos: 210, servidores: 38, vagasDet: [{ etapa: "Anos iniciais", turno: "Integral", n: 5 }, { etapa: "Anos finais", turno: "Vespertino", n: 4 }], infra: ["informatica", "biblioteca", "refeitorio", "acessivel", "internet", "ar"], filtros: ["especializado", "surdos", "acessibilidade"], x: 185, y: 160, lat: -10.92, lng: -37.057 },
  { id: "e4", nome: "E.M.E.F. Santa Maria", bairro: "Santa Maria", cidade: "Aracaju", dist: "6,3 km", alunos: 1104, servidores: 72, vagasDet: [{ etapa: "Anos finais", turno: "Matutino", n: 0 }, { etapa: "EJA", turno: "Noturno", n: 3 }], infra: ["quadra", "refeitorio"], filtros: ["eja"], x: 40, y: 310, lat: -10.98, lng: -37.08 },
  { id: "e5", nome: "Escola Inclusiva Jardins", bairro: "Jardins", cidade: "Aracaju", dist: "2,0 km", alunos: 480, servidores: 45, vagasDet: [{ etapa: "Educação infantil", turno: "Integral", n: 9 }, { etapa: "Anos iniciais", turno: "Matutino", n: 12 }, { etapa: "Anos finais", turno: "Vespertino", n: 10 }], infra: ["quadra", "informatica", "biblioteca", "refeitorio", "acessivel", "internet", "ar"], filtros: ["especializado", "autismo", "acessibilidade", "surdos"], x: 135, y: 180, lat: -10.945, lng: -37.055 },
  { id: "e6", nome: "E.M. Atalaia Nova", bairro: "Atalaia", cidade: "Aracaju", dist: "4,5 km", alunos: 530, servidores: 36, vagasDet: [{ etapa: "Anos iniciais", turno: "Vespertino", n: 6 }, { etapa: "EJA", turno: "Noturno", n: 8 }], infra: ["quadra", "biblioteca", "refeitorio", "internet"], filtros: ["acessibilidade", "eja"], x: 280, y: 255, lat: -10.985, lng: -37.047 },
  { id: "e7", nome: "E.M.E.F. Tobias Barreto", bairro: "Siqueira Campos", cidade: "Aracaju", dist: "2,7 km", alunos: 728, servidores: 52, vagasDet: [{ etapa: "Anos iniciais", turno: "Matutino", n: 0 }, { etapa: "Anos finais", turno: "Vespertino", n: 0 }], infra: ["quadra", "biblioteca", "refeitorio", "internet"], filtros: [], x: 70, y: 140, lat: -10.925, lng: -37.072 },
  { id: "e8", nome: "E.M. Prof. José Conrado de Araújo", bairro: "Farolândia", cidade: "Aracaju", dist: "3,5 km", alunos: 905, servidores: 61, vagasDet: [{ etapa: "Anos finais", turno: "Integral", n: 12 }, { etapa: "EJA", turno: "Noturno", n: 20 }], infra: ["quadra", "informatica", "refeitorio", "acessivel", "internet", "ar"], filtros: ["especializado", "acessibilidade", "eja", "autismo"], x: 210, y: 220, lat: -10.966, lng: -37.058 },
  { id: "e9", nome: "E.M.E.F. Manoel Bomfim", bairro: "Jardim Rosa Elze", cidade: "São Cristóvão", dist: "11,8 km", alunos: 670, servidores: 44, vagasDet: [{ etapa: "Anos iniciais", turno: "Vespertino", n: 15 }], infra: ["quadra", "refeitorio", "acessivel"], filtros: ["acessibilidade"], x: 20, y: 260, lat: -10.925, lng: -37.104 },
  { id: "e10", nome: "E.M. Maria do Carmo Alves", bairro: "Conjunto Marcos Freire", cidade: "N. Sra. do Socorro", dist: "9,4 km", alunos: 1012, servidores: 70, vagasDet: [{ etapa: "Educação infantil", turno: "Matutino", n: 10 }, { etapa: "EJA", turno: "Noturno", n: 16 }], infra: ["quadra", "informatica", "refeitorio", "internet"], filtros: ["eja", "surdos", "especializado"], x: 60, y: 45, lat: -10.853, lng: -37.12 },
];
const vagasTot = (e: EscolaRede) => e.vagasDet.reduce((s, v) => s + v.n, 0);
const FILTRO_ITENS: { id: FiltroEsc; label: string }[] = [{ id: "especializado", label: "Atendimento especializado" }, { id: "surdos", label: "Alunos surdos" }, { id: "autismo", label: "Autismo" }, { id: "acessibilidade", label: "Acessibilidade" }, { id: "eja", label: "EJA" }];
const FILTRO_TAG: Record<FiltroEsc, string> = { especializado: "AEE", surdos: "Libras", autismo: "TEA", acessibilidade: "Acessível", eja: "EJA" };
type EscCtx = "todas" | "vagas" | "alunos" | "servidores";
const CTX_INFO: Record<EscCtx, { t: string; s: string }> = {
  todas: { t: "Escolas da rede", s: "Lista completa · Aracaju e região" },
  vagas: { t: "Escolas com vagas", s: "Vagas abertas por etapa e turno" },
  alunos: { t: "Alunos por escola", s: "Matrículas ativas na rede" },
  servidores: { t: "Servidores por escola", s: "Quadro de pessoal da rede" },
};

function EscolaDetalhe({ esc, gestor, onBack }: { esc: EscolaRede; gestor: boolean; onBack: () => void }) {
  const tot = vagasTot(esc);
  return (
    <>
      <TopBar title={esc.nome} subtitle={`${esc.bairro} · ${esc.cidade}`} onBack={onBack} accent={GREEN} />
      <Screen>
        <div className="card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: GREEN }}>Escola municipal · {esc.dist}</p>
          <p className="mt-1 flex items-center gap-1 text-[12px]" style={{ color: INK_SOFT }}><IconPin size={13} />{esc.bairro}, {esc.cidade} - SE</p>
          <div className={`mt-3 grid gap-2 ${gestor ? "grid-cols-3" : "grid-cols-1"}`}>
            {gestor && <div className="rounded-2xl p-3" style={{ background: BLUE + "0e" }}><p className="text-[18px] font-extrabold" style={{ color: BLUE }}>{esc.alunos.toLocaleString("pt-BR")}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>Alunos matriculados</p></div>}
            {gestor && <div className="rounded-2xl p-3" style={{ background: TEAL + "0e" }}><p className="text-[18px] font-extrabold" style={{ color: TEAL }}>{esc.servidores}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>Servidores</p></div>}
            <div className="rounded-2xl p-3" style={{ background: (tot ? GREEN : RED) + "12" }}><p className="text-[18px] font-extrabold" style={{ color: tot ? GREEN : RED }}>{tot}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>Vagas disponíveis</p></div>
          </div>
          {!gestor && <p className="mt-2 flex items-center gap-1.5 text-[10.5px]" style={{ color: INK_SOFT }}><IconShield size={12} />Número de matriculados visível apenas para a gestão.</p>}
          {esc.filtros.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{esc.filtros.map((f) => <Pill key={f} color={VIOLET}>{FILTRO_TAG[f]}</Pill>)}</div>}
        </div>

        <SectionHeader title="Vagas por etapa e turno" />
        <div className="card divide-y" style={{ borderColor: "#eef2f7" }}>
          {esc.vagasDet.map((v) => (
            <div key={v.etapa + v.turno} className="flex items-center gap-3 px-4 py-3" style={{ borderColor: "#eef2f7" }}>
              <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold" style={{ color: INK }}>{v.etapa}</p><p className="text-[11px]" style={{ color: INK_SOFT }}>{v.turno}</p></div>
              {v.n > 0 ? <Pill color={v.n < 6 ? AMBER : GREEN}>{v.n} vagas</Pill> : <Pill color={RED}>Sem vagas</Pill>}
            </div>
          ))}
        </div>

        <SectionHeader title="Infraestrutura" />
        <div className="card grid grid-cols-2 gap-2.5 p-4">
          {(Object.keys(INFRA_LABEL) as Infra[]).map((k) => {
            const tem = esc.infra.includes(k);
            return (
              <div key={k} className="flex items-center gap-2 text-[12px]" style={{ color: tem ? INK : "#94a3b8" }}>
                <span className="grid h-5 w-5 flex-none place-items-center rounded-full" style={{ background: tem ? GREEN + "18" : RED + "12", color: tem ? GREEN : RED }} aria-label={tem ? "Sim" : "Não"}>{tem ? <IconCheck size={12} strokeWidth={2.6} /> : <IconX size={11} strokeWidth={2.4} />}</span>
                {INFRA_LABEL[k]}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex"><RouteButton lat={esc.lat} lng={esc.lng} /></div>
      </Screen>
    </>
  );
}

function Escolas({ back, perfil, ctx = "todas", modoInicial = "lista" }: { back: () => void; perfil: Perfil; ctx?: EscCtx; modoInicial?: "lista" | "mapa" }) {
  const gestor = perfil === "escola" || perfil === "secretaria";
  const contexto: EscCtx = !gestor && (ctx === "alunos" || ctx === "servidores") ? "todas" : ctx;
  const [modo, setModo] = useState(modoInicial);
  const [q, setQ] = useState("");
  const [filtros, setFiltros] = useState<FiltroEsc[]>([]);
  const [soVagas, setSoVagas] = useState(contexto === "vagas");
  const [detalhe, setDetalhe] = useState<string | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  let lista = ESCOLAS_MAPA.filter((e) => (e.nome + e.bairro + e.cidade).toLowerCase().includes(q.toLowerCase()) && filtros.every((f) => e.filtros.includes(f)) && (!soVagas || vagasTot(e) > 0));
  if (contexto === "alunos") lista = [...lista].sort((a, b) => b.alunos - a.alunos);
  if (contexto === "servidores") lista = [...lista].sort((a, b) => b.servidores - a.servidores);
  if (contexto === "vagas") lista = [...lista].sort((a, b) => vagasTot(b) - vagasTot(a));
  const ativos = filtros.length + (soVagas ? 1 : 0) + (q ? 1 : 0);
  const limpar = () => { setFiltros([]); setSoVagas(false); setQ(""); };
  const det = ESCOLAS_MAPA.find((e) => e.id === detalhe);
  if (det) return <EscolaDetalhe esc={det} gestor={gestor} onBack={() => setDetalhe(null)} />;
  const escMapa = lista.find((e) => e.id === sel) ?? lista[0];
  const metrica = (e: EscolaRede) => contexto === "alunos" ? `${e.alunos.toLocaleString("pt-BR")} alunos` : contexto === "servidores" ? `${e.servidores} servidores` : null;

  return (
    <>
      <TopBar title={CTX_INFO[contexto].t} subtitle={CTX_INFO[contexto].s} onBack={back} accent={GREEN} />
      <div className="px-5 pt-1">
        <div className="grid grid-cols-2 rounded-2xl bg-white p-1 shadow-sm" role="tablist">
          {(["lista", "mapa"] as const).map((m) => (
            <button key={m} role="tab" aria-selected={modo === m} onClick={() => setModo(m)} className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-bold transition" style={modo === m ? { background: GREEN, color: "#fff" } : { color: INK_SOFT }}>
              {m === "lista" ? <IconLayers size={15} /> : <IconPin size={15} />}{m === "lista" ? "Lista" : "Mapa"}
            </button>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-sm">
          <span style={{ color: INK_SOFT }}><IconSearch size={17} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por escola, bairro ou cidade" className="flex-1 bg-transparent text-[13px] outline-none" />
        </div>
        <div className="-mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5 pb-1">
          <button onClick={() => setSoVagas(!soVagas)} aria-pressed={soVagas} className="flex flex-none items-center gap-1 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition" style={soVagas ? { background: GREEN, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>{soVagas && <IconCheck size={12} strokeWidth={2.6} />}Com vagas</button>
          {FILTRO_ITENS.map((f) => { const on = filtros.includes(f.id); return (
            <button key={f.id} aria-pressed={on} onClick={() => setFiltros(on ? filtros.filter((x) => x !== f.id) : [...filtros, f.id])} className="flex flex-none items-center gap-1 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition" style={on ? { background: VIOLET, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>{on && <IconCheck size={12} strokeWidth={2.6} />}{f.label}</button>
          ); })}
        </div>
        <div className="mt-1.5 flex items-center justify-between pb-2">
          <p className="text-[12px] font-semibold" style={{ color: INK }}>{lista.length} {lista.length === 1 ? "escola encontrada" : "escolas encontradas"}</p>
          {ativos > 0 && <button onClick={limpar} className="text-[12px] font-bold" style={{ color: RED }}>Limpar filtros ({ativos})</button>}
        </div>
      </div>

      {modo === "mapa" ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <MapCanvas pins={lista.map((e) => ({ id: e.id, x: e.x, y: e.y, label: e.nome.replace(/^E\.M\.(E\.F\.)? /, "") }))} selected={escMapa?.id} onSelect={setSel} height={260} />
          <div className="scroll-area -mt-5 flex-1 overflow-y-auto rounded-t-[26px] bg-[#f6f8fb] px-5 pb-6 pt-3 shadow-[0_-8px_24px_rgba(15,33,53,.08)]">
            {!escMapa ? <EmptyState title="Nenhuma escola no mapa" text="Remova algum filtro para ver mais escolas." icon={<IconPin size={26} />} /> : (
              <div className="card p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: GREEN }}>{escMapa.bairro} · {escMapa.dist}</p>
                <p className="mt-0.5 text-[15px] font-bold leading-snug" style={{ color: INK }}>{escMapa.nome}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {vagasTot(escMapa) > 0 ? <Pill color={GREEN}>{vagasTot(escMapa)} vagas</Pill> : <Pill color={RED}>Sem vagas</Pill>}
                  {gestor && <Pill color={BLUE}>{escMapa.alunos.toLocaleString("pt-BR")} alunos</Pill>}
                  {escMapa.filtros.map((f) => <Pill key={f} color={VIOLET}>{FILTRO_TAG[f]}</Pill>)}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <RouteButton lat={escMapa.lat} lng={escMapa.lng} />
                  <button onClick={() => setDetalhe(escMapa.id)} className="ml-auto text-[12.5px] font-bold" style={{ color: BLUE }}>Ver detalhes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Screen>
          {lista.length === 0 ? <EmptyState title="Nenhuma escola encontrada" text="Nenhuma escola atende a todos os filtros. Remova algum para ampliar a busca." icon={<IconSearch size={26} />} /> : (
            <div className="space-y-3">
              {lista.map((e) => { const tot = vagasTot(e); const m = metrica(e); return (
                <button key={e.id} onClick={() => setDetalhe(e.id)} className="card w-full p-4 text-left active:scale-[0.99] transition">
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: GREEN + "16", color: GREEN }}><IconGrad size={22} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold leading-snug" style={{ color: INK }}>{e.nome}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[12px]" style={{ color: INK_SOFT }}><IconPin size={13} />{e.bairro} · {e.cidade} · {e.dist}</p>
                    </div>
                    <IconChevron size={18} style={{ color: "#cbd5e1" }} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {tot > 0 ? <Pill color={GREEN}>{tot} vagas</Pill> : <Pill color={RED}>Sem vagas</Pill>}
                    {m ? <Pill color={BLUE}>{m}</Pill> : gestor && <Pill color={BLUE}>{e.alunos.toLocaleString("pt-BR")} alunos</Pill>}
                    {e.filtros.map((f) => <Pill key={f} color={VIOLET}>{FILTRO_TAG[f]}</Pill>)}
                  </div>
                </button>
              ); })}
            </div>
          )}
        </Screen>
      )}
    </>
  );
}

/* ============================================================
   Secretaria — Pesquisas Recentes
   ============================================================ */
const PESQUISAS = [
  { id: "p1", termo: "Vagas para alunos com necessidades especiais", volume: 1284, var: 62, cor: RED, destaque: true },
  { id: "p2", termo: "Matrícula EJA noturno", volume: 742, var: 18, cor: AMBER },
  { id: "p3", termo: "Escola com tempo integral", volume: 615, var: 9, cor: BLUE },
  { id: "p4", termo: "Transporte escolar zona rural", volume: 388, var: -4, cor: TEAL },
  { id: "p5", termo: "Creche em período integral", volume: 352, var: 12, cor: VIOLET },
];
const SERIE_SEM = [310, 335, 360, 420, 505, 610, 790, 1284];

function SecPesquisas({ back }: { back: () => void }) {
  const [aberta, setAberta] = useState<string | null>(null);
  const [envio, setEnvio] = useState<"idle" | "form" | "loading" | "ok">("idle");
  const [qtd, setQtd] = useState(40);
  if (aberta) {
    const max = Math.max(...SERIE_SEM);
    return (
      <>
        <TopBar title="Necessidades especiais" subtitle="Pesquisas por vagas · últimas 8 semanas" onBack={() => { setAberta(null); setEnvio("idle"); }} accent={RED} />
        <Screen>
          <div className="card p-4">
            <div className="flex items-start justify-between">
              <div><p className="text-[12px]" style={{ color: INK_SOFT }}>Buscas nesta semana</p><p className="text-[28px] font-extrabold leading-tight" style={{ color: INK }}>1.284</p></div>
              <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold" style={{ background: RED + "14", color: RED }}><IconTrend size={14} />+62%</span>
            </div>
            <div className="mt-3 flex items-end gap-1.5" style={{ height: 110 }}>
              {SERIE_SEM.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-1 items-end"><div className="w-full rounded-t-md" style={{ height: `${(v / max) * 100}%`, background: i === SERIE_SEM.length - 1 ? RED : RED + "40" }} /></div>
                  <span className="text-[9px]" style={{ color: INK_SOFT }}>S{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <SectionHeader title="Regiões com mais buscas" />
          <div className="card space-y-3 p-4">
            {[{ r: "Zona Norte · Santa Maria", v: 412 }, { r: "Zona Sul · Atalaia", v: 318 }, { r: "Centro · São José", v: 276 }, { r: "Zona Oeste · Capucho", v: 189 }].map((r) => (
              <div key={r.r}>
                <div className="mb-1 flex justify-between text-[12px]"><span style={{ color: INK }}>{r.r}</span><span className="font-bold" style={{ color: INK }}>{r.v}</span></div>
                <div className="h-2 overflow-hidden rounded-full" style={{ background: "#eef2f7" }}><div className="h-full rounded-full" style={{ width: `${(r.v / 412) * 100}%`, background: RED }} /></div>
              </div>
            ))}
          </div>
          <SectionHeader title="Escolas mais procuradas" />
          <div className="space-y-2">
            {[{ n: "Escola Inclusiva Jardins", b: 284, v: 31 }, { n: "Centro de Ensino Bilíngue para Surdos", b: 231, v: 9 }, { n: "E.M.E.F. Poeta João Ribeiro", b: 198, v: 6 }, { n: "E.M.E.F. Santa Maria", b: 176, v: 0 }].map((e) => (
              <div key={e.n} className="card flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold" style={{ color: INK }}>{e.n}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{e.b} buscas</p></div>
                <div className="text-right"><p className="text-[16px] font-extrabold" style={{ color: e.v === 0 ? RED : e.v < 10 ? AMBER : GREEN }}>{e.v}</p><p className="text-[10px]" style={{ color: INK_SOFT }}>vagas AEE</p></div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-2xl p-3.5" style={{ background: RED + "10" }}>
            <IconAlert size={18} className="mt-0.5 flex-none" style={{ color: RED }} />
            <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>Demanda estimada de <b>~120 novas vagas</b> em atendimento especializado; apenas <b>46</b> disponíveis na rede.</p>
          </div>
          <div className="mt-4">
            {envio === "ok" ? (
              <div className="card flex items-center gap-3 p-4"><div className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ background: GREEN }}><IconCheck size={22} /></div><div><p className="text-[14px] font-bold" style={{ color: INK }}>Solicitação enviada</p><p className="text-[12px]" style={{ color: INK_SOFT }}>Protocolo SEDUC-2026-04812 · {qtd} vagas</p></div></div>
            ) : envio === "form" || envio === "loading" ? (
              <div className="card space-y-3 p-4">
                <p className="text-[14px] font-bold" style={{ color: INK }}>Solicitar criação de vagas</p>
                <Field label="Quantidade de vagas"><div className="flex items-center gap-3"><input type="range" min={10} max={120} step={5} value={qtd} onChange={(e) => setQtd(+e.target.value)} className="flex-1 accent-[#ef4444]" /><span className="w-10 text-right text-[15px] font-extrabold" style={{ color: RED }}>{qtd}</span></div></Field>
                <Field label="Região prioritária"><select className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px]" style={{ borderColor: "#e2e8f0", color: INK }}><option>Zona Norte · Santa Maria</option><option>Zona Sul · Atalaia</option><option>Centro · São José</option></select></Field>
                <Field label="Tipo de atendimento"><select className="w-full rounded-xl border bg-white px-3 py-2.5 text-[13px]" style={{ borderColor: "#e2e8f0", color: INK }}><option>Sala de recursos multifuncionais (AEE)</option><option>Intérprete de Libras</option><option>Profissional de apoio (TEA)</option></select></Field>
                <PrimaryButton color={RED} loading={envio === "loading"} onClick={() => { setEnvio("loading"); setTimeout(() => setEnvio("ok"), 1200); }}>Enviar solicitação</PrimaryButton>
              </div>
            ) : (
              <PrimaryButton color={RED} onClick={() => setEnvio("form")}>Solicitar criação de vagas</PrimaryButton>
            )}
          </div>
        </Screen>
      </>
    );
  }
  return (
    <>
      <TopBar title="Pesquisas recentes" subtitle="O que as famílias buscam no app" onBack={back} accent={AMBER} />
      <Screen>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <div className="card p-4"><p className="text-[23px] font-extrabold" style={{ color: BLUE }}>8.912</p><p className="text-[12px]" style={{ color: INK_SOFT }}>Buscas na semana</p></div>
          <div className="card p-4"><p className="text-[23px] font-extrabold" style={{ color: RED }}>+62%</p><p className="text-[12px]" style={{ color: INK_SOFT }}>Maior alta</p></div>
        </div>
        <SectionHeader title="Termos em alta" />
        <div className="space-y-2.5">
          {PESQUISAS.map((p) => (
            <button key={p.id} onClick={() => p.destaque && setAberta(p.id)} className="card w-full p-3.5 text-left active:scale-[0.99] transition" style={p.destaque ? { outline: `2px solid ${RED}33` } : undefined}>
              {p.destaque && <div className="mb-2"><Pill color={RED}>Alerta de demanda</Pill></div>}
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl" style={{ background: p.cor + "16", color: p.cor }}><IconSearch size={19} /></div>
                <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold leading-snug" style={{ color: INK }}>{p.termo}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{p.volume.toLocaleString("pt-BR")} buscas</p></div>
                <span className="text-[12.5px] font-bold" style={{ color: p.var >= 0 ? (p.var > 30 ? RED : GREEN) : INK_SOFT }}>{p.var > 0 ? "+" : ""}{p.var}%</span>
              </div>
            </button>
          ))}
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   Calendário escolar + Olimpíadas
   ============================================================ */
type EvTipo = "prova" | "trabalho" | "evento" | "olimpiada";
type EvCal = { id: string; m: number; d: number; t: string; tipo: EvTipo; c: string; sigla?: string; nome?: string; fase?: string; nivel?: string };
const OLIMPIADAS: { sigla: string; nome: string; c: string }[] = [
  { sigla: "OBMEP", nome: "Olimpíada Brasileira de Matemática das Escolas Públicas", c: BLUE },
  { sigla: "OBA", nome: "Olimpíada Brasileira de Astronomia e Astronáutica", c: INDIGO },
  { sigla: "OBF", nome: "Olimpíada Brasileira de Física", c: TEAL },
  { sigla: "OBQ", nome: "Olimpíada Brasileira de Química", c: PINK },
  { sigla: "OBB", nome: "Olimpíada Brasileira de Biologia", c: GREEN },
  { sigla: "ONHB", nome: "Olimpíada Nacional em História do Brasil", c: "#b45309" },
  { sigla: "OLP", nome: "Olimpíada de Língua Portuguesa", c: VIOLET },
];
const olimp = (s: string) => OLIMPIADAS.find((o) => o.sigla === s)!;
const EVENTOS_CAL: EvCal[] = ([
  { id: "e1", m: 8, d: 5, t: "Prova de Matemática", tipo: "prova", c: BLUE },
  { id: "e2", m: 8, d: 12, t: "Entrega do trabalho de Ciências", tipo: "trabalho", c: GREEN },
  { id: "e3", m: 8, d: 15, t: "Reunião de pais e mestres", tipo: "evento", c: AMBER },
  { id: "e4", m: 8, d: 19, t: "Prova de Português", tipo: "prova", c: BLUE },
  { id: "e5", m: 8, d: 26, t: "Feira de Ciências", tipo: "evento", c: AMBER },
  { id: "e6", m: 9, d: 3, t: "Seminário de História", tipo: "trabalho", c: GREEN },
  { id: "e7", m: 9, d: 15, t: "Dia do Professor", tipo: "evento", c: AMBER },
  { id: "e8", m: 9, d: 24, t: "Prova de Geografia", tipo: "prova", c: BLUE },
  { id: "e9", m: 10, d: 7, t: "Trabalho de Artes", tipo: "trabalho", c: GREEN },
  { id: "e10", m: 10, d: 20, t: "Consciência Negra · Mostra cultural", tipo: "evento", c: AMBER },
  { id: "o1", m: 8, d: 9, t: "ONHB · 5ª fase", tipo: "olimpiada", sigla: "ONHB", fase: "5ª fase online", nivel: "8º e 9º ano / Ensino Médio", c: "" },
  { id: "o2", m: 8, d: 17, t: "OBQ · Fase II", tipo: "olimpiada", sigla: "OBQ", fase: "Fase II · prova escrita", nivel: "Ensino Médio", c: "" },
  { id: "o3", m: 8, d: 23, t: "OBF · 2ª fase", tipo: "olimpiada", sigla: "OBF", fase: "2ª fase", nivel: "Níveis 1 a 3 (9º ano ao EM)", c: "" },
  { id: "o4", m: 9, d: 2, t: "OLP · Semifinal", tipo: "olimpiada", sigla: "OLP", fase: "Semifinal regional", nivel: "5º ano ao Ensino Médio", c: "" },
  { id: "o5", m: 9, d: 11, t: "OBMEP · 2ª fase", tipo: "olimpiada", sigla: "OBMEP", fase: "2ª fase · prova discursiva", nivel: "Nível 2 (8º e 9º ano)", c: "" },
  { id: "o6", m: 9, d: 21, t: "OBB · Inscrições 2026", tipo: "olimpiada", sigla: "OBB", fase: "Abertura de inscrições", nivel: "Ensino Médio", c: "" },
  { id: "o7", m: 10, d: 14, t: "OBA · Resultados", tipo: "olimpiada", sigla: "OBA", fase: "Divulgação de resultados e medalhas", nivel: "Níveis 1 a 4", c: "" },
] as EvCal[]).map((e) => (e.sigla ? { ...e, c: olimp(e.sigla).c, nome: olimp(e.sigla).nome } : e));
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const TIPO_CAL: Record<EvTipo, string> = { prova: "Prova", trabalho: "Trabalho", evento: "Evento", olimpiada: "Olimpíada" };

function Calendario({ back }: { back: () => void }) {
  const [mes, setMes] = useState(8);
  const [filtro, setFiltro] = useState<"todos" | EvTipo>("todos");
  const [sel, setSel] = useState<number | null>(null);
  const [card, setCard] = useState<EvCal | null>(null);
  const [lembretes, setLembretes] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const ano = 2025;
  const inicio = new Date(ano, mes, 1).getDay();
  const total = new Date(ano, mes + 1, 0).getDate();
  const doMes = EVENTOS_CAL.filter((e) => e.m === mes && (filtro === "todos" || e.tipo === filtro)).sort((a, b) => a.d - b.d);
  const lista = sel ? doMes.filter((e) => e.d === sel) : doMes;
  const proximas = EVENTOS_CAL.filter((e) => e.tipo === "olimpiada").sort((a, b) => a.m - b.m || a.d - b.d);
  const lembrar = (e: EvCal) => {
    const on = lembretes.includes(e.id);
    setLembretes(on ? lembretes.filter((x) => x !== e.id) : [...lembretes, e.id]);
    setToast(on ? "Lembrete removido" : `Vamos te lembrar da ${e.sigla} em ${e.d}/${String(e.m + 1).padStart(2, "0")}`);
    setTimeout(() => setToast(""), 2400);
  };
  const filtros: { id: "todos" | EvTipo; label: string }[] = [{ id: "todos", label: "Todos" }, { id: "prova", label: "Provas" }, { id: "trabalho", label: "Trabalhos" }, { id: "evento", label: "Eventos" }, { id: "olimpiada", label: "Olimpíadas" }];
  const abrir = (e: EvCal) => e.tipo === "olimpiada" && setCard(e);
  return (
    <>
      <TopBar title="Calendário escolar" subtitle={`${MESES[mes]} · ${ano}`} onBack={back} accent={VIOLET} />
      <Screen>
        <div className="-mx-5 mb-3 flex gap-2 overflow-x-auto px-5 pb-1">
          {filtros.map((f) => (
            <button key={f.id} onClick={() => { setFiltro(f.id); setSel(null); }} className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition" style={filtro === f.id ? { background: VIOLET, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>
              {f.id === "olimpiada" && <IconStar size={12} className="mr-1 inline" />}{f.label}
            </button>
          ))}
        </div>
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <button aria-label="Mês anterior" disabled={mes === 7} onClick={() => { setMes(mes - 1); setSel(null); }} className="grid h-8 w-8 place-items-center rounded-full disabled:opacity-30" style={{ background: "#f1f5f9", color: INK }}><IconBack size={16} /></button>
            <p className="text-[14px] font-bold" style={{ color: INK }}>{MESES[mes]} {ano}</p>
            <button aria-label="Próximo mês" disabled={mes === 10} onClick={() => { setMes(mes + 1); setSel(null); }} className="grid h-8 w-8 place-items-center rounded-full disabled:opacity-30" style={{ background: "#f1f5f9", color: INK }}><IconChevron size={16} /></button>
          </div>
          <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-bold" style={{ color: INK_SOFT }}>{["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: inicio }, (_, i) => <span key={"b" + i} />)}
            {Array.from({ length: total }, (_, i) => i + 1).map((d) => {
              const evs = doMes.filter((e) => e.d === d);
              const on = sel === d;
              return (
                <button key={d} onClick={() => { setSel(on ? null : d); if (evs.length === 1) abrir(evs[0]); }} className="relative grid aspect-square place-items-center rounded-lg text-[12px] font-semibold transition" style={on ? { background: VIOLET, color: "#fff" } : evs.length ? { background: evs[0].c + "14", color: evs[0].c } : { color: INK }}>
                  {d}
                  {evs.length > 0 && <span className="absolute bottom-1 flex gap-0.5">{evs.map((e) => <span key={e.id} className="h-1 w-1 rounded-full" style={{ background: on ? "#fff" : e.c }} />)}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {filtro === "olimpiada" ? (
          <div className="card mt-3 p-3.5">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: INK_SOFT }}>Legenda</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">{OLIMPIADAS.map((o) => <span key={o.sigla} className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: INK }}><span className="h-2.5 w-2.5 rounded-full" style={{ background: o.c }} />{o.sigla}</span>)}</div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-1">{[{ l: "Prova", c: BLUE }, { l: "Trabalho", c: GREEN }, { l: "Evento", c: AMBER }, { l: "Olimpíada", c: VIOLET }].map((x) => <span key={x.l} className="flex items-center gap-1.5 text-[11px]" style={{ color: INK_SOFT }}><span className="h-2 w-2 rounded-full" style={{ background: x.c }} />{x.l}</span>)}</div>
        )}

        {toast && <div className="mt-3 flex items-center gap-2 rounded-2xl p-3 text-[12.5px] font-semibold" style={{ background: GREEN + "16", color: GREEN }}><IconCheck size={16} />{toast}</div>}

        <SectionHeader title={sel ? `Dia ${sel}/${String(mes + 1).padStart(2, "0")}` : "Eventos do mês"} action={sel ? "Ver mês" : undefined} onAction={() => setSel(null)} />
        {lista.length === 0 ? <EmptyState title="Nada por aqui" text="Nenhum evento para este filtro e período." icon={<IconCalendar size={26} />} /> : (
          <div className="space-y-2.5">
            {lista.map((e) => (
              <button key={e.id} onClick={() => abrir(e)} className="card flex w-full items-center gap-3 p-3.5 text-left">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: e.c + "16", color: e.c }}><span className="text-[15px] font-extrabold">{e.d}</span></div>
                <div className="min-w-0 flex-1"><p className="truncate text-[13.5px] font-bold" style={{ color: INK }}>{e.t}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{MESES[e.m]} · {e.d}/{String(e.m + 1).padStart(2, "0")}</p></div>
                <Pill color={e.c}>{e.sigla ?? TIPO_CAL[e.tipo]}</Pill>
              </button>
            ))}
          </div>
        )}

        <SectionHeader title="Próximas olimpíadas" />
        <div className="space-y-2.5">
          {proximas.map((e) => (
            <button key={e.id} onClick={() => setCard(e)} className="card flex w-full items-center gap-3 p-3.5 text-left">
              <div className="grid h-11 w-14 flex-none place-items-center rounded-2xl text-[11px] font-extrabold text-white" style={{ background: e.c }}>{e.sigla}</div>
              <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-bold" style={{ color: INK }}>{e.fase}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{e.d} de {MESES[e.m].toLowerCase()}</p></div>
              {lembretes.includes(e.id) ? <span style={{ color: GREEN }}><IconBell size={17} /></span> : <IconChevron size={16} className="text-slate-400" />}
            </button>
          ))}
        </div>
      </Screen>

      {card && (
        <div className="absolute inset-0 z-30 flex items-end bg-slate-900/40" onClick={() => setCard(null)}>
          <div className="animate-in w-full rounded-t-3xl bg-white p-5 pb-7" onClick={(ev) => ev.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-16 flex-none place-items-center rounded-2xl text-[12px] font-extrabold text-white" style={{ background: card.c }}>{card.sigla}</div>
              <div className="flex-1"><p className="text-[15px] font-bold leading-snug" style={{ color: INK }}>{card.nome}</p></div>
              <button aria-label="Fechar" onClick={() => setCard(null)} className="grid h-8 w-8 place-items-center rounded-full" style={{ background: "#f1f5f9", color: INK }}><IconX size={16} /></button>
            </div>
            <div className="mt-4 space-y-2.5">
              {[{ I: IconCalendar, l: "Fase / data", v: `${card.fase} · ${card.d}/${String(card.m + 1).padStart(2, "0")}/2025` }, { I: IconGrad, l: "Nível", v: card.nivel }].map((r) => (
                <div key={r.l} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: card.c + "0f" }}>
                  <span style={{ color: card.c }}><r.I size={18} /></span>
                  <div><p className="text-[11px]" style={{ color: INK_SOFT }}>{r.l}</p><p className="text-[13px] font-semibold" style={{ color: INK }}>{r.v}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-4"><PrimaryButton color={lembretes.includes(card.id) ? GREEN : card.c} onClick={() => lembrar(card)}><IconBell size={17} />{lembretes.includes(card.id) ? "Lembrete ativado" : "Lembrar-me"}</PrimaryButton></div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   Biblioteca Virtual
   ============================================================ */
const MEC_URL = "https://www.gov.br/mec/pt-br";
const IconExternal = Ic(<><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>);
const IconPlay = Ic(<><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3Z" /></>);

function BibliotecaVirtual({ back }: { back: () => void }) {
  const cats = [
    { l: "Livros", d: "Literatura e clássicos em domínio público", Icon: IconBook, c: BLUE },
    { l: "Didáticos", d: "Obras do PNLD por série e disciplina", Icon: IconGrad, c: GREEN },
    { l: "Vídeos", d: "Videoaulas e conteúdos educativos", Icon: IconPlay, c: VIOLET },
  ];
  return (
    <>
      <TopBar title="Biblioteca Virtual" subtitle="Acervo digital gratuito" onBack={back} accent={INDIGO} />
      <Screen>
        <div className="overflow-hidden rounded-3xl p-5 text-white" style={{ background: `linear-gradient(145deg, ${INDIGO}, ${BLUE_DARK})` }}>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15"><IconBook size={22} /></div>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-white/70">Em destaque</p>
          <h2 className="mt-1 text-[19px] font-extrabold leading-tight">Acervo digital do MEC</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/85">Livros, materiais didáticos e vídeos educativos do Ministério da Educação, gratuitos para estudantes da rede pública.</p>
          <a href={MEC_URL} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white py-3 text-[13.5px] font-bold active:scale-[0.98] transition" style={{ color: INDIGO }}>
            Acessar biblioteca do MEC <IconExternal size={16} />
          </a>
          <p className="mt-2 text-center text-[10.5px] text-white/65">Abre em nova aba · gov.br</p>
        </div>

        <SectionHeader title="Explorar por categoria" />
        <div className="space-y-2.5">
          {cats.map(({ l, d, Icon, c }) => (
            <a key={l} href={MEC_URL} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 p-3.5 active:scale-[0.99] transition">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl" style={{ background: c + "16", color: c }}><Icon size={21} /></div>
              <div className="min-w-0 flex-1"><p className="text-[13.5px] font-bold" style={{ color: INK }}>{l}</p><p className="text-[11.5px]" style={{ color: INK_SOFT }}>{d}</p></div>
              <span style={{ color: INK_SOFT }}><IconExternal size={16} /></span>
            </a>
          ))}
        </div>
        <div className="mt-4 flex gap-2.5 rounded-2xl p-3.5 text-[11.5px]" style={{ background: BLUE + "0d", color: INK_SOFT }}>
          <span style={{ color: BLUE }}><IconShield size={17} /></span>Você será direcionado a um site oficial do Governo Federal. O SE Educa não armazena seus dados de acesso.
        </div>
      </Screen>
    </>
  );
}

/* ============================================================
   Gestor — Frequência em Programas Sociais
   ============================================================ */
type StatusFreq = "Regular" | "Atenção" | "Risco";
const BENEFICIARIOS: { nome: string; turma: string; prog: "Bolsa Família" | "Pé-de-Meia"; freq: number; faltas: number }[] = [
  { nome: "Bruno Carvalho Lima", turma: "9º A", prog: "Bolsa Família", freq: 76, faltas: 10 },
  { nome: "Larissa Menezes Prado", turma: "1º EM A", prog: "Pé-de-Meia", freq: 79, faltas: 9 },
  { nome: "Diego Farias Melo", turma: "9º B", prog: "Bolsa Família", freq: 81, faltas: 8 },
  { nome: "Kauã Santana Rocha", turma: "2º EM B", prog: "Pé-de-Meia", freq: 82, faltas: 8 },
  { nome: "Yasmin Oliveira Costa", turma: "8º A", prog: "Bolsa Família", freq: 83, faltas: 7 },
  { nome: "Pedro Henrique Alves", turma: "1º EM A", prog: "Pé-de-Meia", freq: 84, faltas: 7 },
  { nome: "Maria Clara Batista", turma: "7º B", prog: "Bolsa Família", freq: 85, faltas: 6 },
  { nome: "João Victor Nascimento", turma: "9º A", prog: "Bolsa Família", freq: 85, faltas: 6 },
  { nome: "Isabela Ferreira Lima", turma: "2º EM B", prog: "Pé-de-Meia", freq: 86, faltas: 6 },
  { nome: "Arthur Mendonça Silva", turma: "8º A", prog: "Bolsa Família", freq: 86, faltas: 6 },
  { nome: "Sophia Rezende Góis", turma: "7º B", prog: "Bolsa Família", freq: 87, faltas: 5 },
  { nome: "Lucas Gabriel Moura", turma: "1º EM A", prog: "Pé-de-Meia", freq: 87, faltas: 5 },
  { nome: "Eduarda Gomes Rocha", turma: "9º B", prog: "Bolsa Família", freq: 93, faltas: 3 },
  { nome: "Rafael Tavares Cruz", turma: "2º EM B", prog: "Pé-de-Meia", freq: 95, faltas: 2 },
  { nome: "Gabriela Nunes Reis", turma: "8º A", prog: "Bolsa Família", freq: 97, faltas: 1 },
  { nome: "Matheus Lima Dantas", turma: "1º EM A", prog: "Pé-de-Meia", freq: 98, faltas: 1 },
];
// Bolsa Família exige 85% (6–15 anos); Pé-de-Meia exige 80%.
const statusFreq = (b: (typeof BENEFICIARIOS)[number]): StatusFreq => {
  const min = b.prog === "Bolsa Família" ? 85 : 80;
  return b.freq < min ? "Risco" : b.freq < min + 3 ? "Atenção" : "Regular";
};
const COR_STATUS: Record<StatusFreq, string> = { Regular: GREEN, Atenção: AMBER, Risco: RED };

function Select({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-1 block text-[10.5px] font-semibold" style={{ color: INK_SOFT }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border bg-white px-2.5 py-2 text-[12.5px] font-semibold outline-none" style={{ borderColor: "#e2e8f0", color: INK }}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function useToast() {
  const [toast, setToast] = useState("");
  const show = (t: string) => { setToast(t); setTimeout(() => setToast(""), 2600); };
  const node = toast ? (
    <div className="pointer-events-none absolute inset-x-5 bottom-24 z-40 flex items-center gap-2 rounded-2xl p-3.5 text-[12.5px] font-semibold text-white shadow-lg animate-in" style={{ background: INK }}><span style={{ color: GREEN }}><IconCheck size={17} /></span>{toast}</div>
  ) : null;
  return { show, node };
}

function GestorFreqSocial({ back }: { back: () => void }) {
  const [prog, setProg] = useState("Todos");
  const [turma, setTurma] = useState("Todas");
  const [mes, setMes] = useState("Setembro/2025");
  const [verLista, setVerLista] = useState(false);
  const [exp, setExp] = useState<string | null>(null);
  const { show, node } = useToast();
  const turmas = ["Todas", ...Array.from(new Set(BENEFICIARIOS.map((b) => b.turma)))];
  const dados = BENEFICIARIOS.filter((b) => (prog === "Todos" || b.prog === prog) && (turma === "Todas" || b.turma === turma));
  const alerta = BENEFICIARIOS.filter((b) => statusFreq(b) !== "Regular");
  const exportar = (t: string) => { setExp(t); setTimeout(() => { setExp(null); show(`Relatório exportado em ${t}`); }, 900); };
  const cont = (s: StatusFreq) => dados.filter((b) => statusFreq(b) === s).length;
  return (
    <>
      <TopBar title="Frequência · Programas sociais" subtitle="Alunos beneficiários" onBack={back} accent={GREEN} />
      <Screen>
        <div className="card p-3.5">
          <div className="flex gap-2">
            <Select label="Programa" value={prog} onChange={setProg} options={["Todos", "Bolsa Família", "Pé-de-Meia"]} />
            <Select label="Turma" value={turma} onChange={setTurma} options={turmas} />
          </div>
          <div className="mt-2"><Select label="Mês" value={mes} onChange={setMes} options={["Setembro/2025", "Agosto/2025", "Julho/2025"]} /></div>
        </div>

        <div className="mt-3 rounded-2xl p-3.5" style={{ background: "#fef3c7", border: `1px solid ${AMBER}55` }}>
          <div className="flex gap-2.5">
            <span className="mt-0.5" style={{ color: "#b45309" }}><IconAlert size={19} /></span>
            <div className="flex-1">
              <p className="text-[13.5px] font-bold" style={{ color: "#78350f" }}>{alerta.length} alunos estão perto do limite de frequência</p>
              <p className="text-[11.5px]" style={{ color: "#92400e" }}>Fechamento do mês em 4 dias · 30/09. Contate as famílias.</p>
              <button onClick={() => setVerLista(!verLista)} className="mt-2 text-[12px] font-bold underline" style={{ color: "#b45309" }}>{verLista ? "Ocultar lista" : "Ver alunos"}</button>
            </div>
          </div>
          {verLista && (
            <div className="mt-3 space-y-1.5">
              {alerta.map((b) => { const s = statusFreq(b); return (
                <div key={b.nome} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2" style={{ borderLeft: `4px solid ${COR_STATUS[s]}` }}>
                  <div className="min-w-0 flex-1"><p className="truncate text-[12.5px] font-semibold" style={{ color: INK }}>{b.nome}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>{b.turma} · {b.prog}</p></div>
                  <span className="text-[13px] font-extrabold" style={{ color: COR_STATUS[s] }}>{b.freq}%</span>
                </div>
              ); })}
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {(["Regular", "Atenção", "Risco"] as StatusFreq[]).map((s) => (
            <div key={s} className="card p-3 text-center"><div className="text-[20px] font-extrabold" style={{ color: COR_STATUS[s] }}>{cont(s)}</div><div className="text-[10.5px]" style={{ color: INK_SOFT }}>{s}</div></div>
          ))}
        </div>

        <SectionHeader title={`Relatório · ${mes}`} />
        {dados.length === 0 ? <EmptyState title="Sem beneficiários" text="Nenhum aluno beneficiário para estes filtros." icon={<IconUsers size={26} />} /> : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[440px] text-left text-[11.5px]">
              <thead><tr style={{ color: INK_SOFT, background: "#f8fafc" }}>{["Aluno", "Turma", "Programa", "Freq.", "Faltas", "Status"].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {dados.map((b) => { const s = statusFreq(b); return (
                  <tr key={b.nome} className="border-t" style={{ borderColor: "#eef2f7", background: s === "Risco" ? RED + "08" : s === "Atenção" ? AMBER + "0a" : undefined }}>
                    <td className="px-3 py-2.5 font-semibold" style={{ color: INK }}>{b.nome}</td>
                    <td className="px-3 py-2.5" style={{ color: INK_SOFT }}>{b.turma}</td>
                    <td className="px-3 py-2.5" style={{ color: INK_SOFT }}>{b.prog}</td>
                    <td className="px-3 py-2.5 font-bold" style={{ color: COR_STATUS[s] }}>{b.freq}%</td>
                    <td className="px-3 py-2.5" style={{ color: INK }}>{b.faltas}</td>
                    <td className="px-3 py-2.5"><Pill color={COR_STATUS[s]}>{s}</Pill></td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 px-1 text-[10.5px]" style={{ color: INK_SOFT }}>Mínimo exigido: Bolsa Família 85% · Pé-de-Meia 80%.</p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <PrimaryButton color={RED} loading={exp === "PDF"} onClick={() => exportar("PDF")}><IconDoc size={17} />Exportar PDF</PrimaryButton>
          <PrimaryButton color={GREEN} loading={exp === "Excel"} onClick={() => exportar("Excel")}><IconGrid size={17} />Exportar Excel</PrimaryButton>
        </div>
      </Screen>
      {node}
    </>
  );
}

/* ============================================================
   Gestor — Painel de pendências dos professores
   ============================================================ */
const PENDENCIAS: { id: string; prof: string; turma: string; disc: string; tipo: "Diário" | "Notas"; atraso: number; prazo: string }[] = [
  { id: "p1", prof: "Carlos Menezes", turma: "9º A", disc: "Matemática", tipo: "Diário", atraso: 9, prazo: "26/09" },
  { id: "p2", prof: "Juliana Prado", turma: "8º B", disc: "Inglês", tipo: "Notas", atraso: 6, prazo: "30/09" },
  { id: "p3", prof: "Roberto Andrade", turma: "7º A", disc: "História", tipo: "Diário", atraso: 4, prazo: "30/09" },
  { id: "p4", prof: "Fernanda Lopes", turma: "1º EM A", disc: "Química", tipo: "Notas", atraso: 3, prazo: "30/09" },
  { id: "p5", prof: "Marcos Vieira", turma: "9º B", disc: "Geografia", tipo: "Diário", atraso: 2, prazo: "03/10" },
  { id: "p6", prof: "Patrícia Souza", turma: "6º A", disc: "Ciências", tipo: "Notas", atraso: 1, prazo: "03/10" },
  { id: "p7", prof: "André Carvalho", turma: "2º EM B", disc: "Física", tipo: "Diário", atraso: 0, prazo: "06/10" },
  { id: "p8", prof: "Luciana Ramos", turma: "8º A", disc: "Português", tipo: "Notas", atraso: 0, prazo: "06/10" },
];
const semaforo = (d: number) => (d >= 5 ? RED : d >= 1 ? AMBER : GREEN);

function GestorPendencias({ back }: { back: () => void }) {
  const [enviados, setEnviados] = useState<string[]>([]);
  const [filtro, setFiltro] = useState<"Todos" | "Diário" | "Notas">("Todos");
  const { show, node } = useToast();
  const lista = PENDENCIAS.filter((p) => filtro === "Todos" || p.tipo === filtro);
  const diarios = PENDENCIAS.filter((p) => p.tipo === "Diário" && p.atraso > 0).length;
  const notas = PENDENCIAS.filter((p) => p.tipo === "Notas").length;
  const enviar = (id: string, prof: string) => { setEnviados((e) => [...e, id]); show(`Lembrete enviado para ${prof}`); };
  const todos = () => { const pend = lista.filter((p) => !enviados.includes(p.id)); setEnviados((e) => [...e, ...pend.map((p) => p.id)]); show(pend.length ? `${pend.length} lembretes enviados aos professores` : "Todos já foram lembrados"); };
  return (
    <>
      <TopBar title="Pendências dos professores" subtitle="Fechamento da 3ª unidade · 30/09" onBack={back} accent={RED} />
      <Screen>
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4"><div className="flex items-center justify-between"><span style={{ color: RED }}><IconEdit size={19} /></span><Pill color={RED}>Urgente</Pill></div><div className="mt-2 text-[26px] font-extrabold" style={{ color: INK }}>{diarios}</div><p className="text-[12px] leading-snug" style={{ color: INK_SOFT }}>Diários sem preenchimento</p></div>
          <div className="card p-4"><div className="flex items-center justify-between"><span style={{ color: AMBER }}><IconStar size={19} /></span><Pill color={AMBER}>4 dias</Pill></div><div className="mt-2 text-[26px] font-extrabold" style={{ color: INK }}>{notas}</div><p className="text-[12px] leading-snug" style={{ color: INK_SOFT }}>Turmas sem nota perto do fechamento</p></div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {(["Todos", "Diário", "Notas"] as const).map((f) => <button key={f} onClick={() => setFiltro(f)} className="rounded-full px-3 py-1.5 text-[11.5px] font-semibold" style={filtro === f ? { background: INK, color: "#fff" } : { background: "#fff", color: INK, border: "1px solid #e2e8f0" }}>{f}</button>)}
          </div>
          <button onClick={todos} className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold text-white active:scale-95 transition" style={{ background: BLUE }}><IconSend size={14} />Lembrar todos</button>
        </div>
        <div className="mt-2.5 flex gap-3 px-1">{[{ l: "Em dia", c: GREEN }, { l: "1–4 dias", c: AMBER }, { l: "5+ dias", c: RED }].map((x) => <span key={x.l} className="flex items-center gap-1.5 text-[11px]" style={{ color: INK_SOFT }}><span className="h-2.5 w-2.5 rounded-full" style={{ background: x.c }} />{x.l}</span>)}</div>

        <div className="card mt-3 overflow-x-auto">
          <table className="w-full min-w-[460px] text-left text-[11.5px]">
            <thead><tr style={{ color: INK_SOFT, background: "#f8fafc" }}>{["", "Professor / turma", "Pendência", "Atraso", "Prazo", ""].map((h, i) => <th key={i} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {lista.map((p) => { const c = semaforo(p.atraso); const ok = enviados.includes(p.id); return (
                <tr key={p.id} className="border-t" style={{ borderColor: "#eef2f7" }}>
                  <td className="pl-3"><span className="block h-3 w-3 rounded-full" style={{ background: c, boxShadow: `0 0 0 3px ${c}26` }} aria-label={p.atraso >= 5 ? "Crítico" : p.atraso ? "Atenção" : "Em dia"} /></td>
                  <td className="px-3 py-2.5"><p className="font-semibold" style={{ color: INK }}>{p.prof}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>{p.turma} · {p.disc}</p></td>
                  <td className="px-3 py-2.5" style={{ color: INK }}>{p.tipo}</td>
                  <td className="px-3 py-2.5 font-bold" style={{ color: c }}>{p.atraso ? `${p.atraso} dia${p.atraso > 1 ? "s" : ""}` : "—"}</td>
                  <td className="px-3 py-2.5" style={{ color: INK_SOFT }}>{p.prazo}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button disabled={ok} onClick={() => enviar(p.id, p.prof)} className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold transition" style={ok ? { background: GREEN + "16", color: GREEN } : { background: BLUE + "14", color: BLUE }}>{ok ? "Enviado" : "Enviar lembrete"}</button>
                  </td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      </Screen>
      {node}
    </>
  );
}

const REGIOES = [
  { r: "Centro", atual: 93.4, ant: 92.1 },
  { r: "Zona Sul", atual: 91.2, ant: 91.8 },
  { r: "Zona Oeste", atual: 88.6, ant: 87.0 },
  { r: "Zona Norte", atual: 84.7, ant: 86.3 },
  { r: "Zona de Expansão", atual: 82.1, ant: 83.5 },
  { r: "N. Sra. do Socorro", atual: 86.9, ant: 85.4 },
  { r: "São Cristóvão", atual: 89.3, ant: 88.8 },
  { r: "Barra dos Coqueiros", atual: 90.5, ant: 89.1 },
];
const fmtPct = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function FreqRegioes() {
  const max = Math.max(...REGIOES.map((r) => r.atual));
  const min = Math.min(...REGIOES.map((r) => r.atual));
  const maior = REGIOES.find((r) => r.atual === max)!;
  const menor = REGIOES.find((r) => r.atual === min)!;
  const media = REGIOES.reduce((s, r) => s + r.atual, 0) / REGIOES.length;
  const base = 75;
  const sigla = (r: string) => r.replace("Zona de Expansão", "Exp.").replace("Zona ", "Z. ").replace("N. Sra. do Socorro", "Socorro").replace("São Cristóvão", "S. Crist.").replace("Barra dos Coqueiros", "Barra");
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-3.5" style={{ outline: `2px solid ${GREEN}2a` }}><Pill color={GREEN}>Maior frequência</Pill><p className="mt-2 text-[21px] font-extrabold" style={{ color: GREEN }}>{fmtPct(max)}%</p><p className="text-[12px] font-semibold" style={{ color: INK }}>{maior.r}</p></div>
        <div className="card p-3.5" style={{ outline: `2px solid ${RED}2a` }}><Pill color={RED}>Menor frequência</Pill><p className="mt-2 text-[21px] font-extrabold" style={{ color: RED }}>{fmtPct(min)}%</p><p className="text-[12px] font-semibold" style={{ color: INK }}>{menor.r}</p></div>
      </div>
      <div className="card mt-3 p-4">
        <div className="mb-3 flex items-center justify-between text-[11px]" style={{ color: INK_SOFT }}>
          <span>Média da rede: <b style={{ color: INK }}>{fmtPct(media)}%</b></span>
          <span className="flex items-center gap-2"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: BLUE }} />Set</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: "#cbd5e1" }} />Ago</span></span>
        </div>
        <div className="flex items-end justify-between gap-1.5" style={{ height: 140 }}>
          {REGIOES.map((r) => { const c = r.atual === max ? GREEN : r.atual === min ? RED : BLUE; return (
            <div key={r.r} className="flex h-full flex-1 flex-col items-center gap-1">
              <span className="text-[9px] font-bold" style={{ color: c }}>{Math.round(r.atual)}</span>
              <div className="flex w-full flex-1 items-end justify-center gap-[2px]">
                <div className="w-1/3 rounded-t" style={{ height: `${((r.ant - base) / (100 - base)) * 100}%`, background: "#cbd5e1" }} />
                <div className="w-1/2 rounded-t" style={{ height: `${((r.atual - base) / (100 - base)) * 100}%`, background: c }} />
              </div>
              <span className="w-full truncate text-center text-[8.5px]" style={{ color: INK_SOFT }}>{sigla(r.r)}</span>
            </div>
          ); })}
        </div>
        <p className="mt-2 text-[9.5px]" style={{ color: "#94a3b8" }}>Eixo a partir de 75% para destacar as diferenças.</p>
      </div>
      <div className="card mt-3 divide-y">
        {[...REGIOES].sort((a, b) => b.atual - a.atual).map((r) => { const d = r.atual - r.ant; const c = r.atual === max ? GREEN : r.atual === min ? RED : INK; return (
          <div key={r.r} className="flex items-center gap-3 px-4 py-2.5" style={{ borderColor: "#eef2f7" }}>
            <div className="min-w-0 flex-1"><p className="text-[12.5px] font-semibold" style={{ color: INK }}>{r.r}</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>{["Centro", "Zona Sul", "Zona Oeste", "Zona Norte", "Zona de Expansão"].includes(r.r) ? "Aracaju" : "Grande Aracaju"} · ago {fmtPct(r.ant)}%</p></div>
            <span className="text-[13px] font-extrabold" style={{ color: c }}>{fmtPct(r.atual)}%</span>
            <span className="w-14 text-right text-[11px] font-bold" style={{ color: d >= 0 ? GREEN : RED }}>{d >= 0 ? "▲" : "▼"} {fmtPct(Math.abs(d))}</span>
          </div>
        ); })}
      </div>
    </>
  );
}

/* ============================================================
   App shell — device + navegação + galeria
   ============================================================ */
type ScreenId =
  | "splash" | "login" | "cadastro" | "alunoHome" | "responsavelHome" | "notas" | "frequencia" | "horarios" | "boletim"
  | "matricula" | "escolas" | "acompanhamento" | "secretariaVirtual" | "notificacoes"
  | "perfil" | "configuracoes" | "professorHome" | "escolaHome" | "secretariaHome" | "calendario" | "chat"
  | "tarefas" | "comunicados" | "historico" | "profNotas" | "profFrequencia" | "profDiario" | "profPlanejamento"
  | "admMatriculas" | "admTurmas" | "admProfessores" | "admHorarios" | "admDiario" | "admBoletins"
  | "secMatriculas" | "secEnturmacao" | "secPedagogico" | "secCargaHoraria" | "secRegional"
  | "mapaEstudos" | "transporte" | "merenda" | "mapaEscolas" | "secPesquisas" | "biblioteca" | "gestorFreqSocial" | "gestorPendencias";

const HOME_BY_PERFIL: Record<Perfil, ScreenId> = { aluno: "alunoHome", responsavel: "responsavelHome", professor: "professorHome", escola: "escolaHome", secretaria: "secretariaHome" };

const GALLERY: { grupo: string; itens: { id: ScreenId; label: string }[] }[] = [
  { grupo: "Acesso", itens: [{ id: "splash", label: "Splash" }, { id: "login", label: "Login" }, { id: "cadastro", label: "Cadastro" }] },
  { grupo: "Aluno", itens: [{ id: "alunoHome", label: "Home" }, { id: "notas", label: "Notas" }, { id: "frequencia", label: "Frequência" }, { id: "horarios", label: "Horários" }, { id: "boletim", label: "Boletim" }, { id: "historico", label: "Histórico Escolar" }, { id: "tarefas", label: "Tarefas" }, { id: "mapaEstudos", label: "Locais de estudo" }, { id: "transporte", label: "Transporte Escolar" }, { id: "merenda", label: "Merenda Escolar" }, { id: "calendario", label: "Calendário + Olimpíadas" }, { id: "biblioteca", label: "Biblioteca Virtual" }] },
  { grupo: "Responsável", itens: [{ id: "responsavelHome", label: "Home" }] },
  { grupo: "Serviços", itens: [{ id: "matricula", label: "Matrícula" }, { id: "escolas", label: "Escolas (lista e mapa)" }, { id: "acompanhamento", label: "Acompanhamento" }, { id: "secretariaVirtual", label: "Secretaria Virtual" }] },
  { grupo: "Comum", itens: [{ id: "notificacoes", label: "Notificações" }, { id: "comunicados", label: "Comunicados" }, { id: "perfil", label: "Perfil" }, { id: "configuracoes", label: "Configurações" }, { id: "calendario", label: "Calendário" }, { id: "chat", label: "Chat" }] },
  { grupo: "Professor", itens: [{ id: "professorHome", label: "Home" }, { id: "profNotas", label: "Lançar notas" }, { id: "profFrequencia", label: "Frequência" }, { id: "profDiario", label: "Diário de classe" }, { id: "profPlanejamento", label: "Planejamento" }] },
  { grupo: "Administração", itens: [{ id: "escolaHome", label: "Home Escola" }, { id: "admMatriculas", label: "Matrículas" }, { id: "admTurmas", label: "Turmas/Cursos" }, { id: "admProfessores", label: "Professores" }, { id: "admHorarios", label: "Horários" }, { id: "admDiario", label: "Supervisão diário" }, { id: "admBoletins", label: "Boletins" }, { id: "gestorFreqSocial", label: "Freq. programas sociais" }, { id: "gestorPendencias", label: "Pendências professores" }] },
  { grupo: "Secretaria", itens: [{ id: "secretariaHome", label: "Home Secretaria" }, { id: "secMatriculas", label: "Matrículas da rede" }, { id: "secEnturmacao", label: "Enturmação" }, { id: "secPedagogico", label: "Gestão pedagógica" }, { id: "secCargaHoraria", label: "Carga horária" }, { id: "secRegional", label: "Contato Regional" }, { id: "secPesquisas", label: "Pesquisas recentes" }] },
];

const PERFIL_BY_SCREEN: Partial<Record<ScreenId, Perfil>> = {
  alunoHome: "aluno", responsavelHome: "responsavel",
  professorHome: "professor", profNotas: "professor", profFrequencia: "professor", profDiario: "professor", profPlanejamento: "professor",
  escolaHome: "escola", admMatriculas: "escola", admTurmas: "escola", admProfessores: "escola", admHorarios: "escola", admDiario: "escola", admBoletins: "escola", gestorFreqSocial: "escola", gestorPendencias: "escola", biblioteca: "aluno",
  secretariaHome: "secretaria", secMatriculas: "secretaria", secEnturmacao: "secretaria", secPedagogico: "secretaria", secCargaHoraria: "secretaria", secRegional: "secretaria", secPesquisas: "secretaria",
};

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("splash");
  const [perfil, setPerfil] = useState<Perfil>("aluno");
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

  const showChrome = !["splash", "login", "cadastro"].includes(screen);
  const showNav = showChrome && screen !== "chat";

  const [escCtx, setEscCtx] = useState<EscCtx>("todas");
  const nav = (s: ScreenId) => { if (s === "escolas") setEscCtx("todas"); setScreen(s); };
  const openGallery = (s: ScreenId) => { setScreen(s); const p = PERFIL_BY_SCREEN[s]; if (p) setPerfil(p); };

  const renderScreen = () => {
    switch (screen) {
      case "splash": return <Splash go={() => setScreen("login")} />;
      case "login": return <Login onEnter={(p) => { setPerfil(p); setScreen(HOME_BY_PERFIL[p]); setTab("inicio"); }} onCadastro={() => setScreen("cadastro")} />;
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
      case "notificacoes": return perfil === "secretaria" ? <NotificacoesSecretaria back={goHome} nav={nav} /> : <Notificacoes back={goHome} />;
      case "perfil": return <Perfil back={goHome} onLogout={() => setScreen("login")} perfil={perfil} nav={nav} />;
      case "configuracoes": return <Configuracoes back={goHome} a11y={a11y} setA11y={setA11y} onLogout={() => setScreen("login")} />;
      case "professorHome": return <ProfessorHome nav={nav} />;
      case "profNotas": return <ProfNotas back={goHome} />;
      case "profFrequencia": return <ProfFrequencia back={goHome} />;
      case "profDiario": return <ProfDiario back={goHome} />;
      case "profPlanejamento": return <ProfPlanejamento back={goHome} />;
      case "escolaHome": return <EscolaHome nav={nav} />;
      case "secretariaHome": return <SecretariaHome nav={nav} abrirEscolas={(c) => { setEscCtx(c); setScreen("escolas"); }} />;
      case "admMatriculas": return <AdmMatriculas back={goHome} />;
      case "admTurmas": return <AdmTurmas back={goHome} />;
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
    }
  };

  const darkStatus = screen === "splash";

  return (
    <div className="flex h-full w-full items-center justify-center gap-8 overflow-hidden p-4 lg:p-6">
      {/* Galeria de telas (presentation) */}
      <aside className="scroll-area hidden max-h-[85vh] w-56 flex-none self-center overflow-y-auto lg:block">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}><IconGrad size={20} strokeWidth={2} /></div>
          <div><p className="text-[15px] font-extrabold leading-none" style={{ color: INK }}>SE Educa</p><p className="text-[10.5px]" style={{ color: INK_SOFT }}>Protótipo · 46 telas</p></div>
        </div>
        <div className="space-y-4">
          {GALLERY.map((g) => (
            <div key={g.grupo}>
              <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>{g.grupo}</p>
              <div className="space-y-1">
                {g.itens.map((it) => {
                  const on = screen === it.id;
                  return (
                    <button key={it.id} onClick={() => openGallery(it.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] font-medium transition" style={on ? { background: BLUE, color: "#fff" } : { color: INK }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: on ? "#fff" : "#cbd5e1" }} />{it.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Tela */}
      <div className={`device-screen relative flex h-full w-full max-w-[520px] flex-none flex-col overflow-hidden rounded-3xl shadow-xl ${a11y.animacoes ? "" : "no-anim"}`} style={{ filter: a11y.contraste ? "contrast(1.14) saturate(1.05)" : undefined }}>
        <StatusBar dark={darkStatus} />
        <div className="flex min-h-0 flex-1 flex-col" style={{ zoom: a11y.fontScale } as React.CSSProperties}>{renderScreen()}</div>
        {showNav && <BottomNav active={tab} onChange={onTab} badge={3} />}
      </div>
    </div>
  );
}
