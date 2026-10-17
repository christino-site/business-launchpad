import { z } from 'zod';
export const toolKeys = ['benefice', 'factures', 'generateur', 'lien', 'mesure'] as const;
export const toolLabels: Record<string, string> = { benefice: 'Calculateur de bénéfice', factures: 'Factures et devis', generateur: 'Générateur WhatsApp', lien: 'Lien WhatsApp direct', mesure: 'Convertisseur de mesure', whatsapp: 'Générateur WhatsApp', 'lien-whatsapp': 'Lien WhatsApp direct', mesures: 'Convertisseur de mesure' };
export const destinationFor = (kind: 'facture' | 'devis' | 'benefice' | 'generateur' | 'lien' | 'mesure') => kind === 'facture' ? 'invoices' : kind === 'devis' ? 'quotes' : 'operations';
export const savedResultSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.enum(['facture', 'devis']), number: z.string().trim().min(1).max(100), client: z.string().trim().min(1).max(200), items: z.array(z.object({name:z.string().trim().min(1),qty:z.number().finite().positive(),price:z.number().finite().nonnegative()})).min(1), discount:z.number().finite().nonnegative(), delivery:z.number().finite().nonnegative(), date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }),
  z.object({kind:z.enum(['benefice','generateur','lien','mesure']),label:z.string().trim().min(1).max(200),amount:z.number().finite().nullable(),details:z.record(z.string(),z.unknown())}),
]);
export type SavedResult = z.infer<typeof savedResultSchema>;