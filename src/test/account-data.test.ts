import { describe,it,expect } from 'vitest';
import { destinationFor,savedResultSchema } from '@/lib/account-data';
describe('Destinations des enregistrements',()=>{
 it('envoie les factures dans leur liste',()=>expect(destinationFor('facture')).toBe('invoices'));
 it('envoie les devis dans leur liste',()=>expect(destinationFor('devis')).toBe('quotes'));
 it.each(['benefice','generateur','lien','mesure'] as const)('envoie %s dans l’historique',kind=>expect(destinationFor(kind)).toBe('operations'));
 it('ignore un propriétaire fourni par le navigateur',()=>expect(savedResultSchema.parse({kind:'lien',label:'Contact',amount:null,details:{},user_id:'other-user'})).not.toHaveProperty('user_id'));
 it('refuse un document sans articles',()=>expect(savedResultSchema.safeParse({kind:'facture',number:'F-1',client:'Awa',items:[],discount:0,delivery:0,date:'2026-10-17'}).success).toBe(false));
});
