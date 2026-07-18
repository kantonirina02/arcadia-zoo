export function initHome() {
  fetchReviews();
  setupReviewForm();
}

async function fetchReviews() {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  try {
    const response = await fetch(window.API_BASE_URL + '/api/reviews/validated');

    if (!response.ok) {
      throw new Error('Impossible de récupérer les avis.');
    }

    const reviews = await response.json();

    // Si aucun avis n'est encore validé
    if (reviews.length === 0) {
      container.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="bi bi-chat-left-dots fs-3 mb-2 d-block"></i>
                    <p>Aucun avis n'a encore été publié. Soyez le premier !</p>
                </div>
            `;
      return;
    }
    container.innerHTML = '';

    // Générer les avis de manière sécurisée (Protection XSS)
    reviews.forEach((review) => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';

      const card = document.createElement('div');
      card.className = 'card h-100 border-0 shadow-sm p-3 bg-white';

      const cardBody = document.createElement('div');
      cardBody.className =
        'card-body d-flex flex-column justify-content-between';

      const commentText = document.createElement('p');
      commentText.className = 'card-text fst-italic text-muted';

      commentText.textContent = `"${review.commentaire}"`;

      const footerDiv = document.createElement('div');
      footerDiv.className =
        'd-flex align-items-center justify-content-between mt-3 pt-2 border-top border-light';

      const pseudoSpan = document.createElement('span');
      pseudoSpan.className = 'fw-bold text-success small';
      pseudoSpan.textContent = review.pseudo;

      const icon = document.createElement('i');
      icon.className = 'bi bi-quote text-success fs-3 opacity-25';

      // Assemblage du composant
      footerDiv.appendChild(pseudoSpan);
      footerDiv.appendChild(icon);
      cardBody.appendChild(commentText);
      cardBody.appendChild(footerDiv);
      card.appendChild(cardBody);
      col.appendChild(card);
      container.appendChild(col);
    });
  } catch (error) {
    console.error('Erreur de chargement des avis :', error);
    container.innerHTML = `
            <div class="text-center py-4 text-danger">
                <i class="bi bi-exclamation-triangle fs-2 mb-2 d-block"></i>
                <p>Impossible de charger les avis pour le moment.</p>
            </div>
        `;
  }
}

/**
Gère l'envoi du formulaire d'avis vers l'API
 */
function setupReviewForm() {
  const form = document.getElementById('add-review-form');
  const messageContainer = document.getElementById('review-message');

  if (!form || !messageContainer) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const pseudo = document.getElementById('review-pseudo').value.trim();
    const comment = document.getElementById('review-comment').value.trim();

    if (!pseudo || !comment) return;

    try {
      const response = await fetch(window.API_BASE_URL + '/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pseudo: pseudo,
          commentaire: comment,
        }),
      });

      if (response.ok) {
        // Succès : Notification utilisateur
        messageContainer.className = 'mt-3 text-center alert alert-success';
        messageContainer.textContent =
          "Merci ! Votre avis a été soumis avec succès et est en attente de modération par l'équipe.";
        messageContainer.classList.remove('d-none');

        // Réinitialiser le formulaire
        form.reset();
      } else {
        throw new Error("Échec de l'envoi de l'avis.");
      }
    } catch (error) {
      console.error("Erreur d'envoi de l'avis :", error);
      messageContainer.className = 'mt-3 text-center alert alert-danger';
      messageContainer.textContent =
        "Une erreur est survenue lors de l'envoi de votre avis. Veuillez réessayer.";
      messageContainer.classList.remove('d-none');
    }
  });
}
