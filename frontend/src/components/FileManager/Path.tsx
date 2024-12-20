import styles from "../../styles/FileManager/FolderNavigation.module.css";
import { useFileManager } from "./useFileManager";

export default function Path() {
  const { folderHistory, handlePathClick } = useFileManager();

  return (
    <div className={styles.Path}>
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
