import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(_req: Request, { params }: { params: { invoiceId: string } }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createAdminSupabaseClient();

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('invoice_number,pdf_url,profiles(email,nombre)')
    .eq('id', params.invoiceId)
    .single();

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
