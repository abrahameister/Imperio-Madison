'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Search, CheckCircle2, Loader2, Send } from 'lucide-react';
import { gsap } from 'gsap';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';

export function ProductSuggestionModal() {
  const { isSuggestionOpen, closeSuggestion } = useCart();
  
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [productName, setProductName] = useState('');
  const [brandDetail, setBrandDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ──────────────────────────────────────────
     GSAP ENTRANCE
     ────────────────────────────────────────── */
  useEffect(() => {
    if (!isSuggestionOpen) {
      // Reset state when strictly closed
      if (!isSubmitting) {
        setProductName('');
        setBrandDetail('');
        setIsSuccess(false);
        setErrorMsg(null);
      }
      return;
    }

    const enter = setTimeout(() => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(backdropRef.current,
          { opacity: 0 }, { opacity: 1, duration: 0.28 }
        );

        tl.fromTo(panelRef.current,
          { opacity: 0, scale: 0.93, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.38 },
          '-=0.1'
        );
        
        // Minor stagger for form elements
        if (!isSuccess && formRef.current) {
          tl.fromTo(formRef.current.children,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 },
            '-=0.2'
          );
        }
      });

      // Focus first input automatically
      const firstInput = document.getElementById('suggest-product-name');
      if (firstInput) {
        firstInput.focus();
      } else {
        closeBtnRef.current?.focus();
      }

      return () => { ctx.revert(); };
    }, 40);

    return () => clearTimeout(enter);
  }, [isSuggestionOpen, isSuccess, isSubmitting]);

  /* ── Escape and Scroll Lock ── */
  useEffect(() => {
    if (!isSuggestionOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isSubmitting) closeSuggestion(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isSuggestionOpen, closeSuggestion, isSubmitting]);


  /* ── Submit Handler ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from('product_requests')
        .insert({
          product_name: productName.trim(),
          brand_or_detail: brandDetail.trim() || null,
        });

      if (error) throw error;

      setIsSuccess(true);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        closeSuggestion();
      }, 2000);

    } catch (err: any) {
      console.error('Error enviando sugerencia:', err);
      setErrorMsg('Hubo un problema de conexión. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSuggestionOpen) return null;

  return (
    <>
      <div
        ref={backdropRef}
        onClick={() => !isSubmitting && closeSuggestion()}
        aria-hidden
        className="fixed inset-0 z-[70] bg-bg/85 backdrop-blur-md cursor-pointer"
        style={{ opacity: 0 }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggestion-modal-title"
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div
          className="
            relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto overscroll-contain
            bg-bg border border-border rounded-2xl
            shadow-[0_24px_80px_rgba(0,0,0,0.65)]
            pointer-events-auto p-6 sm:p-8
          "
        >
          <button
            ref={closeBtnRef}
            onClick={closeSuggestion}
            disabled={isSubmitting}
            aria-label="Cerrar modal"
            className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-text hover:bg-surface2 transition-all disabled:opacity-50"
          >
            <X size={20} strokeWidth={2} />
          </button>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-8 gap-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-accent-secondary/10 flex items-center justify-center mb-2">
                <CheckCircle2 size={36} className="text-accent-secondary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-text">¡Gracias!</h2>
              <p className="text-text-muted text-sm max-w-[250px]">
                Hemos anotado tu sugerencia. Trabajaremos para agregarlo a nuestro catálogo al mejor precio.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="pr-6">
                <div className="flex items-center gap-2 mb-2 text-accent-primary">
                  <Search size={20} />
                  <p className="text-xs font-bold tracking-[0.15em] uppercase">Buzón de Pedidos</p>
                </div>
                <h2 id="suggestion-modal-title" className="font-heading text-xl sm:text-2xl font-bold text-text leading-snug">
                  ¡Ayúdanos a crecer!
                </h2>
                <p className="text-sm text-text-muted mt-2">
                  ¿Qué producto te gustaría que trajéramos a Imperio Madison? Lo buscaremos al mejor precio para ti.
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Input 1 - Obligatorio */}
                <div className="flex flex-col gap-1.5 opacity-0">
                  <label htmlFor="suggest-product-name" className="text-sm font-semibold text-text">
                    Nombre del producto <span className="text-accent-primary">*</span>
                  </label>
                  <input
                    id="suggest-product-name"
                    type="text"
                    required
                    maxLength={100}
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ej: Papel Higiénico"
                    disabled={isSubmitting}
                    className="
                      w-full bg-surface2/50 border border-border rounded-lg px-4 py-3 text-sm
                      text-text placeholder:text-text-muted/50
                      focus:outline-none focus:border-accent-primary focus:bg-surface/80
                      transition-colors
                    "
                  />
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[10px] text-text-muted/60">Requerido</span>
                    <span className={`text-[10px] ${productName.length >= 100 ? 'text-danger' : 'text-text-muted/60'}`}>
                      {productName.length}/100
                    </span>
                  </div>
                </div>

                {/* Input 2 - Opcional */}
                <div className="flex flex-col gap-1.5 opacity-0">
                  <label htmlFor="suggest-brand" className="text-sm font-semibold text-text">
                    Marca o detalle <span className="text-text-muted font-normal">(opcional)</span>
                  </label>
                  <input
                    id="suggest-brand"
                    type="text"
                    maxLength={200}
                    value={brandDetail}
                    onChange={(e) => setBrandDetail(e.target.value)}
                    placeholder="Ej: Favorita, paquete de 4"
                    disabled={isSubmitting}
                    className="
                      w-full bg-surface2/50 border border-border rounded-lg px-4 py-3 text-sm
                      text-text placeholder:text-text-muted/50
                      focus:outline-none focus:border-accent-secondary/50 focus:bg-surface/80
                      transition-colors
                    "
                  />
                  <div className="flex justify-end mt-0.5">
                    <span className={`text-[10px] ${brandDetail.length >= 200 ? 'text-danger' : 'text-text-muted/60'}`}>
                      {brandDetail.length}/200
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-danger/10 border border-danger/20 rounded-md opacity-0">
                    <p className="text-xs text-danger text-center font-medium">{errorMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !productName.trim()}
                  className="
                    mt-2 w-full flex items-center justify-center gap-2
                    bg-accent-primary hover:bg-accent-primary/90 disabled:bg-surface2 disabled:text-text-muted
                    text-bg font-bold py-3.5 rounded-lg
                    transition-all active:scale-[0.98] disabled:active:scale-100 opacity-0
                  "
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar sugerencia
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
