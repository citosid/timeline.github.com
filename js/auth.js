class AuthService {
  constructor(clientId) {
    this.clientId = clientId;
    this.accessToken = null;
    this.tokenClient = null;

    this.loginElement = document.getElementById('login');
    this.logoutElement = document.getElementById('logout');
    this.loggedOutContent = document.getElementById('logged-out-content');
    this.timelineForm = document.getElementById('timeline-form-container');

    this.initAuth();
  }

  initAuth() {
    google.accounts.id.initialize({ client_id: this.clientId });
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.loginElement.addEventListener('click', (e) => this.handleLogin(e));
    this.logoutElement.addEventListener('click', (e) => this.handleLogout(e));
  }

  async handleLogin(event) {
    event.preventDefault();
    await this.login();
  }

  async handleLogout(event) {
    event.preventDefault();
    this.logout();
  }

  toggleUI(isLoggedIn) {
    this.loginElement.style.display = isLoggedIn ? 'none' : 'block';
    this.logoutElement.style.display = isLoggedIn ? 'block' : 'none';
    this.loggedOutContent.style.display = isLoggedIn ? 'none' : 'block';
    this.timelineForm.style.display = isLoggedIn ? 'block' : 'none';
  }

  async isAccessTokenValid() {
    const token = this.getAccessTokenFromCookie();
    if (!token) return false;

    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );

    const isValid = response.ok && !(await response.json()).error_description;

    if (isValid) {
      this.accessToken = token;
      this.setAccessToken(token);
    }

    return isValid;
  }

  getAccessTokenFromCookie() {
    return document.cookie.match(/access_token=([^;]*)/)?.[1] || null;
  }

  login() {
    return new Promise((resolve, reject) => {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'https://www.googleapis.com/auth/drive',
        callback: (tokenResponse) => {
          if (tokenResponse?.access_token) {
            this.setAccessToken(tokenResponse.access_token);
            resolve(this.accessToken);
            window.dispatchEvent(new Event('auth.loggedIn'));
          } else {
            reject('Failed to obtain access token');
          }
        },
      });

      this.tokenClient.requestAccessToken();
    });
  }

  setAccessToken(token) {
    this.accessToken = token;
    document.cookie = `access_token=${token}`;
  }

  logout() {
    this.setAccessToken(null);
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    google.accounts.id.revoke(this.accessToken, () => {});
    this.toggleUI(false);
  }

  async getAccessToken() {
    if (await this.isAccessTokenValid()) return this.accessToken;
    return await this.login();
  }
}
