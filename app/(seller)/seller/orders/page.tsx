import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function SellerOrdersPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('orders').select('id,status,total_final_cop,created_at').order('created_at', { ascending: false });

  return (
    <div className="card">
      <h3>Mis pedidos</h3>
      <table className="table">
        <thead><tr><th>ID</th><th>Estado</th><th>Total COP</th></tr></thead>
        <tbody>
          {(data ?? []).map((order) => (
            <tr key={order.id}><td>{order.id.slice(0, 8)}</td><td>{order.status}</td><td>{Number(order.total_final_cop).toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
