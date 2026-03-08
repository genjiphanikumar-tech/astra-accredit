
-- Fix ALL RLS policies: change from RESTRICTIVE to PERMISSIVE

-- ===== evidence_files =====
DROP POLICY IF EXISTS "Admins can manage all evidence" ON public.evidence_files;
DROP POLICY IF EXISTS "Authenticated users can upload evidence" ON public.evidence_files;
DROP POLICY IF EXISTS "Authenticated users can view evidence" ON public.evidence_files;

CREATE POLICY "Admins can manage all evidence"
  ON public.evidence_files FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can upload evidence"
  ON public.evidence_files FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can view evidence"
  ON public.evidence_files FOR SELECT TO authenticated
  USING (true);

-- ===== criteria =====
DROP POLICY IF EXISTS "Admins and editors can manage criteria" ON public.criteria;
DROP POLICY IF EXISTS "Authenticated users can view criteria" ON public.criteria;

CREATE POLICY "Admins and editors can manage criteria"
  ON public.criteria FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Authenticated users can view criteria"
  ON public.criteria FOR SELECT TO authenticated
  USING (true);

-- ===== data_sources =====
DROP POLICY IF EXISTS "Admins and editors can manage data sources" ON public.data_sources;
DROP POLICY IF EXISTS "Authenticated users can view data sources" ON public.data_sources;

CREATE POLICY "Admins and editors can manage data sources"
  ON public.data_sources FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Authenticated users can view data sources"
  ON public.data_sources FOR SELECT TO authenticated
  USING (true);

-- ===== gaps =====
DROP POLICY IF EXISTS "Admins and editors can manage gaps" ON public.gaps;
DROP POLICY IF EXISTS "Authenticated users can view gaps" ON public.gaps;

CREATE POLICY "Admins and editors can manage gaps"
  ON public.gaps FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Authenticated users can view gaps"
  ON public.gaps FOR SELECT TO authenticated
  USING (true);

-- ===== institutions =====
DROP POLICY IF EXISTS "Admins can manage institutions" ON public.institutions;
DROP POLICY IF EXISTS "Authenticated users can view institutions" ON public.institutions;

CREATE POLICY "Admins can manage institutions"
  ON public.institutions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view institutions"
  ON public.institutions FOR SELECT TO authenticated
  USING (true);

-- ===== milestones =====
DROP POLICY IF EXISTS "Admins can manage milestones" ON public.milestones;
DROP POLICY IF EXISTS "Authenticated users can view milestones" ON public.milestones;

CREATE POLICY "Admins can manage milestones"
  ON public.milestones FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view milestones"
  ON public.milestones FOR SELECT TO authenticated
  USING (true);

-- ===== notifications =====
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- ===== profiles =====
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- ===== reports =====
DROP POLICY IF EXISTS "Admins and editors can manage reports" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can view reports" ON public.reports;

CREATE POLICY "Admins and editors can manage reports"
  ON public.reports FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Authenticated users can view reports"
  ON public.reports FOR SELECT TO authenticated
  USING (true);

-- ===== tasks =====
DROP POLICY IF EXISTS "Admins and editors can manage tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can view tasks" ON public.tasks;

CREATE POLICY "Admins and editors can manage tasks"
  ON public.tasks FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Authenticated users can view tasks"
  ON public.tasks FOR SELECT TO authenticated
  USING (true);

-- ===== user_roles =====
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
