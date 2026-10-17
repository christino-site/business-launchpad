import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Json } from '@/integrations/supabase/types';
import { savedResultSchema, destinationFor } from './account-data';
import { computeInvoice } from './tools';

export const saveResult = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(savedResultSchema).handler(async ({data,context})=>{
  const table = destinationFor(data.kind);
  if(data.kind === 'facture' || data.kind === 'devis') {
    const row = {user_id:context.userId,number:data.number,client_name:data.client,items:{lines:data.items,discount:data.discount,delivery:data.delivery},total_fcfa:computeInvoice(data.items,data.discount,data.delivery).total};
    const response = data.kind==='facture'
      ? await context.supabase.from('invoices').insert({...row,issued_on:data.date}).select('id').single()
      : await context.supabase.from('quotes').insert({...row,valid_until:data.date}).select('id').single();
    if(response.error) throw new Error(response.error.message);
    if(!response.data) throw new Error('Aucun document confirmé.');
    return {id:response.data.id,table};
  }
  if ('label' in data) {
    const {data:row,error}=await context.supabase.from('operations').insert({user_id:context.userId,tool:data.kind,label:data.label,amount_fcfa:data.amount,details:data.details as Json}).select('id').single();
    if(error) throw new Error(error.message);
    if(!row) throw new Error('Aucun résultat confirmé.');
    return {id:row.id,table};
  }
  throw new Error('Résultat invalide.');
});
export const listAccountData = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.enum(['invoices','quotes','operations'])).handler(async({data:table,context})=>{
  if(table==='operations'){
    const {data,error}=await context.supabase.from('operations').select('*').eq('user_id',context.userId).order('created_at',{ascending:false});
    if(error) throw new Error(error.message);
    return {documents:[],operations:data};
  }
  const {data,error}=await context.supabase.from(table).select('*').eq('user_id',context.userId).order('created_at',{ascending:false});
  if(error) throw new Error(error.message);
  return {documents:data,operations:[]};
});