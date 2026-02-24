'use client';

import { useState } from 'react';
import { createOrderAction } from '@/lib/actions/core';

export default function NewOrderPage() {
  const [items, setItems] = useState([{ codigo: '', descripcion: '', cantidad: 1, precio_catalogo_cop: 0 }]);

  return (
    <div className="card">
      <h3>Nuevo Pedido</h3>
      <form action={createOrderAction} className="grid">
        <input name="campaign_id" placeholder="campaign uuid" required />
        <input name="seller_id" placeholder="seller uuid" required />
        <textarea
          name="items_json"
          value={JSON.stringify(items)}
          onChange={(e) => setItems(JSON.parse(e.target.value || '[]'))}
          rows={7}
        />
        <button type="submit">Enviar pedido</button>
      </form>
      <p>
        Formato JSON:{' '}
        <code>[{"codigo":"P1","descripcion":"Labial","cantidad":1,"precio_catalogo_cop":10000}]</code>
      </p>
    </div>
  );
}
