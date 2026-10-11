export function Screen({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`scroll-area animate-in flex-1 overflow-y-auto px-5 pb-6 ${className}`}>{children}</div>;
}
