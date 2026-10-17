import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/use-session';
import { useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { saveResult } from '@/lib/account.functions';
import type { SavedResult } from '@/lib/account-data';

/** Bouton d'enregistrement : n'affiche « enregistré » que si la base a confirmé. */
export function SaveToAccount({ result }: { result: SavedResult }) {
  const { user, ready } = useSession();
  const saveFn=useServerFn(saveResult); const qc=useQueryClient();
  const [state, setState] = useState<{ kind: 'idle' | 'saving' | 'ok' | 'error'; msg?: string; fingerprint?:string; table?:string }>({ kind: 'idle' });
  const fingerprint=JSON.stringify(result);
  const current=state.fingerprint===fingerprint?state.kind:'idle';
  if (!ready) return null;
  if (!user) return <p className="text-xs text-muted-foreground"><Link to="/connexion" className="font-semibold text-primary">Connectez-vous</Link> pour enregistrer ce résultat dans votre historique.</p>;
  async function save() {
    if(!user) return;
    setState({ kind: 'saving',fingerprint });
    try { const saved=await saveFn({data:result}); setState({kind:'ok',fingerprint,table:saved.table}); await qc.invalidateQueries({queryKey:[saved.table,user.id]}); await qc.invalidateQueries({queryKey:['summary',user.id]}); }
    catch (e) { setState({ kind: 'error',fingerprint, msg: e instanceof Error ? e.message : 'Impossible de joindre le serveur.' }); }
  }
  return <div className="space-y-2">
    <Button type="button" variant="outline" onClick={save} disabled={state.kind === 'saving' || current==='ok'}><Save />{state.kind === 'saving' ? 'Enregistrement…' : current==='ok'?'Enregistré':'Enregistrer dans mon compte'}</Button>
    {current === 'ok' && <p role="status" className="flex flex-wrap items-center gap-2 text-xs text-primary"><CheckCircle2 className="size-4" />Enregistré dans votre compte. <Link to={state.table==='invoices'?'/factures':state.table==='quotes'?'/devis':'/historique'} className="underline">Voir {state.table==='invoices'?'mes factures':state.table==='quotes'?'mes devis':'mon historique'}</Link></p>}
    {current === 'error' && <p role="alert" className="flex items-center gap-2 text-xs text-destructive"><AlertCircle className="size-4" />Échec de l’enregistrement : {state.msg}</p>}
  </div>;
}
