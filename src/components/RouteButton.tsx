import { IconRoute } from "@/components/icons";
import { BLUE } from "@/theme/colors";

export function rotaUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function RouteButton({ lat, lng, label = "Traçar rota" }: { lat: number; lng: number; label?: string }) {
  return (
    <a href={rotaUrl(lat, lng)} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-bold text-white shadow-sm active:scale-[0.98] transition" style={{ background: BLUE }}>
      <IconRoute size={17} />{label}
    </a>
  );
}
