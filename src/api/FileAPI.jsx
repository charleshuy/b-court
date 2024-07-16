import apiClient from "./apiClient";

const FileAPI = {
  getAllPhotos: async () => {
    try {
      const response = await apiClient.get("/files");
      return response.data;
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

      return response.data;
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  },
  uploadFileCourt: async (courtId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        `/files/upload/court/${courtId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to upload court file:", error);
      throw error;
    }
  },

  downloadFile: async (fileId) => {
    try {
      const response = await apiClient.get(`/files/${fileId}`, {
        responseType: "arraybuffer",
      });

      return response.data;
    } catch (error) {
      console.error("Failed to download file:", error);
      throw error;
    }
  },
};

export default FileAPI;
