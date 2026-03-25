'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { X, CheckCircle2, MessageCircle, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { useCart } from '@/context/CartContext';
import { formatCLP, type Product } from '@/lib/mockData';

/* ─────────────────────────────────────────────
   CHAIN COMPARISON CARD
   ───────────────────────────────────────────── */
interface ChainCardProps {
  name: string;
  total: number;
  color: string;         // border / accent color (CSS hex)
  bgColor: string;       // subtle background
  isWinner?: boolean;    // PYME card — biggest, animated
  animRef?: React.RefObject<HTMLDivElement | null>;
}

function ChainCard({ name, total, color, bgColor, isWinner = false, animRef }: ChainCardProps) {
  return (
    <div
      ref={isWinner ? (animRef as React.RefObject<HTMLDivElement>) : undefined}
      className={`
        flex flex-col items-center justify-center gap-2 rounded-xl
        border-2 transition-all duration-300
        ${isWinner
          ? 'px-6 py-7 md:py-9 shadow-[0_0_32px_rgba(134,171,69,0.20)]'
          : 'px-5 py-5 md:py-7 opacity-90'
        }
      `}
      style={{
        borderColor: color,
        backgroundColor: bgColor,
      }}
      aria-label={`${name}: ${formatCLP(total)}`}
    >
      {isWinner && (
        <span
          className="px-3 py-0.5 rounded-pill text-[11px] font-bold mb-1"
          style={{ backgroundColor: color + '28', color }}
        >
          ★ PRECIO IMBATIBLE
        </span>
      )}

      <span
        className={`font-heading font-bold tracking-tight tabular-nums`}
        style={{ color, fontSize: isWinner ? 'clamp(1.6rem, 4vw, 2.4rem)' : 'clamp(1.2rem, 3vw, 1.75rem)' }}
      >
        {formatCLP(total)}
      </span>

      <span
        className={`font-semibold ${isWinner ? 'text-base' : 'text-sm'}`}
        style={{ color: isWinner ? color : '#EAF0FF' }}
      >
        {name}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WHATSAPP CTA — builds a pre-filled message
   ───────────────────────────────────────────── */
function buildWhatsAppMessage(items: { product: Product; qty: number }[], totalPYME: number, totalAhorro: number): string {
  const lines = [
    '🛒 *Pedido Imperio Madison*',
    '',
    ...items.map(({ product: p, qty: q }) =>
      `• ${p.nombre} x${q} → ${formatCLP(p.precios.precioPYME * q)}`
    ),
    '',
    `*Total: ${formatCLP(totalPYME)}*`,
    `💚 Ahorro vs supermercado: ${formatCLP(totalAhorro)}`,
    '',
    '¡Quiero confirmar mi pedido!',
  ];
  return encodeURIComponent(lines.join('\n'));
}

/* ─────────────────────────────────────────────
   MAGIC COMPARISON MODAL
   ───────────────────────────────────────────── */
export function MagicComparisonModal() {
  const {
    items,
    isModalOpen,
    closeModal,
    totalPYME,
    totalLider,
    totalJumbo,
    totalTottus,
    totalAhorro,
  } = useCart();

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const pymeCardRef = useRef<HTMLDivElement>(null);
  const triumphRef  = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const heartbeatTl = useRef<gsap.core.Timeline | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /* ──────────────────────────────────────────
     GSAP ENTRANCE COREOGRAPHY
     1. Backdrop fades in (0.25s)
     2. Panel scales + fades (+0.1s offset)
     3. Competitor cards fan in with stagger
     4. PYME card bounces in (scale overshoot)
     5. Heartbeat loop starts on PYME card
     6. Triumph text + CTA slide up
     ────────────────────────────────────────── */
  useEffect(() => {
    if (!isModalOpen) return;

    // tiny delay to let DOM paint
    const enter = setTimeout(() => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1. Backdrop
        tl.fromTo(backdropRef.current,
          { opacity: 0 }, { opacity: 1, duration: 0.28 }
        );

        // 2. Panel
        tl.fromTo(panelRef.current,
          { opacity: 0, scale: 0.93, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.38 },
          '-=0.1'
        );

        // 3. Competitor cards staggered fan-in
        tl.fromTo(cardRefs.current.filter(Boolean),
          { opacity: 0, y: 28, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1 },
          '-=0.15'
        );

        // 4. PYME card bounce
        tl.fromTo(pymeCardRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.5)' },
          '-=0.2'
        );

        // 5. Triumph + CTA
        tl.fromTo([triumphRef.current, ctaRef.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
          '-=0.15'
        );
      });

      // 6. Heartbeat loop on PYME card (runs independently)
      heartbeatTl.current = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      heartbeatTl.current.to(pymeCardRef.current, {
        scale: 1.025,
        duration: 0.22,
        ease: 'sine.inOut',
        boxShadow: '0 0 52px rgba(134,171,69,0.35)',
      }).to(pymeCardRef.current, {
        scale: 1,
        duration: 0.22,
        ease: 'sine.inOut',
        boxShadow: '0 0 32px rgba(134,171,69,0.20)',
      });

      closeBtnRef.current?.focus();

      return () => { ctx.revert(); };
    }, 40);

    return () => {
      clearTimeout(enter);
      heartbeatTl.current?.kill();
    };
  }, [isModalOpen]);

  /* ── Escape to close ── */
  useEffect(() => {
    if (!isModalOpen) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isModalOpen, closeModal]);

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const maxCompetitor = Math.max(totalLider, totalJumbo, totalTottus);
  const maxSavingsVsWorst = maxCompetitor - totalPYME;
  const waText = buildWhatsAppMessage(items, totalPYME, totalAhorro);
  const waUrl  = `https://wa.me/56929855415?text=${waText}`;

  const CHAINS = [
    { name: 'Lider',   total: totalLider,   color: '#0071CE', bg: '#0071CE14' },
    { name: 'Jumbo',   total: totalJumbo,   color: '#00A44F', bg: '#00A44F14' },
    { name: 'Tottus',  total: totalTottus,  color: '#E31837', bg: '#E3183714' },
  ] as const;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        ref={backdropRef}
        onClick={closeModal}
        aria-hidden
        className="fixed inset-0 z-[70] bg-bg/85 backdrop-blur-md cursor-pointer"
        style={{ opacity: 0 }}
      />

      {/* ── Modal panel ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Comparación de precios"
        className="
          fixed inset-0 z-[80] flex items-center justify-center p-4
          pointer-events-none
        "
        style={{ opacity: 0 }}
      >
        <div
          className="
            relative w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain
            bg-bg border border-border rounded-2xl
            shadow-[0_24px_80px_rgba(0,0,0,0.65)]
            pointer-events-auto
          "
        >
          {/* Close btn */}
          <button
            ref={closeBtnRef}
            onClick={closeModal}
            aria-label="Cerrar comparación"
            className="
              absolute top-4 right-4 z-10
              p-2 rounded-full
              text-text-muted hover:text-text hover:bg-surface2
              transition-all duration-150
            "
          >
            <X size={20} strokeWidth={2} />
          </button>

          {/* ── Content ── */}
          <div className="px-5 sm:px-8 py-8 flex flex-col gap-8">

            {/* Title */}
            <div className="text-center pr-8">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent-primary mb-2">
                La tabla de la verdad 📊
              </p>
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-text leading-tight">
                ¿Cuánto pagarías{' '}
                <span className="text-text-muted font-medium">en cada supermercado</span>
                {' '}vs{' '}
                <span className="text-accent-secondary">nosotros</span>?
              </h2>
            </div>

            {/* ── Comparison cards grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-start">
              {/* Competitor cards */}
              <div className="col-span-2 sm:col-span-3 grid grid-cols-3 gap-3">
                {CHAINS.map((chain, i) => (
                  <div
                    key={chain.name}
                    ref={(el) => { cardRefs.current[i] = el; }}
                    style={{ opacity: 0 }}
                  >
                    <ChainCard
                      name={chain.name}
                      total={chain.total}
                      color={chain.color}
                      bgColor={chain.bg}
                    />
                  </div>
                ))}
              </div>

              {/* PYME card — winner */}
              <div
                ref={pymeCardRef}
                className="col-span-2 sm:col-span-1"
                style={{ opacity: 0 }}
              >
                <ChainCard
                  name="Imperio Madison"
                  total={totalPYME}
                  color="#86AB45"
                  bgColor="#86AB4514"
                  isWinner
                />
              </div>
            </div>

            {/* ── Triumph message ── */}
            <div
              ref={triumphRef}
              className="
                text-center px-4 py-5 rounded-xl
                bg-accent-secondary/10 border border-accent-secondary/25
              "
              style={{ opacity: 0 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 size={22} className="text-accent-secondary" strokeWidth={2.5} />
                <p className="text-xs font-bold tracking-widest uppercase text-accent-secondary">
                  Ahorro confirmado
                </p>
              </div>
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-text leading-tight">
                ¡Te ahorras hasta{' '}
                <span className="text-accent-secondary">
                  {formatCLP(maxSavingsVsWorst)}
                </span>{' '}
                en este pedido!
              </p>
              <p className="text-sm text-text-muted mt-2">
                Comparado contra el supermercado más caro de los tres.
              </p>
            </div>

            {/* ── CTA ── */}
            <div ref={ctaRef} className="flex flex-col items-center gap-3" style={{ opacity: 0 }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-full max-w-md flex items-center justify-center gap-3
                  py-4 rounded-xl
                  bg-[#25D366] hover:bg-[#1ebe59]
                  text-white font-bold text-lg
                  shadow-[0_4px_24px_rgba(37,211,102,0.30)]
                  hover:shadow-[0_6px_32px_rgba(37,211,102,0.45)]
                  transition-all duration-200 active:scale-[0.98]
                "
                aria-label="Confirmar pedido por WhatsApp"
              >
                <MessageCircle size={22} strokeWidth={2} fill="white" />
                Confirmar Pedido por WhatsApp
              </a>

              {/* Order summary pill */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/60 border border-border">
                <ShoppingBag size={14} className="text-text-muted" />
                <span className="text-xs text-text-muted">
                  {items.length} producto{items.length !== 1 ? 's' : ''} ·{' '}
                  <span className="text-accent-secondary font-semibold">{formatCLP(totalPYME)}</span>
                </span>
              </div>

              <button
                onClick={closeModal}
                className="text-xs text-text-muted hover:text-text transition-colors duration-150 underline underline-offset-2"
              >
                Volver a editar mi carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MagicComparisonModal;
