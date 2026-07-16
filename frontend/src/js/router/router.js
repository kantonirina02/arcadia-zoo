import { allRoutes, websiteName } from './allRoutes.js';
import { initHome } from '../pages/home.js';
import { initServices } from '../pages/services.js';
import { initHabitats } from '../pages/habitats.js';

const handleLocation = async () => {
  const path = window.location.pathname;
  const route =
    allRoutes.find((r) => r.url === path) ||
    allRoutes.find((r) => r.url === '/');

  try {
    const response = await fetch(route.htmlPath);
    if (!response.ok) {
      throw new Error(
        `Erreur lors du chargement de la page : ${response.status}`,
      );
    }
    const htmlContent = await response.text();

    const mainContainer = document.getElementById('main-page');
    if (mainContainer) {
      mainContainer.innerHTML = htmlContent;
    }

    document.title = `${route.title} - ${websiteName}`;

    // Routage et exécution des contrôleurs frontend
    if (path === '/' || path === '/index.html') {
      initHome();
    } else if (path === '/services') {
      initServices();
    } else if (path === '/habitats') {
      initHabitats();
    }
  } catch (error) {
    console.error('Erreur du routeur :', error);
    document.getElementById('main-page').innerHTML =
      `<div class="alert alert-danger">Désolé, une erreur est survenue.</div>`;
  }
};

const routeEvent = (event) => {
  event.preventDefault();
  window.history.pushState({}, '', event.target.href);
  handleLocation();
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      routeEvent(e);
    }
  });

  window.onpopstate = handleLocation;
  handleLocation();
});
