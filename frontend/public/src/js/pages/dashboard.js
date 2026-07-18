import { getUserRoles, getPayload, authFetch } from '../auth.js';
import { 
  renderAdminServices, 
  renderAdminHabitats, 
  renderAdminAnimaux, 
  renderAdminRapports, 
  renderAdminHoraires 
} from './dashboardAdmin.js';

import { renderEmployeServices } from './dashboardEmploye.js';

import { renderVetHabitatComment, renderVetAlimentations } from './dashboardVet.js';

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
    addMenuItem(menuContainer, 'Gestion Services', 'bi-gear', () => renderAdminServices(contentContainer, titleDisplay));
    addMenuItem(menuContainer, 'Gestion Habitats', 'bi-tree', () => renderAdminHabitats(contentContainer, titleDisplay));
    addMenuItem(menuContainer, 'Gestion Animaux', 'bi-bug', () => renderAdminAnimaux(contentContainer, titleDisplay));
    addMenuItem(menuContainer, 'Gestion Horaires', 'bi-clock', () => renderAdminHoraires(contentContainer, titleDisplay));
    addMenuItem(menuContainer, 'Rapports Vétérinaires', 'bi-file-medical', () => renderAdminRapports(contentContainer, titleDisplay));
  } 
  else if (roles.includes('ROLE_VETERINAIRE')) {
    roleBadge.textContent = 'Vétérinaire';
    roleBadge.className = 'badge bg-info mb-3';
    
    addMenuItem(menuContainer, 'Saisir un rapport', 'bi-clipboard-pulse', () => renderVetRapport(contentContainer, titleDisplay));
    addMenuItem(menuContainer, 'Commenter Habitats', 'bi-tree', () => renderVetHabitatComment(contentContainer, titleDisplay));
    addMenuItem(menuContainer, 'Historique Alimentation', 'bi-clock-history', () => renderVetAlimentations(contentContainer, titleDisplay));
  } 
  else if (roles.includes('ROLE_EMPLOYE')) {
    roleBadge.textContent = 'Employé';
    roleBadge.className = 'badge bg-success mb-3';
    
    addMenuItem(menuContainer, 'Valider les avis', 'bi-chat-check', () => renderEmployeAvis(contentContainer, titleDisplay));
    addMenuItem(menuContainer, 'Nourrir un animal', 'bi-cup-straw', () => renderEmployeAlimentation(contentContainer, titleDisplay));
    addMenuItem(menuContainer, 'Modifier Services', 'bi-gear', () => renderEmployeServices(contentContainer, titleDisplay));
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
    const res = await authFetch(window.API_BASE_URL + '/api/admin/stats');
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
    const res = await authFetch(window.API_BASE_URL + '/api/employe/reviews');
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
      await authFetch(`${window.API_BASE_URL}/api/employe/reviews/${id}/validate`, {
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
  content.innerHTML = `
    <form id="form-admin-user" class="row g-3 bg-white p-4 rounded shadow-sm">
      <div id="admin-user-msg" class="col-12 d-none alert"></div>
      <div class="col-md-6">
        <label class="form-label">Nom</label>
        <input type="text" id="au-nom" class="form-control" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">Prénom</label>
        <input type="text" id="au-prenom" class="form-control" required>
      </div>
      <div class="col-md-12">
        <label class="form-label">Email (Username)</label>
        <input type="email" id="au-username" class="form-control" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">Mot de passe</label>
        <input type="password" id="au-password" class="form-control" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">Rôle</label>
        <select id="au-role" class="form-select" required>
          <option value="">Choisir un rôle...</option>
          <option value="ROLE_EMPLOYE">Employé</option>
          <option value="ROLE_VETERINAIRE">Vétérinaire</option>
        </select>
      </div>
      <div class="col-12 mt-4">
        <button type="submit" class="btn btn-danger w-100">Créer le compte</button>
      </div>
    </form>
  `;

  document.getElementById('form-admin-user').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('admin-user-msg');
    try {
      const response = await authFetch(window.API_BASE_URL + '/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: document.getElementById('au-nom').value,
          prenom: document.getElementById('au-prenom').value,
          username: document.getElementById('au-username').value,
          password: document.getElementById('au-password').value,
          role: document.getElementById('au-role').value
        })
      });

      if (response.ok) {
        msg.className = 'col-12 alert alert-success';
        msg.textContent = 'Compte créé avec succès ! Un email a été envoyé (simulation).';
        e.target.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création');
      }
    } catch (err) {
      msg.className = 'col-12 alert alert-danger';
      msg.textContent = err.message;
    }
  });
}

async function renderVetRapport(content, title) {
  title.textContent = 'Saisir un Rapport Vétérinaire';
  content.innerHTML = '<div class="spinner-border text-info"></div>';

  try {
    // Récupérer les animaux via les habitats
    const resHabitats = await fetch(window.API_BASE_URL + '/api/habitats');
    const habitats = await resHabitats.json();
    let animalOptions = '';
    habitats.forEach(h => {
      if (h.animaux) {
        h.animaux.forEach(a => {
          animalOptions += `<option value="${a.id_animal}">${a.prenom} (${a.race})</option>`;
        });
      }
    });

    content.innerHTML = `
      <form id="form-vet-rapport" class="row g-3">
        <div id="vet-msg" class="col-12 d-none alert"></div>
        <div class="col-md-6">
          <label class="form-label">Animal</label>
          <select id="vet-animal" class="form-select" required>
            <option value="">Choisir un animal...</option>
            ${animalOptions}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Date</label>
          <input type="date" id="vet-date" class="form-control" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">État (ex: Bon, Malade)</label>
          <input type="text" id="vet-etat" class="form-control" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Nourriture proposée</label>
          <input type="text" id="vet-nourriture" class="form-control" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Grammage proposé (g)</label>
          <input type="number" id="vet-grammage" class="form-control" required>
        </div>
        <div class="col-12">
          <label class="form-label">Détail (optionnel)</label>
          <textarea id="vet-detail" class="form-control" rows="3"></textarea>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-info text-white">Enregistrer le rapport</button>
        </div>
      </form>
    `;

    document.getElementById('form-vet-rapport').addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('vet-msg');
      try {
        const response = await authFetch(window.API_BASE_URL + '/api/veterinaire/rapports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            animal_id: document.getElementById('vet-animal').value,
            date: document.getElementById('vet-date').value,
            etat_animal: document.getElementById('vet-etat').value,
            nourriture_proposee: document.getElementById('vet-nourriture').value,
            grammage_propose: parseFloat(document.getElementById('vet-grammage').value),
            detail_etat: document.getElementById('vet-detail').value
          })
        });

        if (response.ok) {
          msg.className = 'col-12 alert alert-success';
          msg.textContent = 'Rapport enregistré avec succès !';
          e.target.reset();
        } else {
          throw new Error('Erreur lors de l\'enregistrement');
        }
      } catch (err) {
        msg.className = 'col-12 alert alert-danger';
        msg.textContent = err.message;
      }
    });

  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur de chargement: ${e.message}</div>`;
  }
}

async function renderEmployeAlimentation(content, title) {
  title.textContent = 'Nourrir un animal';
  content.innerHTML = '<div class="spinner-border text-success"></div>';

  try {
    const resHabitats = await fetch(window.API_BASE_URL + '/api/habitats');
    const habitats = await resHabitats.json();
    let animalOptions = '';
    habitats.forEach(h => {
      if (h.animaux) {
        h.animaux.forEach(a => {
          animalOptions += `<option value="${a.id_animal}">${a.prenom} (${a.race})</option>`;
        });
      }
    });

    content.innerHTML = `
      <form id="form-emp-alim" class="row g-3">
        <div id="emp-msg" class="col-12 d-none alert"></div>
        <div class="col-md-12">
          <label class="form-label">Animal</label>
          <select id="emp-animal" class="form-select" required>
            <option value="">Choisir un animal...</option>
            ${animalOptions}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Date</label>
          <input type="date" id="emp-date" class="form-control" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Heure</label>
          <input type="time" id="emp-heure" class="form-control" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Nourriture donnée</label>
          <input type="text" id="emp-nourriture" class="form-control" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Quantité donnée (g)</label>
          <input type="number" id="emp-quantite" class="form-control" required>
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-success">Enregistrer le repas</button>
        </div>
      </form>
    `;

    // Mettre la date et l'heure par défaut
    const now = new Date();
    document.getElementById('emp-date').value = now.toISOString().split('T')[0];
    document.getElementById('emp-heure').value = now.toTimeString().split(' ')[0].substring(0, 5);

    document.getElementById('form-emp-alim').addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('emp-msg');
      try {
        const response = await authFetch(window.API_BASE_URL + '/api/employe/alimentation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            animal_id: document.getElementById('emp-animal').value,
            date: document.getElementById('emp-date').value,
            heure: '1970-01-01 ' + document.getElementById('emp-heure').value + ':00', // Format DateTime attendu par Symfony
            nourriture_donnee: document.getElementById('emp-nourriture').value,
            quantite_donnee: parseFloat(document.getElementById('emp-quantite').value)
          })
        });

        if (response.ok) {
          msg.className = 'col-12 alert alert-success';
          msg.textContent = 'Repas enregistré avec succès !';
          e.target.reset();
          document.getElementById('emp-date').value = new Date().toISOString().split('T')[0];
        } else {
          throw new Error('Erreur lors de l\'enregistrement');
        }
      } catch (err) {
        msg.className = 'col-12 alert alert-danger';
        msg.textContent = err.message;
      }
    });

  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur de chargement: ${e.message}</div>`;
  }
}
