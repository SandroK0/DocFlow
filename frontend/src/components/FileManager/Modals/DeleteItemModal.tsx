import styles from "../../../styles/FileManager/New.module.css";
import { useFileManager } from "../useFileManager";
import { Folder, Document } from "../../../Types";
import ModalContWrapper from "./ModalContWrapper";

interface DeleteItemModalProps {
  items: Array<Document | Folder>;
  closeModal: () => void;
}

function DeleteItemModal(props: DeleteItemModalProps) {
  const { items, closeModal } = props;
  const { handleDeleteDocument, handleDeleteFolder } = useFileManager();

  const handleConfirm = () => {
    items.forEach((item: Document | Folder, indx: number) => {
      if ((item as Document).title) {
        handleDeleteDocument(item.id);
      } else {
        handleDeleteFolder(item.id);
      }
    });
    closeModal();
  };

  return (
    <>
      <ModalContWrapper closeModal={closeModal}>
        <div className={styles.container}>
          <h3>Are you sure you want to delete ?</h3>
          <button className={styles.option} onClick={handleConfirm}>
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
