'use client';

import React, { useState, useCallback, memo, useMemo, useRef } from 'react';
import { ShoppingCart, Check, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 120 : -120, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Left fade + arrow (desktop hint) */}
      <button
        onClick={() => scroll('left')}
        className="hidden sm:flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-surface/80 border border-border text-text-muted hover:text-text mr-1"
        aria-label="Scroll filtros izquierda"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto py-1 flex-1"
        role="tablist"
        aria-label="Filtrar por categoría"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            onClick={() => onChange(cat)}
            className={`
              shrink-0 px-4 py-2 rounded-full text-sm font-medium
              border transition-all duration-200 whitespace-nowrap
              min-h-[36px] touch-manipulation
              ${active === cat
                ? 'bg-accent-primary/20 border-accent-primary text-accent-primary'
                : 'bg-surface/60 border-border text-text-muted'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className="hidden sm:flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-surface/80 border border-border text-text-muted hover:text-text ml-1"
        aria-label="Scroll filtros derecha"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD — Mobile-first rewrite
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
      className="flex flex-col bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-primary/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
      aria-label={product.nombre}
    >
      {/* ── Image area: padding-top aspect ratio trick (works everywhere) ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ paddingTop: '66.67%', backgroundColor: product.colorPlaceholder + '18' }}
      >
        {/* Savings badge */}
        {savings > 0 && (
          <span className="absolute top-2 right-2 z-20 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-accent-secondary/20 border border-accent-secondary/40 text-[10px] font-bold text-accent-secondary">
            <TrendingDown size={9} strokeWidth={2.5} />
            -{formatCLP(savings)}
          </span>
        )}

        {/* Categoria pill */}
        <span className="absolute bottom-2 left-2 z-20 px-2 py-0.5 rounded bg-bg/80 backdrop-blur-sm text-[10px] text-text-muted font-medium">
          {product.categoria}
        </span>

        {/* Image absolutely fills the padding-box */}
        {product.imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fb) fb.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback color block */}
        <div
          className="absolute inset-0 flex-col items-center justify-center gap-1 opacity-60"
          style={{ display: product.imagenUrl ? 'none' : 'flex' }}
        >
          <span className="w-10 h-10 rounded-lg" style={{ backgroundColor: product.colorPlaceholder }} />
          <span className="text-[9px] font-medium text-text-muted px-1 text-center uppercase tracking-wide line-clamp-1">{product.nombre}</span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Name */}
        <h3 className="font-heading font-semibold text-text text-sm leading-snug line-clamp-2">
          {product.nombre}
        </h3>
        <p className="text-[11px] text-text-muted -mt-1">
          {product.marca} · {product.descripcion}
        </p>

        {/* Prices */}
        <div className="flex flex-col gap-1 mt-auto">
          {/* Competitor average */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-text-muted line-through">{formatCLP(competitorAvg)}</span>
            <span className="text-[9px] text-text-muted/50 italic">prom.</span>
          </div>

          {/* Competitor badges */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="inline-flex items-center text-[9px] px-1 py-0.5 rounded bg-comp-lider/15 text-white border border-comp-lider/40 line-through font-medium">
              L: {formatCLP(product.precios.precioLider)}
            </span>
            <span className="inline-flex items-center text-[9px] px-1 py-0.5 rounded bg-comp-jumbo/15 text-white border border-comp-jumbo/40 line-through font-medium">
              J: {formatCLP(product.precios.precioJumbo)}
            </span>
            <span className="inline-flex items-center text-[9px] px-1 py-0.5 rounded bg-comp-tottus/15 text-white border border-comp-tottus/40 line-through font-medium">
              T: {formatCLP(product.precios.precioTottus)}
            </span>
          </div>

          {/* OUR price */}
          <div className="flex items-end gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-accent-secondary leading-none font-heading tracking-tight">
              {formatCLP(product.precios.precioPYME)}
            </span>
            <span className="text-[11px] text-accent-secondary/70 mb-0.5 font-medium">/ {product.unidad}</span>
          </div>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAdd}
          aria-label={added ? 'Agregado al carrito' : `Agregar ${product.nombre} al carrito`}
          disabled={added}
          className={`
            w-full flex items-center justify-center gap-1.5
            py-2.5 rounded-lg mt-1
            text-sm font-semibold
            transition-all duration-300 ease-out
            active:scale-[0.97] select-none touch-manipulation
            ${added
              ? 'bg-accent-secondary text-bg cursor-default'
              : 'bg-accent-primary text-bg hover:bg-accent-primary/90 cursor-pointer'
            }
          `}
        >
          {added ? (
            <><Check size={15} strokeWidth={2.5} />Agregado</>
          ) : (
            <><ShoppingCart size={14} strokeWidth={2} />Agregar</>
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
  const { addToCart, openSuggestion } = useCart();
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
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-text">Nuestros Productos</h2>
          <p className="text-sm text-text-muted">Tu despensa llena por mucho menos.</p>
        </div>
        {!isLoading && !error && (
          <button
            onClick={refetch}
            className="text-xs text-accent-primary hover:underline font-medium shrink-0 ml-2"
          >
            Refrescar
          </button>
        )}
      </div>

      {/* ── Category chips ── */}
      <div className="mb-5 -mx-1 px-1">
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
            className="px-6 py-2 bg-surface2 border border-border rounded-full text-sm font-bold hover:bg-surface2/80 transition-all"
          >
            Reintentar conexión
          </button>
        </div>
      ) : filteredProducts.length > 0 ? (
        /* 2 columns on mobile, 3 on md, 4 on xl */
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <span className="text-4xl" role="img" aria-label="Sin resultados">🔍</span>
          <div>
            <p className="text-text font-medium">¡Ups! No encontramos ese producto.</p>
            <p className="text-text-muted text-sm max-w-[280px] mt-1">Intenta buscar otra cosa o envíanos tu sugerencia.</p>
          </div>
          <button
            onClick={openSuggestion}
            className="mt-2 px-6 py-3 bg-accent-primary text-bg font-bold text-sm rounded-lg hover:bg-accent-primary/90 transition-all active:scale-[0.98]"
          >
            ¿No encuentras lo que buscas? Pídelo aquí
          </button>
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
