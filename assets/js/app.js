let auth0Client = null;

const l = console.log;

const configureClient = async () => {
  const config = {
    domain: 'tbd',
    clientId: 'tbd',
  };

  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
  });
};

const updateUI = async (_isAuthenticated) => {
  const isAuthenticated = await auth0Client.isAuthenticated();

  document.getElementById('logout-btn').disabled = !isAuthenticated;
  document.getElementById('login-btn').disabled = isAuthenticated;

  if (isAuthenticated) {
    document.getElementById('gated-content').classList.remove('hidden');

    document.getElementById('ipt-access-token').innerHTML = await auth0Client.getTokenSilently();

    document.getElementById('ipt-user-profile').textContent = JSON.stringify(
      await auth0Client.getUser()
    );
  } else {
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

window.onload = async () => {
  await configureClient();

  const isAuthenticated = await auth0Client.isAuthenticated();

  l('isAuthenticated', isAuthenticated);

  if (isAuthenticated) {
    // show the gated content
    return;
  }

  // NEW - check for the code and state parameters
  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    // Process the login state
    await auth0Client.handleRedirectCallback();

    updateUI();

    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, '/');
  }
};
