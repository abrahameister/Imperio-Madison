'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { type Product, type ProductPrices, avgCompetitorPrice } from '@/lib/mockData';

/* ─────────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────────── */
export interface CartItem {
  product: Product;
  qty: number;
}

interface CartTotals {
  totalItems: number;
  totalPYME: number;
  totalCompetencia: number;
  totalAhorro: number;
  /** Per-chain totals for MagicComparisonModal */
  totalLider: number;
  totalJumbo: number;
  totalTottus: number;
}

interface CartContextValue extends CartTotals {
  items: CartItem[];
  /* Cart actions */
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  /* UI state */
  isCartOpen: boolean;
  isModalOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openModal: () => void;
  closeModal: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/* ─────────────────────────────────────────────────────────────────
   Totals calculation
   ───────────────────────────────────────────────────────────────── */
function calcTotals(items: CartItem[]): CartTotals {
  let totalItems = 0;
  let totalPYME = 0;
  let totalLider = 0;
  let totalJumbo = 0;
  let totalTottus = 0;

  for (const { product: p, qty: q } of items) {
    totalItems += q;
    totalPYME += p.precios.precioPYME * q;
    totalLider += p.precios.precioLider * q;
    totalJumbo += p.precios.precioJumbo * q;
    totalTottus += p.precios.precioTottus * q;
  }

  const totalCompetencia = items.reduce(
    (s, { product: p, qty: q }) => s + avgCompetitorPrice(p.precios) * q,
    0,
  );

  return {
    totalItems,
    totalPYME,
    totalCompetencia,
    totalAhorro: totalCompetencia - totalPYME,
    totalLider,
    totalJumbo,
    totalTottus,
  };
}

/* ─────────────────────────────────────────────────────────────────
   Provider
   ───────────────────────────────────────────────────────────────── */
export function CartProvider({ children }: { children: React.ReactNode }) {
  /* ── Hydrate from localStorage on first mount (client only) ── */
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('im_cart');
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ── Persist to localStorage on every change ── */
  useEffect(() => {
    try {
      localStorage.setItem('im_cart', JSON.stringify(items));
    } catch {
      // quota exceeded or private mode — silent fail
    }
  }, [items]);


  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, qty } : i)),
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => { setIsCartOpen(true); setIsModalOpen(false); }, []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const openModal = useCallback(() => { setIsModalOpen(true); setIsCartOpen(false); }, []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const totals = useMemo(() => calcTotals(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ...totals,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      isModalOpen,
      openCart,
      closeCart,
      openModal,
      closeModal,
    }),
    [items, totals, addToCart, removeFromCart, updateQuantity, clearCart,
     isCartOpen, isModalOpen, openCart, closeCart, openModal, closeModal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* ─────────────────────────────────────────────────────────────────
   Hooks
   ───────────────────────────────────────────────────────────────── */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside <CartProvider>');
  return ctx;
}

export function useCartCount(): number { return useCart().totalItems; }

export function useCartSavings() {
  const { totalPYME, totalCompetencia, totalAhorro, totalLider, totalJumbo, totalTottus } = useCart();
  return { totalPYME, totalCompetencia, totalAhorro, totalLider, totalJumbo, totalTottus };
}

export type { CartTotals, ProductPrices };
