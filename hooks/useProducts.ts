'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { type Product, type ProductCategory } from '@/lib/mockData';

/* ── Row returned from the JOIN / view ── */
interface ProductosRow {
  id: string;
  nombre: string;
  descripcion: string;
  marca: string;
  categoria: string;
  unidad: string;
  imagen_url: string | null;
  color_placeholder: string;
  destacado: boolean;
  precios: {
    precio_pyme: number;
    precio_lider: number;
    precio_jumbo: number;
    precio_tottus: number;
  }[];
}

/** Maps a Supabase row to the Product shape used throughout the app. */
function toProduct(row: ProductosRow): Product {
  const p = row.precios?.[0] ?? {
    precio_pyme: 0,
    precio_lider: 0,
    precio_jumbo: 0,
    precio_tottus: 0,
  };
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    marca: row.marca,
    categoria: row.categoria as ProductCategory,
    unidad: row.unidad,
    imagenUrl: row.imagen_url ?? undefined,
    colorPlaceholder: row.color_placeholder,
    destacado: row.destacado,
    precios: {
      precioPYME:   p.precio_pyme,
      precioLider:  p.precio_lider,
      precioJumbo:  p.precio_jumbo,
      precioTottus: p.precio_tottus,
    },
  };
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches all products + prices from Supabase.
 * SELECT productos.*, precios(*)
 */
export function useProducts(): UseProductsReturn {
  const [products, setProducts]   = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [tick, setTick]           = useState(0);

  const refetch = () => setTick((t) => t + 1);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    supabase
      .from('productos')
      .select(`
        id,
        nombre,
        descripcion,
        marca,
        categoria,
        unidad,
        imagen_url,
        color_placeholder,
        destacado,
        precios (
          precio_pyme,
          precio_lider,
          precio_jumbo,
          precio_tottus
        )
      `)
      .order('nombre')
      .then(({ data, error: sbError }) => {
        if (cancelled) return;
        if (sbError) {
          console.error('[useProducts] Supabase error:', sbError);
          setError('No pudimos cargar los productos. Intenta de nuevo.');
        } else {
          setProducts((data as ProductosRow[]).map(toProduct));
        }
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick]);

  return { products, isLoading, error, refetch };
}
