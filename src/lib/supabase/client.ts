import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://zxzxfdgkomtkapzleztk.supabase.co';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4enhmZGdrb210a2FwemxlenRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwMjM1NDEsImV4cCI6MjAzNzU5OTU0MX0.jQPSu_pxv9VBsMZ3Ipr7ZjFqM29NrsMq0oPNSLVqvVs';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
