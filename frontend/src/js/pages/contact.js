export function initContact() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('contact-alert');

  if (!form || !alertBox) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Cacher les anciennes alertes
    alertBox.classList.add('d-none');
    alertBox.textContent = '';

    // Activer la validation Bootstrap
    form.classList.add('was-validated');

    // Vérifier la validité globale du formulaire
    if (!form.checkValidity()) {
      return;
    }

    // Récupérer et assainir les valeurs
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Verrouiller le bouton pendant l'envoi (éviter les doubles soumissions)
    const submitBtn = document.getElementById('btn-submit-contact');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi en cours...`;

    try {
      // Envoi Fetch POST vers l'API Symfony de contact
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          title: subject,
          description: message,
        }),
      });

      if (response.ok) {
        // Affichage du message de succès en toute sécurité (anti-XSS via textContent)
        alertBox.className = 'mt-4 text-center alert alert-success';
        alertBox.textContent =
          'Votre message a été envoyé avec succès ! Notre équipe reviendra vers vous très vite.';
        alertBox.classList.remove('d-none');

        // Réinitialiser le formulaire
        form.reset();
        form.classList.remove('was-validated');
      } else {
        throw new Error("Erreur serveur lors de l'envoi.");
      }
    } catch (error) {
      console.error('Erreur Contact :', error);
      alertBox.className = 'mt-4 text-center alert alert-danger';
      alertBox.textContent =
        "Désolé, une erreur technique empêche l'envoi de votre message. Veuillez réessayer ultérieurement.";
      alertBox.classList.remove('d-none');
    } finally {
      // Déverrouiller le bouton
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="bi bi-send-fill me-2"></i> Envoyer ma demande`;
    }
  });
}
