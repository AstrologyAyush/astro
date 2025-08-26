-- CRITICAL SECURITY FIXES
-- This migration addresses critical RLS policy gaps and privilege escalation vulnerabilities

-- First, let's ensure all critical tables exist and have RLS enabled
-- (These tables may already exist from previous migrations)

-- Create tables if they don't exist (with IF NOT EXISTS to avoid errors)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  place_of_birth TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kundali_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_data JSONB NOT NULL,
  kundali_data JSONB NOT NULL,
  gemini_analysis JSONB,
  accuracy_metrics JSONB,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.numerology_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  numerology_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rishi_parasher_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kundali_id UUID REFERENCES public.kundali_reports(id) ON DELETE CASCADE,
  user_query TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  conversation_type TEXT DEFAULT 'general',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY on all critical tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kundali_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.numerology_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rishi_parasher_conversations ENABLE ROW LEVEL SECURITY;

-- DROP existing overly permissive policies before creating secure ones
DROP POLICY IF EXISTS "Edge functions can manage subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Edge functions can manage usage" ON public.usage_tracking;

-- CREATE SECURE RLS POLICIES

-- 1. PROFILES TABLE POLICIES
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    public.has_role(auth.uid(), 'owner') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- 2. KUNDALI REPORTS POLICIES
CREATE POLICY "Users can view their own kundali reports" ON public.kundali_reports
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own kundali reports" ON public.kundali_reports
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own kundali reports" ON public.kundali_reports
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own kundali reports" ON public.kundali_reports
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all kundali reports" ON public.kundali_reports
  FOR ALL USING (
    public.has_role(auth.uid(), 'owner') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- 3. USER ACTIVITIES POLICIES (Allow anonymous tracking for certain activities)
CREATE POLICY "Users can view their own activities" ON public.user_activities
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Allow anonymous activity tracking" ON public.user_activities
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all activities" ON public.user_activities
  FOR SELECT USING (
    public.has_role(auth.uid(), 'owner') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- 4. NUMEROLOGY REPORTS POLICIES
CREATE POLICY "Users can view their own numerology reports" ON public.numerology_reports
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own numerology reports" ON public.numerology_reports
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own numerology reports" ON public.numerology_reports
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own numerology reports" ON public.numerology_reports
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all numerology reports" ON public.numerology_reports
  FOR ALL USING (
    public.has_role(auth.uid(), 'owner') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- 5. RISHI PARASHER CONVERSATIONS POLICIES
CREATE POLICY "Users can view their own conversations" ON public.rishi_parasher_conversations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own conversations" ON public.rishi_parasher_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all conversations" ON public.rishi_parasher_conversations
  FOR SELECT USING (
    public.has_role(auth.uid(), 'owner') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- 6. SECURE ROLE MANAGEMENT (Fix privilege escalation vulnerability)
-- First drop the overly permissive owner policy
DROP POLICY IF EXISTS "Owners can manage all roles" ON public.user_roles;

-- Create more restrictive policies
CREATE POLICY "Prevent role creation by regular users" ON public.user_roles
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'owner') OR
    (public.has_role(auth.uid(), 'admin') AND NEW.role = 'user')
  );

CREATE POLICY "Prevent privilege escalation" ON public.user_roles
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'owner') OR
    (public.has_role(auth.uid(), 'admin') AND OLD.role = 'user' AND NEW.role = 'user')
  );

CREATE POLICY "Only owners can delete roles" ON public.user_roles
  FOR DELETE USING (public.has_role(auth.uid(), 'owner'));

-- 7. SECURE SUBSCRIPTION POLICIES (Replace overly permissive ones)
CREATE POLICY "Service role can manage subscriptions" ON public.subscribers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can view all subscriptions" ON public.subscribers
  FOR SELECT USING (
    public.has_role(auth.uid(), 'owner') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- 8. SECURE USAGE TRACKING POLICIES
CREATE POLICY "Service role can manage usage tracking" ON public.usage_tracking
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can view all usage data" ON public.usage_tracking
  FOR SELECT USING (
    public.has_role(auth.uid(), 'owner') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- 9. CREATE SECURITY AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  table_name TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view security audit log" ON public.security_audit_log
  FOR SELECT USING (
    public.has_role(auth.uid(), 'owner') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- 10. CREATE INDEX FOR PERFORMANCE ON SECURITY-CRITICAL QUERIES
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role ON public.user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_kundali_reports_user_id ON public.kundali_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id_created_at ON public.user_activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);