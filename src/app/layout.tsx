import type { Metadata } from 'next';
import { Inter, Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'Women Mag - Mode Femme Algérie',
  description: 'Vente de vêtements pour femme en Algérie via Cash On Delivery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${poppins.className}`}>
        <LanguageProvider>
          <CartProvider>
              <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow">
                      {children}
                  </main>
                  <Footer />
              </div>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

