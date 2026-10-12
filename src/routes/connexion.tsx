import { createFileRoute } from '@tanstack/react-router';
import { AuthPage } from '@/components/business/auth-page';
import { pageHead } from '@/lib/business-demo';
export const Route = createFileRoute('/connexion')({head:()=>pageHead('Connexion','Aperçu du futur espace de connexion Business Tools Premium. Aucun compte connecté dans cette démonstration.'),component:AuthPage});
