import { MasterNav } from '@/components/app-nav';

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <h2>Zona Master</h2>
      <MasterNav />
      {children}
    </main>
  );
}
