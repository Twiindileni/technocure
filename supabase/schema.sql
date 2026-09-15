-- ============================================
-- TechnoCure Center CC — Supabase Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── profiles ──────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  company     text,
  address     text,
  role        text not null default 'customer' check (role in ('customer','technician','admin','manager')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, company)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'company'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── tickets ───────────────────────────────────
create table public.tickets (
  id                       uuid primary key default uuid_generate_v4(),
  ticket_number            text not null unique,
  customer_id              uuid references public.profiles(id),
  assigned_technician_id   uuid references public.profiles(id),
  printer_brand            text,
  printer_model            text,
  serial_number            text,
  printer_type             text,
  printer_location         text,
  issue_category           text,
  description              text,
  error_code               text,
  priority                 text default 'Normal' check (priority in ('Low','Normal','High','Urgent')),
  status                   text default 'New' check (status in ('New','Open','Assigned','In Progress','Awaiting Customer','Awaiting Parts','Scheduled','Completed','Closed','Cancelled')),
  is_completely_unusable   boolean default false,
  problem_start_date       date,
  scheduled_date           timestamptz,
  diagnosis                text,
  work_performed           text,
  parts_used               text,
  labour_hours             numeric(6,2),
  final_cost               numeric(10,2),
  resolution               text,
  technician_notes         text,
  created_at               timestamptz default now(),
  updated_at               timestamptz default now(),
  closed_at                timestamptz
);
create index idx_tickets_customer_id    on public.tickets(customer_id);
create index idx_tickets_technician_id  on public.tickets(assigned_technician_id);
create index idx_tickets_status         on public.tickets(status);
create index idx_tickets_created        on public.tickets(created_at desc);

-- ── ticket_notes ──────────────────────────────
create table public.ticket_notes (
  id                   uuid primary key default uuid_generate_v4(),
  ticket_id            uuid references public.tickets(id) on delete cascade,
  user_id              uuid references public.profiles(id),
  note                 text not null,
  is_customer_visible  boolean default false,
  created_at           timestamptz default now()
);
create index idx_ticket_notes_ticket on public.ticket_notes(ticket_id);

-- ── ticket_attachments ────────────────────────
create table public.ticket_attachments (
  id           uuid primary key default uuid_generate_v4(),
  ticket_id    uuid references public.tickets(id) on delete cascade,
  file_name    text,
  file_path    text,
  file_type    text,
  file_size    bigint,
  uploaded_by  uuid references public.profiles(id),
  created_at   timestamptz default now()
);
create index idx_ticket_attach_ticket on public.ticket_attachments(ticket_id);

-- ── printers ──────────────────────────────────
create table public.printers (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  brand           text,
  model           text,
  category        text check (category in ('Inkjet','Laser','Multifunction','Office','Business','Label','Other')),
  description     text,
  specifications  jsonb default '{}',
  features        text[],
  price           numeric(10,2) not null default 0,
  stock_quantity  integer not null default 0,
  warranty        text,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index idx_printers_category on public.printers(category);
create index idx_printers_active   on public.printers(is_active);

-- ── printer_images ────────────────────────────
create table public.printer_images (
  id           uuid primary key default uuid_generate_v4(),
  printer_id   uuid references public.printers(id) on delete cascade,
  storage_path text not null,
  is_primary   boolean default false,
  created_at   timestamptz default now()
);

-- ── parts ─────────────────────────────────────
create table public.parts (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  brand           text,
  part_number     text,
  description     text,
  price           numeric(10,2) not null default 0,
  stock_quantity  integer not null default 0,
  low_stock_threshold integer default 5,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index idx_parts_brand  on public.parts(brand);
create index idx_parts_active on public.parts(is_active);

-- ── part_compatibility ────────────────────────
create table public.part_compatibility (
  id             uuid primary key default uuid_generate_v4(),
  part_id        uuid references public.parts(id) on delete cascade,
  printer_brand  text,
  printer_model  text
);
create index idx_compat_part on public.part_compatibility(part_id);

-- ── part_images ───────────────────────────────
create table public.part_images (
  id           uuid primary key default uuid_generate_v4(),
  part_id      uuid references public.parts(id) on delete cascade,
  storage_path text not null,
  is_primary   boolean default false,
  created_at   timestamptz default now()
);

-- ── part_requests ─────────────────────────────
create table public.part_requests (
  id              uuid primary key default uuid_generate_v4(),
  request_number  text not null unique,
  customer_id     uuid references public.profiles(id),
  full_name       text,
  email           text,
  phone           text,
  company         text,
  printer_brand   text,
  printer_model   text,
  serial_number   text,
  requested_part  text,
  part_number     text,
  description     text,
  quantity        integer default 1,
  status          text default 'Pending' check (status in ('Pending','Searching','Supplier Contacted','Available','Ordered','Customer Notified','Completed','Not Available')),
  admin_notes     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index idx_part_requests_customer on public.part_requests(customer_id);
create index idx_part_requests_status   on public.part_requests(status);

-- ── quote_requests ────────────────────────────
create table public.quote_requests (
  id            uuid primary key default uuid_generate_v4(),
  quote_number  text not null unique,
  customer_id   uuid references public.profiles(id),
  full_name     text,
  email         text,
  phone         text,
  company       text,
  request_type  text check (request_type in ('Printer','Parts','Repair','Maintenance Contract','Business Support','Other')),
  description   text,
  quantity      integer default 1,
  budget        numeric(10,2),
  notes         text,
  status        text default 'Pending' check (status in ('Pending','Reviewing','Quoted','Accepted','Declined','Completed')),
  quote_amount  numeric(10,2),
  admin_notes   text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── service_history ───────────────────────────
create table public.service_history (
  id              uuid primary key default uuid_generate_v4(),
  ticket_id       uuid references public.tickets(id),
  customer_id     uuid references public.profiles(id),
  technician_id   uuid references public.profiles(id),
  service_date    timestamptz,
  diagnosis       text,
  work_performed  text,
  parts_used      text,
  labour_hours    numeric(6,2),
  final_cost      numeric(10,2),
  created_at      timestamptz default now()
);
create index idx_service_history_customer on public.service_history(customer_id);
