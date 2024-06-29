import apiClient from "./apiClient";

const FileAPI = {
  getAllPhotos: async () => {
    try {
      const response = await apiClient.get("/files");
      return response.data; // Assuming the response.data contains the list of FileData
    } catch (error) {
      console.error("Failed to fetch all photos:", error);
      throw error;
    }
  },

  uploadFile: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        `/files/upload/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data; // Assuming the response.data contains the fileId
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  },

  downloadFile: async (fileId) => {
    try {
      const response = await apiClient.get(`/files/${fileId}`, {
        responseType: "arraybuffer", // Ensure response type is set to arraybuffer for downloading files
      });

      return response.data; // Assuming the response.data contains the file data
    } catch (error) {
      console.error("Failed to download file:", error);
      throw error;
    }
  },
};

export default FileAPI;
