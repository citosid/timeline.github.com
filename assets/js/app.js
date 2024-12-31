l = console.log;

window.onload = async () => {
  authService = new AuthService();

  googleDriveService = new GoogleDriveService(authService);

  window.timeline = new TimelineManager(googleDriveService);

  if (await authService.isAccessTokenValid()) {
    authService.userLoggedIn();
    await authService.getAccessToken();
    await window.timeline.loadTimelines();
  }

  window.addEventListener('tl.loggedIn', async () => {
    authService.userLoggedIn();
    await authService.getAccessToken();
    await window.timeline.loadTimelines();
  });
};
