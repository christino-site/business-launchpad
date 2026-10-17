import { createFileRoute } from '@tanstack/react-router';
import { AccountList, AccountLoadError } from '@/components/tools/account-list';
import { accountQuery } from '@/lib/account-query';
import { pageHead } from '@/lib/business-demo';
export const Route=createFileRoute('/_authenticated/historique')({head:()=>pageHead('Mon historique','Retrouvez vos données personnelles enregistrées dans Business Tools Premium.'),loader:async({context})=>{await context.queryClient.ensureQueryData(accountQuery(context.user.id,'operations'));},errorComponent:AccountLoadError,notFoundComponent:()=> <p>Données introuvables.</p>,component:Page});
function Page(){const {user}=Route.useRouteContext();return <AccountList userId={user.id} table="operations"/>;}
