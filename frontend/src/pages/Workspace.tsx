import { useNavigate } from "react-router";
import FileManager from "../components/FileManager/FileManager";
import styles from "../styles/Workspace.module.css";
import { FileManagerProvider } from "../components/FileManager/useFileManager";

function Workspace() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("jwt");
    navigate("/");
  }

  return (
    <div className={styles.Workspace}>
      <div className={styles.header}>
        <h1>Workspace</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <main>
        <FileManagerProvider>
          <FileManager></FileManager>
        </FileManagerProvider>
      </main>
    </div>
  );
}

export default Workspace;
