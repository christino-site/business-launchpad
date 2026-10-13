import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/use-session';

/** Bouton d'enregistrement : n'affiche « enregistré » que si la base a confirmé. */
export function SaveToAccount({ disabled, onSave, label = 'Enregistrer dans mon compte' }: { disabled?: boolean; onSave: (userId: string) => Promise<{ error: { message: string } | null }>; label?: string }) {
  const { user, ready } = useSession();
  const [state, setState] = useState<{ kind: 'idle' | 'saving' | 'ok' | 'error'; msg?: string }>({ kind: 'idle' });
  if (!ready) return null;
  if (!user) return <p className="text-xs text-muted-foreground"><Link to="/connexion" className="font-semibold text-primary">Connectez-vous</Link> pour enregistrer ce résultat dans votre historique.</p>;
  async function save() {
    setState({ kind: 'saving' });
    try { const { error } = await onSave(user!.id); setState(error ? { kind: 'error', msg: error.message } : { kind: 'ok' }); }
    catch (e) { setState({ kind: 'error', msg: e instanceof Error ? e.message : 'erreur inconnue' }); }
  }
  return <div className="space-y-2">
    <Button type="button" variant="outline" onClick={save} disabled={disabled || state.kind === 'saving'}><Save />{state.kind === 'saving' ? 'Enregistrement…' : label}</Button>
    {state.kind === 'ok' && <p role="status" className="flex items-center gap-2 text-xs text-primary"><CheckCircle2 className="size-4" />Enregistré dans votre compte.</p>}
    {state.kind === 'error' && <p role="alert" className="flex items-center gap-2 text-xs text-destructive"><AlertCircle className="size-4" />Échec de l’enregistrement : {state.msg}</p>}
  </div>;
}
