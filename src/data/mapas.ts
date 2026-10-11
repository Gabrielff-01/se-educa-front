/* Dados fictícios do protótipo. Quando existir back-end, isso vem da API. */

export type LocalTipo = "biblioteca" | "coworking" | "cultural" | "praca";

export const LOCAIS: { id: string; nome: string; tipo: LocalTipo; end: string; dist: string; min: string; horario: string; aberto: boolean; wifi: boolean; nota: number; x: number; y: number; lat: number; lng: number }[] = [
  { id: "l1", nome: "Biblioteca Pública Epifânio Dória", tipo: "biblioteca", end: "R. Vila Cristina, 1051 · São José", dist: "1,2 km", min: "6 min de carro · 15 min a pé", horario: "08:00 – 18:00", aberto: true, wifi: true, nota: 4.7, x: 195, y: 150, lat: -10.9195, lng: -37.0567 },
  { id: "l2", nome: "Biblioteca Municipal Clodomir Silva", tipo: "biblioteca", end: "Praça Fausto Cardoso · Centro", dist: "2,4 km", min: "9 min de carro", horario: "08:00 – 17:00", aberto: true, wifi: true, nota: 4.5, x: 250, y: 85, lat: -10.9111, lng: -37.0490 },
  { id: "l3", nome: "Coworking Jovem Conectado", tipo: "coworking", end: "Av. Hermes Fontes, 1200 · Luzia", dist: "0,8 km", min: "4 min de carro · 10 min a pé", horario: "07:00 – 22:00", aberto: true, wifi: true, nota: 4.8, x: 90, y: 215, lat: -10.9380, lng: -37.0620 },
  { id: "l4", nome: "Espaço Estudar SE — Hub Atalaia", tipo: "coworking", end: "Av. Santos Dumont · Atalaia", dist: "4,1 km", min: "12 min de carro", horario: "09:00 – 21:00", aberto: false, wifi: true, nota: 4.4, x: 290, y: 270, lat: -10.9850, lng: -37.0460 },
  { id: "l5", nome: "Centro Cultural de Aracaju", tipo: "cultural", end: "Praça Gal. Valadão · Centro", dist: "2,9 km", min: "10 min de carro", horario: "09:00 – 18:00", aberto: true, wifi: false, nota: 4.6, x: 215, y: 105, lat: -10.9118, lng: -37.0505 },
  { id: "l6", nome: "Parque da Sementeira — Área de leitura", tipo: "praca", end: "Av. Beira Mar · Jardins", dist: "1,9 km", min: "7 min de carro", horario: "05:00 – 22:00", aberto: true, wifi: true, nota: 4.3, x: 75, y: 168, lat: -10.9470, lng: -37.0560 },
];

export const TIPO_LABEL: Record<LocalTipo, string> = { biblioteca: "Biblioteca pública", coworking: "Coworking estudantil", cultural: "Centro cultural", praca: "Espaço ao ar livre" };

export const PARADAS = [
  { nome: "Terminal Zona Sul", h: "06:10", x: 30, y: 300, passou: true },
  { nome: "R. Bahia × Av. Hermes Fontes", h: "06:18", x: 70, y: 214, passou: true },
  { nome: "Praça do Bairro Luzia", h: "06:24", x: 120, y: 205, passou: true },
  { nome: "Av. Beira Mar · Jardins", h: "06:31", x: 160, y: 190, passou: false },
  { nome: "Mercado Thales Ferraz", h: "06:38", x: 200, y: 165, passou: false },
  { nome: "E.M.E.F. Poeta João Ribeiro", h: "06:45", x: 245, y: 125, passou: false },
];

export const ROTA_BUS = "M30 300 L40 260 L70 214 L120 205 L160 190 L200 165 L245 125";
