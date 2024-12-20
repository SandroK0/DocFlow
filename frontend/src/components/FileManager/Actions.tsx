import NewModal from "./NewModal";
import styles from "../../styles/FileManager/Actions.module.css";

interface ActionsProps {
  onGoBack: () => void;
  disableGoBack: boolean;
}

export default function Actions({ onGoBack, disableGoBack }: ActionsProps) {
  return (
    <div style={{ display: "flex", gap: "10px" }} className={styles.actions}>
      <button onClick={onGoBack} disabled={disableGoBack}>
      Back
      </button>
      <NewModal></NewModal>
    </div>
  );
}
