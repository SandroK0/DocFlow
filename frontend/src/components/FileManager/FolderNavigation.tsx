import styles from "../../styles/FileManager.module.css";
import { useFileManager } from "./useFileManager";

export default function FolderNavigation() {
  const { folderHistory, handlePathClick } = useFileManager();

  return (
    <div className={styles.folderNavigation}>
      {folderHistory.map((node, index) => (
        <span
          style={{ cursor: "pointer" }}
          key={node.id}
          onClick={() => handlePathClick(node.id)}
        >
          {node.name}
          {index < folderHistory.length - 1 && " / "}
        </span>
      ))}
    </div>
  );
}
