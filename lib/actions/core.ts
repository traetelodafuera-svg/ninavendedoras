'use server';

import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const itemSchema = z.object({
  codigo: z.string().min(1),
  descripcion: z.string().min(1),
  cantidad: z.coerce.number().int().positive(),
  precio_catalogo_cop: z.coerce.number().positive()
});

export async function createOrderAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const campaignId = String(formData.get('campaign_id') ?? '');
  const sellerId = String(formData.get('seller_id') ?? '');
  const rawItems = String(formData.get('items_json') ?? '[]');
  const items = z.array(itemSchema).parse(JSON.parse(rawItems));

  const totalProductos = items.reduce((sum, i) => sum + i.cantidad * i.precio_catalogo_cop, 0);

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      campaign_id: campaignId,
      seller_id: sellerId,
      status: 'sent',
      total_productos_cop: totalProductos,
      total_final_cop: totalProductos
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  const { error: itemsError } = await supabase.from('order_items').insert(
    items.map((item) => ({
      order_id: order.id,
      ...item
    }))
  );

  if (itemsError) throw new Error(itemsError.message);
}

export async function createPaymentAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const campaign_id = String(formData.get('campaign_id') ?? '');
  const seller_id = String(formData.get('seller_id') ?? '');
  const method = String(formData.get('method') ?? 'cop');
  const currency = String(formData.get('currency') ?? 'COP');
  const amount = Number(formData.get('amount_original') ?? 0);
  const rate_usd_cash_used = Number(formData.get('rate_usd_cash_used') ?? 0);
  const rate_usd_bs_used = Number(formData.get('rate_usd_bs_used') ?? 0);
  const rate_bcv_used = Number(formData.get('rate_bcv_used') ?? 0);

  let cop_equivalent = amount;
  if (currency === 'USD') cop_equivalent = amount * rate_usd_cash_used;
  if (currency === 'BS') cop_equivalent = (amount / rate_bcv_used) * rate_usd_bs_used;

  const { error } = await supabase.from('payments').insert({
    campaign_id,
    seller_id,
    status: 'pending',
    method,
    currency,
    amount_original: amount,
    rate_usd_cash_used,
    rate_usd_bs_used,
    rate_bcv_used,
    cop_equivalent,
    reference: String(formData.get('reference') ?? '')
  });

  if (error) throw new Error(error.message);
}

export async function createCampaignAction(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const payload = {
    nombre: String(formData.get('nombre') ?? ''),
    fecha_inicio: String(formData.get('fecha_inicio') ?? ''),
    fecha_fin: String(formData.get('fecha_fin') ?? ''),
    cutoff_date: String(formData.get('cutoff_date') ?? ''),
    rate_usd_cash: Number(formData.get('rate_usd_cash') ?? 0),
    rate_usd_bs: Number(formData.get('rate_usd_bs') ?? 0),
    rate_bcv: Number(formData.get('rate_bcv') ?? 0),
    active: true
  };

  const { error } = await supabase.from('campaigns').insert(payload);
  if (error) throw new Error(error.message);
}
