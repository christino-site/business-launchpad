import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Sparkles, ShieldCheck, Smartphone, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolGrid, PremiumBand } from '@/components/business/shared';
import { pageHead } from '@/lib/business-demo';
import entrepreneur from '@/assets/entrepreneur.jpg';
export const Route = createFileRoute('/')({head:()=>pageHead('Accueil','Business Tools Premium : cinq outils pour accompagner les entrepreneurs et petites entreprises en Afrique francophone.'),component:Index});
function Index() { return <>
 <div className="page-heading"><div><h2 className="text-[25px] font-extrabold">De grandes idées. Les bons outils.</h2><p>Un espace pensé pour simplifier votre quotidien d’entrepreneur.</p></div></div>
 <section className="home-hero"><img src={entrepreneur} alt="Entrepreneure au travail, avec son ordinateur et ses documents" width={1536} height={1024}/><div className="hero-copy"><div className="hero-kicker"><Sparkles className="size-3.5"/>L’essentiel pour votre activité</div><h1>Business Tools<br/>Premium<span className="text-secondary">.</span></h1><p>Calculez, créez et développez votre activité.<br/>Vos outils du quotidien, réunis dans un espace simple et professionnel.</p><Button asChild className="hero-button mt-6 h-11 px-5 text-xs"><Link to="/outils">Découvrir les outils <ArrowRight/></Link></Button><div className="mt-4 flex items-center gap-1.5 text-[10px] opacity-80"><CircleCheck className="size-3"/>Sans abonnement pendant le prototype</div></div></section>
 <div className="benefit-strip"><div className="benefit"><GridIcon/><div><strong>5 outils, un seul espace</strong><span>L’essentiel, toujours à portée de main.</span></div></div><div className="benefit"><Smartphone/><div><strong>Au bureau ou en déplacement</strong><span>Sur votre téléphone et votre ordinateur.</span></div></div><div className="benefit"><ShieldCheck/><div><strong>Simple et sans engagement</strong><span>Explorez librement la démonstration.</span></div></div></div>
 <div className="section-heading"><div><h2>Vos outils au quotidien</h2><p>Moins de complications. Plus de temps pour votre business.</p></div><Button asChild variant="link" className="px-0 text-[11px]"><Link to="/outils">Tous les outils <ArrowRight/></Link></Button></div><ToolGrid/><PremiumBand/>
 </>; }
function GridIcon(){return <Sparkles/>;}
