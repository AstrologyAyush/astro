// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oaixlmzglepmlcbhekrl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9haXhsbXpnbGVwbWxjYmhla3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTUzOTUsImV4cCI6MjA2NDQzMTM5NX0.Dof2gaRXaxRJQ-E2UiY8aDSi1F8PGCD2ca8RJhYT0Cg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);