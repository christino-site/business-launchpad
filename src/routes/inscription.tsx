import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '@/components/business/auth-page';
import { pageHead } from '@/lib/business-demo';
export const Route = createFileRoute('/inscription')({head:()=>pageHead('Inscription','Découvrez le futur formulaire de création de compte Business Tools Premium. Inscription non active dans le prototype.'),component:()=> <AuthPage signup/>});
