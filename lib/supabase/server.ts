import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabaseAnonKey, supabaseServiceRole, supabaseUrl } from './env';

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        cookieStore.set({ name, value, ...(options as object) });
      },
      remove(name: string, options: Record<string, unknown>) {
        cookieStore.set({ name, value: '', ...(options as object) });
      }
    }
  });
}

export function createAdminSupabaseClient() {
  return createServerClient(supabaseUrl, supabaseServiceRole, {
    cookies: {
      get() {
        return undefined;
      },
      set() {},
      remove() {}
    }
  });
}
