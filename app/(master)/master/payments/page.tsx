import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function MasterPaymentsPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('payments').select('id,status,method,currency,amount_original,cop_equivalent,rate_usd_cash_used,rate_usd_bs_used,rate_bcv_used').order('created_at', { ascending: false });

  return (
    <div className="card">
      <h3>Pagos pendientes</h3>
      <table className="table"><thead><tr><th>ID</th><th>Estado</th><th>Método</th><th>Monto</th><th>COP equiv</th><th>Snapshot tasas</th></tr></thead><tbody>
        {(data ?? []).map((p) => <tr key={p.id}><td>{p.id.slice(0, 8)}</td><td>{p.status}</td><td>{p.method}</td><td>{Number(p.amount_original).toFixed(2)} {p.currency}</td><td>{Number(p.cop_equivalent).toFixed(2)}</td><td>{p.rate_usd_cash_used}/{p.rate_usd_bs_used}/{p.rate_bcv_used}</td></tr>)}
      </tbody></table>
    </div>
  );
}
