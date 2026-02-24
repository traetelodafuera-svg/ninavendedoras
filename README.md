# Portal de Vendedoras – Nina Jaimes Makeup

Proyecto base MVP en **Next.js App Router + Supabase**.

## Incluye
- Auth con Supabase (login por email/password).
- Módulos MVP: campañas, pedidos + items, pagos, facturas.
- Conversión y snapshot de tasas en pagos.
- Esquema SQL + RLS + buckets de storage (`receipts`, `invoices`).
- Endpoint PDF con `@react-pdf/renderer`.
- Endpoint de envío por email con Resend.

## Ejecutar
```bash
npm install
npm run dev
```

## Variables de entorno
Copiar `.env.example` a `.env.local` y completar:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM`

## Supabase
Aplicar migración:
- `supabase/migrations/202602240001_init.sql`

## Deploy
Deploy-ready para Vercel, con Server Components y rutas API.
