/**
 * Fichier utilitaire pour gérer l'authentification (JWT)
 */

export function getToken() {
  return localStorage.getItem('jwt_token');
}

export function isAuthenticated() {
  return getToken() !== null;
}

export function logout() {
  localStorage.removeItem('jwt_token');
  window.dispatchEvent(new Event('auth_changed'));
  window.history.pushState({}, '', '/login');
  window.dispatchEvent(new Event('popstate'));
}

export function getPayload() {
  const token = getToken();
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch(e) {
    console.error('Token invalide', e);
    return null;
  }
}

export function getUserRoles() {
  const payload = getPayload();
  return payload && payload.roles ? payload.roles : [];
}

export function authFetch(url, options = {}) {
  const token = getToken();
  if (!options.headers) options.headers = {};
  
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, options);
}
