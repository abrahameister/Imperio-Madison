'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ShoppingCart, Search, X, Leaf, Tag } from 'lucide-react';
import { useScrollShrink } from '@/hooks/useScrollShrink';
import { useTypingPlaceholder } from '@/hooks/useTypingPlaceholder';
import { useDebounce } from '@/hooks/useDebounce';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { mockProducts, formatCLP, normalizeStr, type Product } from '@/lib/mockData';

/* ─────────────────────────────────────────────
   LOGO SENSORIAL
   ───────────────────────────────────────────── */
function LogoSensorial() {
  return (
    <a
      href="/"
      aria-label="Imperio Madison — Inicio"
      className="group flex items-center gap-1.5 select-none shrink-0 transition-all duration-300"
    >
      <span
        className="
          relative flex items-center justify-center w-8 h-8 rounded-lg
          bg-accent-secondary/20 border border-accent-secondary/30
          group-hover:bg-accent-secondary/30
          group-hover:shadow-[0_0_16px_2px_#86AB4566]
          transition-all duration-300
        "
        aria-hidden
      >
        <Leaf
          size={16}
          className="text-accent-secondary group-hover:scale-110 transition-transform duration-300"
          strokeWidth={2.5}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-text-muted group-hover:text-text transition-colors duration-300">
          Imperio
        </span>
        <span className="text-[19px] font-bold tracking-tight text-text group-hover:drop-shadow-[0_0_10px_#86AB4566] transition-all duration-300">
          Madison<span className="text-accent-secondary">.</span>
        </span>
      </span>
    </a>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT THUMBNAIL
   ───────────────────────────────────────────── */
function ProductThumb({ product }: { product: Product }) {
  if (product.imagenUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.imagenUrl}
        alt={product.nombre}
        className="w-10 h-10 rounded-md object-cover shrink-0"
      />
    );
  }
  return (
    <span
      className="w-10 h-10 rounded-md shrink-0 flex items-center justify-center"
      style={{ backgroundColor: product.colorPlaceholder + '33' }}
      aria-hidden
    >
      <span
        className="w-5 h-5 rounded-sm"
        style={{ backgroundColor: product.colorPlaceholder }}
      />
    </span>
  );
}

/* ─────────────────────────────────────────────
   SEARCH DROPDOWN
   ───────────────────────────────────────────── */
interface SearchDropdownProps {
  results: Product[];
  query: string;
  onSelect: (product: Product) => void;
  onSuggest: () => void;
  isVisible: boolean;
}

function SearchDropdown({ results, query, onSelect, onSuggest, isVisible }: SearchDropdownProps) {
  if (!isVisible) return null;

  const isEmpty = query.length > 0 && results.length === 0;
  const hasResults = results.length > 0;

  return (
    <div
      role="listbox"
      aria-label="Resultados de búsqueda"
      className="
        absolute top-[calc(100%+8px)] left-0 right-0 z-50
        bg-surface/95 backdrop-blur-xl
        border border-border rounded-lg
        shadow-[0_16px_48px_rgba(0,0,0,0.5)]
        overflow-hidden
        animate-slide-down
      "
    >
      {/* ── Results list ── */}
      {hasResults && (
        <ul className="max-h-[340px] overflow-y-auto overscroll-contain divide-y divide-border/50">
          {results.map((product) => (
            <li key={product.id} role="option" aria-selected={false}>
              <button
                onMouseDown={(e) => { e.preventDefault(); onSelect(product); }}
                className="
                  w-full flex items-center gap-3 px-4 py-3
                  hover:bg-surface2/70 active:bg-surface2
                  transition-colors duration-100
                  text-left group/item
                "
              >
                {/* Thumbnail */}
                <ProductThumb product={product} />

                {/* Name + meta */}
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-text truncate group-hover/item:text-accent-secondary transition-colors duration-150">
                    {product.nombre}
                  </span>
                  <span className="text-xs text-text-muted">
                    {product.marca} · {product.descripcion} · {product.categoria}
                  </span>
                </span>

                {/* PYME price — the hero number */}
                <span className="shrink-0 text-right">
                  <span className="block text-base font-bold text-accent-secondary">
                    {formatCLP(product.precios.precioPYME)}
                  </span>
                  <span className="flex items-center gap-0.5 justify-end text-[10px] text-text-muted">
                    <Tag size={9} />
                    precio PYME
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="px-5 py-6 flex flex-col items-center gap-4 text-center">
          <span
            className="
              flex items-center justify-center w-10 h-10 rounded-full
              bg-warning/10 border border-warning/20
            "
            aria-hidden
          >
            <Search size={18} className="text-warning" strokeWidth={2} />
          </span>
          <div>
            <p className="text-sm font-medium text-text">
              No encontramos &quot;{query}&quot;
            </p>
            <p className="text-xs text-text-muted mt-1 max-w-[260px]">
              No encontramos ese producto, pero seguro tenemos una alternativa más barata.
            </p>
          </div>
          <button
            onMouseDown={(e) => { e.preventDefault(); onSuggest(); }}
            className="mt-1 px-4 py-2.5 bg-accent-primary text-bg font-bold text-xs rounded-lg hover:bg-accent-primary/90 transition-colors active:scale-95"
          >
            ¿No encuentras lo que buscas? Pídelo aquí
          </button>
        </div>
      )}

      {/* ── Footer hint ── */}
      {hasResults && (
        <div className="px-4 py-2 border-t border-border/60 bg-bg/40">
          <p className="text-[10px] text-text-muted">
            {results.length} resultado{results.length !== 1 ? 's' : ''} · Agrega al carrito para comparar precios finales
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SEARCH BAR (Desktop) — upgraded with dropdown
   ───────────────────────────────────────────── */
interface SearchBarProps {
  onFocusChange: (focused: boolean) => void;
  onQueryChange: (q: string) => void;
}

function SearchBar({ onFocusChange, onQueryChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 350);
  const placeholder = useTypingPlaceholder();
  const { products, isLoading } = useProducts();
  const { openSuggestion } = useCart();

  /* ── Filter products locally (accent-insensitive via NFD) ── */
  const searchResults = useMemo<Product[]>(() => {
    const q = normalizeStr(debouncedQuery.trim());
    if (!q) return [];
    return products.filter(
      (p) =>
        normalizeStr(p.nombre).includes(q) ||
        normalizeStr(p.marca).includes(q) ||
        normalizeStr(p.categoria).includes(q) ||
        normalizeStr(p.descripcion).includes(q),
    );
  }, [debouncedQuery, products]);


  /* ── Emit to parent ── */
  useEffect(() => { onQueryChange(debouncedQuery); }, [debouncedQuery, onQueryChange]);

  /* ── Show/hide dropdown based on query ── */
  useEffect(() => {
    setIsDropdownOpen(debouncedQuery.trim().length > 0);
  }, [debouncedQuery]);

  /* ── Close on outside click ── */
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setIsFocused(false);
        onFocusChange(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [onFocusChange]);

  /* ── Close on Escape ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
        setIsFocused(false);
        onFocusChange(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isDropdownOpen, onFocusChange]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange(true);
    if (debouncedQuery.trim()) setIsDropdownOpen(true);
  };

  const handleClear = () => {
    setQuery('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleSelect = (product: Product) => {
    setQuery(product.nombre);
    setIsDropdownOpen(false);
    setIsFocused(false);
    onFocusChange(false);
    // Future: open product detail / add to cart flow
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Input wrapper */}
      <div
        className={`
          relative flex items-center rounded-pill border
          transition-all duration-300 ease-out
          bg-surface/80
          ${isFocused || isDropdownOpen
            ? 'border-accent-primary shadow-[0_0_0_3px_#E8863222] scale-[1.012]'
            : 'border-border hover:border-text-muted/40'
          }
          ${isDropdownOpen ? 'rounded-b-none border-b-transparent' : ''}
        `}
      >
        <Search
          size={18}
          className={`absolute left-3.5 shrink-0 pointer-events-none transition-colors duration-200 ${isFocused || isDropdownOpen ? 'text-accent-primary' : 'text-text-muted'}`}
          strokeWidth={2}
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          value={query}
          placeholder={isFocused ? '' : placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          aria-label="Buscar productos"
          className="
            w-full bg-transparent outline-none
            pl-10 pr-10 py-2.5
            text-sm text-text placeholder:text-text-muted/60
            rounded-pill
          "
        />
        {query && (
          <button
            onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 p-0.5 rounded-full text-text-muted hover:text-text hover:bg-surface2 transition-all duration-150"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown — attaches flush to the bottom of the input wrapper */}
      <SearchDropdown
        results={searchResults}
        query={debouncedQuery.trim()}
        onSelect={handleSelect}
        onSuggest={openSuggestion}
        isVisible={isDropdownOpen}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOBILE SEARCH MODAL — upgraded with dropdown
   ───────────────────────────────────────────── */
interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQueryChange: (q: string) => void;
}

function MobileSearchModal({ isOpen, onClose, onQueryChange }: MobileSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 350);
  const placeholder = useTypingPlaceholder();
  const { products, isLoading } = useProducts();
  const { openSuggestion } = useCart();

  const searchResults = useMemo<Product[]>(() => {
    const q = normalizeStr(debouncedQuery.trim());
    if (!q) return [];
    return products.filter(
      (p) =>
        normalizeStr(p.nombre).includes(q) ||
        normalizeStr(p.marca).includes(q) ||
        normalizeStr(p.categoria).includes(q),
    );
  }, [debouncedQuery, products]);


  useEffect(() => { onQueryChange(debouncedQuery); }, [debouncedQuery, onQueryChange]);

  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 50); }
    else { setQuery(''); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEmpty = debouncedQuery.trim().length > 0 && searchResults.length === 0;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      <div className="absolute inset-0 bg-bg/90 backdrop-blur-md" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full bg-surface border-b border-border px-4 pt-safe-top pb-4 shadow-md animate-slide-down">

        {/* Input row */}
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Search size={20} className="text-accent-primary shrink-0" strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="Buscar productos"
            className="flex-1 bg-transparent outline-none text-base text-text placeholder:text-text-muted/60"
          />
          <button
            onClick={onClose}
            aria-label="Cerrar búsqueda"
            className="p-2 rounded-full text-text-muted hover:text-text hover:bg-surface2 transition-all duration-150"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick hint chips — only when no query */}
        {!query && (
          <div className="flex flex-wrap gap-2 mt-3 max-w-lg mx-auto">
            {["Azúcar Iansa", "Aceite Natura", "Leche Colun", "Nescafé"].map((hint) => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                className="text-xs px-3 py-1.5 rounded-pill bg-surface2/80 border border-border text-text-muted hover:text-text hover:border-accent-primary/40 transition-all duration-150"
              >
                {hint}
              </button>
            ))}
          </div>
        )}

        {/* Results inline */}
        {searchResults.length > 0 && (
          <ul className="mt-3 max-h-[55vh] overflow-y-auto overscroll-contain divide-y divide-border/50 max-w-lg mx-auto rounded-lg border border-border overflow-hidden">
            {searchResults.map((product) => (
              <li key={product.id}>
                <button
                  onClick={() => { setQuery(product.nombre); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface2/70 transition-colors duration-100 text-left"
                >
                  <ProductThumb product={product} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-text truncate">{product.nombre}</span>
                    <span className="text-xs text-text-muted">{product.descripcion}</span>
                  </span>
                  <span className="text-base font-bold text-accent-secondary shrink-0">
                    {formatCLP(product.precios.precioPYME)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="mt-3 px-4 py-5 text-center max-w-lg mx-auto rounded-lg border border-border bg-surface2/30 flex flex-col items-center gap-4">
            <div>
              <p className="text-sm font-medium text-text">Sin resultados para &quot;{debouncedQuery.trim()}&quot;</p>
              <p className="text-xs text-text-muted mt-1">
                No encontramos ese producto, pero seguro tenemos una alternativa más barata.
              </p>
            </div>
            <button
              onClick={() => { onClose(); openSuggestion(); }}
              className="px-4 py-2.5 bg-accent-primary text-bg font-bold text-xs rounded-lg hover:bg-accent-primary/90 transition-colors w-full shadow-md"
            >
              ¿No encuentras lo que buscas? Pídelo aquí
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CART BUTTON
   ───────────────────────────────────────────── */
function CartButton() {
  const { totalItems, openCart } = useCart();
  const hasItems = totalItems > 0;

  return (
    <button
      onClick={openCart}
      aria-label={`Abrir carrito — ${totalItems} items`}
      className="relative flex items-center justify-center w-10 h-10 rounded-full shrink-0 text-text hover:text-accent-primary hover:bg-surface2/60 transition-all duration-200 active:scale-95"
    >
      <ShoppingCart size={22} strokeWidth={2} />
      {hasItems && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center">
          <span className="absolute inline-flex w-5 h-5 rounded-full bg-danger/40 animate-ping-slow" aria-hidden />
          <span className="relative z-10 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-[10px] font-bold text-white leading-none">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        </span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   DIM OVERLAY
   ───────────────────────────────────────────── */
function DimOverlay({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-30 bg-bg/60 backdrop-blur-[2px] pointer-events-none transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

/* ─────────────────────────────────────────────
   HEADER E-COMMERCE  ← Main export
   ───────────────────────────────────────────── */
export interface HeaderECommerceProps {
  onSearchQuery?: (query: string) => void;
}

export function HeaderECommerce({ onSearchQuery }: HeaderECommerceProps) {
  const isScrolled = useScrollShrink(20);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleQueryChange = useCallback((q: string) => { onSearchQuery?.(q); }, [onSearchQuery]);

  return (
    <>
      <DimOverlay isVisible={searchFocused} />
      <MobileSearchModal
        isOpen={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
        onQueryChange={handleQueryChange}
      />

      <header
        className={`
          sticky top-0 z-40 w-full
          transition-all duration-300 ease-out
          ${isScrolled
            ? 'h-14 bg-bg/75 backdrop-blur-xl border-b border-border shadow-md'
            : 'h-[68px] bg-bg border-b border-transparent'
          }
        `}
      >
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3">

          {/* Logo */}
          <LogoSensorial />

          {/* Desktop search — full width center */}
          <div className="hidden md:flex flex-1 justify-center relative z-40">
            <SearchBar onFocusChange={setSearchFocused} onQueryChange={handleQueryChange} />
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* Mobile search icon */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Buscar"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-text-muted hover:text-accent-primary hover:bg-surface2/60 transition-all duration-200"
            >
              <Search size={20} strokeWidth={2} />
            </button>
            <CartButton />
          </div>

        </div>
      </header>
    </>
  );
}

export default HeaderECommerce;
