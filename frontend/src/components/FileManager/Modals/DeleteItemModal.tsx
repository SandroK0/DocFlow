import styles from "../../../styles/FileManager/DeleteModal.module.css";
import { useFileManager } from "../useFileManager";
import { Folder, Document } from "../../../Types";
import ModalContWrapper from "../../ModalContWrapper";

interface DeleteItemModalProps {
  items: Array<Document | Folder>;
  closeModal: () => void;
}

function DeleteItemModal(props: DeleteItemModalProps) {
  const { items, closeModal } = props;
  const { handleDeleteDocument, handleDeleteFolder, setSelectedItems } = useFileManager();

  const handleConfirm = () => {
    items.forEach((item: Document | Folder) => {
      if ((item as Document).title) {
        handleDeleteDocument(item.id);
      } else {
        handleDeleteFolder(item.id);
      }
    });
    setSelectedItems([])
    closeModal();
  };


  return (
    <>
      <ModalContWrapper closeModal={closeModal}>
        <div className={styles.container}>
          <h3>Are you sure you want to delete {items.length} item{items.length > 1 ? "s" : ""} ?</h3>
          <div className={styles.btnCont}>
            <button className={styles.button} onClick={handleConfirm}>
              Yes
            </button>
            <button className={styles.button} onClick={closeModal}>
              No
            </button>
          </div>
        </div>
      </ModalContWrapper>
    </>
  );
}

export default DeleteItemModal;
