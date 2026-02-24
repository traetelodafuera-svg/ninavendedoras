import { createCampaignAction } from '@/lib/actions/core';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function CampaignsPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });

  return (
    <div className="card">
      <h3>Campañas</h3>
      <form action={createCampaignAction} className="grid grid-2">
        <input name="nombre" placeholder="C-06" required />
        <input name="fecha_inicio" type="date" required />
        <input name="fecha_fin" type="date" required />
        <input name="cutoff_date" type="date" required />
        <input name="rate_usd_cash" type="number" step="0.0001" placeholder="rate usd cash" required />
        <input name="rate_usd_bs" type="number" step="0.0001" placeholder="rate usd bs" required />
        <input name="rate_bcv" type="number" step="0.0001" placeholder="rate bcv" required />
        <button type="submit">Guardar campaña</button>
      </form>
      <ul>{(data ?? []).map((c) => <li key={c.id}>{c.nombre} - {c.rate_usd_cash}</li>)}</ul>
    </div>
  );
}
