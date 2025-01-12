import { useEffect, useState } from "react";
import {
  deleteAllFromTrash,
  getTrash,
  restoreAllFromTrash,
} from "../../services/apiService";
import { Folder, Document } from "../../Types";
import ModalContWrapper from "./Modals/ModalContWrapper";
import { FaFolder } from "react-icons/fa";
import styles from "../../styles/FileManager/MoveModal.module.css";

interface TrashProps {
  close: () => void;
}

interface ContentType {
  documents: Document[];
  folders: Folder[];
}

export default function Trash(props: TrashProps) {
  const { close } = props;
  const [showRestoreBtn, setShowRestoreBtn] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<ContentType | null>(
    null
  );

  const restoreAllClick = (e: any) => {
    e.stopPropagation();
    restoreAll();
  };

  const deleteAllClick = (e: any) => {
    e.stopPropagation();
    emptyTrash();
  };

  const getData = async () => {
    const data = await getTrash();
    setCurrentContent(data);
    console.log(data);
  };

  const emptyTrash = async () => {
    try {
      await deleteAllFromTrash();
    } catch (err) {
      console.log(err);
    }
  };

  const restoreAll = async () => {
    try {
      await restoreAllFromTrash();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ModalContWrapper closeModal={close}>
      <div className={styles.modalCont}>
        <h3>Trash</h3>
        <div className={styles.folderCont}>
          {currentContent &&
            [...currentContent.folders, ...currentContent.documents].map(
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
                      <FaFolder />
                      <span>
                        {isFolder
                          ? (item as Folder).name
                          : (item as Document).title}
                      </span>
                    </div>
                    {showRestoreBtn === key && <button>restore</button>}
                  </div>
                );
              }
            )}
        </div>
        <div>
          <button onClick={(e) => restoreAllClick(e)}>Restore All</button>
          <button onClick={(e) => deleteAllClick(e)}>Delete All</button>
        </div>
      </div>
    </ModalContWrapper>
  );
}
