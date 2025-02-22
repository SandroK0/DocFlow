import axios from "axios";
import { API_URL } from "../config";
import { jwtDecode } from "jwt-decode";

const isValid = (token: string) => {
  try {
    const decodedToken = jwtDecode(token);

    const expirationTime = decodedToken.exp ? decodedToken.exp * 1000 : 0; // Convert to milliseconds

    const isExpired = Date.now() > expirationTime;

    return !isExpired;
  } catch (error: any) {
    return false;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");

  if (!token) {
    return;
  }

  if (!isValid(token)) {
    localStorage.removeItem("jwt");
    return;
  }

  return { Authorization: `Bearer ${token}` };
};

export const login = async (username: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/user/login`,
    { username, password },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const register = async (username: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/user/register`,
    { username, password },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getUserStorageInfo = async () => {
  const response = await axios.get(`${API_URL}/user/storage_info`, {
    headers: getAuthHeaders(),
  });

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
    }
  );
  return response.data;
};

// Create a new folder
export const createFolder = async (
  folderName: string,
  parent_id: number | null
) => {
  const response = await axios.post(
    `${API_URL}/folders/`,
    { name: folderName, ...(parent_id ? { parent_id } : {}) },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const updateFolder = async (
  folder_id: number,
  parent_id?: number | null,
  name?: string
): Promise<any> => {
  // Construct the payload with optional fields
  const payload: { parent_id?: number | null; name?: string } = {};
  if (parent_id !== undefined) payload.parent_id = parent_id;
  if (name !== undefined) payload.name = name;

  // Send the request
  const response = await axios.put(
    `${API_URL}/folders/${folder_id}`,
    payload, // Use the payload as the request body
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// Delete a folder
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

export const shareDocument = async (id: number, role: "viewer" | "editor") => {
  const response = await axios.post(
    `${API_URL}/documents/share/${id}`,
    { role },
    { headers: getAuthHeaders() }
  );

  return response.data;
};

export const getSharedDocument = async (share_token: string) => {
  const response = await axios.get(
    `${API_URL}/documents/shared/${share_token}`
  );

  return response.data;
};

export const updateSharedDocument = async (
  share_token: string,
  title?: string,
  content?: string
) => {
  const payload: {
    title?: string;
    content?: string;
  } = {};

  if (title !== undefined) payload.title = title;
  if (content !== undefined) payload.content = content;

  const response = await axios.put(
    `${API_URL}/documents/shared/${share_token}`,
    payload
  );

  return response.data;
};

// Create a new document
export const createDocument = async (
  title: string,
  folder_id: number | null
) => {
  const response = await axios.post(
    `${API_URL}/documents/`,
    { title, ...(folder_id ? { folder_id } : {}) },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const deleteDocument = async (documentId: number) => {
  const response = await axios.delete(`${API_URL}/documents/${documentId}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const updateDocument = async (
  documentId: number,
  title?: string,
  content?: string,
  parentId?: number | null
): Promise<any> => {
  const payload: {
    title?: string;
    content?: string;
    folder_id?: number | null;
  } = {};

  if (title !== undefined) payload.title = title;
  if (content !== undefined) payload.content = content;
  if (parentId !== undefined) payload.folder_id = parentId;

  const response = await axios.put(
    `${API_URL}/documents/${documentId}`,
    payload,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getTrashData = async (): Promise<any> => {
  const response = await axios.get(`${API_URL}/trash/`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const deleteAllFromTrash = async () => {
  const response = await axios.post(
    `${API_URL}/trash/delete_all`,
    {}, // Empty request body since no data is sent
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const restoreAllFromTrash = async () => {
  const response = await axios.post(
    `${API_URL}/trash/restore_all`,
    {}, // Empty request body since no data is sent
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const restoreDocumentFromTrash = async (id: number) => {
  const response = await axios.post(
    `${API_URL}/trash/restore/document/${id}`,
    {}, // Empty request body since no data is sent
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const deleteDocumentFromTrash = async (id: number) => {
  const response = await axios.post(
    `${API_URL}/trash/delete/document/${id}`,
    {}, // Empty request body since no data is sent
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const restoreFolderFromTrash = async (id: number) => {
  const response = await axios.post(
    `${API_URL}/trash/restore/folder/${id}`,
    {}, // Empty request body since no data is sent
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const deleteFolderFromTrash = async (id: number) => {
  const response = await axios.post(
    `${API_URL}/trash/delete/folder/${id}`,
    {}, // Empty request body since no data is sent
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};
