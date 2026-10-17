import { useState, type FormEvent } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeading, ToolGrid } from '@/components/business/shared';
import { pageHead } from '@/lib/business-demo';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/tableau-de-bord')({head:()=>pageHead('Tableau de bord','Votre tableau de bord personnel et privé Business Tools Premium.'),component:Dashboard});

const toolLabels={benefice:'Calculateur de bénéfice',factures:'Factures et devis',whatsapp:'Générateur WhatsApp','lien-whatsapp':'Lien WhatsApp direct',mesures:'Convertisseur de mesure'} as const;
type ToolKey=keyof typeof toolLabels;
const fcfa=(n:number|null)=>n==null?'—':`${new Intl.NumberFormat('fr-FR').format(n)} FCFA`;

function Dashboard(){
 const {user}=Route.useRouteContext();
 const qc=useQueryClient();
 const [formError,setFormError]=useState<string|null>(null);
 const [notice,setNotice]=useState<string|null>(null);

 const summary=useQuery({queryKey:['summary',user.id],queryFn:async()=>{
  const [p,i,q]=await Promise.all([
   supabase.from('profiles').select('full_name').eq('id',user.id).maybeSingle(),
   supabase.from('invoices').select('id',{count:'exact',head:true}),
   supabase.from('quotes').select('id',{count:'exact',head:true}),
  ]);
  const err=p.error??i.error??q.error; if(err) throw err;
  return {name:p.data?.full_name??null,invoices:i.count??0,quotes:q.count??0};
 }});
 const ops=useQuery({queryKey:['operations',user.id],queryFn:async()=>{
  const {data,error}=await supabase.from('operations').select('id,tool,label,amount_fcfa,created_at').order('created_at',{ascending:false}).limit(20);
  if(error) throw error; return data;
 }});
 const add=useMutation({mutationFn:async(v:{tool:ToolKey;label:string;amount:number|null})=>{
  const {error}=await supabase.from('operations').insert({user_id:user.id,tool:v.tool,label:v.label,amount_fcfa:v.amount});
  if(error) throw error;
 },onSuccess:()=>{setNotice('Opération enregistrée dans votre compte.');qc.invalidateQueries({queryKey:['operations',user.id]});},
  onError:(e:Error)=>{setNotice(null);setFormError(`Échec de l’enregistrement : ${e.message}`);}});
 const del=useMutation({mutationFn:async(id:string)=>{
  const {error,count}=await supabase.from('operations').delete({count:'exact'}).eq('id',id);
  if(error) throw error; if(!count) throw new Error('aucune ligne supprimée');
 },onSuccess:()=>{setNotice('Opération supprimée.');qc.invalidateQueries({queryKey:['operations',user.id]});},
  onError:(e:Error)=>{setNotice(null);setFormError(`Échec de la suppression : ${e.message}`);}});

 function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setFormError(null); setNotice(null);
  const form=e.currentTarget; const f=new FormData(form);
  const label=String(f.get('label')??'').trim(); const raw=String(f.get('amount')??'').replace(/\s/g,'');
  if(!label){setFormError('Indiquez un libellé.');return;}
  const amount=raw===''?null:Number(raw);
  if(amount!=null&&(!Number.isFinite(amount)||amount<0)){setFormError('Le montant doit être un nombre positif.');return;}
  add.mutate({tool:f.get('tool') as ToolKey,label,amount},{onSuccess:()=>form.reset()});
 }

 return <><PageHeading title={`Bienvenue${summary.data?.name?`, ${summary.data.name}`:''}.`} description={`Espace privé de ${user.email}. Seules vos propres données s’affichent ici.`}/>
 {summary.error&&<ErrorBox>Impossible de charger votre résumé : {(summary.error as Error).message}</ErrorBox>}
 <div className="stats-grid">
  <article className="stat"><span>Opérations enregistrées</span><strong>{ops.isLoading?'…':ops.data?.length??'—'}</strong><span>20 dernières affichées</span></article>
  <article className="stat"><span>Factures</span><strong>{summary.isLoading?'…':summary.data?.invoices??'—'}</strong><Link to="/factures" className="text-primary underline">Voir mes factures</Link></article>
  <article className="stat"><span>Devis</span><strong>{summary.isLoading?'…':summary.data?.quotes??'—'}</strong><Link to="/devis" className="text-primary underline">Voir mes devis</Link></article>
 </div>
 <div className="section-heading"><h2>Ajouter une opération</h2></div>
 <form onSubmit={submit} className="auth-form" style={{maxWidth:'none'}} noValidate>
  {formError&&<ErrorBox>{formError}</ErrorBox>}
  {notice&&!formError&&<p role="status" className="rounded-lg bg-secondary p-3 text-sm text-primary">{notice}</p>}
  <label htmlFor="tool">Outil</label><select id="tool" name="tool" className="form-input">{Object.entries(toolLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
  <label htmlFor="label">Libellé</label><input id="label" name="label" className="form-input" maxLength={200} placeholder="Ex. Vente de pagnes"/>
  <label htmlFor="amount">Montant (FCFA, facultatif)</label><input id="amount" name="amount" inputMode="numeric" className="form-input" placeholder="45000"/>
  <Button type="submit" disabled={add.isPending} className="mt-5"><Plus/>{add.isPending?'Enregistrement…':'Enregistrer'}</Button>
 </form>
 <div className="section-heading"><h2>Vos opérations récentes</h2></div>
 {ops.error?<ErrorBox>Impossible de charger vos opérations : {(ops.error as Error).message}</ErrorBox>:
 <div className="demo-table"><table><thead><tr><th>Libellé</th><th>Outil</th><th>Montant</th><th>Date</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
  {ops.isLoading&&<tr><td colSpan={5}>Chargement…</td></tr>}
  {ops.data?.length===0&&<tr><td colSpan={5} className="text-muted-foreground">Aucune opération pour l’instant.</td></tr>}
  {ops.data?.map(r=><tr key={r.id}><td className="font-semibold">{r.label}</td><td>{toolLabels[r.tool as ToolKey]??r.tool}</td><td>{fcfa(r.amount_fcfa)}</td><td>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td><td><Button variant="ghost" size="icon" aria-label={`Supprimer ${r.label}`} disabled={del.isPending} onClick={()=>{setFormError(null);del.mutate(r.id);}}><Trash2/></Button></td></tr>)}
 </tbody></table></div>}
 <div className="section-heading"><h2>Vos outils</h2></div><ToolGrid/></>;
}
function ErrorBox({children}:{children:React.ReactNode}){return <div role="alert" className="mb-4 flex gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="size-4 shrink-0 mt-0.5"/><span>{children}</span></div>;}
