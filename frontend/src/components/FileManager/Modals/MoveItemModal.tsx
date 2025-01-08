import { useState, useEffect } from "react";
import styles from "../../../styles/FileManager/MoveModal.module.css";
import { Folder, Document } from "../../../Types";
import { FaFolder } from "react-icons/fa";
import { fetchFolderContent } from "../../../services/apiService";
import { useFileManager } from "../useFileManager";
import ModalContWrapper from "./ModalContWrapper";
import Path from "../Path";

interface MoveItemModalProps {
  items: Array<Document | Folder>;
  closeModal: () => void;
}
interface ContentType {
  folders: Folder[];
}

function MoveItemModal(props: MoveItemModalProps) {
  const { handleMoveDocument, handleMoveFolder } = useFileManager();
  const { items, closeModal } = props;
  const [showMoveBtn, setShowMoveBtn] = useState<number | null>(null);
  const [currentFolders, setCurrentFolders] = useState<ContentType | null>(
    null
  );
  const [folderHistory, setFolderHistory] = useState<Folder[]>([]);

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

  const peek = () =>
    folderHistory[folderHistory.length - 1]
      ? folderHistory[folderHistory.length - 1]
      : null;

  const goToFolder = (folder: Folder) => {
    setFolderHistory((prev) => [...prev, folder]);
  };

  const goBack = () => {
    setFolderHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const handleMoveClick = (folderToMoveTo: Folder | null) => {
    items.forEach((item: Document | Folder, indx: number) => {
      if ((item as Document).title) {
        handleMoveDocument(item as Document, folderToMoveTo);
      } else {
        handleMoveFolder(item as Folder, folderToMoveTo);
      }
    });
    closeModal();
  };

  const refetchContent = () => {
    const currentFolderId = peek() != null ? peek()?.id ?? null : null;
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
        <h3>Moving ...</h3>
        <button onClick={() => goBack()} disabled={folderHistory.length === 0}>
          Back
        </button>
        <Path
          folderHistory={folderHistory}
          handlePathClick={handlePathClick}
        ></Path>
        <div className={styles.folderCont}>
          {currentFolders?.folders.map((folder) => {
            if (items.some((i) => i.id === folder.id)) {
              return null;
            }

            return (
              <div
                key={folder.id}
                className={styles.folder}
                onMouseEnter={() => setShowMoveBtn(folder.id)}
                onMouseLeave={() => setShowMoveBtn(null)}
                onClick={() => goToFolder(folder)}
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
        <button onClick={() => handleMoveClick(peek())}>Place</button>
      </div>
    </ModalContWrapper>
  );
}

export default MoveItemModal;
