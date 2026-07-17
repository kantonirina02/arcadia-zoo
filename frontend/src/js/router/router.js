import { allRoutes, websiteName } from './allRoutes.js';
import { initHome } from '../pages/home.js';
import { initServices } from '../pages/services.js';
import { initHabitats } from '../pages/habitats.js';
import { initContact } from '../pages/contact.js';
import { initLogin } from '../pages/login.js';
import { isAuthenticated, logout } from '../auth.js';

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
    } else if (path === '/contact') {
      initContact();
    } else if (path === '/login') {
      initLogin();
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

const updateAuthUI = () => {
  const isAuth = isAuthenticated();
  document.querySelectorAll('.auth-hide').forEach(el => {
    isAuth ? el.classList.add('d-none') : el.classList.remove('d-none');
  });
  document.querySelectorAll('.auth-show').forEach(el => {
    isAuth ? el.classList.remove('d-none') : el.classList.add('d-none');
  });
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      routeEvent(e);
    }
  });

  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  window.addEventListener('auth_changed', updateAuthUI);
  updateAuthUI();

  window.onpopstate = handleLocation;
  handleLocation();
});
