import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://siyuiswtwfjzhixrrkyi.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_m3riWiuOF_7RiZhOlzQ0BA_XsZnO7Y9';

const isConfigured = !SUPABASE_URL.includes('YOUR-PROJECT-REF')
  && !SUPABASE_PUBLISHABLE_KEY.includes('YOUR_SUPABASE_PUBLISHABLE_KEY');

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

export async function saveProfile(user, metadata) {
  if (!supabase || !user) return { error: new Error('Supabase is not configured.') };

  const { data, error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: metadata.full_name || user.user_metadata?.full_name || '',
    phone: metadata.phone || user.user_metadata?.phone || '',
    email: user.email || ''
  }).select('id, full_name, phone, email').single();

  return { data, error };
}

async function updateNavigation(session) {
  const loginLink = document.querySelector('[data-auth-login]');
  const userLabel = document.querySelector('[data-auth-user]');
  const logoutButton = document.querySelector('[data-auth-logout]');
  if (!loginLink || !userLabel || !logoutButton) return;

  if (!session?.user) {
    loginLink.hidden = false;
    userLabel.hidden = true;
    logoutButton.hidden = true;
    return;
  }

  let name = session.user.user_metadata?.full_name || '';
  if (supabase) {
    const { data } = await supabase.from('profiles')
      .select('full_name').eq('id', session.user.id).maybeSingle();
    name = data?.full_name || name;
  }
  loginLink.hidden = true;
  userLabel.textContent = name || session.user.email || 'Your account';
  userLabel.hidden = false;
  logoutButton.hidden = false;
}

document.addEventListener('DOMContentLoaded', async () => {
  const loginLink = document.querySelector('[data-auth-login]');
  const logoutButton = document.querySelector('[data-auth-logout]');
  if (!loginLink || !logoutButton) return;

  if (!supabase) {
    loginLink.setAttribute('aria-label', 'Configure Supabase to enable customer accounts');
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  await updateNavigation(session);
  supabase.auth.onAuthStateChange((_event, nextSession) => {
    window.setTimeout(() => void updateNavigation(nextSession), 0);
  });
  logoutButton.addEventListener('click', async () => {
    logoutButton.disabled = true;
    const { error } = await supabase.auth.signOut();
    logoutButton.disabled = false;
    if (error) console.error('Unable to sign out:', error.message);
  });
});
