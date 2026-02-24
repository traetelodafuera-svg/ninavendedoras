import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function MasterInvoicesPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('invoices').select('id,invoice_number,status,total_cop,paid_cop,balance_cop').order('created_at', { ascending: false });

  return (
    <div className="card">
      <h3>Facturas</h3>
      <table className="table"><thead><tr><th>Número</th><th>Estado</th><th>Total</th><th>Acciones</th></tr></thead><tbody>
        {(data ?? []).map((inv) => (
          <tr key={inv.id}>
            <td>{inv.invoice_number}</td><td>{inv.status}</td><td>{Number(inv.total_cop).toFixed(2)}</td>
            <td>
              <Link href={`/api/invoices/${inv.id}/pdf`} target="_blank">PDF</Link> |{' '}
              <Link href={`/api/invoices/${inv.id}/send-email`} target="_blank">Enviar email</Link>
            </td>
          </tr>
        ))}
      </tbody></table>
    </div>
  );
}
