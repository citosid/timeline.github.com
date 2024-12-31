StoreService = {
  async checkFolder(service, folderName, accessToken = null) {
    return await service.checkFolder(folderName, accessToken);
  },

  async createFolder(service, folderName, accessToken = null) {
    return await service.createFolder(folderName, accessToken);
  },

  async listFiles(service, folderId, accessToken = null) {
    return await service.listFiles(folderId, accessToken);
  },

  async uploadFile(service, folderId, fileName, fileContent, accessToken = null) {
    return await service.uploadFile(folderId, fileName, fileContent, accessToken);
  },

  async deleteFile(service, fileId, accessToken = null) {
    await service.deleteFile(fileId, accessToken);
  },
};
