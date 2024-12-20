import styles from "../../styles/FileManager/ItemList.module.css";
import { useFileManager } from "./useFileManager";
import { FaFolder } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { Folder, Document } from "../../Types";
import DeleteModal from "./DeleteModal";
import MoveModal from "./MoveModal";

interface ItemProps {
  item: Document | Folder;
  isFolder: boolean;
  showOptions: number | null;
  setShowOptions: (value: number | null) => void;
  indx: number;
}

export const Item = (props: ItemProps) => {
  const { goToFolder } = useFileManager();
  const { item, isFolder, setShowOptions, indx, showOptions } = props;

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
        {showOptions === indx && (
          <>
            <MoveModal item={item} isFolder={isFolder} />
            <DeleteModal item={item} isFolder={isFolder}></DeleteModal>
          </>
        )}
        <button
          onClick={() => setShowOptions(indx === showOptions ? null : indx)}
        >
          options
        </button>
      </div>
    </div>
  );
};
