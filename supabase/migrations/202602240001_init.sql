create extension if not exists "pgcrypto";

create type app_role as enum ('master','seller');
create type order_status as enum ('draft','sent','approved','rejected');
create type payment_status as enum ('pending','approved','rejected');
create type payment_method as enum ('zelle','paypal','binance','zinli','usd_cash','bs_bcv','bs_manual','cop');
create type currency_code as enum ('USD','BS','COP');
create type invoice_status as enum ('draft','final');
create type goal_type as enum ('sales_cop','units');
create type discount_origin as enum ('manual','none');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null default 'seller',
  nombre text not null,
  telefono text,
  email text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  fecha_inicio date not null,
  fecha_fin date not null,
  cutoff_date date not null,
  rate_usd_cash numeric not null,
  rate_usd_bs numeric not null,
  rate_bcv numeric not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id),
  seller_id uuid not null references profiles(id),
  status order_status not null default 'draft',
  total_productos_cop numeric not null default 0,
  manejo_cop numeric not null default 0,
  servicios_cop numeric not null default 0,
  otros_cargos_cop numeric not null default 0,
  descuento_manual_cop numeric not null default 0,
  total_final_cop numeric not null default 0,
  total_costo_real_cop numeric not null default 0,
  total_ganancia_productos_cop numeric not null default 0,
  total_ganancia_total_cop numeric not null default 0,
  notes_master text,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  codigo text not null,
  descripcion text not null,
  cantidad int not null check (cantidad > 0),
  precio_catalogo_cop numeric not null,
  descuento_belcorp_pct numeric not null default 0,
  descuento_origen discount_origin not null default 'none',
  precio_costo_real_cop numeric,
  ganancia_item_cop numeric,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id),
  seller_id uuid not null references profiles(id),
  status payment_status not null default 'pending',
  method payment_method not null,
  currency currency_code not null,
  amount_original numeric not null,
  rate_usd_cash_used numeric,
  rate_usd_bs_used numeric,
  rate_bcv_used numeric,
  cop_equivalent numeric not null,
  reference text,
  receipt_url text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  rejection_reason text
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id),
  seller_id uuid not null references profiles(id),
  invoice_number text not null unique,
  status invoice_status not null default 'draft',
  total_cop numeric not null,
  paid_cop numeric not null,
  balance_cop numeric not null,
  pdf_url text,
  created_at timestamptz not null default now(),
  finalized_at timestamptz,
  sent_at timestamptz
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id),
  type goal_type not null,
  target_value numeric not null,
  title text not null,
  reward_text text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz not null default now()
);

create or replace function is_master() returns boolean language sql stable as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'master');
$$;

alter table profiles enable row level security;
alter table campaigns enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table invoices enable row level security;
alter table goals enable row level security;
alter table audit_logs enable row level security;

create policy "profiles owner or master" on profiles for select using (id = auth.uid() or is_master());
create policy "master write profiles" on profiles for all using (is_master()) with check (is_master());

create policy "campaigns read all auth" on campaigns for select using (auth.uid() is not null);
create policy "campaigns master write" on campaigns for all using (is_master()) with check (is_master());

create policy "orders read own or master" on orders for select using (seller_id = auth.uid() or is_master());
create policy "orders seller insert" on orders for insert with check (seller_id = auth.uid() or is_master());
create policy "orders seller edit draft sent" on orders for update using (is_master() or (seller_id = auth.uid() and status in ('draft','sent'))) with check (is_master() or seller_id = auth.uid());
create policy "orders master delete" on orders for delete using (is_master());

create policy "items read own or master" on order_items for select using (
  exists(select 1 from orders o where o.id = order_id and (o.seller_id = auth.uid() or is_master()))
);
create policy "items seller insert" on order_items for insert with check (
  exists(select 1 from orders o where o.id = order_id and (o.seller_id = auth.uid() or is_master()))
);
create policy "items seller edit draft sent" on order_items for update using (
  exists(select 1 from orders o where o.id = order_id and (is_master() or (o.seller_id = auth.uid() and o.status in ('draft','sent'))))
);

create policy "payments read own or master" on payments for select using (seller_id = auth.uid() or is_master());
create policy "payments seller insert" on payments for insert with check (seller_id = auth.uid() or is_master());
create policy "payments master update" on payments for update using (is_master());

create policy "invoices read own or master" on invoices for select using (seller_id = auth.uid() or is_master());
create policy "invoices master write" on invoices for all using (is_master()) with check (is_master());

create policy "goals read all" on goals for select using (auth.uid() is not null);
create policy "goals master write" on goals for all using (is_master()) with check (is_master());

create policy "audit logs master read" on audit_logs for select using (is_master());
create policy "audit logs system insert" on audit_logs for insert with check (auth.uid() is not null);

insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('invoices', 'invoices', false) on conflict (id) do nothing;
