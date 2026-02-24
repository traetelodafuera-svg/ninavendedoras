import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function MasterOrdersPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('orders').select('id,status,total_productos_cop,manejo_cop,servicios_cop,otros_cargos_cop').order('created_at', { ascending: false });

  return (
    <div className="card">
      <h3>Pedidos</h3>
      <p>Para aprobar: editar cargos + descuentos por item vía SQL/editor admin en esta versión base.</p>
      <table className="table"><thead><tr><th>ID</th><th>Estado</th><th>Total productos</th><th>Cargos</th></tr></thead><tbody>
        {(data ?? []).map((order) => <tr key={order.id}><td>{order.id.slice(0, 8)}</td><td>{order.status}</td><td>{Number(order.total_productos_cop).toFixed(2)}</td><td>{Number(order.manejo_cop) + Number(order.servicios_cop) + Number(order.otros_cargos_cop)}</td></tr>)}
      </tbody></table>
    </div>
  );
}
