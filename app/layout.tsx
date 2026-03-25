import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { HeaderECommerce } from '@/components/HeaderECommerce';
import { SmartCart } from '@/components/SmartCart';
import { MagicComparisonModal } from '@/components/MagicComparisonModal';

export const metadata: Metadata = {
  title: 'Imperio Madison — Compara y Ahorra',
  description:
    'Compara precios de tu supermercado con Jumbo, Lider y Tottus. Descubre cuánto ahorras con Imperio Madison.',
  openGraph: {
    title: 'Imperio Madison — Compara y Ahorra',
    description: 'Tu distribuidora local siempre más barata que los grandes supermercados.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body>
        <CartProvider>
          {/* Header reads openCart / closeCart from CartContext internally */}
          <HeaderECommerce />

          {/* Main content */}
          <main>{children}</main>

          {/* Global overlays — rendered as siblings to body children,
              inside CartProvider so they share the same cart state */}
          <SmartCart />
          <MagicComparisonModal />
        </CartProvider>
      </body>
    </html>
  );
}
