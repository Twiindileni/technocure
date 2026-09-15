-- ============================================
-- TechnoCure — Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
alter table public.profiles          enable row level security;
alter table public.tickets           enable row level security;
alter table public.ticket_notes      enable row level security;
alter table public.ticket_attachments enable row level security;
alter table public.printers          enable row level security;
alter table public.printer_images    enable row level security;
alter table public.parts             enable row level security;
alter table public.part_images       enable row level security;
alter table public.part_compatibility enable row level security;
alter table public.part_requests     enable row level security;
alter table public.quote_requests    enable row level security;
alter table public.service_history   enable row level security;

-- Helper: get current user role
create or replace function get_user_role(user_id uuid)
returns text as $$
  select role from public.profiles where id = user_id;
$$ language sql security definer stable;

-- ── profiles ─────────────────────────────────────────────────────
-- Users can read and update their own profile
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Admins and managers can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (get_user_role(auth.uid()) in ('admin','manager'));

-- ── tickets ──────────────────────────────────────────────────────
-- Customers can create tickets
create policy "Customers can create tickets"
  on public.tickets for insert
  with check (auth.uid() = customer_id OR customer_id IS NULL);

-- Customers can only view their own tickets
create policy "Customers can view own tickets"
  on public.tickets for select
  using (auth.uid() = customer_id);

-- Technicians can view tickets assigned to them
create policy "Technicians can view assigned tickets"
  on public.tickets for select
  using (auth.uid() = assigned_technician_id);

-- Technicians can update their assigned tickets
create policy "Technicians can update assigned tickets"
  on public.tickets for update
  using (auth.uid() = assigned_technician_id);

-- Admins/managers can do everything with tickets
create policy "Admins can manage tickets"
  on public.tickets for all
  using (get_user_role(auth.uid()) in ('admin','manager'));

-- ── ticket_notes ─────────────────────────────────────────────────
-- Customers can view notes that are customer-visible on their tickets
create policy "Customers can view visible notes"
  on public.ticket_notes for select
  using (
    is_customer_visible = true AND
    exists (select 1 from public.tickets where id = ticket_id and customer_id = auth.uid())
  );

-- Technicians can view all notes on their tickets
create policy "Technicians can view ticket notes"
  on public.ticket_notes for select
  using (
    exists (select 1 from public.tickets where id = ticket_id and assigned_technician_id = auth.uid())
  );

-- Technicians can add notes
create policy "Technicians can add notes"
  on public.ticket_notes for insert
  with check (
    auth.uid() = user_id AND
    exists (select 1 from public.tickets where id = ticket_id and assigned_technician_id = auth.uid())
  );

-- Admins can manage all notes
create policy "Admins can manage notes"
  on public.ticket_notes for all
  using (get_user_role(auth.uid()) in ('admin','manager'));

-- ── ticket_attachments ───────────────────────────────────────────
create policy "Customers can view own ticket attachments"
  on public.ticket_attachments for select
  using (exists (select 1 from public.tickets where id = ticket_id and customer_id = auth.uid()));

create policy "Customers can upload attachments"
  on public.ticket_attachments for insert
  with check (auth.uid() = uploaded_by);

create policy "Admins can manage attachments"
  on public.ticket_attachments for all
  using (get_user_role(auth.uid()) in ('admin','manager'));

-- ── printers (public read, admin write) ──────────────────────────
create policy "Anyone can view active printers"
  on public.printers for select
  using (is_active = true);

create policy "Admins can manage printers"
  on public.printers for all
  using (get_user_role(auth.uid()) in ('admin','manager'));

create policy "Anyone can view printer images"
  on public.printer_images for select using (true);

create policy "Admins can manage printer images"
  on public.printer_images for all
  using (get_user_role(auth.uid()) in ('admin','manager'));

-- ── parts (public read, admin write) ─────────────────────────────
create policy "Anyone can view active parts"
  on public.parts for select
  using (is_active = true);

create policy "Admins can manage parts"
  on public.parts for all
  using (get_user_role(auth.uid()) in ('admin','manager'));

create policy "Anyone can view part images"
  on public.part_images for select using (true);

create policy "Admins can manage part images"
  on public.part_images for all
  using (get_user_role(auth.uid()) in ('admin','manager'));

create policy "Anyone can view part compatibility"
  on public.part_compatibility for select using (true);

create policy "Admins can manage compatibility"
  on public.part_compatibility for all
  using (get_user_role(auth.uid()) in ('admin','manager'));

-- ── part_requests ─────────────────────────────────────────────────
create policy "Anyone can create part requests"
  on public.part_requests for insert with check (true);

create policy "Customers can view own part requests"
  on public.part_requests for select
  using (auth.uid() = customer_id OR customer_id IS NULL);

create policy "Admins can manage part requests"
  on public.part_requests for all
  using (get_user_role(auth.uid()) in ('admin','manager'));

-- ── quote_requests ────────────────────────────────────────────────
create policy "Anyone can create quote requests"
  on public.quote_requests for insert with check (true);

create policy "Customers can view own quotes"
  on public.quote_requests for select
  using (auth.uid() = customer_id OR customer_id IS NULL);

create policy "Admins can manage quotes"
  on public.quote_requests for all
  using (get_user_role(auth.uid()) in ('admin','manager'));

-- ── service_history ───────────────────────────────────────────────
create policy "Customers can view own service history"
  on public.service_history for select
  using (auth.uid() = customer_id);

create policy "Admins can manage service history"
  on public.service_history for all
  using (get_user_role(auth.uid()) in ('admin','manager'));
