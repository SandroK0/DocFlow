import { Dispatch, SetStateAction, useState } from "react";
import styles from "../../styles/FileManager/Actions.module.css";
import NewItemModal from "./Modals/NewItemModal";
import ReactDOM from "react-dom";
import { CiGrid41 } from "react-icons/ci";
import { CiBoxList } from "react-icons/ci";
import { AiOutlinePlus } from "react-icons/ai";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useFileManager } from "./useFileManager";
import { Folder, Document } from "../../Types";
import DeleteItemModal from "./Modals/DeleteItemModal";
import MoveItemModal from "./Modals/MoveItemModal";

interface ActionsProps {
  onGoBack: () => void;
  disableGoBack: boolean;
  view: "Grid" | "List";
  setView: Dispatch<SetStateAction<"Grid" | "List">>;
}

export default function Actions({
  onGoBack,
  disableGoBack,
  view,
  setView,
}: ActionsProps) {
  const [modal, setModal] = useState<"New" | "Delete" | "Move" | null>(null);
  const { selectedItems } = useFileManager();

  return (
    <>
      <div style={{ display: "flex", gap: "10px" }} className={styles.actions}>
        <button onClick={onGoBack} disabled={disableGoBack}>
          <RiArrowGoBackFill />
        </button>
        <button onClick={() => setModal("New")}>
          <AiOutlinePlus />
        </button>
        <button onClick={() => setView(view === "Grid" ? "List" : "Grid")}>
          {view === "Grid" ? <CiBoxList></CiBoxList> : <CiGrid41></CiGrid41>}
        </button>
        {selectedItems.length !== 0 && (
          <div>
            <button onClick={() => setModal("Delete")}>Delete</button>
            <button onClick={() => setModal("Move")}>Move</button>
          </div>
        )}
      </div>
      {modal === "New" &&
        ReactDOM.createPortal(
          <NewItemModal closeModal={() => setModal(null)} />,
          document.body // Render in the root of the document
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
    </>
  );
}
