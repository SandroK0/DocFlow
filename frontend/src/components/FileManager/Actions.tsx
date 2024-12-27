import { Dispatch, SetStateAction, useState } from "react";
import styles from "../../styles/FileManager/Actions.module.css";
import NewItemModal from "./Modals/NewItemModal";
import ReactDOM from "react-dom";
import { CiGrid41 } from "react-icons/ci";
import { CiBoxList } from "react-icons/ci";

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
  const [modal, setModal] = useState<"New" | null>(null);

  return (
    <>
      <div style={{ display: "flex", gap: "10px" }} className={styles.actions}>
        <button onClick={onGoBack} disabled={disableGoBack}>
          Back
        </button>
        <button onClick={() => setModal("New")}>New</button>
        <button onClick={() => setView(view === "Grid" ? "List" : "Grid")}>
          {view === "Grid" ? <CiBoxList></CiBoxList> : <CiGrid41></CiGrid41>}
        </button>
      </div>
      {modal === "New" &&
        ReactDOM.createPortal(
          <NewItemModal closeModal={() => setModal(null)} />,
          document.body // Render in the root of the document
        )}
    </>
  );
}
