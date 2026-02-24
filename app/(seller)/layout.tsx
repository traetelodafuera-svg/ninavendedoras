import { SellerNav } from '@/components/app-nav';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <h2>Zona Vendedora</h2>
      <SellerNav />
      {children}
    </main>
  );
}
