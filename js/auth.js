class AuthService {
  constructor() {
    this.tokenClient = null;
    this.accessToken = null;

    google.accounts.id.initialize({
      client_id: CLIENT_ID,
    });

    this.loginElement = document.getElementById('login');
    this.logoutElement = document.getElementById('logout');

    this.logedOutContent = document.getElementById('logged-out-content');
    this.timelineForm = document.getElementById('timeline-form-container');

    this.loginElement.addEventListener('click', async (event) => {
      event.preventDefault();
      await this.login();
    });

    this.logoutElement.addEventListener('click', async (event) => {
      event.preventDefault();
      await this.logout();
    });
  }

  userLoggedIn() {
    this.loginElement.style.display = 'none';
    this.logoutElement.style.display = 'block';

    this.logedOutContent.style.display = 'none';
    this.timelineForm.style.display = 'block';
  }

  userLoggedOut() {
    this.loginElement.style.display = 'block';
    this.logoutElement.style.display = 'none';

    this.logedOutContent.style.display = 'block';
    this.timelineForm.style.display = 'none';
  }

  async isAccessTokenValid() {
    // Check if the token is already available in the cookie
    this.accessToken = document.cookie.match(/access_token=([^;]*)/)?.[1];

    if (!this.accessToken) {
      return false;
    }

    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${this.accessToken}`
    );

    if (!response.ok) {
      // If the response is not OK, it means the token is invalid or expired
      return false;
    }

    const data = await response.json();

    // The data returned from the tokeninfo endpoint will contain information about the token
    if (data.error_description) {
      // If there is an error_description field, the token is invalid
      return false;
    }

    // If the response does not have errors, the token is valid
    return true;
  }

  async login() {
    return new Promise(async (resolve, reject) => {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive',
        callback: (tokenResponse) => {
          if (tokenResponse?.access_token) {
            this.accessToken = tokenResponse.access_token;
            // Store the token as a cookie
            document.cookie = `access_token=${tokenResponse.access_token}`;
            resolve(this.accessToken);
            window.dispatchEvent(new Event('tl.loggedIn'));
          } else {
            reject('Failed to obtain access token');
          }
        },
      });

      this.tokenClient.requestAccessToken();
    });
  }

  async logout() {
    this.userLoggedOut();
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    google.accounts.id.revoke(this.accessToken, (_response) => {});
  }

  async getAccessToken() {
    return new Promise(async (resolve, _reject) => {
      if (await this.isAccessTokenValid()) {
        resolve(this.accessToken);
        return;
      }

      const accessToken = await this.login();
      resolve(accessToken);
    });
  }
}
