import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function SellerDashboard() {
  const supabase = createServerSupabaseClient();
  const [{ data: campaigns }, { data: orders }, { data: payments }] = await Promise.all([
    supabase.from('campaigns').select('*').eq('active', true).limit(1),
    supabase.from('orders').select('total_final_cop').eq('status', 'approved'),
    supabase.from('payments').select('cop_equivalent').eq('status', 'approved')
  ]);

  const total = (orders ?? []).reduce((a, b) => a + Number(b.total_final_cop), 0);
  const abonado = (payments ?? []).reduce((a, b) => a + Number(b.cop_equivalent), 0);

  return (
    <div className="card">
      <h3>Campaña activa: {campaigns?.[0]?.nombre ?? 'Sin campaña'}</h3>
      <p>Total aprobado: {total.toFixed(2)} COP</p>
      <p>Abonado: {abonado.toFixed(2)} COP</p>
      <p>Saldo: {(total - abonado).toFixed(2)} COP</p>
    </div>
  );
}
