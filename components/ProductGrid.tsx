'use client';

import React, { useState, useCallback, memo, useMemo } from 'react';
import { ShoppingCart, Check, TrendingDown } from 'lucide-react';
import { formatCLP, maxSavings, avgCompetitorPrice, type Product } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';
import { ProductGridSkeleton } from './ProductSkeletons';
import { useProducts } from '@/hooks/useProducts';

/* ─────────────────────────────────────────────
   CATEGORY FILTER CHIPS
   ───────────────────────────────────────────── */
const ALL_CATEGORIES = ['Todos', 'Abarrotes', 'Aceites y Condimentos', 'Lácteos', 'Limpieza', 'Higiene Personal', 'Desayuno'] as const;
type FilterCategory = typeof ALL_CATEGORIES[number];

interface CategoryChipsProps {
  active: FilterCategory;
  onChange: (cat: FilterCategory) => void;
}

function CategoryChips({ active, onChange }: CategoryChipsProps) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
      role="tablist"
      aria-label="Filtrar por categoría"
    >
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          onClick={() => onChange(cat)}
          className={`
            shrink-0 px-4 py-1.5 rounded-pill text-sm font-medium
            border transition-all duration-200 whitespace-nowrap
            ${active === cat
              ? 'bg-accent-primary/20 border-accent-primary text-accent-primary'
              : 'bg-surface/60 border-border text-text-muted hover:border-text-muted/50 hover:text-text'
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
   ───────────────────────────────────────────── */
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = memo(function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const savings = maxSavings(product.precios);
  const competitorAvg = avgCompetitorPrice(product.precios);

  const handleAdd = useCallback(() => {
    if (added) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  }, [added, onAddToCart, product]);

  return (
    <article
      className="
        group relative flex flex-col
        bg-surface border border-border rounded-lg
        overflow-hidden
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-[0_12px_32px_rgba(232,134,50,0.12),0_4px_12px_rgba(0,0,0,0.25)]
        hover:border-accent-primary/25
      "
      aria-label={product.nombre}
    >
      {/* ── Savings badge ── */}
      {savings > 0 && (
        <span
          className="
            absolute top-3 right-3 z-10
            flex items-center gap-1
            px-2 py-0.5 rounded-pill
            bg-accent-secondary/20 border border-accent-secondary/40
            text-[11px] font-bold text-accent-secondary
          "
          aria-label={`Ahorras ${formatCLP(savings)}`}
        >
          <TrendingDown size={10} strokeWidth={2.5} />
          Ahorras {formatCLP(savings)}
        </span>
      )}

      {/* ── Product image / color block ── */}
      <div
        className="
          relative w-full aspect-[4/3]
          flex items-center justify-center
          overflow-hidden
        "
        style={{ backgroundColor: product.colorPlaceholder + '1A' }}
        aria-hidden
      >
        {product.imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-80">
            <span
              className="w-16 h-16 rounded-xl shadow-inner"
              style={{ backgroundColor: product.colorPlaceholder }}
            />
            <span className="text-xs font-medium text-text-muted">{product.marca}</span>
          </div>
        )}

        {/* Categoria pill */}
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-sm bg-bg/70 backdrop-blur-sm text-[10px] text-text-muted font-medium">
          {product.categoria}
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Name + description */}
        <div>
          <h3 className="font-heading font-semibold text-text leading-snug line-clamp-2">
            {product.nombre}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {product.marca} · {product.descripcion}
          </p>
        </div>

        {/* ── Price hierarchy ── */}
        <div className="flex flex-col gap-1">

          {/* Competitor average — tachado */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-muted line-through">
              {formatCLP(competitorAvg)}
            </span>
            <span className="text-[10px] text-text-muted/60 italic">prom. supermercado</span>
          </div>

          {/* Individual competitor prices — small strip */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-comp-lider/15 text-comp-lider border border-comp-lider/20 line-through">
              L: {formatCLP(product.precios.precioLider)}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-comp-jumbo/15 text-comp-jumbo border border-comp-jumbo/20 line-through">
              J: {formatCLP(product.precios.precioJumbo)}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-comp-tottus/15 text-comp-tottus border border-comp-tottus/20 line-through">
              T: {formatCLP(product.precios.precioTottus)}
            </span>
          </div>

          {/* PYME price — THE hero number */}
          <div className="flex items-end gap-1 mt-1">
            <span className="text-2xl font-extrabold text-accent-secondary leading-none font-heading tracking-tight">
              {formatCLP(product.precios.precioPYME)}
            </span>
            <span className="text-xs text-accent-secondary/70 mb-0.5 font-medium">
              / {product.unidad}
            </span>
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* ── Add to cart button ── */}
        <button
          onClick={handleAdd}
          aria-label={added ? 'Agregado al carrito' : `Agregar ${product.nombre} al carrito`}
          disabled={added}
          className={`
            w-full flex items-center justify-center gap-2
            py-2.5 rounded-md
            text-sm font-semibold
            transition-all duration-300 ease-out
            active:scale-[0.97] select-none
            ${added
              ? 'bg-accent-secondary text-bg cursor-default shadow-[0_4px_16px_rgba(134,171,69,0.25)]'
              : 'bg-accent-primary text-bg hover:bg-accent-primary/90 hover:shadow-[0_4px_16px_rgba(232,134,50,0.30)] cursor-pointer'
            }
          `}
        >
          {added ? (
            <>
              <Check size={16} strokeWidth={2.5} />
              Agregado
            </>
          ) : (
            <>
              <ShoppingCart size={15} strokeWidth={2} />
              Agregar al carrito
            </>
          )}
        </button>
      </div>
    </article>
  );
});

/* ─────────────────────────────────────────────
   PRODUCT GRID — Main export
   ───────────────────────────────────────────── */
export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('Todos');
  const { addToCart } = useCart();
  const { products, isLoading, error, refetch } = useProducts();

  const handleAddToCart = useCallback(
    (product: Product) => addToCart(product),
    [addToCart],
  );

  const filteredProducts = useMemo(() => {
    return activeCategory === 'Todos'
      ? products
      : products.filter((p) => p.categoria === activeCategory);
  }, [products, activeCategory]);

  return (
    <section aria-label="Catálogo de productos" className="w-full">

      {/* ── Section header ── */}
      <div className="flex items-end justify-between mb-5">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-xl font-bold text-text">
            Nuestros Productos
          </h2>
          <p className="text-sm text-text-muted">
            Precios PYME imbatibles. Real-time desde Supabase.
          </p>
        </div>
        {!isLoading && !error && (
          <button 
            onClick={refetch}
            className="text-xs text-accent-primary hover:underline font-medium"
          >
            Refrescar
          </button>
        )}
      </div>

      {/* ── Category chips ── */}
      <div className="mb-5">
        <CategoryChips active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* ── Main content area ── */}
      {isLoading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center border border-dashed border-border rounded-xl bg-surface/30">
          <p className="text-danger font-medium">{error}</p>
          <button 
            onClick={refetch}
            className="px-6 py-2 bg-surface2 border border-border rounded-pill text-sm font-bold hover:bg-surface2/80 transition-all"
          >
            Reintentar conexión
          </button>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div
          className="
            grid gap-4
            grid-cols-2
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <span className="text-4xl" role="img" aria-label="Sin resultados">🔍</span>
          <p className="text-text font-medium">Sin productos en esta categoría</p>
          <p className="text-text-muted text-sm">Selecciona otra categoría para ver más productos.</p>
        </div>
      )}

      {/* ── Count footer ── */}
      {!isLoading && !error && (
        <p className="mt-4 text-xs text-text-muted text-right">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      )}
    </section>
  );
}

export default ProductGrid;
