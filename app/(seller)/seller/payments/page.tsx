import { createPaymentAction } from '@/lib/actions/core';

export default function SellerPaymentsPage() {
  return (
    <div className="card">
      <h3>Reportar pago</h3>
      <form action={createPaymentAction} className="grid">
        <input name="campaign_id" placeholder="campaign uuid" required />
        <input name="seller_id" placeholder="seller uuid" required />
        <select name="method" defaultValue="zelle">
          <option value="zelle">zelle</option><option value="usd_cash">usd_cash</option><option value="bs_bcv">bs_bcv</option><option value="cop">cop</option>
        </select>
        <select name="currency" defaultValue="USD">
          <option value="USD">USD</option><option value="BS">BS</option><option value="COP">COP</option>
        </select>
        <input name="amount_original" type="number" step="0.01" placeholder="Monto" required />
        <input name="rate_usd_cash_used" type="number" step="0.0001" placeholder="rate usd cash" />
        <input name="rate_usd_bs_used" type="number" step="0.0001" placeholder="rate usd bs" />
        <input name="rate_bcv_used" type="number" step="0.0001" placeholder="rate bcv" />
        <input name="reference" placeholder="Referencia" />
        <button type="submit">Enviar abono</button>
      </form>
    </div>
  );
}
