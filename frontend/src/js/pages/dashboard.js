import { getUserRoles, getPayload, authFetch } from '../auth.js';

export function initDashboard() {
  const roleBadge = document.getElementById('dash-role');
  const emailDisplay = document.getElementById('dash-email');
  const menuContainer = document.getElementById('dash-menu');
  const contentContainer = document.getElementById('dash-content');
  const titleDisplay = document.getElementById('dash-content-title');

  if (!menuContainer) return;

  const payload = getPayload();
  if (!payload) {
    window.location.href = '/login';
    return;
  }

  emailDisplay.textContent = payload.username;
  const roles = getUserRoles();
  
  // Configuration du menu selon le rôle
  menuContainer.innerHTML = '';
  
  if (roles.includes('ROLE_ADMIN')) {
    roleBadge.textContent = 'Administrateur';
    roleBadge.className = 'badge bg-danger mb-3';
    
    addMenuItem(menuContainer, 'Comptes Employés', 'bi-people', () => renderAdminUsers(contentContainer, titleDisplay));
    addMenuItem(menuContainer, 'Stats Animaux', 'bi-bar-chart', () => renderAdminStats(contentContainer, titleDisplay));
    // D'autres menus CRUD viendraient ici (Animaux, Habitats...)
  } 
  else if (roles.includes('ROLE_VETERINAIRE')) {
    roleBadge.textContent = 'Vétérinaire';
    roleBadge.className = 'badge bg-info mb-3';
    
    addMenuItem(menuContainer, 'Saisir un rapport', 'bi-clipboard-pulse', () => renderVetRapport(contentContainer, titleDisplay));
  } 
  else if (roles.includes('ROLE_EMPLOYE')) {
    roleBadge.textContent = 'Employé';
    roleBadge.className = 'badge bg-success mb-3';
    
    addMenuItem(menuContainer, 'Valider les avis', 'bi-chat-check', () => renderEmployeAvis(contentContainer, titleDisplay));
    addMenuItem(menuContainer, 'Nourrir un animal', 'bi-cup-straw', () => renderEmployeAlimentation(contentContainer, titleDisplay));
  }
}

function addMenuItem(container, text, iconClass, onClick) {
  const btn = document.createElement('button');
  btn.className = 'list-group-item list-group-item-action border-0 d-flex align-items-center';
  btn.innerHTML = `<i class="bi ${iconClass} me-2 text-secondary"></i> ${text}`;
  btn.addEventListener('click', (e) => {
    // Retirer l'état actif des autres
    container.querySelectorAll('.active').forEach(el => {
      el.classList.remove('active', 'bg-success', 'border-success');
    });
    // Activer le bouton cliqué
    btn.classList.add('active', 'bg-success', 'border-success');
    onClick();
  });
  container.appendChild(btn);
}

// --- Vues Spécifiques (Exemples simplifiés) ---

async function renderAdminStats(content, title) {
  title.textContent = 'Statistiques de consultation des animaux';
  content.innerHTML = '<div class="spinner-border text-success"></div>';

  try {
    const res = await authFetch('http://localhost:8080/api/admin/stats');
    const data = await res.json();

    if (!res.ok) throw new Error("Erreur de récupération");

    let html = '<table class="table table-hover"><thead><tr><th>Animal</th><th>Vues</th></tr></thead><tbody>';
    data.forEach(stat => {
      html += `<tr><td>${stat.prenom}</td><td><span class="badge bg-warning text-dark">${stat.consultations} vues</span></td></tr>`;
    });
    html += '</tbody></table>';
    
    content.innerHTML = html;
  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur: ${e.message}</div>`;
  }
}

async function renderEmployeAvis(content, title) {
  title.textContent = 'Avis en attente de validation';
  content.innerHTML = '<div class="spinner-border text-success"></div>';

  try {
    const res = await authFetch('http://localhost:8080/api/employe/reviews');
    const data = await res.json();

    if (data.length === 0) {
      content.innerHTML = '<p class="text-success"><i class="bi bi-check-circle"></i> Aucun avis en attente.</p>';
      return;
    }

    let html = '<div class="row">';
    data.forEach(avis => {
      html += `
        <div class="col-12 mb-3">
          <div class="card border-warning">
            <div class="card-body">
              <h6 class="card-title">${avis.pseudo}</h6>
              <p class="card-text">"${avis.commentaire}"</p>
              <button class="btn btn-sm btn-success" onclick="validateAvis(${avis.id})">Valider</button>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    content.innerHTML = html;

    // Attacher la fonction globale pour le onclick (hack rapide pour SPA)
    window.validateAvis = async (id) => {
      await authFetch(`http://localhost:8080/api/employe/reviews/${id}/validate`, {
        method: 'PUT',
        body: JSON.stringify({ is_visible: true }),
        headers: { 'Content-Type': 'application/json' }
      });
      renderEmployeAvis(content, title); // Recharger
    };
  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur: ${e.message}</div>`;
  }
}

function renderAdminUsers(content, title) {
  title.textContent = 'Création de compte (Employé/Vétérinaire)';
  content.innerHTML = '<p class="text-muted">Formulaire de création de compte via POST /api/admin/users (US 6)...</p>';
}

function renderVetRapport(content, title) {
  title.textContent = 'Nouveau Rapport Vétérinaire';
  content.innerHTML = '<p class="text-muted">Formulaire de création de rapport via POST /api/veterinaire/rapports (US 8)...</p>';
}

function renderEmployeAlimentation(content, title) {
  title.textContent = 'Nourrir un animal';
  content.innerHTML = '<p class="text-muted">Formulaire d\'alimentation via POST /api/employe/alimentation (US 7)...</p>';
}
