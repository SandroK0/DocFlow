import { useNavigate } from "react-router";
import FileManager from "../components/FileManager";
import styles from "../styles/Workspace.module.css";

export default function Workspace() {
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
        <FileManager></FileManager>
      </main>
    </div>
  );
}
