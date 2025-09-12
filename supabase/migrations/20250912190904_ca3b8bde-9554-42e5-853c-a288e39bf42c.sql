-- Fix security gap in profile_access_log table RLS policies

-- Add INSERT policy to prevent unauthorized log creation
-- Only the system (via triggers) should be able to insert logs
CREATE POLICY "System can insert access logs" 
ON public.profile_access_log 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Add UPDATE policy to prevent log tampering
-- Logs should be immutable for audit integrity
CREATE POLICY "Logs are immutable" 
ON public.profile_access_log 
FOR UPDATE 
USING (false);

-- Add DELETE policy to prevent log deletion
-- Logs should be permanent for audit trail
CREATE POLICY "Logs cannot be deleted" 
ON public.profile_access_log 
FOR DELETE 
USING (false);

-- Enhance the logging trigger to capture more access types
DROP TRIGGER IF EXISTS profile_access_audit ON public.profiles;

-- Create comprehensive audit trigger for all profile operations
CREATE OR REPLACE FUNCTION public.log_profile_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the access attempt with more context
  INSERT INTO public.profile_access_log (
    user_id, 
    accessed_profile_id, 
    access_type,
    ip_address,
    user_agent
  )
  VALUES (
    auth.uid(), 
    COALESCE(NEW.user_id, OLD.user_id), 
    TG_OP,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add triggers for all profile operations
CREATE TRIGGER profile_access_audit_insert
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_access();

CREATE TRIGGER profile_access_audit_update
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_access();

CREATE TRIGGER profile_access_audit_delete
  AFTER DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_access();