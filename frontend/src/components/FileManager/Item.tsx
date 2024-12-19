import styles from "../../styles/FileManager.module.css";
import { useFileManager } from "./useFileManager";
import { FaFolder } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Folder, Document } from "../../Types";
import DeleteModal from "./DeleteModal";

interface ItemProps {
  item: Document | Folder;
  isFolder: boolean;
}

export const Item = (props: ItemProps) => {
  const { goToFolder } = useFileManager();
  const { item, isFolder } = props;
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const navigate = useNavigate();

  const navigateToEdit = (docId: number) =>
    navigate(`/workspace/editing/${docId}`);

  return (
    <div className={styles.item}>
      <div
        className={styles.item}
        onClick={() =>
          isFolder
            ? goToFolder(item.id, (item as Folder).name)
            : navigateToEdit(item.id)
        }
      >
        <div>
          {isFolder ? <FaFolder /> : <IoDocumentTextOutline />}
          {isFolder ? (item as Folder).name : (item as Document).title}
        </div>
      </div>
      <div className={styles.itemOptions}>
        <button onClick={() => setShowOptions((prev) => !prev)}>options</button>
        {showOptions && (
          <div>
            <DeleteModal item={item} isFolder={isFolder}></DeleteModal>
          </div>
        )}
      </div>
    </div>
  );
};
