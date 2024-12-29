// js/app.js
window.onload = async () => {
  await _configureClient();
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    _updateUI();
    return;
  }

  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    await auth0Client.handleRedirectCallback();
    _updateUI();
    window.history.replaceState({}, document.title, '/');
  }
};
