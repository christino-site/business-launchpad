import { createFileRoute } from '@tanstack/react-router';
import { PageHeading } from '@/components/business/shared';
import { ProfitTool, DocumentTool, MessageTool, LinkTool, MeasureTool } from '@/components/tools/workbench';
import { pageHead, tools } from '@/lib/business-demo';
export const Route=createFileRoute('/outil/$outil')({head:({params})=>pageHead(tools.find(t=>t.id===params.outil)?.name??'Outil introuvable','Calculez et enregistrez vos résultats dans votre compte Business Tools Premium.'),component:ToolPage});
function ToolPage(){const {outil}=Route.useParams();const tool=tools.find(t=>t.id===outil);if(!tool)return <PageHeading title="Outil introuvable" description="Cet outil n’existe pas."/>;return <><PageHeading title={tool.name} description={tool.description}/><div className="max-w-3xl">{outil==='benefice'?<ProfitTool/>:outil==='factures'?<DocumentTool/>:outil==='generateur'?<MessageTool/>:outil==='lien'?<LinkTool/>:<MeasureTool/>}</div></>;}