import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
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
  refetchContent: () => void;
  folderHistory: FolderHistoryItem[];
  handleCreateFolder: (name: string) => Promise<void>;
  handleDeleteFolder: (id: number) => Promise<void>;
  handleMoveFolder: (folderToMove: Folder, folderToMoveTo: Folder) => void;
  handleRenameFolder: (id: number, new_name: string) => void;
  handleCreateDocument: (title: string) => Promise<void>;
  handleDeleteDocument: (id: number) => Promise<void>;
  handleMoveDocument: (
    documentToMove: Document,
    folderToMoveTo: Folder
  ) => void;
  handleRenameDocument: (id: number, new_title: string) => void;
  goToFolder: (folderId: number, folderName: string) => void;
  goBack: () => void;
  getPath: () => string;
  handlePathClick: (folder_id: number) => void;
  toastMsg: string | null;
  setToastMsg: Dispatch<SetStateAction<string | null>>;
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
    { id: -1, name: "home" },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

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
      setToastMsg("Error creating folder");
    }
  };

  const handleDeleteFolder = async (folder_id: number) => {
    try {
      await deleteFolder(folder_id);
      refetchContent();
    } catch (err) {
      console.log("Error deleting folder:", err);
      setToastMsg("Error deleting folder");
    }
  };
  const handleMoveFolder = async (
    folderToMove: Folder,
    folderToMoveTo: Folder
  ) => {
    // Check if a subfolder with the same name already exists
    const duplicateFolder = folderToMoveTo.subfolders.some(
      (subfolder) => subfolder.name === folderToMove.name
    );

    if (duplicateFolder) {
      setToastMsg(
        `Cannot move folder: A folder named "${folderToMove.name}" already exists in the target folder.`
      );
      return; // Exit without making the update
    }

    try {
      await updateFolder(
        folderToMove.id,
        folderToMoveTo.id === -1 ? null : folderToMoveTo.id
      );
      refetchContent();
      console.log(`Folder "${folderToMove.name}" moved successfully.`);
    } catch (error) {
      console.error("Error moving folder:", error);
    }
  };

  const handleRenameFolder = async (id: number, new_name: string) => {
    try {
      await updateFolder(id, undefined, new_name);
      refetchContent();
    } catch (error: any) {
      setToastMsg("Cannot rename Folder:", error.response.data.message);
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

  const handleMoveDocument = async (
    documentToMove: Document,
    folderToMoveTo: Folder
  ) => {
    const duplicateDocument = folderToMoveTo.documents.some(
      (doc) => doc.title === documentToMove.title
    );

    if (duplicateDocument) {
      setToastMsg(
        `Cannot move document: A document named "${documentToMove.title}" already exists in the target folder.`
      );
      return;
    }

    try {
      await updateDocument(
        documentToMove.id,
        undefined,
        undefined,
        folderToMoveTo.id === -1 ? null : folderToMoveTo.id
      );

      console.log(`Document "${documentToMove.title}" moved successfully.`);
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
      setToastMsg("Error creating document");
    }
  };

  const handleRenameDocument = async (id: number, new_title: string) => {
    try {
      await updateDocument(id, new_title, undefined, undefined);
      refetchContent();
    } catch (error: any) {
      setToastMsg("Cannot rename Document:", error.response.data.message);
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
        refetchContent,
        folderHistory,
        handleCreateFolder,
        handleDeleteFolder,
        handleMoveFolder,
        handleRenameFolder,
        handleCreateDocument,
        handleDeleteDocument,
        handleMoveDocument,
        handleRenameDocument,
        goToFolder,
        goBack,
        getPath,
        handlePathClick,
        toastMsg,
        setToastMsg,
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
