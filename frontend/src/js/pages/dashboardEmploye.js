import { authFetch } from '../auth.js';

export async function renderEmployeServices(content, title) {
  title.textContent = 'Modifier les Services';
  content.innerHTML = '<div class="spinner-border text-success"></div>';

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/services');
    const data = await res.json();

    let html = `
      <table class="table table-striped">
        <thead><tr><th>ID</th><th>Nom</th><th>Description</th><th>Action</th></tr></thead>
        <tbody>
    `;
    data.forEach(s => {
      html += `
        <tr>
          <td>${s.id_service}</td>
          <td><input type="text" id="emp-srv-nom-${s.id_service}" class="form-control form-control-sm" value="${s.nom}"></td>
          <td><input type="text" id="emp-srv-desc-${s.id_service}" class="form-control form-control-sm" value="${s.description}"></td>
          <td><button class="btn btn-sm btn-success" onclick="updateEmployeService(${s.id_service})">Mettre à jour</button></td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    content.innerHTML = html;

    window.updateEmployeService = async (id) => {
      const msg = document.createElement('div');
      try {
        const nom = document.getElementById(`emp-srv-nom-${id}`).value;
        const desc = document.getElementById(`emp-srv-desc-${id}`).value;
        const resUpdate = await authFetch(`${window.API_BASE_URL}/api/employe/services/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom: nom, description: desc })
        });
        
        if (resUpdate.ok) {
          alert('Service mis à jour avec succès');
        } else {
          throw new Error('Erreur lors de la mise à jour');
        }
      } catch (err) {
        alert(err.message);
      }
    };
  } catch (e) {
    content.innerHTML = `<div class="alert alert-danger">Erreur: ${e.message}</div>`;
  }
}
