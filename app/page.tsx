import { ProductGrid } from '@/components/ProductGrid';

/* Formatea la fecha actual en español chileno, ej: "18 de abril de 2026" */
function formattedDate() {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Santiago',
  }).format(new Date());
}

export default function Home() {
  const today = formattedDate();

  return (
    <main className="w-full flex-1">

      {/* ── Hero — padding reducido para que el grid suba above the fold ── */}
      <section className="px-4 sm:px-6 py-5 sm:py-7 w-full max-w-3xl mx-auto text-center">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-accent-primary mb-3">
          Tu distribuidora de barrio
        </p>
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-text mb-4 leading-tight">
          Compara y{' '}
          <span className="text-accent-secondary">Ahorra</span>
          <span className="text-text">: </span>
          <span className="text-2xl sm:text-4xl font-bold text-text-muted">
            Tu carrito vs Los Grandes
          </span>
        </h1>
        <p className="text-text-muted max-w-lg mx-auto text-base sm:text-lg">
          Arma tu carrito y descubre al instante cuánto te ahorras frente a Jumbo, Lider y Tottus.
        </p>
      </section>

      {/* ── Product grid ── */}
      <section className="px-3 sm:px-6 pb-24 w-full max-w-7xl mx-auto">

        {/* Sello de confianza — precios actualizados */}
        <div className="flex items-center gap-1.5 mb-4 text-text-muted">
          <span aria-hidden className="text-[13px]">📅</span>
          <p className="text-[11px] font-medium">
            Precios actualizados:{' '}
            <span className="text-text">{today}</span>
            {' '}·{' '}
            <span className="text-accent-secondary/80">Comparación en tiempo real</span>
          </p>
        </div>

        <ProductGrid />
      </section>

    </main>
  );
}
