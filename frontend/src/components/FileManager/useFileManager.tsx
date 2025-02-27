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
  getUserStorageInfo,
  restoreAllFromTrash,
  deleteAllFromTrash,
  restoreDocumentFromTrash,
  restoreFolderFromTrash,
  getTrashData,
  deleteDocumentFromTrash,
  deleteFolderFromTrash,
} from "../../api/apiService";
import { Folder, Document } from "../../Types";

interface ContentType {
  documents: Document[];
  folders: Folder[];
}

interface Storage {
  percentage_used: number;
  remaining: string;
  total: string;
  used: string;
}

interface FileManagerContextType {
  storageState: Storage | null;
  setStorageState: Dispatch<SetStateAction<Storage | null>>;
  currentContent: ContentType | null;
  refetchContent: () => void;
  folderHistory: Folder[];
  handleCreateFolder: (name: string) => Promise<void>;
  handleDeleteFolder: (id: number) => Promise<void>;
  handleMoveFolder: (
    folderToMove: Folder,
    folderToMoveTo: Folder | null
  ) => void;
  handleRenameFolder: (id: number, new_name: string) => void;
  handleCreateDocument: (title: string) => Promise<void>;
  handleDeleteDocument: (id: number) => Promise<void>;
  handleMoveDocument: (
    documentToMove: Document,
    folderToMoveTo: Folder | null
  ) => void;
  handleRenameDocument: (id: number, new_title: string) => void;
  goToFolder: (folder: Folder) => void;
  goBack: () => void;
  getPath: () => string;
  handlePathClick: (folder_id: number) => void;
  toastMsg: any | null;
  setToastMsg: Dispatch<SetStateAction<any | null>>;
  selectedItems: Array<Document | Folder>;
  setSelectedItems: Dispatch<SetStateAction<Array<Document | Folder>>>;
  selectItemToggle: (
    item: Folder | Document,
    isSelected: boolean,
    isShiftPressed: boolean
  ) => void;
  trashData: ContentType | null;
  handleGetTrashData: () => void;
  handleEmptyTrash: () => void;
  handleRestoreAllFromTrash: () => void;
  handleRestoreDocumentFromTrash: (id: number) => void;
  handleDeleteDocumentFromTrash: (id: number) => void;
  handleRestoreFolderFromTrash: (id: number) => void;
  handleDeleteFolderFromTrash: (id: number) => void;
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
  const [folderHistory, setFolderHistory] = useState<Folder[]>([]);

  const [trashData, setTrashData] = useState<ContentType | null>(null);

  const [toastMsg, setToastMsg] = useState<any | null>(null);

  const [storageState, setStorageState] = useState<Storage | null>(null);

  const [selectedItems, setSelectedItems] = useState<Array<Document | Folder>>(
    []
  );

  const selectItemToggle = (
    item: Folder | Document,
    isSelected: boolean,
    isShiftPressed: boolean
  ) => {
    if (isSelected) {
      if (selectedItems.length > 1) {
        setSelectedItems([item]);
      } else {
        const updatedArr = selectedItems.filter((el) => el !== item);
        setSelectedItems([...updatedArr]);
      }
    } else {
      if (isShiftPressed) {
        setSelectedItems([...selectedItems, item]);
      } else {
        setSelectedItems([item]);
      }
    }
  };

  const peek = () =>
    folderHistory[folderHistory.length - 1]
      ? folderHistory[folderHistory.length - 1]
      : null;

  const goToFolder = (folder: Folder) => {
    setFolderHistory((prev) => [...prev, folder]);
  };

  const handlePathClick = (nodeId: number) => {
    const newFolderHistory = [...folderHistory];

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
    setFolderHistory((prev) => (prev.length >= 1 ? prev.slice(0, -1) : prev));
  };

  const handleCreateFolder = async (name: string) => {
    const folder = peek();
    try {
      await createFolder(name, folder ? folder.id : null);
      refetchContent();
    } catch (err: any) {
      setToastMsg({
        title: "Error creating folder",
        message: err.response.data.message,
      });
    }
  };

  const handleDeleteFolder = async (folder_id: number) => {
    try {
      await deleteFolder(folder_id);
      refetchContent();
    } catch (err: any) {
      setToastMsg({
        title: "Error deleting folder",
        message: err.response.data.message,
      });
    }
  };
  const handleMoveFolder = async (
    folderToMove: Folder,
    folderToMoveTo: Folder | null
  ) => {
    const duplicateFolder =
      folderToMoveTo &&
      folderToMoveTo.subfolders.some(
        (subfolder) => subfolder.name === folderToMove.name
      );

    if (duplicateFolder) {
      setToastMsg({
        title: "Cannot move folder",
        message: `A folder named "${folderToMove.name}" already exists in the target folder.`,
      });

      return;
    }

    try {
      await updateFolder(
        folderToMove.id,
        folderToMoveTo === null ? null : folderToMoveTo.id
      );
      refetchContent();
    } catch (err: any) {
      setToastMsg({
        title: "Error updating folder",
        message: err.response.data.message
      })
    }
  };

  const handleRenameFolder = async (id: number, new_name: string) => {
    try {
      await updateFolder(id, undefined, new_name);
      refetchContent();
    } catch (error: any) {
      setToastMsg({
        title: "Cannot rename folder",
        message: error.response.data.message,
      });
    }
  };

  const handleDeleteDocument = async (id: number) => {
    try {
      await deleteDocument(id);
      refetchContent();
    } catch (err: any) {
      setToastMsg({
        title: "Error deleting folder",
        message: err.response.data.message
      });
    }
  };

  const handleMoveDocument = async (
    documentToMove: Document,
    folderToMoveTo: Folder | null
  ) => {
    const duplicateDocument =
      folderToMoveTo &&
      folderToMoveTo.documents.some(
        (doc) => doc.title === documentToMove.title
      );

    if (duplicateDocument) {
      setToastMsg({
        title: "Cannot move document",
        message: `A document named "${documentToMove.title}" already exists in the target folder.`
      }
      );
      return;
    }

    try {
      await updateDocument(
        documentToMove.id,
        undefined,
        undefined,
        folderToMoveTo === null ? null : folderToMoveTo.id
      );
      refetchContent();
    } catch (err: any) {
      setToastMsg({
        title: "Error updating document",
        message: err.response.data.message
      })
    }
  };

  const handleCreateDocument = async (title: string) => {
    const folder = peek();
    try {
      await createDocument(title, folder ? folder.id : null);
      refetchContent();
    } catch (err: any) {
      setToastMsg({
        title: "Error creating document",
        message: err.response.data.message
      })
    }
  };

  const handleRenameDocument = async (id: number, new_title: string) => {
    try {
      await updateDocument(id, new_title, undefined, undefined);
      refetchContent();
    } catch (error: any) {

      setToastMsg({
        title: "Error renaming document",
        message: error.response.data.message
      })
    }
  };

  const refetchContent = () => {
    const currentFolderId = peek() != null ? peek()?.id ?? null : null;
    fetchFolderContent(currentFolderId)
      .then((data) => setCurrentContent(data))
      .catch((err) => console.error("Error fetching folder content:", err));
  };

  const getStorageInfo = async () => {
    getUserStorageInfo()
      .then((data) => setStorageState(data.storage))
      .catch((err) => console.error("Error fetching storage info:", err));
  };

  const handleGetTrashData = async () => {
    const data = await getTrashData();
    setTrashData(data);
  };

  const handleEmptyTrash = async () => {
    try {
      await deleteAllFromTrash();
      handleGetTrashData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRestoreAllFromTrash = async () => {
    try {
      await restoreAllFromTrash();
      refetchContent();
      handleGetTrashData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRestoreDocumentFromTrash = async (id: number) => {
    try {
      await restoreDocumentFromTrash(id);
      refetchContent();
      handleGetTrashData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDocumentFromTrash = async (id: number) => {
    try {
      await deleteDocumentFromTrash(id);
      handleGetTrashData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestoreFolderFromTrash = async (id: number) => {
    try {
      await restoreFolderFromTrash(id);
      refetchContent();
      handleGetTrashData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFolderFromTrash = async (id: number) => {
    try {
      await deleteFolderFromTrash(id);
      handleGetTrashData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refetchContent();
    getStorageInfo();
  }, [folderHistory]);

  return (
    <FileManagerContext.Provider
      value={{
        storageState,
        setStorageState,
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
        selectItemToggle,
        selectedItems,
        setSelectedItems,
        trashData,
        handleGetTrashData,
        handleEmptyTrash,
        handleRestoreAllFromTrash,
        handleRestoreDocumentFromTrash,
        handleDeleteDocumentFromTrash,
        handleRestoreFolderFromTrash,
        handleDeleteFolderFromTrash,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  );
};

export const useFileManager = (): FileManagerContextType => {
  const context = useContext(FileManagerContext);
  if (context === undefined) {
    throw new Error("useFileManager must be used within a FileManagerProvider");
  }
  return context;
};
