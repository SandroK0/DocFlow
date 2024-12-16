import { useParams } from "react-router";
import Editor from "../components/Editor";
import { API_URL } from "../config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Document } from "../Types";
import styles from "../styles/Editing.module.css";

export default function Editing() {
  const { docId } = useParams<{ docId: string }>();
  const [document, setDocument] = useState<Document | null>(null);

  function handleSave() {
    axios.put(
      `${API_URL}/documents/${docId}`,
      { title: document?.title, content: document?.content },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`, // JWT token
          "Content-Type": "application/json", // Add this header
        },
      }
    ).then((response) => console.log(response))
      .catch((error) => {
        if (error.response) {
          console.error("Error:", error.response.data); // Logs the error message from the backend
        } else {
          console.error("Error:", error.message);
        }
      });
  }

  function handleChange(newValue: string) {
    if (document) {
      setDocument({ ...document, content: newValue });
    }
  }

  function handleGetDocument() {
    axios
      .get(`${API_URL}/documents/${docId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`, // JWT token
          "Content-Type": "application/json", // Add this header
        },
      })
      .then((response) => setDocument(response.data))
      .catch((error) => {
        if (error.response) {
          console.error("Error:", error.response.data); // Logs the error message from the backend
        } else {
          console.error("Error:", error.message);
        }
      });
  }

  useEffect(() => {
    handleGetDocument();
  }, []);

  return (
    <div className={styles.Editing}>
      <div className={styles.header}>
        <h1>Editing</h1>
        <button onClick={handleSave}>Save</button>
      </div>
      <main>
        {document && (
          <Editor value={document.content} handleChange={handleChange}></Editor>
        )}
      </main>
    </div>
  );
}
