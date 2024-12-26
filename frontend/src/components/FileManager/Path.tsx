import { AiOutlineHome } from "react-icons/ai"; // Importing home icon
import styles from "../../styles/FileManager/Path.module.css";

interface FolderHistoryItem {
  id: number;
  name: string;
}

interface PathProps {
  folderHistory: FolderHistoryItem[];
  handlePathClick: (folder_id: number) => void;
}

export default function Path(props: PathProps) {
  const { folderHistory, handlePathClick } = props;
  return (
    <nav className={styles.Path} aria-label="Breadcrumb">
      <div className={styles.Breadcrumb} onClick={() => handlePathClick(-1)}>
        <span
          className={styles.Crumb}
          role="button"
          tabIndex={0}
          aria-label="Navigate to home"
        >
          <AiOutlineHome />
        </span>
      </div>

      {folderHistory.map((node, index) => (
        <div className={styles.Breadcrumb} key={node.id}>
          {index >= 0 && (
            <span className={styles.Separator} aria-hidden="true">
              &gt;
            </span>
          )}
          <span
            className={
              index === folderHistory.length - 1
                ? styles.ActiveCrumb
                : styles.Crumb
            }
            onClick={() =>
              index !== folderHistory.length - 1 && handlePathClick(node.id)
            }
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${node.name}`}
          >
            {node.name}
          </span>
        </div>
      ))}
    </nav>
  );
}
