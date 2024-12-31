l = console.log;

window.onload = async () => {
  const authService = new AuthService(CLIENT_ID);
  const googleDriveService = new GoogleDriveService(authService);
  const timelineManager = new TimelineManager(googleDriveService);

  if (await authService.isAccessTokenValid()) {
    authService.toggleUI(true);
    await googleDriveService.ensureFolderExists('Timeline');
    await timelineManager.loadTimelines();
  }

  window.addEventListener('auth.loggedIn', async () => {
    authService.toggleUI(true);
    await googleDriveService.ensureFolderExists('Timeline');
    await timelineManager.loadTimelines();
  });
};
