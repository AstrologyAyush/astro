-- Enhanced security measures for profiles table containing sensitive personal data

-- First, let's add a DELETE policy to be explicit about deletion permissions
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add additional security by creating a function to validate profile access
CREATE OR REPLACE FUNCTION public.validate_profile_access(profile_owner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = profile_owner_id AND auth.uid() IS NOT NULL;
$$;

-- Update existing policies to use the validation function for extra security
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recreate policies with enhanced validation
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (public.validate_profile_access(user_id));

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (public.validate_profile_access(user_id));

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (public.validate_profile_access(user_id))
WITH CHECK (public.validate_profile_access(user_id));

-- Add audit logging for sensitive data access
CREATE TABLE IF NOT EXISTS public.profile_access_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  accessed_profile_id uuid NOT NULL,
  access_type text NOT NULL,
  accessed_at timestamp with time zone DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Enable RLS on audit log
ALTER TABLE public.profile_access_log ENABLE ROW LEVEL SECURITY;

-- Only allow users to view their own access logs
CREATE POLICY "Users can view their own access logs" 
ON public.profile_access_log 
FOR SELECT 
USING (user_id = auth.uid());

-- Create function to log profile access
CREATE OR REPLACE FUNCTION public.log_profile_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the access attempt
  INSERT INTO public.profile_access_log (user_id, accessed_profile_id, access_type)
  VALUES (auth.uid(), NEW.user_id, TG_OP);
  
  RETURN NEW;
END;
$$;

-- Add trigger to log profile updates (most sensitive operations)
CREATE TRIGGER profile_access_audit
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_access();