import React from 'react';
import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoicePdf } from '@/lib/invoice-pdf';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(_req: Request, { params }: { params: { invoiceId: string } }) {
  const supabase = createAdminSupabaseClient();
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('invoice_number,total_cop,paid_cop,balance_cop,profiles(nombre)')
    .eq('id', params.invoiceId)
    .single();

  if (error || !invoice) return NextResponse.json({ error: error?.message ?? 'Invoice not found' }, { status: 404 });

  const buffer = await renderToBuffer(
    React.createElement(InvoicePdf, {
      invoiceNumber: invoice.invoice_number,
      sellerName: (invoice.profiles as { nombre?: string })?.nombre ?? 'Vendedora',
      total: Number(invoice.total_cop),
      paid: Number(invoice.paid_cop),
      balance: Number(invoice.balance_cop)
    })
  );

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${invoice.invoice_number}.pdf"`
    }
  });
}
