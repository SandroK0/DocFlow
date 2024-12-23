import styles from "../../../styles/FileManager/New.module.css";
import { useFileManager } from "../useFileManager";
import { Folder, Document } from "../../../Types";
import ModalContWrapper from "./ModalContWrapper";

interface DeleteItemModalProps {
  item: Document | Folder;
  isFolder: boolean;
  closeModal: () => void;
}

function DeleteItemModal(props: DeleteItemModalProps) {
  const { item, isFolder, closeModal } = props;
  const { handleDeleteDocument, handleDeleteFolder } = useFileManager();

  const { name, is_empty } = isFolder
    ? (item as Folder)
    : { name: (item as Document).title, is_empty: true };

  return (
    <>
      <ModalContWrapper closeModal={closeModal}>
        <div className={styles.container}>
          <h3>
            Are you sure you want to delete {isFolder ? "folder" : "document"}:{" "}
            {name} {isFolder && !is_empty && "(folder is not empty)"}
          </h3>
          <button
            className={styles.option}
            onClick={() => {
              if (isFolder) {
                handleDeleteFolder((item as Folder).id);
              } else {
                handleDeleteDocument((item as Document).id);
              }
              closeModal();
            }}
          >
            Yes
          </button>
          <button className={styles.option} onClick={closeModal}>
            No
          </button>
        </div>
      </ModalContWrapper>
    </>
  );
}

export default DeleteItemModal;
