/* Ícones em SVG usados no app inteiro. */

export type IconProps = { size?: number; className?: string; strokeWidth?: number; style?: React.CSSProperties };

export const Ic = (path: React.ReactNode) =>
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

export const IconHome = Ic(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></>);
export const IconBook = Ic(<><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></>);
export const IconGrid = Ic(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>);
export const IconBell = Ic(<><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>);
export const IconUser = Ic(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></>);
export const IconChart = Ic(<><path d="M4 20V4" /><path d="M4 20h16" /><rect x="7" y="11" width="3" height="6" rx="1" /><rect x="12" y="7" width="3" height="10" rx="1" /><rect x="17" y="13" width="3" height="4" rx="1" /></>);
export const IconCalendar = Ic(<><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 3v3M16 3v3" /></>);
export const IconClock = Ic(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const IconCheck = Ic(<path d="m4 12 5 5L20 6" />);
export const IconChevron = Ic(<path d="m9 6 6 6-6 6" />);
export const IconBack = Ic(<path d="m15 6-6 6 6 6" />);
export const IconSearch = Ic(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>);
export const IconPin = Ic(<><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>);
export const IconDoc = Ic(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></>);
export const IconChat = Ic(<><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4Z" /></>);
export const IconShield = Ic(<><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z" /><path d="m9 12 2 2 4-4" /></>);
export const IconGrad = Ic(<><path d="M22 9 12 4 2 9l10 5 10-5Z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></>);
export const IconLogout = Ic(<><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 12H3M6 8l-3 4 3 4" /></>);
export const IconAlert = Ic(<><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17.5v.5" /></>);
export const IconSend = Ic(<path d="M4 12 20 4l-6 16-3-7-7-1Z" />);
export const IconPlus = Ic(<><path d="M12 5v14M5 12h14" /></>);
export const IconStar = Ic(<path d="m12 3 2.6 5.6L21 9.3l-4.5 4.2 1.1 6L12 16.7 6.4 19.5l1.1-6L3 9.3l6.4-.7Z" />);
export const IconUsers = Ic(<><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M16 5.2A3.2 3.2 0 0 1 16 14M21 20c0-2.6-1.4-4.2-3.5-4.8" /></>);
export const IconEdit = Ic(<><path d="M4 20h4L18 10l-4-4L4 16Z" /><path d="M13.5 6.5 17.5 10.5" /></>);
export const IconRoute = Ic(<><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16" /></>);
export const IconBus = Ic(<><rect x="4" y="3" width="16" height="15" rx="3" /><path d="M4 11h16M8 18v2.5M16 18v2.5" /><circle cx="8" cy="14.5" r=".8" /><circle cx="16" cy="14.5" r=".8" /></>);
export const IconFood = Ic(<><path d="M5 3v7a2 2 0 0 0 4 0V3M7 10v11" /><path d="M17 21V3c-2 0-3.5 2.5-3.5 6s1.5 4 3.5 4" /></>);
export const IconLayers = Ic(<><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>);
export const IconTarget = Ic(<><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>);
export const IconX = Ic(<path d="M6 6l12 12M18 6 6 18" />);
export const IconTrend = Ic(<><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>);
export const IconExternal = Ic(<><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>);
export const IconPlay = Ic(<><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3Z" /></>);
