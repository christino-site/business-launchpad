import { createFileRoute } from '@tanstack/react-router';
import { ToolGrid, PageHeading, DemoNotice } from '@/components/business/shared';
import { pageHead } from '@/lib/business-demo';
export const Route = createFileRoute('/outils')({head:()=>pageHead('Mes outils','Présentation des cinq outils Business Tools : bénéfice, factures et devis, messages WhatsApp, liens directs et conversions.'),component:Tools});
function Tools(){return <><PageHeading title="Les bons outils pour avancer." description="Retrouvez les cinq essentiels de Business Tools dans votre futur espace Premium."/><DemoNotice>Présentation uniquement : les outils ne sont pas encore intégrés ici. Votre site gratuit existant reste entièrement indépendant.</DemoNotice><ToolGrid/></>;}
