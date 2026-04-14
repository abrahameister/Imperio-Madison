import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { HeaderECommerce } from '@/components/HeaderECommerce';
import { SmartCart } from '@/components/SmartCart';
import { MagicComparisonModal } from '@/components/MagicComparisonModal';
import { ProductSuggestionModal } from '@/components/ProductSuggestionModal';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Imperio Madison Mercadito - Tu Opción Más Barata',
  description:
    'Ahorra tiempo y dinero. Comparamos los precios de Lider, Jumbo y Tottus para darte siempre la mejor oferta.',
  openGraph: {
    title: 'Imperio Madison Mercadito - Tu Opción Más Barata',
    description: 'Ahorra tiempo y dinero. Comparamos los precios de Lider, Jumbo y Tottus para darte siempre la mejor oferta.',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Imperio Madison' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body>
        <CartProvider>
          {/* App Layout */}
          <div className="flex flex-col min-h-[100dvh]">
            <HeaderECommerce />
            {children}
            <Footer />
          </div>

          {/* Global overlays — rendered as siblings to body children,
              inside CartProvider so they share the same cart state */}
          <SmartCart />
          <MagicComparisonModal />
          <ProductSuggestionModal />
        </CartProvider>
      </body>
    </html>
  );
}
