import { supabase } from '../lib/supabaseClient';

export async function fetchNowItems() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from('now_items').select('*').order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function insertFeedback(payload) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from('feedback').insert(payload).select().single();

  if (error) {
    throw error;
  }

  return data;
}
