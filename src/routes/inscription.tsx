import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '@/components/business/auth-page';
import { pageHead } from '@/lib/business-demo';
export const Route = createFileRoute('/inscription')({head:()=>pageHead('Inscription','Créez votre compte Business Tools Premium avec votre adresse e-mail.'),component:()=> <AuthPage signup/>});
