'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, TrendingDown, BarChart2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCLP, type Product } from '@/lib/mockData';

/* ─────────────────────────────────────────────
   QUANTITY CONTROL
   ───────────────────────────────────────────── */
interface QtyControlProps {
  qty: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

function QtyControl({ qty, onDecrement, onIncrement }: QtyControlProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onDecrement}
        aria-label="Disminuir cantidad"
        className="
          w-7 h-7 flex items-center justify-center rounded-md
          bg-surface2 border border-border
          text-text-muted hover:text-text hover:border-accent-primary/40
          transition-all duration-150 active:scale-90
        "
      >
        <Minus size={12} strokeWidth={2.5} />
      </button>
      <span
        className="w-7 text-center text-sm font-bold text-text tabular-nums"
        aria-label={`Cantidad: ${qty}`}
      >
        {qty}
      </span>
      <button
        onClick={onIncrement}
        aria-label="Aumentar cantidad"
        className="
          w-7 h-7 flex items-center justify-center rounded-md
          bg-surface2 border border-border
          text-text-muted hover:text-text hover:border-accent-primary/40
          transition-all duration-150 active:scale-90
        "
      >
        <Plus size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CART ITEM ROW
   ───────────────────────────────────────────── */
interface CartItemRowProps {
  product: Product;
  qty: number;
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

function CartItemRow({ product, qty, onUpdate, onRemove }: CartItemRowProps) {
  const subtotal = product.precios.precioPYME * qty;

  return (
    <li className="flex items-start gap-3 py-3 border-b border-border/60 last:border-0 group">
      {/* Color thumbnail */}
      <span
        className="
          w-12 h-12 rounded-md shrink-0 flex items-center justify-center
          transition-transform duration-200 group-hover:scale-105
        "
        style={{ backgroundColor: product.colorPlaceholder + '28' }}
        aria-hidden
      >
        <span
          className="w-6 h-6 rounded-sm"
          style={{ backgroundColor: product.colorPlaceholder }}
        />
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text leading-tight truncate">
          {product.nombre}
        </p>
        <p className="text-xs text-text-muted mt-0.5">
          {product.marca} · {product.descripcion}
        </p>

        <div className="flex items-center justify-between mt-2">
          <QtyControl
            qty={qty}
            onDecrement={() => onUpdate(product.id, qty - 1)}
            onIncrement={() => onUpdate(product.id, qty + 1)}
          />
          <span className="text-sm font-bold text-accent-secondary tabular-nums">
            {formatCLP(subtotal)}
          </span>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onRemove(product.id)}
        aria-label={`Eliminar ${product.nombre}`}
        className="
          mt-0.5 p-1.5 rounded-md shrink-0
          text-text-muted/40 hover:text-danger hover:bg-danger/10
          transition-all duration-150 opacity-0 group-hover:opacity-100
          focus:opacity-100
        "
      >
        <Trash2 size={14} strokeWidth={2} />
      </button>
    </li>
  );
}

/* ─────────────────────────────────────────────
   SMART CART DRAWER
   ───────────────────────────────────────────── */
export function SmartCart() {
  const {
    items,
    isCartOpen,
    closeCart,
    openModal,
    updateQuantity,
    removeFromCart,
    totalPYME,
    totalAhorro,
    totalItems,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /* ── Focus trap + Escape ── */
  useEffect(() => {
    if (!isCartOpen) return;

    // Move focus to close button when drawer opens
    const timer = setTimeout(() => closeButtonRef.current?.focus(), 80);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeCart(); return; }

      // Tab trap: cycle focus within the drawer
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'button, a, input, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute('disabled'));

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => { clearTimeout(timer); document.removeEventListener('keydown', handleKey); };
  }, [isCartOpen, closeCart]);

  /* ── Prevent body scroll when open ── */
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const handleCompare = useCallback(() => {
    closeCart();
    // Small delay so drawer exit animation doesn't clash with modal entrance
    setTimeout(() => openModal(), 200);
  }, [closeCart, openModal]);

  const isEmpty = items.length === 0;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={closeCart}
        aria-hidden
        className={`
          fixed inset-0 z-50 bg-bg/70 backdrop-blur-sm
          transition-opacity duration-300
          ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* ── Drawer panel ── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`
          fixed right-0 top-0 h-full z-[60]
          w-full max-w-[400px]
          bg-bg border-l border-border
          shadow-[-16px_0_48px_rgba(0,0,0,0.4)]
          flex flex-col
          transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-accent-primary" strokeWidth={2} />
            <h2 className="font-heading text-base font-bold text-text">
              Tu Carrito
            </h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 rounded-pill bg-accent-primary/15 text-accent-primary text-xs font-bold">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="p-2 rounded-full text-text-muted hover:text-text hover:bg-surface2 transition-all duration-150"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* ── Items list ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-2">
          {isEmpty ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center">
                <ShoppingBag size={28} className="text-text-muted/50" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-lg text-text">¡Tu carrito está vacío!</p>
                <p className="text-sm text-text-muted mt-2">
                  Empieza a ahorrar agregando productos.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 mt-2 rounded-pill bg-accent-primary/15 border border-accent-primary/30 text-accent-primary text-sm font-bold hover:bg-accent-primary hover:text-bg transition-all duration-200"
              >
                Volver a comprar
              </button>
            </div>
          ) : (
            <ul aria-label="Productos en el carrito">
              {items.map(({ product, qty }) => (
                <CartItemRow
                  key={product.id}
                  product={product}
                  qty={qty}
                  onUpdate={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer (sticky) — only when items exist ── */}
        {!isEmpty && (
          <div className="shrink-0 border-t border-border bg-surface/60 backdrop-blur-sm px-5 py-4 flex flex-col gap-3">

            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm text-text-muted">
                <span>Subtotal PYME</span>
                <span className="font-semibold text-text tabular-nums">{formatCLP(totalPYME)}</span>
              </div>

              {totalAhorro > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-accent-secondary font-medium">
                    <TrendingDown size={14} strokeWidth={2.5} />
                    Ahorro acumulado
                  </span>
                  <span className="font-bold text-accent-secondary tabular-nums">
                    {formatCLP(totalAhorro)}
                  </span>
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={handleCompare}
              className="
                w-full flex items-center justify-center gap-2.5
                py-3.5 rounded-lg
                bg-accent-primary hover:bg-accent-primary/90
                text-bg font-bold text-base
                shadow-[0_4px_20px_rgba(232,134,50,0.35)]
                hover:shadow-[0_6px_28px_rgba(232,134,50,0.45)]
                transition-all duration-200 active:scale-[0.98]
              "
            >
              <BarChart2 size={18} strokeWidth={2.5} />
              Comparar y Comprar
            </button>

            <p className="text-center text-[10px] text-text-muted">
              Verás cuánto ahorras vs. Jumbo, Lider y Tottus
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default SmartCart;
