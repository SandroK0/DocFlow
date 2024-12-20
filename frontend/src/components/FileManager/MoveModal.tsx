import { useState, useEffect, useRef, useCallback } from "react";
import styles from "../../styles/FileManager/MoveModal.module.css";
import { Folder, Document } from "../../Types";
import { FaFolder } from "react-icons/fa";
import { fetchFolderContent } from "../../services/apiService";
import { useFileManager } from "./useFileManager";

interface MoveModalProps {
  item: Document | Folder;
  isFolder: boolean;
}

interface FolderHistoryItem {
  id: number;
  name: string;
}

interface ContentType {
  folders: Folder[];
}

function MoveModal(props: MoveModalProps) {
  const { handleMoveDocument, handleMoveFolder } = useFileManager();
  const [show, setShow] = useState<boolean>(false);
  const { item, isFolder } = props;
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [showMoveBtn, setShowMoveBtn] = useState<number | null>(null);
  const [currentFolders, setCurrentFolders] = useState<ContentType | null>(
    null,
  );
  const [folderHistory, setFolderHistory] = useState<FolderHistoryItem[]>([
    { id: -1, name: "" },
  ]);

  const peek = () => folderHistory[folderHistory.length - 1];

  const goToFolder = (folderId: number, folderName: string) => {
    setFolderHistory((prev) => [...prev, { id: folderId, name: folderName }]);
  };
  const getPath = () => {
    return folderHistory.map((node) => node.name).join("/");
  };

  const goBack = () => {
    setFolderHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const handleMoveClick = (e: any, folderId: number) => {
    e.stopPropagation();

    if (isFolder) {
      handleMoveFolder(item.id, folderId);
    } else {
      handleMoveDocument(item.id, folderId);
    }
  };

  const { name } = isFolder
    ? (item as Folder)
    : { name: (item as Document).title };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [show]);

  const refetchContent = useCallback(() => {
    const currentFolderId = peek().id === -1 ? null : peek().id;
    fetchFolderContent(currentFolderId)
      .then((data) => {
        console.log(data);
        setCurrentFolders(data);
      })
      .catch((err) => console.error("Error fetching folder content:", err));
  }, []);

  useEffect(() => {
    refetchContent();

    return () => {
      setCurrentFolders(null);
    };
  }, [folderHistory]);

  return (
    <>
      <button onClick={() => setShow(true)}>Move</button>
      {show && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            zIndex: 11,
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            top: 0,
            left: 0,
          }}
        >
          <div className={styles.container} ref={modalRef}>
            <h3>
              Moving {isFolder ? "folder" : "document"} named: {name}
            </h3>
            <button onClick={() => goBack()}>Back</button>
            <div>Current Location: {getPath()}</div>
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
                      <button onClick={(e) => handleMoveClick(e, folder.id)}>
                        move
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={(e) => handleMoveClick(e, peek().id)}>
              Place
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MoveModal;
