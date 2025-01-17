import { useEffect, useState } from "react";
import { Folder, Document } from "../../Types";
import ModalContWrapper from "../ModalContWrapper";
import { FaFolder } from "react-icons/fa";
import styles from "../../styles/FileManager/Trash.module.css";
import { useFileManager } from "./useFileManager";
import { IoDocumentOutline } from "react-icons/io5";

interface TrashProps {
  close: () => void;
}

export default function Trash(props: TrashProps) {
  const { close } = props;
  const [showRestoreBtn, setShowRestoreBtn] = useState<string | null>(null);

  const {
    handleGetTrashData,
    handleRestoreAllFromTrash,
    handleEmptyTrash,
    handleRestoreDocumentFromTrash,
    handleRestoreFolderFromTrash,
    trashData,
  } = useFileManager();

  const restoreAllClick = (e: any) => {
    e.stopPropagation();
    handleRestoreAllFromTrash();
  };

  const deleteAllClick = (e: any) => {
    e.stopPropagation();
    handleEmptyTrash();
  };

  const handleRestoreClick = (item: Document | Folder) => {
    if ("name" in item) {
      handleRestoreFolderFromTrash(item.id);
    } else {
      handleRestoreDocumentFromTrash(item.id);
    }
  };

  useEffect(() => {
    handleGetTrashData();
  }, []);

  return (
    <ModalContWrapper closeModal={close}>
      <div className={styles.container}>
        <h3>Trash</h3>
        <div className={styles.folderCont}>
          {trashData &&
            [...trashData.folders, ...trashData.documents].map(
              (item: Folder | Document) => {
                const isFolder = (item as Folder).name !== undefined;
                const key = `${item.id}-${isFolder ? "folder" : "document"}`;
                return (
                  <div
                    key={key}
                    className={styles.folder}
                    onMouseEnter={() => setShowRestoreBtn(key)}
                    onMouseLeave={() => setShowRestoreBtn(null)}
                  >
                    <div className={styles.folderContent}>
                      {isFolder ? <FaFolder /> : <IoDocumentOutline />}
                      <span>
                        {isFolder
                          ? (item as Folder).name
                          : (item as Document).title}
                      </span>
                    </div>
                    {showRestoreBtn === key && (
                      <button
                        className={styles.button}
                        onClick={() =>
                          handleRestoreClick(
                            isFolder ? (item as Folder) : (item as Document)
                          )
                        }
                      >
                        restore
                      </button>
                    )}
                  </div>
                );
              }
            )}
        </div>
        <div className={styles.btnCont}>
          <button className={styles.button} onClick={(e) => restoreAllClick(e)}>
            Restore All
          </button>
          <button className={styles.button} onClick={(e) => deleteAllClick(e)}>
            Delete All
          </button>
        </div>
      </div>
    </ModalContWrapper>
  );
}
