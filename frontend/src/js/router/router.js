// frontend/src/js/router/router.js
import { allRoutes, websiteName } from './allRoutes.js';

// Intercepter la navigation (clic sur un lien sans rechargement)
const navigate = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, '', event.target.href);
  handleLocation();
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route =
    allRoutes.find((r) => r.url === path) ||
    allRoutes.find((r) => r.url === '/');

  // Récupérer le contenu HTML de la page cible
  const response = await fetch(route.htmlPath);
  const html = await response.text();

  // Injecter le code HTML dans notre squelette de page index.html
  document.getElementById('main-page').innerHTML = html;
  document.title = `${route.title} - ${websiteName}`;
};

// Écouter les événements du navigateur (boutons retour/avant)
window.onpopstate = handleLocation;
window.route = navigate;

// Intercepter tous les clics sur les liens contenant l'attribut "data-link"
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      window.history.pushState({}, '', e.target.href);
      handleLocation();
    }
  });
  handleLocation();
});
