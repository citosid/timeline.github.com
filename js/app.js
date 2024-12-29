l = console.log;

window.onload = async () => {
  await _configureClient();
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    l('authenticated');
    l(TimelineManager);
    // _updateUI();

    window.timeline = new TimelineManager();
    window.timeline.addEvent();
    return;
  }

  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    await auth0Client.handleRedirectCallback();
    _updateUI();
    window.history.replaceState({}, document.title, '/');
  }
};
