import { queryOptions } from '@tanstack/react-query';
import { listAccountData } from './account.functions';
export const accountQuery = (userId:string,table:'invoices'|'quotes'|'operations') => queryOptions({queryKey:[table,userId],queryFn:()=>listAccountData({data:table}),staleTime:0});