import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { LockKeyhole, AlertCircle, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { authErrorMessage } from '@/hooks/use-session';
import { PageHeading } from './shared';

export function AuthPage({signup=false}:{signup?:boolean}) {
 const navigate=useNavigate();
 const [error,setError]=useState<string|null>(null);
 const [pending,setPending]=useState(false);
 const [sentTo,setSentTo]=useState<string|null>(null);

 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setError(null);
  const f=new FormData(e.currentTarget);
  const email=String(f.get('email')??'').trim(), password=String(f.get('password')??'');
  if(!email||!password){setError('Renseignez votre adresse e-mail et votre mot de passe.');return;}
  if(signup){
   const name=String(f.get('name')??'').trim();
   if(password.length<8){setError('Le mot de passe doit contenir au moins 8 caractères.');return;}
   if(password!==f.get('confirm')){setError('Les deux mots de passe ne correspondent pas.');return;}
   setPending(true);
   const {data,error:err}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+'/tableau-de-bord',data:{full_name:name}}});
   setPending(false);
   if(err){setError(authErrorMessage(err.message));return;}
   if(data.session){navigate({to:'/tableau-de-bord'});return;}
   setSentTo(email); return;
  }
  setPending(true);
  const {error:err}=await supabase.auth.signInWithPassword({email,password});
  setPending(false);
  if(err){setError(authErrorMessage(err.message));return;}
  navigate({to:'/tableau-de-bord'});
 }

 if(sentTo) return <><PageHeading title="Vérifiez votre boîte e-mail." description="Une dernière étape avant d’accéder à votre espace."/><div className="auth-form"><div className="tool-icon bg-secondary text-primary"><MailCheck/></div><p className="mt-5 text-sm leading-6">Un lien de confirmation a été envoyé à <strong>{sentTo}</strong>. Ouvrez-le pour activer votre compte, puis connectez-vous.</p><p className="mt-3 text-xs text-muted-foreground">Pas reçu ? Pensez à regarder dans les courriers indésirables.</p><Button asChild className="mt-6 w-full"><Link to="/connexion">Aller à la connexion</Link></Button></div></>;

 return <><PageHeading title={signup?'Créer votre compte':'Ravi de vous retrouver.'} description={signup?'Votre espace personnel pour gérer votre activité.':'Connectez-vous pour retrouver vos données.'}/>
 <form className="auth-form" onSubmit={submit} noValidate>
  <div className="tool-icon bg-secondary text-primary"><LockKeyhole/></div>
  <h2 className="mt-5 text-xl font-bold">{signup?'Bienvenue chez Business Tools':'Connexion à votre espace'}</h2>
  {error&&<div role="alert" className="mt-4 flex gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="size-4 shrink-0 mt-0.5"/>{error}</div>}
  {signup&&<><label htmlFor="name">Nom complet</label><input id="name" name="name" className="form-input" placeholder="Votre nom" autoComplete="name" maxLength={100}/></>}
  <label htmlFor="email">Adresse e-mail</label><input id="email" name="email" type="email" required className="form-input" placeholder="vous@exemple.com" autoComplete="email"/>
  <label htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" required className="form-input" placeholder={signup?'8 caractères minimum':'Votre mot de passe'} autoComplete={signup?'new-password':'current-password'}/>
  {signup&&<><label htmlFor="confirm">Confirmer le mot de passe</label><input id="confirm" name="confirm" type="password" required className="form-input" placeholder="Confirmez votre mot de passe" autoComplete="new-password"/></>}
  <Button type="submit" disabled={pending} className="mt-7 w-full">{pending?'Veuillez patienter…':signup?'Créer mon compte':'Se connecter'}</Button>
  <p className="mt-6 text-center text-xs text-muted-foreground">{signup?'Déjà un compte ?':'Pas encore de compte ?'} <Link to={signup?'/connexion':'/inscription'} className="font-semibold text-primary">{signup?'Se connecter':'S’inscrire'}</Link></p>
 </form></>;
}
