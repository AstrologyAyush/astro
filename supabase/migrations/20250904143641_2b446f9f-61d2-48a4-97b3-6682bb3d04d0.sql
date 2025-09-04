-- Fix critical security vulnerability: Remove overly permissive RLS policy
-- The "Edge functions can manage subscriptions" policy with "true" condition allows public access
-- Edge functions use service role key and bypass RLS anyway, so this policy is unnecessary and dangerous

DROP POLICY IF EXISTS "Edge functions can manage subscriptions" ON public.subscribers;

-- Verify that user-specific policies remain for proper access control
-- These policies ensure users can only access their own subscription data when authenticated