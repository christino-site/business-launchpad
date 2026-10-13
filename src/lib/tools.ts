// Logique pure des cinq outils, reprise du site Business Tools d'origine.
export const toNum = (v: string | number) => { const s = String(v).trim().replace(',', '.'); return s === '' ? NaN : Number(s); };
export function fmt(n: number, d = 2) {
  if (!Number.isFinite(n)) return '—';
  const a = Number(Math.abs(n).toFixed(d)); const [i, r] = String(a).split('.');
  return (n < 0 && a !== 0 ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (r ? ',' + r : '');
}
export const fcfa = (n: number) => `${fmt(n)} FCFA`;

/* ---------- Calculateur de bénéfice ---------- */
export type ProfitInput = { buy: number; qty: number; sell: number; costs: number[] };
export function computeProfit({ buy, qty, sell, costs }: ProfitInput) {
  if (!(buy >= 0) || !(qty > 0) || !(sell >= 0)) return null;
  const extra = costs.reduce((s, c) => s + Math.max(0, Number.isFinite(c) ? c : 0), 0);
  const products = buy * qty, total = products + extra, revenue = sell * qty, profit = revenue - total;
  return { products, total, revenue, profit, margin: revenue > 0 ? (profit / revenue) * 100 : NaN, unitCost: total / qty, unitProfit: profit / qty };
}

/* ---------- Factures et devis ---------- */
export type LineItem = { name: string; qty: number; price: number };
export function computeInvoice(items: LineItem[], discount: number, delivery: number) {
  const subtotal = items.reduce((s, i) => s + (Number.isFinite(i.qty) && Number.isFinite(i.price) ? i.qty * i.price : 0), 0);
  return { subtotal, total: Math.max(0, subtotal - Math.max(0, discount || 0) + Math.max(0, delivery || 0)) };
}

/* ---------- Générateur WhatsApp ---------- */
type Field = { id: string; label: string; req?: boolean; type?: 'number'; placeholder?: string };
const f = (id: string, label: string, o: Partial<Field> = {}): Field => ({ id, label, ...o });
type V = Record<string, string>;
const money = (v?: string) => { const n = toNum(v ?? ''); return Number.isFinite(n) ? fcfa(n) : ''; };
const hi = (e: V) => 'Bonjour' + (e.client ? ' ' + e.client : '') + ' 👋';
const ln = (k: string, v?: string) => (v ? `${k} : ${v}` : null);
const compose = (...l: (string | null)[]) => l.filter(x => x != null).join('\n').replace(/\n{3,}/g, '\n\n').trim();
export const WA_CATEGORIES: Record<string, { label: string; fields: Field[]; build: (e: V) => string }> = {
  contact: { label: '👋 Premier contact', fields: [f('client', 'Nom du client', { req: true }), f('entreprise', 'Votre nom ou entreprise', { req: true }), f('offre', 'Ce que vous proposez')],
    build: e => compose(hi(e), '', `Ici ${e.entreprise}.`, e.offre ? `Nous proposons : ${e.offre}.` : null, '', 'Dites-moi ce qui vous intéresse, je vous réponds avec plaisir.', '', 'Bonne journée 🙏') },
  prix: { label: '💰 Demande de prix', fields: [f('client', 'Nom du client', { req: true }), f('produit', 'Produit', { req: true }), f('prix', 'Prix (FCFA)', { req: true, type: 'number' }), f('validite', "Offre valable jusqu'au")],
    build: e => compose(hi(e), '', 'Merci pour votre intérêt.', '', ln('Produit', e.produit), ln('Prix', money(e.prix)), ln("Valable jusqu'au", e.validite), '', 'Souhaitez-vous commander ? Je reste disponible pour toute question.') },
  commande: { label: '🛒 Confirmation de commande', fields: [f('client', 'Nom du client', { req: true }), f('produit', 'Produit', { req: true }), f('quantite', 'Quantité', { type: 'number' }), f('prix', 'Montant total (FCFA)', { type: 'number' }), f('livraison', 'Date et heure de livraison', { placeholder: '8 octobre à 8H' }), f('paiement', 'Moyen de paiement')],
    build: e => compose(hi(e), '', 'Merci pour votre commande.', '', ln('Produit', e.produit), ln('Quantité', e.quantite), ln('Montant', money(e.prix)), ln('Paiement', e.paiement), '', e.livraison ? `Votre commande sera livrée le ${e.livraison}.` : null, '', 'Merci pour votre confiance 🙏') },
  paiement: { label: '💳 Confirmation de paiement', fields: [f('client', 'Nom du client', { req: true }), f('montant', 'Montant reçu (FCFA)', { req: true, type: 'number' }), f('moyen', 'Moyen de paiement'), f('produit', 'Produit ou référence')],
    build: e => compose(hi(e), '', 'Nous confirmons la bonne réception de votre paiement ✅', '', ln('Montant reçu', money(e.montant)), ln('Moyen de paiement', e.moyen), ln('Pour', e.produit), '', 'Merci pour votre confiance 🙏') },
  expedition: { label: '📦 Expédition', fields: [f('client', 'Nom du client', { req: true }), f('produit', 'Produit', { req: true }), f('transport', "Transporteur / moyen d'envoi"), f('suivi', 'Numéro de suivi'), f('arrivee', 'Arrivée prévue')],
    build: e => compose(hi(e), '', 'Bonne nouvelle : votre commande a été expédiée 📦', '', ln('Produit', e.produit), ln('Transport', e.transport), ln('Numéro de suivi', e.suivi), ln('Arrivée prévue', e.arrivee), '', 'Nous vous contacterons à son arrivée.') },
  livraison: { label: '🚚 Livraison', fields: [f('client', 'Nom du client', { req: true }), f('produit', 'Produit', { req: true }), f('quand', 'Date et heure de livraison', { req: true }), f('lieu', 'Lieu de livraison'), f('reste', 'Montant à payer à la livraison (FCFA)', { type: 'number' })],
    build: e => compose(hi(e), '', 'Votre commande est en route 🚚', '', ln('Produit', e.produit), ln('Livraison', e.quand), ln('Lieu', e.lieu), ln('Montant à régler', money(e.reste)), '', 'Merci de rester joignable. À bientôt 🙏') },
  relance: { label: '🔔 Relance client', fields: [f('client', 'Nom du client', { req: true }), f('sujet', 'Produit ou sujet', { req: true }), f('date', 'Date de votre dernier échange')],
    build: e => compose(hi(e), '', `Je me permets de revenir vers vous au sujet de : ${e.sujet}.`, e.date ? `Nous avons échangé le ${e.date}.` : null, '', 'Êtes-vous toujours intéressé(e) ? Je peux répondre à vos questions ou vous aider à finaliser votre commande.', '', 'Bonne journée 🙏') },
  promo: { label: '🎁 Promotion', fields: [f('client', 'Nom du client (facultatif)'), f('produit', 'Produit', { req: true }), f('promo', 'Prix promo (FCFA)', { req: true, type: 'number' }), f('ancien', 'Ancien prix (FCFA)', { type: 'number' }), f('fin', "Offre valable jusqu'au")],
    build: e => compose(hi(e), '', '🎁 Offre spéciale pour vous !', '', ln('Produit', e.produit), ln('Ancien prix', money(e.ancien)), ln('Prix promo', money(e.promo)), ln("Valable jusqu'au", e.fin), '', 'Intéressé(e) ? Répondez à ce message pour commander.') },
  avis: { label: "⭐ Demande d'avis", fields: [f('client', 'Nom du client', { req: true }), f('produit', 'Produit', { req: true }), f('lien', 'Lien pour laisser un avis (facultatif)')],
    build: e => compose(hi(e), '', `Merci pour votre achat ! J'espère que ${e.produit} vous donne entière satisfaction.`, '', 'Votre avis compte beaucoup pour nous : pourriez-vous nous dire en quelques mots ce que vous en pensez ? ⭐', e.lien ? `Laissez votre avis ici : ${e.lien}` : null, '', 'Merci 🙏') },
};

/* ---------- Lien WhatsApp ---------- */
export const cleanPhone = (p: string) => p.replace(/[^\d]/g, '');
export const isValidPhone = (p: string) => /^\d{8,15}$/.test(cleanPhone(p));
export const waLink = (phone: string, msg = '') => { const n = cleanPhone(phone); const t = msg.trim(); return `https://wa.me/${n}${t ? '?text=' + encodeURIComponent(t) : ''}`; };

/* ---------- Convertisseur ---------- */
type Unit = [string, string, number?];
const LEN: Record<string, Unit> = { mm: ['Millimètre', 'mm', 0.001], cm: ['Centimètre', 'cm', 0.01], m: ['Mètre', 'm', 1], km: ['Kilomètre', 'km', 1e3], in: ['Pouce', 'in', 0.0254], ft: ['Pied', 'ft', 0.3048], yd: ['Yard', 'yd', 0.9144], mi: ['Mile', 'mi', 1609.344] };
export const CONVERTER: Record<string, { label: string; units: Record<string, Unit>; def: { value: string; value2?: string; from: string; to: string }; pair?: boolean }> = {
  length: { label: '📐 Longueur', units: LEN, def: { value: '100', from: 'cm', to: 'm' } },
  mass: { label: '⚖️ Poids / masse', units: { mg: ['Milligramme', 'mg', 1e-6], g: ['Gramme', 'g', 0.001], kg: ['Kilogramme', 'kg', 1], t: ['Tonne', 't', 1e3], oz: ['Once', 'oz', 0.028349523125], lb: ['Livre', 'lb', 0.45359237] }, def: { value: '1000', from: 'g', to: 'kg' } },
  volume: { label: '🧴 Volume', units: { ml: ['Millilitre', 'ml', 0.001], cl: ['Centilitre', 'cl', 0.01], l: ['Litre', 'L', 1], m3: ['Mètre cube', 'm³', 1e3], gal: ['Gallon US', 'gal US', 3.785411784], cup: ['Tasse', 'cup', 0.2365882365] }, def: { value: '1000', from: 'ml', to: 'l' } },
  area: { label: '📦 Surface', units: { cm2: ['Centimètre carré', 'cm²', 1e-4], m2: ['Mètre carré', 'm²', 1], km2: ['Kilomètre carré', 'km²', 1e6], ha: ['Hectare', 'ha', 1e4], acre: ['Acre', 'acre', 4046.8564224] }, def: { value: '1', from: 'm2', to: 'cm2' } },
  temperature: { label: '🌡️ Température', units: { c: ['Celsius', '°C'], f: ['Fahrenheit', '°F'], k: ['Kelvin', 'K'] }, def: { value: '0', from: 'c', to: 'f' } },
  dimensions: { label: '📏 Dimensions (largeur × hauteur)', pair: true, units: { mm: LEN.mm, cm: LEN.cm, m: LEN.m, in: LEN.in }, def: { value: '30', value2: '40', from: 'cm', to: 'in' } },
};
export function convert(v: number, from: string, to: string, cat: string) {
  if (cat === 'temperature') { const c = from === 'c' ? v : from === 'f' ? ((v - 32) * 5) / 9 : v - 273.15; return to === 'c' ? c : to === 'f' ? (c * 9) / 5 + 32 : c + 273.15; }
  const u = CONVERTER[cat].units; return (v * (u[from][2] as number)) / (u[to][2] as number);
}
export function fmtConv(n: number, d = 4) {
  if (!Number.isFinite(n)) return '—';
  const x = Number(n.toPrecision(12)); if (x === 0) return '0';
  const a = Math.abs(x);
  if (a < 1e-6 || a >= 1e15) return Number(x.toPrecision(5)).toExponential().replace('e+', 'e').replace('.', ',').replace('e', ' × 10^');
  const r = a < 1 ? Number(a.toPrecision(d + 2)) : Number(a.toFixed(d)); const [i, dec] = String(r).split('.');
  return (x < 0 ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? ',' + dec : '');
}
