class GoogleDriveService {
  constructor(authService) {
    this.authService = authService;
  }

  async createFolder(folderName) {
    const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.authService.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create folder: ${response.statusText}`);
    }

    const data = await response.json();

    this.folderId = data.id;
  }

  async doesFolderExist(folderName) {
    const response = await fetch(
      "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)",
      {
        headers: {
          Authorization: `Bearer ${this.authService.accessToken}`,
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to list folders: ${response.statusText}`);
    }

    // return data.files;

    if (data.files.length === 0) {
      return false;
    }

    // Check if the folder with the given name exists
    const folder = data.files.find((folder) => folder.name === folderName);

    if (!folder) {
      return false;
    }

    this.folderId = folder.id;
    return folder;
  }

  async ensureFolderExists(folderName) {
    if (!this.doesFolderExist(folderName)) {
      await this.createFolder(folderName);
    }
  }

  async listTimelines() {
    const isAccessTokenValid = await this.authService.isAccessTokenValid();
    if (!isAccessTokenValid) {
      await this.authService.login();
    }
    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=mimeType="application/json" and trashed=false and name contains "timeline"',
      {
        headers: {
          Authorization: `Bearer ${this.authService.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to list timelines: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files.map((file) => {
      return {
        name: file.name,
        id: file.id,
      };
    });
  }

  async readFile(timeline) {
    const isAccessTokenValid = await this.authService.isAccessTokenValid();
    if (!isAccessTokenValid) {
      await this.authService.login();
    }
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${timeline.id}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${this.authService.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to read file: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: timeline.id,
      name: timeline.name,
      data: data,
    };
  }

  async uploadFile(fileName, fileContent) {
    const isAccessTokenValid = await this.authService.isAccessTokenValid();
    if (!isAccessTokenValid) {
      await this.authService.login();
    }
    try {
      // Check if the file already exists in the folder
      const existingFile = await this.findFileByName(fileName);

      // If the file exists, delete it
      if (existingFile) {
        await this.deleteFile(existingFile.id);
      }
    } catch (_) {
      // If the file doesn't exist, that's fine
      // We'll just create a new file
    }

    // Upload the new file (or the same file after deletion)
    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.authService.accessToken}`,
        },
        body: this.createMultipartBody(fileName, fileContent),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const data = await response.json();
    return data.id; // Return the uploaded file's ID
  }

  // Helper method to check if a file exists by name
  async findFileByName(fileName) {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(fileName)}' and '${this.folderId}' in parents and trashed=false&fields=files(id,name)`,
      {
        headers: {
          Authorization: `Bearer ${this.authService.accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to find file: ${response.statusText}`);
    }

    return data.files.length > 0 ? data.files[0] : null; // Return the file if found
  }

  // Helper method to delete a file
  async deleteFile(fileId) {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.authService.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
  }

  // Helper method to create the multipart body
  createMultipartBody(fileName, fileContent) {
    const boundary = '-------314159265358979323846'; // Unique boundary string
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      parents: [this.folderId],
    };

    const multipartRequestBody = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}${delimiter}Content-Type: application/json\r\n\r\n${JSON.stringify(fileContent)}${closeDelimiter}`;

    return new Blob([multipartRequestBody], { type: `multipart/related; boundary=${boundary}` });
  }
}
