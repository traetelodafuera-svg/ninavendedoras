import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(_req: Request, { params }: { params: { invoiceId: string } }) {
  const requestSupabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await requestSupabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createAdminSupabaseClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  const isMaster = profile?.role === 'master';

  let invoiceQuery = supabase
    .from('invoices')
    .select('invoice_number,pdf_url,profiles(email,nombre)')
    .eq('id', params.invoiceId);

  if (!isMaster) {
    invoiceQuery = invoiceQuery.eq('seller_id', user.id);
  }

  const { data: invoice, error } = await invoiceQuery.single();

  if (error || !invoice) return NextResponse.json({ error: error?.message ?? 'Invoice not found' }, { status: 404 });

  const seller = invoice.profiles as { email?: string; nombre?: string };
  if (!seller?.email) return NextResponse.json({ error: 'No email on seller profile' }, { status: 400 });

  const result = await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
    to: seller.email,
    subject: `Factura ${invoice.invoice_number}`,
    html: `<p>Hola ${seller.nombre ?? ''}, tu factura está lista:</p><p><a href="${invoice.pdf_url}">Descargar PDF</a></p>`
  });

  return NextResponse.json({ ok: true, result });
}
