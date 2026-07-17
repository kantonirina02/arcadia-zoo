import { authFetch } from '../auth.js';

export async function renderVetHabitatComment(content, title) {
  title.textContent = 'Commenter un Habitat';
  content.innerHTML = '<div class="spinner-border text-info"></div>';

  try {
    const res = await fetch('http://localhost:8080/api/habitats');
    const data = await res.json();

    let html = `
      <div class="row g-4">
    `;
    data.forEach(h => {
      html += `
        <div class="col-md-6">
          <div class="card shadow-sm border-info">
            <div class="card-body">
              <h5 class="card-title text-info">${h.nom}</h5>
              <p class="card-text">${h.description}</p>
              <div class="mb-2">
                <label class="form-label text-muted small">Avis du Vétérinaire (actuel)</label>
                <textarea class="form-control" id="vet-hab-com-${h.id_habitat}" rows="2" placeholder="Saisir un avis sur cet habitat (propreté, amélioration...)...">${h.commentaire_veterinaire || ''}</textarea>
              </div>
              <button class="btn btn-info text-white w-100" onclick="updateHabitatComment(${h.id_habitat})">Enregistrer le commentaire</button>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    content.innerHTML = html;

    window.updateHabitatComment = async (id) => {
      const commentaire = document.getElementById(`vet-hab-com-${id}`).value;
      try {
        const response = await authFetch(`http://localhost:8080/api/veterinaire/habitats/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentaire_veterinaire: commentaire })
        });
        if (response.ok) {
          alert('Commentaire enregistré avec succès !');
        } else {
          throw new Error('Erreur lors de l\'enregistrement');
        }
      } catch (err) {
        alert(err.message);
      }
    };
  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur: ${e.message}</div>`;
  }
}

export async function renderVetAlimentations(content, title) {
  title.textContent = 'Consulter l\'Alimentation (Saisie par les employés)';
  content.innerHTML = '<div class="spinner-border text-info"></div>';

  try {
    // Récupérer les animaux pour le select
    const resHabitats = await fetch('http://localhost:8080/api/habitats');
    const habitats = await resHabitats.json();
    let animalOptions = '';
    habitats.forEach(h => {
      if (h.animaux) {
        h.animaux.forEach(a => {
          animalOptions += `<option value="${a.id_animal}">${a.prenom} (${a.race})</option>`;
        });
      }
    });

    let html = `
      <div class="row mb-4">
        <div class="col-md-6">
          <label class="form-label">Sélectionner un animal</label>
          <select id="vet-alim-animal" class="form-select" onchange="fetchAlimentations()">
            <option value="">Choisir un animal...</option>
            ${animalOptions}
          </select>
        </div>
      </div>
      <div id="vet-alim-results">
        <p class="text-muted">Sélectionnez un animal pour voir l'historique de ses repas.</p>
      </div>
    `;
    content.innerHTML = html;

    window.fetchAlimentations = async () => {
      const animalId = document.getElementById('vet-alim-animal').value;
      const resContainer = document.getElementById('vet-alim-results');
      
      if (!animalId) {
        resContainer.innerHTML = '<p class="text-muted">Sélectionnez un animal pour voir l\'historique de ses repas.</p>';
        return;
      }
      
      resContainer.innerHTML = '<div class="spinner-border spinner-border-sm text-info"></div> Chargement...';
      try {
        const response = await authFetch(`http://localhost:8080/api/veterinaire/alimentation/animal/${animalId}`);
        const data = await response.json();

        if (data.length === 0) {
          resContainer.innerHTML = '<div class="alert alert-warning">Aucun repas enregistré pour cet animal.</div>';
          return;
        }

        let table = `
          <table class="table table-hover mt-3">
            <thead class="table-info">
              <tr>
                <th>Date</th>
                <th>Heure</th>
                <th>Nourriture</th>
                <th>Quantité (g)</th>
                <th>Employé</th>
              </tr>
            </thead>
            <tbody>
        `;
        data.forEach(alim => {
          table += `
            <tr>
              <td>${alim.date}</td>
              <td>${alim.heure}</td>
              <td>${alim.nourriture_donnee}</td>
              <td>${alim.quantite_donnee}</td>
              <td>${alim.employe || 'N/A'}</td>
            </tr>
          `;
        });
        table += '</tbody></table>';
        resContainer.innerHTML = table;
      } catch (err) {
        resContainer.innerHTML = `<div class="alert alert-danger">Erreur: ${err.message}</div>`;
      }
    };
  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur: ${e.message}</div>`;
  }
}
