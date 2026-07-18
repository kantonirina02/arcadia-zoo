import { authFetch } from '../auth.js';

export async function renderAdminServices(content, title) {
  title.textContent = 'Gestion des Services';
  content.innerHTML = '<div class="spinner-border text-danger"></div>';

  try {
    const res = await fetch(window.API_BASE_URL + '/api/services');
    const data = await res.json();

    let html = `
      <form id="form-add-service" class="mb-4 bg-light p-3 rounded">
        <h6>Ajouter un service</h6>
        <div class="row g-2">
          <div class="col-md-4"><input type="text" id="srv-nom" class="form-control" placeholder="Nom" required></div>
          <div class="col-md-6"><input type="text" id="srv-desc" class="form-control" placeholder="Description" required></div>
          <div class="col-md-2"><button type="submit" class="btn btn-danger w-100">Ajouter</button></div>
        </div>
      </form>
      <table class="table table-striped">
        <thead><tr><th>ID</th><th>Nom</th><th>Description</th><th>Action</th></tr></thead>
        <tbody>
    `;
    data.forEach(s => {
      html += `
        <tr>
          <td>${s.id_service}</td>
          <td>${s.nom}</td>
          <td>${s.description}</td>
          <td><button class="btn btn-sm btn-danger" onclick="deleteService(${s.id_service})">Supprimer</button></td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    content.innerHTML = html;

    document.getElementById('form-add-service').addEventListener('submit', async (e) => {
      e.preventDefault();
      await authFetch(window.API_BASE_URL + '/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: document.getElementById('srv-nom').value,
          description: document.getElementById('srv-desc').value
        })
      });
      renderAdminServices(content, title);
    });

    window.deleteService = async (id) => {
      if(confirm('Supprimer ce service ?')) {
        await authFetch(`${window.API_BASE_URL}/api/admin/services/${id}`, { method: 'DELETE' });
        renderAdminServices(content, title);
      }
    };
  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur: ${e.message}</div>`;
  }
}

export async function renderAdminHabitats(content, title) {
  title.textContent = 'Gestion des Habitats';
  content.innerHTML = '<div class="spinner-border text-danger"></div>';

  try {
    const res = await fetch(window.API_BASE_URL + '/api/habitats');
    const data = await res.json();

    let html = `
      <form id="form-add-habitat" class="mb-4 bg-light p-3 rounded">
        <h6>Ajouter un habitat</h6>
        <div class="row g-2">
          <div class="col-md-4"><input type="text" id="hab-nom" class="form-control" placeholder="Nom" required></div>
          <div class="col-md-6"><input type="text" id="hab-desc" class="form-control" placeholder="Description" required></div>
          <div class="col-md-2"><button type="submit" class="btn btn-danger w-100">Ajouter</button></div>
        </div>
      </form>
      <table class="table table-striped">
        <thead><tr><th>ID</th><th>Nom</th><th>Action</th></tr></thead>
        <tbody>
    `;
    data.forEach(h => {
      html += `
        <tr>
          <td>${h.id_habitat}</td>
          <td>${h.nom}</td>
          <td><button class="btn btn-sm btn-danger" onclick="deleteHabitat(${h.id_habitat})">Supprimer</button></td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    content.innerHTML = html;

    document.getElementById('form-add-habitat').addEventListener('submit', async (e) => {
      e.preventDefault();
      await authFetch(window.API_BASE_URL + '/api/admin/habitats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: document.getElementById('hab-nom').value,
          description: document.getElementById('hab-desc').value
        })
      });
      renderAdminHabitats(content, title);
    });

    window.deleteHabitat = async (id) => {
      if(confirm('Supprimer cet habitat ?')) {
        await authFetch(`${window.API_BASE_URL}/api/admin/habitats/${id}`, { method: 'DELETE' });
        renderAdminHabitats(content, title);
      }
    };
  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur: ${e.message}</div>`;
  }
}

export async function renderAdminAnimaux(content, title) {
  title.textContent = 'Gestion des Animaux';
  content.innerHTML = '<div class="spinner-border text-danger"></div>';

  try {
    const res = await fetch(window.API_BASE_URL + '/api/habitats');
    const habitats = await res.json();

    let html = `
      <form id="form-add-animal" class="mb-4 bg-light p-3 rounded">
        <h6>Ajouter un animal</h6>
        <div class="row g-2">
          <div class="col-md-3"><input type="text" id="ani-prenom" class="form-control" placeholder="Prénom" required></div>
          <div class="col-md-3">
            <select id="ani-habitat" class="form-select" required>
              <option value="">Habitat...</option>
              ${habitats.map(h => `<option value="${h.id_habitat}">${h.nom}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-2"><input type="number" id="ani-race" class="form-control" placeholder="ID Race (ex: 1)" required></div>
          <div class="col-md-2"><input type="text" id="ani-etat" class="form-control" placeholder="État" required></div>
          <div class="col-md-2"><button type="submit" class="btn btn-danger w-100">Ajouter</button></div>
        </div>
      </form>
      <table class="table table-striped">
        <thead><tr><th>ID</th><th>Prénom</th><th>Habitat</th><th>Action</th></tr></thead>
        <tbody>
    `;
    habitats.forEach(h => {
      if(h.animaux) h.animaux.forEach(a => {
        html += `
          <tr>
            <td>${a.id_animal}</td>
            <td>${a.prenom}</td>
            <td>${h.nom}</td>
            <td><button class="btn btn-sm btn-danger" onclick="deleteAnimal(${a.id_animal})">Supprimer</button></td>
          </tr>
        `;
      });
    });
    html += '</tbody></table>';
    content.innerHTML = html;

    document.getElementById('form-add-animal').addEventListener('submit', async (e) => {
      e.preventDefault();
      await authFetch(window.API_BASE_URL + '/api/admin/animaux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: document.getElementById('ani-prenom').value,
          habitat_id: parseInt(document.getElementById('ani-habitat').value),
          race_id: parseInt(document.getElementById('ani-race').value),
          etat: document.getElementById('ani-etat').value
        })
      });
      renderAdminAnimaux(content, title);
    });

    window.deleteAnimal = async (id) => {
      if(confirm('Supprimer cet animal ?')) {
        await authFetch(`${window.API_BASE_URL}/api/admin/animaux/${id}`, { method: 'DELETE' });
        renderAdminAnimaux(content, title);
      }
    };
  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur: ${e.message}</div>`;
  }
}

export async function renderAdminRapports(content, title) {
  title.textContent = 'Rapports Vétérinaires';
  content.innerHTML = '<div class="spinner-border text-danger"></div>';

  try {
    const res = await authFetch(window.API_BASE_URL + '/api/admin/rapports');
    const data = await res.json();

    let html = `
      <div class="row mb-3">
        <div class="col-md-4">
          <input type="text" id="filter-animal" class="form-control" placeholder="Filtrer par animal...">
        </div>
        <div class="col-md-4">
          <input type="date" id="filter-date" class="form-control">
        </div>
        <div class="col-md-4">
          <button class="btn btn-secondary w-100" onclick="applyRapportFilters()">Filtrer</button>
        </div>
      </div>
      <table class="table table-hover">
        <thead><tr><th>Date</th><th>Animal</th><th>État</th><th>Nourriture</th><th>Détail</th></tr></thead>
        <tbody id="rapports-tbody">
    `;
    
    window.allRapports = data; // Store globally for filtering
    
    function renderRows(reports) {
      let rows = '';
      reports.forEach(r => {
        rows += `<tr>
          <td>${r.date}</td>
          <td>${r.animal}</td>
          <td>${r.etat_animal}</td>
          <td>${r.nourriture_proposee} (${r.grammage_propose}g)</td>
          <td>${r.detail_etat || '-'}</td>
        </tr>`;
      });
      return rows;
    }
    
    html += renderRows(data) + '</tbody></table>';
    content.innerHTML = html;

    window.applyRapportFilters = async () => {
      const ani = document.getElementById('filter-animal').value;
      const dat = document.getElementById('filter-date').value;
      
      let filtered = window.allRapports;
      if (ani) {
        filtered = filtered.filter(r => r.animal && r.animal.toLowerCase().includes(ani.toLowerCase()));
      }
      if (dat) {
        filtered = filtered.filter(r => r.date === dat);
      }
      document.getElementById('rapports-tbody').innerHTML = renderRows(filtered);
    };
  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur: ${e.message}</div>`;
  }
}

export async function renderAdminHoraires(content, title) {
  title.textContent = 'Gestion des Horaires';
  content.innerHTML = '<div class="spinner-border text-danger"></div>';

  try {
    const res = await fetch(window.API_BASE_URL + '/api/horaires');
    const data = await res.json();

    let html = `
      <form id="form-add-horaire" class="mb-4 bg-light p-3 rounded">
        <h6>Ajouter un horaire</h6>
        <div class="row g-2">
          <div class="col-md-4"><input type="text" id="hor-jour" class="form-control" placeholder="Jour (ex: Lundi)" required></div>
          <div class="col-md-3"><input type="time" id="hor-ouv" class="form-control" required></div>
          <div class="col-md-3"><input type="time" id="hor-ferm" class="form-control" required></div>
          <div class="col-md-2"><button type="submit" class="btn btn-danger w-100">Ajouter</button></div>
        </div>
      </form>
      <table class="table table-striped">
        <thead><tr><th>ID</th><th>Jour</th><th>Ouverture</th><th>Fermeture</th><th>Action</th></tr></thead>
        <tbody>
    `;
    data.forEach(h => {
      html += `
        <tr>
          <td>${h.id_horaire}</td>
          <td>${h.jour}</td>
          <td>${h.heure_ouverture}</td>
          <td>${h.heure_fermeture}</td>
          <td><button class="btn btn-sm btn-danger" onclick="deleteHoraire(${h.id_horaire})">Supprimer</button></td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    content.innerHTML = html;

    document.getElementById('form-add-horaire').addEventListener('submit', async (e) => {
      e.preventDefault();
      const ouv = document.getElementById('hor-ouv').value;
      const ferm = document.getElementById('hor-ferm').value;
      await authFetch(window.API_BASE_URL + '/api/admin/horaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jour_semaine: document.getElementById('hor-jour').value,
          ouverture: `1970-01-01 ${ouv}:00`,
          fermeture: `1970-01-01 ${ferm}:00`
        })
      });
      renderAdminHoraires(content, title);
    });

    window.deleteHoraire = async (id) => {
      if(confirm('Supprimer cet horaire ?')) {
        await authFetch(`${window.API_BASE_URL}/api/admin/horaires/${id}`, { method: 'DELETE' });
        renderAdminHoraires(content, title);
      }
    };
  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur: ${e.message}</div>`;
  }
}
