import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchFolderContent,
  createFolder,
  deleteFolder,
  createDocument,
  deleteDocument,
  updateDocument,
  updateFolder,
} from "../../services/apiService";
import { Folder, Document } from "../../Types";

interface ContentType {
  documents: Document[];
  folders: Folder[];
}

interface FolderHistoryItem {
  id: number;
  name: string;
}

interface FileManagerContextType {
  currentContent: ContentType | null;
  folderHistory: FolderHistoryItem[];
  handleCreateFolder: (name: string) => Promise<void>;
  handleDeleteFolder: (id: number) => Promise<void>;
  handleMoveFolder: (id: number, new_parent_id: number) => void;
  handleCreateDocument: (title: string) => Promise<void>;
  handleDeleteDocument: (id: number) => Promise<void>;
  handleMoveDocument: (id: number, new_parent_id: number) => void;
  goToFolder: (folderId: number, folderName: string) => void;
  goBack: () => void;
  getPath: () => string;
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
    let newFolderHistory = [...folderHistory];

    while (
      newFolderHistory.length > 0 &&
      newFolderHistory[newFolderHistory.length - 1].id !== nodeId
    ) {
      newFolderHistory.pop();
    }

    setFolderHistory(newFolderHistory);
  };

  const getPath = () => {
    return folderHistory.map((node) => node.name).join("/");
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
      refetchContent();
    } catch (err) {
      console.log("Error deleting folder:", err);
    }
  };

  const handleMoveFolder =  async (id: number, new_parent_id: number) => {

    try {
      await updateFolder(id, new_parent_id === -1 ? null : new_parent_id);
      refetchContent();
    } catch (error) {
      console.error("Error moving folder:", error);
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

  const handleMoveDocument = async (id: number, new_folder_id: number) => {
    try {
      await updateDocument(id, undefined, undefined, new_folder_id === -1 ? null : new_folder_id);

      refetchContent();
    } catch (error) {
      console.error("Error moving document:", error);
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
        handleMoveFolder,
        handleCreateDocument,
        handleDeleteDocument,
        handleMoveDocument,
        goToFolder,
        goBack,
        getPath,
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
