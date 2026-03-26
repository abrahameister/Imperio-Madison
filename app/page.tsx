import { ProductGrid } from '@/components/ProductGrid';

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* ── Hero ── */}
      <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto text-center">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-accent-primary mb-3">
          Tu distribuidora de barrio
        </p>
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-text mb-4 leading-tight">
          Compara y{' '}
          <span className="text-accent-secondary">Ahorra</span>
          <span className="text-text">:</span>
          <br className="hidden sm:block" />
          <span className="text-2xl sm:text-4xl font-bold text-text-muted">
            Tu carrito vs Los Grandes
          </span>
        </h1>
        <p className="text-text-muted max-w-lg mx-auto text-base sm:text-lg">
          Arma tu carrito y descubre al instante cuánto te ahorras frente a Jumbo, Lider y Tottus.
        </p>
      </section>

      {/* ── Product grid ── */}
      <section className="px-4 sm:px-6 pb-24 max-w-7xl mx-auto">
        <ProductGrid />
      </section>

    </main>
  );
}
