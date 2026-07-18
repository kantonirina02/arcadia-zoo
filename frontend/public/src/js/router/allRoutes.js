import { Route } from './Route.js';

export const allRoutes = [
  new Route('/', 'Accueil', '/pages/home.html'),
  new Route('/services', 'Nos Services', '/pages/services.html'),
  new Route('/habitats', "Les Habitats d'Exception", '/pages/habitats.html'),
  new Route('/contact', 'Contactez Arcadia', '/pages/contact.html'),
  new Route('/login', 'Espace Connexion', '/pages/login.html'),
  new Route('/dashboard', 'Mon Espace (Dashboard)', '/pages/dashboard.html'),
];

export const websiteName = 'Arcadia Zoo';
