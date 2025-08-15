-- Enable Row-Level Security on all club-scoped tables
-- This migration enables RLS and creates policies for multi-tenant data isolation

-- Enable RLS on all tables that have club_id relationships
ALTER TABLE public."clubs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."trainers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."classes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."class_enrollments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."announcements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."players" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."evaluations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."training_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."training_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."contribution_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."invoices" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for each table
-- Each policy ensures users can only access data from their own club

-- Clubs table: Users can only access their own club
CREATE POLICY "ByClub" ON public."clubs"
  FOR ALL USING (id = current_setting('app.current_tenant')::uuid);

-- Members table: Users can only access members from their club
CREATE POLICY "ByClub" ON public."members"
  FOR ALL USING (club_id = current_setting('app.current_tenant')::uuid);

-- Trainers table: Users can only access trainers from their club
CREATE POLICY "ByClub" ON public."trainers"
  FOR ALL USING (club_id = current_setting('app.current_tenant')::uuid);

-- Classes table: Users can only access classes from their club
CREATE POLICY "ByClub" ON public."classes"
  FOR ALL USING (club_id = current_setting('app.current_tenant')::uuid);

-- Class enrollments: Users can only access enrollments for classes in their club
CREATE POLICY "ByClub" ON public."class_enrollments"
  FOR ALL USING (
    class_id IN (
      SELECT id FROM public."classes" 
      WHERE club_id = current_setting('app.current_tenant')::uuid
    )
  );

-- Payments table: Users can only access payments from their club
CREATE POLICY "ByClub" ON public."payments"
  FOR ALL USING (club_id = current_setting('app.current_tenant')::uuid);

-- Announcements table: Users can only access announcements from their club
CREATE POLICY "ByClub" ON public."announcements"
  FOR ALL USING (club_id = current_setting('app.current_tenant')::uuid);

-- Products table: Users can only access products from their club
CREATE POLICY "ByClub" ON public."products"
  FOR ALL USING (club_id = current_setting('app.current_tenant')::uuid);

-- Orders table: Users can only access orders from their club
CREATE POLICY "ByClub" ON public."orders"
  FOR ALL USING (club_id = current_setting('app.current_tenant')::uuid);

-- Order items: Users can only access items for orders in their club
CREATE POLICY "ByClub" ON public."order_items"
  FOR ALL USING (
    order_id IN (
      SELECT id FROM public."orders" 
      WHERE club_id = current_setting('app.current_tenant')::uuid
    )
  );

-- Players table: Users can only access players from their club
CREATE POLICY "ByClub" ON public."players"
  FOR ALL USING (
    member_id IN (
      SELECT id FROM public."members" 
      WHERE club_id = current_setting('app.current_tenant')::uuid
    )
  );

-- Evaluations table: Users can only access evaluations for players in their club
CREATE POLICY "ByClub" ON public."evaluations"
  FOR ALL USING (
    player_id IN (
      SELECT p.id FROM public."players" p
      JOIN public."members" m ON p.member_id = m.id
      WHERE m.club_id = current_setting('app.current_tenant')::uuid
    )
  );

-- Notes table: Users can only access notes for players in their club
CREATE POLICY "ByClub" ON public."notes"
  FOR ALL USING (
    player_id IN (
      SELECT p.id FROM public."players" p
      JOIN public."members" m ON p.member_id = m.id
      WHERE m.club_id = current_setting('app.current_tenant')::uuid
    )
  );

-- Training plans table: Users can only access training plans from their club
CREATE POLICY "ByClub" ON public."training_plans"
  FOR ALL USING (
    trainer_id IN (
      SELECT id FROM public."trainers" 
      WHERE club_id = current_setting('app.current_tenant')::uuid
    )
  );

-- Training sessions table: Users can only access training sessions from their club
CREATE POLICY "ByClub" ON public."training_sessions"
  FOR ALL USING (
    trainer_id IN (
      SELECT id FROM public."trainers" 
      WHERE club_id = current_setting('app.current_tenant')::uuid
    )
  );

-- Contribution plans table: Users can only access contribution plans from their club
CREATE POLICY "ByClub" ON public."contribution_plans"
  FOR ALL USING (club_id = current_setting('app.current_tenant')::uuid);

-- Invoices table: Users can only access invoices from their club
CREATE POLICY "ByClub" ON public."invoices"
  FOR ALL USING (club_id = current_setting('app.current_tenant')::uuid);

-- Create a function to set the current tenant
-- This will be called by the application middleware
CREATE OR REPLACE FUNCTION set_current_tenant(tenant_id uuid)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant', tenant_id::text, false);
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION set_current_tenant(uuid) TO authenticated; 