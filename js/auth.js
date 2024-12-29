// js/auth.js
let auth0Client = null;
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const _configureClient = async () => {
  const config = {
    domain: 'tbd',
    clientId: 'tbd',
  };
  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
  });
};

const saveAuthData = async () => {
  const token = await auth0Client.getTokenSilently();
  const user = await auth0Client.getUser();
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const loadAuthData = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  return { token, user };
};

const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const _updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();
  document.getElementById('logout-btn').disabled = !isAuthenticated;
  document.getElementById('login-btn').disabled = isAuthenticated;

  if (isAuthenticated) {
    await saveAuthData();
    const { token, user } = loadAuthData();
    document.getElementById('gated-content').classList.remove('hidden');
  } else {
    clearAuthData();
    document.getElementById('gated-content').classList.add('hidden');
  }
};

const _login = async () => {
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  });
};

const _logout = async () => {
  clearAuthData();
  await auth0Client.logout();
};
