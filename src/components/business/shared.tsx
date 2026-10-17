import { Link } from '@tanstack/react-router';
import { ArrowRight, Info, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tools } from '@/lib/business-demo';
export function PageHeading({title,description}:{title:string,description:string}) { return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div></div>; }
export function DemoNotice({children}:{children?:React.ReactNode}) { return <div className="notice"><Info/><div>{children ?? <><strong>Données fictives — démonstration uniquement.</strong> Aucun résultat n’est enregistré et aucun compte n’est connecté.</>}</div></div>; }
export function ToolGrid() { return <div className="tool-grid">{tools.map(tool=><article key={tool.id} className="tool-card"><div className={`tool-icon ${tool.tone}`}><tool.icon/></div><h3>{tool.name}</h3><p>{tool.description}</p><div className="tool-action"><span className="free-tag">Outil gratuit</span><Button asChild variant="ghost" size="sm"><Link to="/outil/$outil" params={{outil:tool.id}}>Ouvrir <ArrowRight/></Link></Button></div></article>)}</div>; }
export function PremiumBand() { return <section className="premium-band"><div className="flex gap-4"><Crown className="mt-1 size-7 shrink-0 text-primary"/><div><h2>Un peu plus loin, avec Premium.</h2><p>Historique, sauvegarde et outils avancés : votre futur espace pour aller plus loin.</p></div></div><Button asChild variant="outline" className="shrink-0 text-xs"><Link to="/premium">Découvrir les avantages <ArrowRight/></Link></Button></section>; }
