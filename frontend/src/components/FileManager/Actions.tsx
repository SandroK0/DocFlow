import { useState } from "react";
import styles from "../../styles/FileManager/Actions.module.css";
import NewItemModal from "./Modals/NewItemModal";
import ReactDOM from "react-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useFileManager } from "./useFileManager";
import DeleteItemModal from "./Modals/DeleteItemModal";
import MoveItemModal from "./Modals/MoveItemModal";
import { CiTrash } from "react-icons/ci";
import Trash from "./Trash";

interface ActionsProps {
  onGoBack: () => void;
  disableGoBack: boolean;
}

export default function Actions({ onGoBack, disableGoBack }: ActionsProps) {
  const [modal, setModal] = useState<
    "New" | "Delete" | "Move" | "Trash" | null
  >(null);
  const { selectedItems } = useFileManager();

  return (
    <>
      <div className={styles.actions}>
        <div className={styles.btnCont}>
          <button onClick={onGoBack} disabled={disableGoBack}>
            <RiArrowGoBackFill />
          </button>
          <button onClick={() => setModal("New")}>
            <AiOutlinePlus />
          </button>
          {selectedItems.length !== 0 && (
            <>
              <button onClick={() => setModal("Delete")}>Delete</button>
              <button onClick={() => setModal("Move")}>Move</button>
            </>
          )}
        </div>
        <div className={styles.btnCont}>
          <button onClick={() => setModal("Trash")}>
            <CiTrash />
          </button>
        </div>
      </div>
      {modal === "New" &&
        ReactDOM.createPortal(
          <NewItemModal closeModal={() => setModal(null)} />,
          document.body
        )}
      {modal === "Delete" &&
        ReactDOM.createPortal(
          <DeleteItemModal
            items={selectedItems}
            closeModal={() => setModal(null)}
          />,
          document.body
        )}
      {modal === "Move" &&
        ReactDOM.createPortal(
          <MoveItemModal
            closeModal={() => setModal(null)}
            items={selectedItems}
          />,
          document.body
        )}
      {modal === "Trash" &&
        ReactDOM.createPortal(
          <Trash close={() => setModal(null)}></Trash>,
          document.body
        )}
    </>
  );
}
