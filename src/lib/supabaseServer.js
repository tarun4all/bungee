import { createClient } from "@supabase/supabase-js";

const NEXT_PUBLIC_SUPABASE_URL = "https://ybaarcwqgggxfblvxxvx.supabase.co";
const NEXT_PUBLIC_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliYWFyY3dxZ2dneGZibHZ4eHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjE5NjQsImV4cCI6MjA3OTczNzk2NH0.GUN5r-jflLJHeuOZYsrtAdeo75mnJIvNAsoUTOBbXC0";

const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase env vars are missing");
}

// SERVER-SIDE ONLY client
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
