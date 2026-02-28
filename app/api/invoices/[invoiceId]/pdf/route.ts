import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoicePdf } from '@/lib/invoice-pdf';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(_req: Request, { params }: { params: { invoiceId: string } }) {
  const requestSupabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await requestSupabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  const isMaster = profile?.role === 'master';

  let invoiceQuery = supabase
    .from('invoices')
    .select('invoice_number,total_cop,paid_cop,balance_cop,profiles(nombre)')
    .eq('id', params.invoiceId);

  if (!isMaster) {
    invoiceQuery = invoiceQuery.eq('seller_id', user.id);
  }

  const { data: invoice, error } = await invoiceQuery.single();

  if (error || !invoice) return NextResponse.json({ error: error?.message ?? 'Invoice not found' }, { status: 404 });

  const pdfDocument = InvoicePdf({
    invoiceNumber: invoice.invoice_number,
    sellerName: (invoice.profiles as { nombre?: string })?.nombre ?? 'Vendedora',
    total: Number(invoice.total_cop),
    paid: Number(invoice.paid_cop),
    balance: Number(invoice.balance_cop)
  });

  const buffer = await renderToBuffer(pdfDocument);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${invoice.invoice_number}.pdf"`
    }
  });
}
