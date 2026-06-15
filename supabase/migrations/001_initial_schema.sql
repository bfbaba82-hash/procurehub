-- ============================================================
-- ProcureHub — Initial Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
create type po_status as enum ('draft','pending','under_review','approved','rejected','completed');
create type vendor_status as enum ('active','inactive','pending_review','blacklisted');
create type user_role as enum ('admin','procurement_officer','approver','viewer');
create type supplier_submission_status as enum ('pending','verifying','approved','rejected');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  department text,
  role user_role not null default 'viewer',
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view all profiles" on profiles for select using (auth.role() = 'authenticated');
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- ============================================================
-- VENDORS
-- ============================================================
create table vendors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text,
  contact_email text,
  contact_phone text,
  address text,
  cr_number text,
  vat_number text,
  rating numeric(3,2) default 0,
  status vendor_status default 'pending_review',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table vendors enable row level security;
create policy "Authenticated users can view vendors" on vendors for select using (auth.role() = 'authenticated');
create policy "Procurement can manage vendors" on vendors for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin','procurement_officer'))
);

-- ============================================================
-- PURCHASE ORDERS
-- ============================================================
create table purchase_orders (
  id uuid primary key default uuid_generate_v4(),
  po_number text unique not null,
  vendor_id uuid references vendors(id),
  requested_by uuid references profiles(id),
  department text not null,
  status po_status default 'draft',
  required_by date,
  budget_line text,
  justification text,
  total_amount numeric(15,2) default 0,
  currency text default 'SAR',
  attachments jsonb default '[]',
  current_approver uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table purchase_orders enable row level security;
create policy "Users can view POs" on purchase_orders for select using (auth.role() = 'authenticated');
create policy "Procurement can create POs" on purchase_orders for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin','procurement_officer'))
);
create policy "Admins and approvers can update POs" on purchase_orders for update using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin','approver'))
);

-- ============================================================
-- PO LINE ITEMS
-- ============================================================
create table po_line_items (
  id uuid primary key default uuid_generate_v4(),
  po_id uuid references purchase_orders(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null,
  unit_price numeric(15,2) not null,
  total_price numeric(15,2) generated always as (quantity * unit_price) stored,
  unit text default 'unit',
  created_at timestamptz default now()
);

alter table po_line_items enable row level security;
create policy "Users can view line items" on po_line_items for select using (auth.role() = 'authenticated');
create policy "Procurement can manage line items" on po_line_items for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin','procurement_officer'))
);

-- ============================================================
-- APPROVAL STEPS
-- ============================================================
create table approval_steps (
  id uuid primary key default uuid_generate_v4(),
  po_id uuid references purchase_orders(id) on delete cascade,
  step_number int not null,
  approver_role text not null,
  approver_id uuid references profiles(id),
  status text default 'pending',
  comment text,
  acted_at timestamptz,
  created_at timestamptz default now()
);

alter table approval_steps enable row level security;
create policy "Users can view approval steps" on approval_steps for select using (auth.role() = 'authenticated');
create policy "Approvers can update their steps" on approval_steps for update using (
  approver_id = auth.uid() or
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ============================================================
-- INVENTORY
-- ============================================================
create table inventory_items (
  id uuid primary key default uuid_generate_v4(),
  sku text unique,
  name text not null,
  category text,
  unit text default 'unit',
  quantity_in_stock numeric(12,2) default 0,
  reorder_point numeric(12,2) default 0,
  unit_cost numeric(15,2),
  location text,
  vendor_id uuid references vendors(id),
  last_restocked_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table inventory_items enable row level security;
create policy "Authenticated users can view inventory" on inventory_items for select using (auth.role() = 'authenticated');
create policy "Procurement can manage inventory" on inventory_items for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin','procurement_officer'))
);

-- ============================================================
-- BUDGET
-- ============================================================
create table budgets (
  id uuid primary key default uuid_generate_v4(),
  department text not null,
  fiscal_year int not null,
  allocated_amount numeric(15,2) not null,
  spent_amount numeric(15,2) default 0,
  committed_amount numeric(15,2) default 0,
  currency text default 'SAR',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(department, fiscal_year)
);

alter table budgets enable row level security;
create policy "Authenticated can view budgets" on budgets for select using (auth.role() = 'authenticated');
create policy "Admins can manage budgets" on budgets for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ============================================================
-- SUPPLIER PORTAL TOKENS
-- ============================================================
create table supplier_portal_tokens (
  id uuid primary key default uuid_generate_v4(),
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  label text,
  created_by uuid references profiles(id),
  expires_at timestamptz,
  used_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Public access for supplier portal (no auth needed for token-based access)
alter table supplier_portal_tokens enable row level security;
create policy "Anyone can verify a token" on supplier_portal_tokens for select using (true);
create policy "Admins can manage tokens" on supplier_portal_tokens for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin','procurement_officer'))
);

-- ============================================================
-- SUPPLIER SUBMISSIONS
-- ============================================================
create table supplier_submissions (
  id uuid primary key default uuid_generate_v4(),
  token_id uuid references supplier_portal_tokens(id),
  supplier_name text not null,
  supplier_email text not null,
  supplier_phone text,
  cr_number text,
  vat_number text,
  category text,
  price_list jsonb default '[]',
  documents jsonb default '[]',
  notes text,
  status supplier_submission_status default 'pending',
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

alter table supplier_submissions enable row level security;
create policy "Anyone can insert submissions" on supplier_submissions for insert with check (true);
create policy "Procurement can view submissions" on supplier_submissions for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin','procurement_officer'))
);
create policy "Procurement can update submissions" on supplier_submissions for update using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin','procurement_officer'))
);

-- ============================================================
-- TRIGGER: auto-generate PO number
-- ============================================================
create or replace function generate_po_number()
returns trigger as $$
declare
  year text := to_char(now(), 'YYYY');
  seq int;
begin
  select count(*) + 1 into seq
  from purchase_orders
  where extract(year from created_at) = extract(year from now());
  new.po_number := 'PO-' || year || '-' || lpad(seq::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_po_number
before insert on purchase_orders
for each row execute function generate_po_number();

-- ============================================================
-- TRIGGER: update PO total when line items change
-- ============================================================
create or replace function update_po_total()
returns trigger as $$
begin
  update purchase_orders
  set total_amount = (
    select coalesce(sum(total_price), 0)
    from po_line_items
    where po_id = coalesce(new.po_id, old.po_id)
  ),
  updated_at = now()
  where id = coalesce(new.po_id, old.po_id);
  return new;
end;
$$ language plpgsql;

create trigger recalc_po_total
after insert or update or delete on po_line_items
for each row execute function update_po_total();

-- ============================================================
-- SEED DATA
-- ============================================================
insert into vendors (name, category, contact_email, rating, status) values
  ('Al-Rashid Supplies', 'Office supplies', 'orders@alrashid.sa', 4.8, 'active'),
  ('Gulf Tech Trading', 'IT equipment', 'sales@gulftech.sa', 4.5, 'active'),
  ('Delta Logistics', 'Logistics', 'ops@deltalog.sa', 3.9, 'pending_review'),
  ('SaudiMed Co.', 'Medical supplies', 'info@saudimed.sa', 4.2, 'active'),
  ('Riyadh Stationery', 'Office supplies', 'hello@rystationery.sa', 4.6, 'active');

insert into budgets (department, fiscal_year, allocated_amount, spent_amount) values
  ('IT', 2024, 600000, 420000),
  ('Operations', 2024, 500000, 380000),
  ('Logistics', 2024, 400000, 280000),
  ('HR', 2024, 250000, 200000),
  ('Admin', 2024, 250000, 60000);

insert into inventory_items (sku, name, category, unit, quantity_in_stock, reorder_point, unit_cost) values
  ('STN-001', 'A4 Paper', 'Stationery', 'Ream', 12, 50, 25),
  ('IT-042', 'Ink cartridges', 'IT', 'Unit', 5, 20, 120),
  ('SAF-007', 'Safety helmets', 'Safety', 'Unit', 28, 40, 85),
  ('IT-018', 'Ethernet cables', 'IT', 'Meter', 45, 60, 8),
  ('FUR-003', 'Office chairs', 'Furniture', 'Unit', 120, 30, 750),
  ('FAC-012', 'Cleaning kits', 'Facilities', 'Kit', 80, 40, 45);
