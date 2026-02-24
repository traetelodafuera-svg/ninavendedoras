import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function MasterDashboard() {
  const supabase = createServerSupabaseClient();
  const [{ count: pendingOrders }, { count: pendingPayments }, { data: approvedOrders }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('total_ganancia_total_cop').eq('status', 'approved')
  ]);

  const ganancia = (approvedOrders ?? []).reduce((acc, row) => acc + Number(row.total_ganancia_total_cop ?? 0), 0);

  return (
    <div className="card">
      <h3>KPIs Campaña</h3>
      <p>Pedidos pendientes: {pendingOrders ?? 0}</p>
      <p>Pagos pendientes: {pendingPayments ?? 0}</p>
      <p>Ganancia estimada: {ganancia.toFixed(2)} COP</p>
    </div>
  );
}
