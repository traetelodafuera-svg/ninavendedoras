import Link from 'next/link';

export function SellerNav() {
  return (
    <nav>
      <Link href="/seller/dashboard">Dashboard</Link>
      <Link href="/seller/new-order">Nuevo Pedido</Link>
      <Link href="/seller/orders">Mis Pedidos</Link>
      <Link href="/seller/payments">Reportar Pago</Link>
      <Link href="/seller/ledger">Estado de Cuenta</Link>
    </nav>
  );
}

export function MasterNav() {
  return (
    <nav>
      <Link href="/master/dashboard">Dashboard</Link>
      <Link href="/master/campaigns">Campañas</Link>
      <Link href="/master/orders">Pedidos</Link>
      <Link href="/master/payments">Pagos</Link>
      <Link href="/master/invoices">Facturas</Link>
    </nav>
  );
}
