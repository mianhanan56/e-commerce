export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

// Lets the store and admin show a clear message instead of crashing before setup.
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey);
}
