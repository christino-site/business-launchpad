import { useState } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/use-session';
import { House, LayoutDashboard, Grid2X2, History, Crown, ArrowUpRight, Menu, X, ChevronRight, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
 {to:'/',label:'Accueil',icon:House}, {to:'/tableau-de-bord',label:'Tableau de bord',icon:LayoutDashboard},
 {to:'/outils',label:'Mes outils',icon:Grid2X2}, {to:'/historique',label:'Historique',icon:History}, {to:'/premium',label:'Offre Premium',icon:Crown},
] as const;
export function BusinessShell({children}:{children:React.ReactNode}) {
 const [open,setOpen]=useState(false);
 const path=useRouterState({select:s=>s.location.pathname});
 const current=navigation.find(item=>item.to===path)?.label ?? (path==='/connexion'?'Connexion':'Inscription');
 return <>
  {open && <div className="fixed inset-0 z-30 bg-foreground/30" onClick={()=>setOpen(false)} aria-hidden="true" />}
  <aside className={`app-sidebar ${open?'open':''}`}>
   <Link to="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-mark">B</span><span><span className="brand-name block">Business Tools</span><span className="brand-subtitle">Premium</span></span></Link>
   <div className="nav-label">Votre espace business</div>
   <nav aria-label="Navigation principale">{navigation.map(item=><Link key={item.to} to={item.to} className={`nav-link ${path===item.to?'active':''}`} onClick={()=>setOpen(false)} aria-current={path===item.to?'page':undefined}><item.icon/>{item.label}{item.to==='/premium'&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber"/>}</Link>)}</nav>
   <div className="sidebar-premium"><Crown className="mb-3 size-5 text-primary"/><p className="font-bold text-[13px]">Votre business mérite plus.</p><p className="my-2 text-[11px] leading-5 text-muted-foreground">Découvrez ce que vous réserve la future formule Premium.</p><Button asChild variant="link" className="h-auto p-0 text-[11px]"><Link to="/premium" onClick={()=>setOpen(false)}>Découvrir Premium <ArrowUpRight/></Link></Button></div>
   <div className="border-t border-border px-2 pt-5 text-[10px] text-muted-foreground flex items-center gap-2"><FlaskConical className="size-3.5"/>Version 1.0 · Prototype</div>
  </aside>
  <div className="app-body"><header className="app-header"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="mobile-menu" onClick={()=>setOpen(!open)} aria-label={open?'Fermer le menu':'Ouvrir le menu'}>{open?<X/>:<Menu/>}</Button><div className="header-breadcrumb flex items-center gap-3 text-xs text-muted-foreground">Mon espace <ChevronRight className="size-3"/><span className="text-foreground font-semibold">{current}</span></div><span className="prototype-badge"><span className="prototype-dot"/>Version 2 · Prototype</span></div><AccountActions/></header>
   <main className="page-content">{children}<footer className="app-footer"><span>© 2026 Business Tools Premium. Pensé pour votre réussite.</span><span>Prototype indépendant · Aucun paiement réel</span></footer></main>
  </div>
 </>;
}

function AccountActions(){
 const {user,ready}=useSession(); const navigate=useNavigate(); const qc=useQueryClient();
 const [err,setErr]=useState<string|null>(null);
 if(!ready) return <div className="h-9"/>;
 if(!user) return <div className="flex items-center gap-3"><Button asChild variant="ghost" className="header-login text-xs"><Link to="/connexion">Se connecter</Link></Button><Button asChild className="text-xs"><Link to="/inscription">S’inscrire <ArrowUpRight/></Link></Button></div>;
 async function signOut(){
  setErr(null); await qc.cancelQueries();
  const {error}=await supabase.auth.signOut();
  if(error){setErr('Échec de la déconnexion');return;}
  qc.clear(); navigate({to:'/connexion',replace:true});
 }
 return <div className="flex items-center gap-3">{err&&<span role="alert" className="text-xs text-destructive">{err}</span>}<span className="header-login text-xs text-muted-foreground max-w-40 truncate">{user.email}</span><Button variant="outline" className="text-xs" onClick={signOut}><LogOut/>Se déconnecter</Button></div>;
}
