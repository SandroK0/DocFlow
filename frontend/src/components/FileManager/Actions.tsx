import { useState } from "react";
import styles from "../../styles/FileManager/Actions.module.css";
import NewItemModal from "./Modals/NewItemModal";
import ReactDOM from "react-dom";

interface ActionsProps {
  onGoBack: () => void;
  disableGoBack: boolean;
}

export default function Actions({ onGoBack, disableGoBack }: ActionsProps) {
  const [modal, setModal] = useState<"New" | null>(null);

  return (
    <>
      <div style={{ display: "flex", gap: "10px" }} className={styles.actions}>
        <button onClick={onGoBack} disabled={disableGoBack}>
          Back
        </button>
        <button onClick={() => setModal("New")}>New</button>
      </div>
      {modal === "New" &&
        ReactDOM.createPortal(
          <NewItemModal closeModal={() => setModal(null)} />,
          document.body, // Render in the root of the document
        )}
    </>
  );
}
