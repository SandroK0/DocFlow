import axios from "axios";
import { API_URL } from "../config";

// Helper to get token from localStorage
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

// Fetch folder content
export const fetchFolderContent = async (folderId: number | "root") => {
  const response = await axios.get(`${API_URL}/folders/${folderId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Create a new folder
export const createFolder = async (folderName: string, parent_id: number | null) => {
  const response = await axios.post(
    `${API_URL}/folders/`,
    { name: folderName, ...(parent_id ? { parent_id } : {}) },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Create a new document
export const createDocument = async (title: string, folder_id: number | null) => {
  const response = await axios.post(
    `${API_URL}/documents/`,
    { title, ...(folder_id ? { folder_id } : {}) },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

