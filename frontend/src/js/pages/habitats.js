export async function initHabitats() {
  const mainContainer = document.getElementById('habitats-main-container');
  const backBtnContainer = document.getElementById(
    'back-to-habitats-btn-container',
  );
  const backBtn = document.getElementById('btn-back-habitats');
  const header = document.getElementById('habitats-header');

  if (!mainContainer) return;
  async function loadListView() {
    header.classList.remove('d-none');
    backBtnContainer.classList.add('d-none');
    mainContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-success" role="status"></div>
            </div>`;

    try {
      const response = await fetch('http://localhost:8080/api/habitats');
      if (!response.ok) throw new Error('Erreur de récupération des habitats');

      const habitats = await response.json();
      mainContainer.innerHTML = '';

      habitats.forEach((habitat) => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-4';

        // Retrouver l'image de l'habitat (ou fallback si non définie)
        const imagePath = habitat.image_path
          ? `/assets/images/${habitat.image_path}`
          : '/assets/images/hero-broceliande.webp';

        col.innerHTML = `
                    <div class="card h-100 border-0 shadow-sm overflow-hidden cursor-pointer" style="cursor: pointer;">
                        <img src="${imagePath}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="">
                        <div class="card-body text-center">
                            <h3 class="h5 card-title text-success font-serif fw-bold mb-0"></h3>
                        </div>
                    </div>
                `;

        col.querySelector('h3').textContent = habitat.nom;
        col.querySelector('img').alt = `Habitat ${habitat.nom}`;

        // Événement de clic pour charger le détail
        col.querySelector('.card').addEventListener('click', () => {
          loadDetailView(habitat.id_habitat);
        });

        mainContainer.appendChild(col);
      });
    } catch (error) {
      console.error('Erreur list-habitats :', error);
      mainContainer.innerHTML = `<p class="text-center text-danger">Erreur de chargement des biotopes.</p>`;
    }
  }

  // Charger la vue détaillée d'un habitat
  async function loadDetailView(id) {
    header.classList.add('d-none');
    backBtnContainer.classList.remove('d-none');
    mainContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-success" role="status"></div>
            </div>`;

    try {
      const response = await fetch(`http://localhost:8080/api/habitats/${id}`);
      if (!response.ok)
        throw new Error("Erreur de récupération du détail de l'habitat");

      const habitat = await response.json();
      mainContainer.innerHTML = '';

      // Section de présentation de l'habitat
      const headerSection = document.createElement('div');
      headerSection.className = 'col-12 mb-4';
      headerSection.innerHTML = `
                <div class="p-5 bg-white rounded-3 shadow-sm border-start border-success border-5">
                    <h2 class="text-success font-serif fw-bold"></h2>
                    <p class="lead text-muted mt-3" id="habitat-desc"></p>
                    <div class="alert alert-info mt-3 d-none" id="veto-comment-box">
                        <h4 class="h6 fw-bold"><i class="bi bi-shield-check"></i> Avis du Vétérinaire</h4>
                        <p class="mb-0 small fst-italic" id="veto-comment-text"></p>
                    </div>
                </div>
            `;

      headerSection.querySelector('h2').textContent = habitat.nom;
      headerSection.querySelector('#habitat-desc').textContent =
        habitat.description;

      if (habitat.commentaire_veterinaire) {
        const commentBox = headerSection.querySelector('#veto-comment-box');
        const commentText = headerSection.querySelector('#veto-comment-text');
        commentBox.classList.remove('d-none');
        commentText.textContent = habitat.commentaire_veterinaire;
      }

      mainContainer.appendChild(headerSection);

      // Titre des animaux de l'habitat
      const titleCol = document.createElement('div');
      titleCol.className = 'col-12 mt-3 mb-2';
      titleCol.innerHTML = `<h3 class="text-success font-serif">Animaux résidents de cet habitat</h3>`;
      mainContainer.appendChild(titleCol);

      // Liste des animaux associés
      if (!habitat.animaux || habitat.animaux.length === 0) {
        const infoCol = document.createElement('div');
        infoCol.className = 'col-12';
        infoCol.innerHTML = `<p class="text-muted">Aucun animal n'est actuellement affecté à cet habitat.</p>`;
        mainContainer.appendChild(infoCol);
      } else {
        habitat.animaux.forEach((animal) => {
          const animalCol = document.createElement('div');
          animalCol.className = 'col-12 col-md-4';

          const animalImg = animal.image_path
            ? `/assets/images/${animal.image_path}`
            : '/assets/images/hero-broceliande.webp';

          animalCol.innerHTML = `
                        <div class="card h-100 border-0 shadow-sm overflow-hidden">
                            <img src="${animalImg}" class="card-img-top" style="height: 180px; object-fit: cover;" alt="">
                            <div class="card-body">
                                <h4 class="h5 card-title text-success font-serif mb-1"></h4>
                                <p class="card-text text-muted small mb-3">Race : <span class="badge bg-secondary"></span></p>
                                <button class="btn btn-sm btn-success w-100 btn-view-animal">Consulter la fiche</button>
                            </div>
                        </div>
                    `;

          animalCol.querySelector('h4').textContent = animal.prenom;
          animalCol.querySelector('span').textContent = animal.race;
          animalCol.querySelector('img').alt = animal.prenom;

          // Événement d'augmentation de la consultation (NoSQL MongoDB)
          animalCol
            .querySelector('.btn-view-animal')
            .addEventListener('click', async () => {
              try {
                // Incrémentation MongoDB (US 11)
                await fetch(`http://localhost:8080/api/stats/animal/${animal.id_animal}`, { method: 'POST' });
              } catch (e) {
                console.error('Erreur stats MongoDB', e);
              }
              alert(`Fiche de ${animal.prenom} consultée ! (+1 ajouté dans MongoDB)`);
            });

          mainContainer.appendChild(animalCol);
        });
      }
    } catch (error) {
      console.error('Erreur detail-habitat :', error);
      mainContainer.innerHTML = `<p class="text-center text-danger">Erreur de chargement du détail.</p>`;
    }
  }

  // Assignation de l'écouteur pour le bouton de retour
  backBtn.addEventListener('click', loadListView);

  // Chargement initial
  loadListView();
}
