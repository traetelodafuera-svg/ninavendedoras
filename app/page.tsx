import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="card">
        <h1>Portal de Vendedoras</h1>
        <p>Belcorp-lite listo para deploy en Vercel.</p>
        <div className="grid grid-2">
          <Link href="/login"><button>Iniciar sesión</button></Link>
          <Link href="/master/dashboard"><button className="secondary">Ir a Master</button></Link>
        </div>
      </div>
    </main>
  );
}
