import { useState, useEffect } from "react";
import styles from "../../../styles/FileManager/MoveModal.module.css";
import { Folder, Document } from "../../../Types";
import { FaFolder } from "react-icons/fa";
import { fetchFolderContent } from "../../../services/apiService";
import { useFileManager } from "../useFileManager";
import ModalContWrapper from "./ModalContWrapper";
import Path from "../Path";

interface MoveItemModalProps {
  item: Document | Folder;
  isFolder: boolean;
  closeModal: () => void;
}

interface FolderHistoryItem {
  id: number;
  name: string;
}

interface ContentType {
  folders: Folder[];
}

function MoveItemModal(props: MoveItemModalProps) {
  const { handleMoveDocument, handleMoveFolder } = useFileManager();
  const { item, isFolder, closeModal } = props;
  const [showMoveBtn, setShowMoveBtn] = useState<number | null>(null);
  const [currentFolders, setCurrentFolders] = useState<ContentType | null>(
    null,
  );
  const [folderHistory, setFolderHistory] = useState<FolderHistoryItem[]>([
    { id: -1, name: "" },
  ]);

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

  const peek = () => folderHistory[folderHistory.length - 1];

  const goToFolder = (folderId: number, folderName: string) => {
    setFolderHistory((prev) => [...prev, { id: folderId, name: folderName }]);
  };

  const goBack = () => {
    setFolderHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const handleMoveClick = (folderToMoveTo: Folder) => {
    if (isFolder) {
      handleMoveFolder(item as Folder, folderToMoveTo);
    } else {
      handleMoveDocument(item as Document, folderToMoveTo);
    }
  };

  const { name } = isFolder
    ? (item as Folder)
    : { name: (item as Document).title };

  const refetchContent = () => {
    const currentFolderId = peek().id === -1 ? null : peek().id;
    fetchFolderContent(currentFolderId)
      .then((data) => {
        setCurrentFolders(data);
      })
      .catch((err) => console.error("Error fetching folder content:", err));
  };

  useEffect(() => {
    refetchContent();
    return () => {
      setCurrentFolders(null);
    };
  }, [folderHistory]);

  return (
    <ModalContWrapper closeModal={closeModal}>
      <div className={styles.modalCont}>
        <h3>
          Moving {isFolder ? "folder" : "document"} named: {name}
        </h3>
        <button onClick={() => goBack()}>Back</button>
        <Path
          folderHistory={folderHistory}
          handlePathClick={handlePathClick}
        ></Path>
        <div className={styles.folderCont}>
          {currentFolders?.folders.map((folder) => {
            if (folder.id === item.id) {
              return null;
            }
            return (
              <div
                key={folder.id}
                className={styles.folder}
                onMouseEnter={() => setShowMoveBtn(folder.id)}
                onMouseLeave={() => setShowMoveBtn(null)}
                onClick={() => goToFolder(folder.id, folder.name)}
              >
                <div className={styles.folderContent}>
                  <FaFolder />
                  <span>{folder.name}</span>
                </div>
                {showMoveBtn === folder.id && (
                  <button onClick={() => handleMoveClick(folder)}>move</button>
                )}
              </div>
            );
          })}
        </div>
        <button>Place</button>
      </div>
    </ModalContWrapper>
  );
}

export default MoveItemModal;
