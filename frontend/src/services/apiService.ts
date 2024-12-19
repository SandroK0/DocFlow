import axios from "axios";
import { API_URL } from "../config";
import { Document } from "../Types";

// Helper to get token from localStorage
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

export const login = async (username: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/user/login`,
    { username, password },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  const response = await axios.post(
    `${API_URL}/user/register`,
    { username, email, password },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};

// Fetch folder content
export const fetchFolderContent = async (folder_id: number | null) => {
  const response = await axios.get(
    folder_id
      ? `${API_URL}/folders/${folder_id}` // When folder_id is provided
      : `${API_URL}/folders/`, // When folder_id is null or undefined
    {
      headers: getAuthHeaders(), // Authentication headers
    },
  );
  return response.data;
};

// Create a new folder
export const createFolder = async (
  folderName: string,
  parent_id: number | null,
) => {
  const response = await axios.post(
    `${API_URL}/folders/`,
    { name: folderName, ...(parent_id ? { parent_id } : {}) },
    { headers: getAuthHeaders() },
  );
  return response.data;
};

export const deleteFolder = async (folder_id: number) => {
  const response = await axios.delete(`${API_URL}/folders/${folder_id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const getDocument = async (docId: number) => {
  const response = await axios.get(`${API_URL}/documents/${docId}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

// Create a new document
export const createDocument = async (
  title: string,
  folder_id: number | null,
) => {
  const response = await axios.post(
    `${API_URL}/documents/`,
    { title, ...(folder_id ? { folder_id } : {}) },
    { headers: getAuthHeaders() },
  );
  return response.data;
};

export const deleteDocument = async (documentId: number) => {
  const response = await axios.delete(`${API_URL}/documents/${documentId}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const updateDocument = async (document: Document) => {
  const response = await axios.put(
    `${API_URL}/documents/${document.id}`,
    { title: document?.title, content: document?.content },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
};
