/* Mapa de verdade (OpenStreetMap) com a biblioteca Leaflet.
   Cada ponto é uma escola com latitude e longitude cadastradas pelo DIES.
   O mapa se ajusta sozinho para mostrar todos os pontos; tocar num ponto chama onSelect. */

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GREEN } from "@/theme/colors";

export type PontoMapa = { id: number; lat: number; lng: number; nome: string };

export function MapaReal({ pontos, selecionado, onSelect, height = 280 }: {
  pontos: PontoMapa[];
  selecionado?: number;
  onSelect?: (id: number) => void;
  height?: number;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const camada = useRef<L.LayerGroup | null>(null);

  // Cria o mapa uma vez só (e desmonta quando a tela fecha).
  useEffect(() => {
    if (!caixa.current) return;
    mapa.current = L.map(caixa.current, { zoomControl: true }).setView([-10.91, -37.07], 11); // Aracaju
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa.current);
    camada.current = L.layerGroup().addTo(mapa.current);
    return () => { mapa.current?.remove(); mapa.current = null; };
  }, []);

  // Redesenha os pontos quando a lista (filtros) muda.
  const chave = pontos.map((p) => p.id).join(",");
  useEffect(() => {
    if (!mapa.current || !camada.current) return;
    camada.current.clearLayers();
    for (const p of pontos) {
      // circleMarker: bolinha desenhada pelo próprio Leaflet (não precisa de imagem de ícone).
      L.circleMarker([p.lat, p.lng], { radius: 9, color: "#fff", weight: 3, fillColor: GREEN, fillOpacity: 1 })
        .bindTooltip(p.nome)
        .on("click", () => onSelect?.(p.id))
        .addTo(camada.current);
    }
    if (pontos.length === 1) mapa.current.setView([pontos[0].lat, pontos[0].lng], 15);
    else if (pontos.length > 1) mapa.current.fitBounds(L.latLngBounds(pontos.map((p) => [p.lat, p.lng])), { padding: [30, 30] });
  }, [chave]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escola escolhida: aumenta a bolinha e mostra o nome. Só move o mapa se ela estiver fora da vista.
  useEffect(() => {
    const p = pontos.find((x) => x.id === selecionado);
    if (!p || !mapa.current) return;
    if (!mapa.current.getBounds().pad(-0.15).contains([p.lat, p.lng])) mapa.current.panTo([p.lat, p.lng]);
    camada.current?.eachLayer((m) => {
      const marcador = m as L.CircleMarker;
      const ehEla = marcador.getLatLng().equals([p.lat, p.lng]);
      marcador.setStyle({ radius: ehEla ? 13 : 9 });
      if (ehEla) marcador.openTooltip();
    });
  }, [selecionado, chave]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={caixa} className="w-full" style={{ height, zIndex: 0 }} />;
}
