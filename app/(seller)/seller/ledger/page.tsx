import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function SellerLedgerPage() {
  const supabase = createServerSupabaseClient();
  const [{ data: orders }, { data: payments }, { data: invoices }] = await Promise.all([
    supabase.from('orders').select('total_final_cop').eq('status', 'approved'),
    supabase.from('payments').select('cop_equivalent').eq('status', 'approved'),
    supabase.from('invoices').select('invoice_number,pdf_url,balance_cop')
  ]);

  const total = (orders ?? []).reduce((acc, row) => acc + Number(row.total_final_cop), 0);
  const paid = (payments ?? []).reduce((acc, row) => acc + Number(row.cop_equivalent), 0);

  return (
    <div className="card">
      <h3>Estado de cuenta</h3>
      <p>Total: {total.toFixed(2)} COP</p>
      <p>Pagado: {paid.toFixed(2)} COP</p>
      <p>Saldo: {(total - paid).toFixed(2)} COP</p>
      <h4>Facturas</h4>
      <ul>
        {(invoices ?? []).map((inv) => <li key={inv.invoice_number}>{inv.invoice_number} - {Number(inv.balance_cop).toFixed(2)} - <a href={inv.pdf_url ?? '#'}>PDF</a></li>)}
      </ul>
    </div>
  );
}
