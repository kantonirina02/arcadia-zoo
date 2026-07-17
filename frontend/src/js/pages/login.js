export function initLogin() {
  const form = document.getElementById('login-form');
  const alertBox = document.getElementById('login-alert');

  if (!form || !alertBox) return;

  // Si l'utilisateur est déjà connecté, le rediriger vers le dashboard
  if (localStorage.getItem('jwt_token')) {
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new Event('popstate')); // Forcer le routeur à réagir
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    alertBox.classList.add('d-none');
    form.classList.add('was-validated');

    if (!form.checkValidity()) return;

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login');

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connexion...`;

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: email, password: password })
      });

      if (response.ok) {
        const data = await response.json();
        // Sauvegarde du token
        localStorage.setItem('jwt_token', data.token);

        alertBox.className = 'alert alert-success mt-3';
        alertBox.textContent = 'Connexion réussie ! Redirection...';
        alertBox.classList.remove('d-none');

        // Mettre à jour la navigation
        window.dispatchEvent(new Event('auth_changed'));

        // Redirection vers le dashboard
        setTimeout(() => {
          window.history.pushState({}, '', '/dashboard');
          window.dispatchEvent(new Event('popstate'));
        }, 1000);
      } else {
        alertBox.className = 'alert alert-danger mt-3';
        alertBox.textContent = 'Identifiants incorrects.';
        alertBox.classList.remove('d-none');
      }
    } catch (error) {
      console.error('Erreur Login:', error);
      alertBox.className = 'alert alert-danger mt-3';
      alertBox.textContent = 'Erreur réseau, impossible de contacter le serveur.';
      alertBox.classList.remove('d-none');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<i class="bi bi-box-arrow-in-right me-2"></i> Se Connecter`;
    }
  });
}
