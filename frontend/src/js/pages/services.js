export async function initServices() {
  const container = document.getElementById('services-list-container');
  if (!container) return;

  try {
    const response = await fetch('http://localhost:8080/api/services');
    if (!response.ok) throw new Error('Erreur de récupération des services');

    const services = await response.json();
    container.innerHTML = '';

    if (services.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">Aucun service disponible pour le moment.</p>`;
      return;
    }

    services.forEach((service) => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';

      let iconClass = 'bi-patch-check';
      if (service.nom.toLowerCase().includes('restauration'))
        iconClass = 'bi-cup-hot';
      if (service.nom.toLowerCase().includes('train'))
        iconClass = 'bi-train-front';
      if (service.nom.toLowerCase().includes('guide')) iconClass = 'bi-compass';

      col.innerHTML = `
                <div class="card h-100 border-0 shadow-sm p-4 text-center">
                    <div class="text-success mb-3">
                        <i class="bi ${iconClass} fs-1"></i>
                    </div>
                    <div class="card-body p-0">
                        <h3 class="h5 card-title text-success font-serif fw-bold"></h3>
                        <p class="card-text text-muted small mt-2"></p>
                    </div>
                </div>
            `;

      // Protection XSS par assignation de texte sécurisé
      col.querySelector('h3').textContent = service.nom;
      col.querySelector('p').textContent = service.description;

      container.appendChild(col);
    });
  } catch (error) {
    console.error('Erreur services :', error);
    container.innerHTML = `
            <div class="text-center py-5 text-danger">
                <i class="bi bi-exclamation-triangle fs-1"></i>
                <p class="mt-2">Erreur lors de la récupération des services.</p>
            </div>`;
  }
}
