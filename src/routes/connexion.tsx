import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '@/components/business/auth-page';
import { pageHead } from '@/lib/business-demo';
export const Route = createFileRoute('/connexion')({head:()=>pageHead('Connexion','Connectez-vous à votre espace Business Tools Premium pour retrouver vos données.'),component:AuthPage});
