import { Calculator, FileText, MessageSquareText, Link2, Ruler } from 'lucide-react';

export const prototype = { authentication:true, persistence:true, payments: false, currency: 'FCFA' } as const;
export const tools = [
 { id:'benefice', name:'Calculateur de bénéfice', description:'Estimez vos marges et votre bénéfice pour prendre les bonnes décisions.', icon:Calculator, tone:'bg-secondary text-primary', detail:'Prix de vente, coût d’achat, charges et quantité : les éléments de votre futur calcul de bénéfice.' },
 { id:'factures', name:'Factures et devis', description:'Préparez des documents professionnels pour vos clients, en toute simplicité.', icon:FileText, tone:'bg-blue-soft text-blue', detail:'Coordonnées, articles, quantités et montants en FCFA : la future interface de vos factures et devis.' },
 { id:'generateur', name:'Générateur WhatsApp', description:'Composez des messages clairs et percutants pour développer votre activité.', icon:MessageSquareText, tone:'bg-secondary text-primary', detail:'Des modèles de messages pour présenter une offre, relancer un client ou confirmer une commande.' },
 { id:'lien', name:'Lien WhatsApp direct', description:'Facilitez le contact avec vos clients grâce à un lien WhatsApp personnalisé.', icon:Link2, tone:'bg-amber-soft text-amber', detail:'Un numéro de téléphone avec indicatif et un message prédéfini pour votre futur lien de contact.' },
 { id:'mesure', name:'Convertisseur de mesure', description:'Convertissez facilement vos unités de longueur, de poids et de volume.', icon:Ruler, tone:'bg-violet-soft text-violet', detail:'Les conversions de longueur, masse et volume seront disponibles dans une prochaine étape.' },
];
export const demoHistory = [
 { id:'EX-001', name:'Vente de pagnes', tool:'Calculateur de bénéfice', date:'10 oct. 2026', amount:'45 000 FCFA' },
 { id:'EX-002', name:'Devis — Boutique Awa', tool:'Factures et devis', date:'9 oct. 2026', amount:'125 000 FCFA' },
 { id:'EX-003', name:'Message de bienvenue', tool:'Générateur WhatsApp', date:'8 oct. 2026', amount:'—' },
 { id:'EX-004', name:'Contact de la boutique', tool:'Lien WhatsApp direct', date:'7 oct. 2026', amount:'—' },
 { id:'EX-005', name:'Conversion de poids', tool:'Convertisseur de mesure', date:'6 oct. 2026', amount:'—' },
];
export function pageHead(title:string, description:string) {
 const fullTitle = `${title} | Business Tools Premium`;
 return { meta:[{title:fullTitle},{name:'description',content:description},{property:'og:title',content:fullTitle},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}] };
}
