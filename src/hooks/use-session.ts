import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/** Session courante côté navigateur ; `ready` passe à true après la première lecture. */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, s) => { setSession(s); setReady(true); });
    supabase.auth.getSession().then(({ data: d }) => { setSession(d.session); setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  return { session, user: session?.user ?? null, ready };
}

/** Traduit les erreurs d'authentification les plus courantes en français. */
export function authErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Adresse e-mail ou mot de passe incorrect.';
  if (m.includes('email not confirmed')) return 'Votre adresse e-mail n’est pas encore confirmée. Ouvrez le lien reçu par e-mail.';
  if (m.includes('already registered') || m.includes('already exists')) return 'Un compte existe déjà avec cette adresse e-mail.';
  if (m.includes('password') && (m.includes('weak') || m.includes('pwned') || m.includes('leaked'))) return 'Ce mot de passe est trop faible ou déjà compromis. Choisissez-en un autre.';
  if (m.includes('at least')) return 'Le mot de passe doit contenir au moins 6 caractères.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Trop de tentatives. Patientez quelques minutes avant de réessayer.';
  if (m.includes('fetch') || m.includes('network')) return 'Impossible de joindre le serveur. Vérifiez votre connexion internet.';
  return `Erreur : ${message}`;
}
