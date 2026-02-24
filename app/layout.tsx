import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal de Vendedoras',
  description: 'Nina Jaimes Makeup - Belcorp-lite'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
