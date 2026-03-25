/* ─────────────────────────────────────────────────────────────────
   Imperio Madison — Mock Product Data
   Regla de negocio: precioPYME < min(precioLider, precioJumbo, precioTottus)
   Formato CLP, sin decimales.
   ───────────────────────────────────────────────────────────────── */

export type ProductCategory =
  | 'Abarrotes'
  | 'Aceites y Condimentos'
  | 'Lácteos'
  | 'Limpieza'
  | 'Higiene Personal'
  | 'Desayuno'
  | 'Snacks';

export interface ProductPrices {
  precioPYME: number;   // ← siempre el más barato
  precioLider: number;
  precioJumbo: number;
  precioTottus: number;
}

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;          // peso / volumen / variedad
  marca: string;
  categoria: ProductCategory;
  imagenUrl?: string;           // opcional; usamos color placeholder si falta
  colorPlaceholder: string;     // color CSS para el thumbnail cuando no hay imagen
  precios: ProductPrices;
  unidad: string;               // 'kg' | 'L' | 'un' | 'pack'
  destacado?: boolean;          // producto featured en grid
}

/* ────────────────────────
   LISTA DE PRODUCTOS
   ──────────────────────── */
export const mockProducts: Product[] = [
  {
    id: 'azucar-iansa-1kg',
    nombre: 'Azúcar Iansa',
    descripcion: '1 kg',
    marca: 'Iansa',
    categoria: 'Abarrotes',
    colorPlaceholder: '#C8902A',
    unidad: 'kg',
    destacado: true,
    precios: {
      precioPYME: 890,
      precioLider: 1050,
      precioJumbo: 1099,
      precioTottus: 990,
    },
  },
  {
    id: 'aceite-natura-1l',
    nombre: 'Aceite Maravilla Natura',
    descripcion: '1 litro',
    marca: 'Natura',
    categoria: 'Aceites y Condimentos',
    colorPlaceholder: '#D4A017',
    unidad: 'L',
    destacado: true,
    precios: {
      precioPYME: 1490,
      precioLider: 1749,
      precioJumbo: 1799,
      precioTottus: 1690,
    },
  },
  {
    id: 'arroz-tucapel-1kg',
    nombre: 'Arroz Tucapel Grano Largo',
    descripcion: '1 kg',
    marca: 'Tucapel',
    categoria: 'Abarrotes',
    colorPlaceholder: '#B7C4A0',
    unidad: 'kg',
    destacado: true,
    precios: {
      precioPYME: 1090,
      precioLider: 1299,
      precioJumbo: 1249,
      precioTottus: 1199,
    },
  },
  {
    id: 'papel-higienico-confort-4un',
    nombre: 'Papel Higiénico Confort',
    descripcion: 'Pack 4 doble hoja',
    marca: 'Confort',
    categoria: 'Higiene Personal',
    colorPlaceholder: '#E8E0D5',
    unidad: 'pack',
    precios: {
      precioPYME: 1890,
      precioLider: 2199,
      precioJumbo: 2290,
      precioTottus: 2099,
    },
  },
  {
    id: 'nescafe-tradicion-200g',
    nombre: 'Nescafé Tradición',
    descripcion: '200 g',
    marca: 'Nescafé',
    categoria: 'Desayuno',
    colorPlaceholder: '#6B3A2A',
    unidad: 'un',
    destacado: true,
    precios: {
      precioPYME: 4290,
      precioLider: 4990,
      precioJumbo: 5190,
      precioTottus: 4790,
    },
  },
  {
    id: 'detergente-omo-matic-3kg',
    nombre: 'Detergente OMO Matic',
    descripcion: '3 kg',
    marca: 'OMO',
    categoria: 'Limpieza',
    colorPlaceholder: '#1A6FA8',
    unidad: 'kg',
    precios: {
      precioPYME: 6490,
      precioLider: 7490,
      precioJumbo: 7690,
      precioTottus: 7199,
    },
  },
  {
    id: 'leche-colun-1l',
    nombre: 'Leche Entera Colun',
    descripcion: '1 litro',
    marca: 'Colun',
    categoria: 'Lácteos',
    colorPlaceholder: '#F5F0E8',
    unidad: 'L',
    precios: {
      precioPYME: 790,
      precioLider: 950,
      precioJumbo: 990,
      precioTottus: 899,
    },
  },
  {
    id: 'fideos-carozzi-spaghetti-400g',
    nombre: 'Fideos Carozzi Spaghetti',
    descripcion: '400 g',
    marca: 'Carozzi',
    categoria: 'Abarrotes',
    colorPlaceholder: '#D4B483',
    unidad: 'un',
    precios: {
      precioPYME: 590,
      precioLider: 699,
      precioJumbo: 749,
      precioTottus: 650,
    },
  },
  {
    id: 'ariel-liquido-3l',
    nombre: 'Ariel Líquido Concentrado',
    descripcion: '3 litros',
    marca: 'Ariel',
    categoria: 'Limpieza',
    colorPlaceholder: '#FF6B00',
    unidad: 'L',
    precios: {
      precioPYME: 7490,
      precioLider: 8799,
      precioJumbo: 8990,
      precioTottus: 8499,
    },
  },
  {
    id: 'yogurt-nestle-frutado-165g',
    nombre: 'Yogurt Nestlé Frutado',
    descripcion: '165 g',
    marca: 'Nestlé',
    categoria: 'Lácteos',
    colorPlaceholder: '#E8A0B4',
    unidad: 'un',
    precios: {
      precioPYME: 390,
      precioLider: 490,
      precioJumbo: 499,
      precioTottus: 450,
    },
  },
  {
    id: 'bebida-coca-cola-15l',
    nombre: 'Coca-Cola Original',
    descripcion: '1.5 litros',
    marca: 'Coca-Cola',
    categoria: 'Abarrotes',
    colorPlaceholder: '#E8001A',
    unidad: 'L',
    precios: {
      precioPYME: 990,
      precioLider: 1190,
      precioJumbo: 1249,
      precioTottus: 1099,
    },
  },
  {
    id: 'mantequilla-soprole-250g',
    nombre: 'Mantequilla Soprole',
    descripcion: '250 g con sal',
    marca: 'Soprole',
    categoria: 'Lácteos',
    colorPlaceholder: '#F5D680',
    unidad: 'un',
    precios: {
      precioPYME: 1890,
      precioLider: 2199,
      precioJumbo: 2290,
      precioTottus: 2090,
    },
  },
];

/* ── Helper: format CLP ── */
export function formatCLP(value: number): string {
  return `$ ${value.toLocaleString('es-CL')}`;
}

/* ── Helper: accent + case normalization for search (NFD) ── */
export function normalizeStr(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritics
    .toLowerCase();
}

/* ── Helper: savings vs cheapest competitor ── */
export function maxSavings(precios: ProductPrices): number {
  const competitorMin = Math.min(
    precios.precioLider,
    precios.precioJumbo,
    precios.precioTottus,
  );
  return competitorMin - precios.precioPYME;
}

/* ── Helper: average competitor price ── */
export function avgCompetitorPrice(precios: ProductPrices): number {
  return Math.round(
    (precios.precioLider + precios.precioJumbo + precios.precioTottus) / 3,
  );
}
