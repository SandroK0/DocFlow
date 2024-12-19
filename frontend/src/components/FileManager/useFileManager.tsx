import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchFolderContent,
  createFolder,
  deleteFolder,
  createDocument,
  deleteDocument,
} from "../../services/apiService";
import { Folder, Document } from "../../Types";

// Types for content and history
interface ContentType {
  documents: Document[];
  folders: Folder[];
}

interface FolderHistoryItem {
  id: number;
  name: string;
}

// Context type
interface FileManagerContextType {
  currentContent: ContentType | null;
  folderHistory: FolderHistoryItem[];
  handleCreateFolder: (name: string) => Promise<void>;
  handleDeleteFolder: (id: number) => Promise<void>;
  handleCreateDocument: (title: string) => Promise<void>;
  handleDeleteDocument: (id: number) => Promise<void>;
  goToFolder: (folderId: number, folderName: string) => void;
  goBack: () => void;
  handlePathClick: (folder_id: number) => void;
}

const FileManagerContext = createContext<FileManagerContextType | undefined>(
  undefined
);

export const FileManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentContent, setCurrentContent] = useState<ContentType | null>(
    null
  );
  const [folderHistory, setFolderHistory] = useState<FolderHistoryItem[]>([
    { id: -1, name: "" },
  ]);

  const peek = () => folderHistory[folderHistory.length - 1];

  const goToFolder = (folderId: number, folderName: string) => {
    setFolderHistory((prev) => [...prev, { id: folderId, name: folderName }]);
  };

  const handlePathClick = (nodeId: number) => {
    let newFolderHistory = [...folderHistory]; // Create a copy of the folderHistory state

    // Pop folders from history until you reach the target nodeId
    while (
      newFolderHistory.length > 0 &&
      newFolderHistory[newFolderHistory.length - 1].id !== nodeId
    ) {
      newFolderHistory.pop();
    }

    // Update the folder history in state
    setFolderHistory(newFolderHistory);
  };

  const goBack = () => {
    setFolderHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const handleCreateFolder = async (name: string) => {
    const { id: parentId } = peek();
    try {
      await createFolder(name, parentId === -1 ? null : parentId);
      refetchContent();
    } catch (err) {
      console.error("Error creating folder:", err);
    }
  };

  const handleDeleteFolder = async (folder_id: number) => {
    try {
      await deleteFolder(folder_id);
    } catch (err) {
      console.log("Error deleting folder:", err);
    }
  };

  const handleDeleteDocument = async (id: number) => {
    try {
      await deleteDocument(id);
      refetchContent();
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  const handleCreateDocument = async (title: string) => {
    const { id: folderId } = peek();
    try {
      await createDocument(title, folderId === -1 ? null : folderId);
      refetchContent();
    } catch (err) {
      console.error("Error creating document:", err);
    }
  };

  const refetchContent = () => {
    const currentFolderId = peek().id === -1 ? null : peek().id;
    fetchFolderContent(currentFolderId)
      .then((data) => setCurrentContent(data))
      .catch((err) => console.error("Error fetching folder content:", err));
  };

  useEffect(() => {
    refetchContent();
  }, [folderHistory]);

  return (
    <FileManagerContext.Provider
      value={{
        currentContent,
        folderHistory,
        handleCreateFolder,
        handleDeleteFolder,
        handleCreateDocument,
        handleDeleteDocument,
        goToFolder,
        goBack,
        handlePathClick,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  );
};

// Hook to use the context
export const useFileManager = (): FileManagerContextType => {
  const context = useContext(FileManagerContext);
  if (context === undefined) {
    throw new Error("useFileManager must be used within a FileManagerProvider");
  }
  return context;
};
